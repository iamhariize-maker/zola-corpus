#!/usr/bin/env node
// Regenerate the install-dialog screenshots in screenshots/ from the real app.
// Needs Playwright with Chromium (npx playwright install chromium). Run from anywhere:
//   node tools/screenshots.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'screenshots');
const { chromium } = await import('playwright').catch(() => import('/opt/node-tools/node_modules/playwright/index.mjs'));

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html'));
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const base = `http://localhost:${server.address().port}/`;

const SHOTS = [
  ['phone-forecast', '#forecast/brief', { width: 432, height: 768 }, 2.5],
  ['phone-hacking', '#hacking', { width: 432, height: 768 }, 2.5],
  ['phone-csat', '#csat', { width: 432, height: 768 }, 2.5],
  ['desktop-forecast', '#forecast/brief', { width: 1280, height: 720 }, 1.5],
  ['desktop-hacking', '#hacking', { width: 1280, height: 720 }, 1.5],
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const [name, hash, viewport, scale] of SHOTS) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, colorScheme: 'light', serviceWorkers: 'block' });
  // Keep the install and offline notices out of the pictures, and keep the live feed offline-quiet.
  await ctx.addInitScript(() => { try { localStorage.setItem('zola.pwa.dismissedAt', String(Date.now())); localStorage.setItem('zola.pwa.readyShown', '1'); } catch (e) {} });
  await ctx.route(/^https:\/\/raw\.githubusercontent\.com\//, r => r.abort());
  const page = await ctx.newPage();
  await page.goto(base + hash, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const png = await page.screenshot();
  // Encode as WebP in the browser: a quarter of the PNG size, sharp enough for text.
  const webp = await page.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.88).split(',')[1];
  }, png.toString('base64'));
  fs.writeFileSync(path.join(OUT, name + '.webp'), Buffer.from(webp, 'base64'));
  console.log(`screenshots/${name}.webp ${Math.round(webp.length * 0.75 / 1024)} KB`);
  await ctx.close();
}
await browser.close();
server.close();
