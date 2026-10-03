// Install, offline and update behaviour of the built site (_site). Run via: npm test
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT, SITE, serve, playwright, ok, failures, FEED_FIXTURE } from './helpers.mjs';

const { chromium, devices } = await playwright();
const { base, close } = await serve();
const browser = await chromium.launch();
const errs = [];
const watch = p => { p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && !/raw\.githubusercontent|ERR_|Failed to load resource/.test(m.text()) && errs.push(m.text())); };
const toast = p => p.evaluate(() => { const t = document.querySelector('.pwa-toast'); return t ? t.dataset.kind + ': ' + t.innerText.replace(/\s+/g, ' ') : null; });
console.log('PWA: install, offline, update');

let ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
await ctx.route(/raw\.githubusercontent\.com/, r => r.fulfill({ status: 200, body: FEED_FIXTURE, headers: { 'access-control-allow-origin': '*' } }));
let page = await ctx.newPage(); watch(page);
await page.goto(base + '#forecast/brief');
await page.evaluate(() => navigator.serviceWorker.ready);
await page.waitForFunction(() => document.querySelector('.pwa-toast'), null, { timeout: 8000 }).catch(() => {});
ok(/^ready: Ready to work offline/.test(await toast(page) || ''), 'first visit says "Ready to work offline"');
const cdp = await ctx.newCDPSession(page);
ok((await cdp.send('Page.getAppManifest')).errors.length === 0, 'manifest parses cleanly');
ok((await cdp.send('Page.getInstallabilityErrors')).installabilityErrors.length === 0, 'Chrome reports the app installable');
const cached = await page.evaluate(async () => { const k = await caches.keys(); return (await (await caches.open(k[0])).keys()).length; });
ok(cached >= 11, `app shell precached (${cached} files)`);

await ctx.setOffline(true); await page.waitForTimeout(300);
ok(/^offline:/.test(await toast(page) || ''), 'going offline shows the offline notice');
await page.reload();
ok(await page.locator('#tab-hacking').count() === 1, 'reload while offline opens the full app');
await page.goto(base + 'some/deep/path');
ok(await page.locator('#tab-hacking').count() === 1 && new URL(page.url()).pathname === '/', 'offline, an unknown address lands on the app home');
await ctx.setOffline(false);

await page.goto(base + '#forecast/brief'); await page.waitForTimeout(500);
await page.evaluate(() => document.querySelector('.pwa-toast')?.remove());
execSync('node tools/pwa.mjs build _site', { cwd: ROOT });
fs.appendFileSync(path.join(SITE, 'index.html'), '\n<!-- new build -->\n');
const swp = path.join(SITE, 'sw.js');
fs.writeFileSync(swp, fs.readFileSync(swp, 'utf8').replace(/const VERSION = '([^']+)'/, "const VERSION = '$1-next'"));
await page.reload();
await page.waitForFunction(() => document.querySelector('.pwa-toast[data-kind="update"]'), null, { timeout: 10000 }).catch(() => {});
ok(/^update: New build ready/.test(await toast(page) || ''), 'a published update is offered as "New build ready · Reload"');
await page.click('.pwa-toast .pwa-b:not(.q)'); await page.waitForLoadState('load');
ok(await page.evaluate(() => new XMLSerializer().serializeToString(document).includes('<!-- new build -->')), 'Reload brings in the new build');
await ctx.close();
execSync('node tools/pwa.mjs build _site', { cwd: ROOT });   // leave _site clean

ctx = await browser.newContext({ viewport: { width: 412, height: 860 }, colorScheme: 'dark', serviceWorkers: 'block' });
await ctx.addInitScript(() => localStorage.setItem('zola.pwa.visits', '3'));
page = await ctx.newPage(); watch(page);
await page.goto(base);
await page.evaluate(() => { const e = new Event('beforeinstallprompt'); e.prompt = () => { window.__prompted = true; }; e.userChoice = Promise.resolve({ outcome: 'accepted' }); window.dispatchEvent(e); });
await page.waitForTimeout(4500);
ok(/^install: Install Zola Corpus/.test(await toast(page) || ''), 'a return visit gets the install offer');
await page.click('.pwa-toast .pwa-b:not(.q)');
ok(await page.evaluate(() => window.__prompted === true), 'Install opens the browser install prompt');
await ctx.close();

ctx = await browser.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
await ctx.addInitScript(() => localStorage.setItem('zola.pwa.visits', '3'));
page = await ctx.newPage(); watch(page);
await page.goto(base); await page.waitForTimeout(4500);
ok(/^ios: Install Zola Corpus Tap Share/.test(await toast(page) || ''), 'iPhone gets the Share → Add to Home Screen hint');
await page.click('.pwa-toast .pwa-b.q'); await page.reload(); await page.waitForTimeout(4500);
ok(await toast(page) === null, '"Got it" keeps it quiet next time');
await ctx.close();

ctx = await browser.newContext({ serviceWorkers: 'block' }); page = await ctx.newPage(); watch(page);
await page.goto(base);
await page.evaluate(() => { const e = new Event('beforeinstallprompt'); e.prompt = () => {}; window.dispatchEvent(e); });
await page.waitForTimeout(5000);
ok(await toast(page) === null, 'a first visit does not nag straight away');
await ctx.close();

ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
await browser.close(); close();
process.exit(failures() ? 1 : 0);
