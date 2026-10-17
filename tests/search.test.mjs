// Global search (ZC-04.4): the static index, its source boundaries, the layer wiring and the browser behaviour.
// Runs against the built _site (npm test builds it first).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE, ok, failures, playwright, serve, FEED_FIXTURE } from './helpers.mjs';
import { buildSearchIndex, SEARCH_INDEX_FILE } from '../tools/search-index.mjs';

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const html = read('index.html');
const js = read('pwa/search.js');

console.log('Global search: the static index');
const fresh = buildSearchIndex({ html });
const committed = JSON.parse(read(SEARCH_INDEX_FILE));
ok(JSON.stringify(committed) === JSON.stringify(fresh), `the committed ${SEARCH_INDEX_FILE} matches a fresh build from the sources (run: node tools/search-index.mjs)`);
const want = { topic: 31, article: 24, forecast: 57, machine: 23, claim: 438, case: 22, csat: 49 };
ok(Object.entries(want).every(([t, n]) => committed.counts[t] === n), `the counts match the sources: ${JSON.stringify(want)}`);
ok(committed.records.every(r => r.type && typeof r.title === 'string' && r.title.trim()), 'every record has a type and a title');
ok(new Set(committed.records.map(r => `${r.type}:${r.id}`)).size === committed.records.length, 'record ids are unique within each type');
ok(committed.records.filter(r => r.type === 'forecast').every(r => r.route === '#forecast/tracker' && r.rowId === r.id), 'Forecast results route to the tracker with their own row id');
ok(committed.records.filter(r => r.type === 'machine').every(r => /^#hacking\/M\d{2}$/.test(r.route)), 'machine results use the established #hacking/Mxx routes');
ok(committed.records.filter(r => r.type === 'csat').every(r => r.route === '#csat' && !/[{}]/.test(r.title)), 'CSAT labels are plain text, with no generator code');
ok(committed.records.filter(r => r.type === 'claim').every(r => r.limit !== undefined), 'claims carry their note or limit field');

console.log('Global search: source boundaries');
ok(!/localStorage|sessionStorage|indexedDB|document\.cookie|sendBeacon|XMLHttpRequest|WebSocket/.test(js), 'the search script stores nothing and opens no side channel');
ok(!/\beval\(|new Function|Forge\.|decodeB64|srcC|srcB|showCat\(/.test(js), 'the search script never runs the CSAT or Hacking generators or reads their sources');
ok((js.match(/\bfetch\(/g) || []).length === 1 && js.includes("fetch('search-index.json'"), 'the only request is the same-origin static index');
ok(!/https?:\/\/[a-z0-9]/i.test(js), 'the search script contains no external host');
const liveCalls = [...new Set([...js.matchAll(/\bL\.(\w+)\(/g)].map(m => m[1]))].sort();
ok(JSON.stringify(liveCalls) === JSON.stringify(['events', 'inbox', 'info', 'state']), `the feed is read through its read-only accessors only (${liveCalls.join(', ')})`);
ok(!/ZOLA_LIVE\.(check|setUrl|forget|validate)\b/.test(js) && !/ZOLA_LIVE\s*=/.test(js), 'the search script never checks, changes, forgets or reassigns the feed');
ok(/addEventListener\('zola-live'/.test(js), 'the snapshot is rebuilt when the app fires zola-live');
ok(!/id=["']trkQ["']/.test(js) && (js.match(/getElementById\('trkQ'\)/g) || []).length === 1, 'the search script never creates the tracker input, and reads it only to clear a filter');

console.log('Global search: layer wiring');
ok(/'\.\/search-index\.json'/.test(read('sw.js')), 'sw.js precaches the search index for offline use');
ok(read('tools/pwa.mjs').includes("'search-index.json'"), 'the build copies the search index into the site');
ok(/<!-- zola-search -->/.test(read('pwa/body.html')), 'the layer carries the search placeholder');
const owner = html.slice(0, html.indexOf('<script id="zsearch">'));
ok(owner.length > 0 && !owner.includes('gsearch'), 'the owner markup has no search control; the control is created at runtime by the layer');

console.log('Global search: browser behaviour (built site)');
const { chromium } = await playwright();
const { base, close } = await serve(SITE);
const browser = await chromium.launch();
try {
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  await page.goto(base + 'index.html', { waitUntil: 'load' });
  await page.waitForSelector('.hdr .top #gsearch', { timeout: 15000 });
  ok(true, 'the search control sits in the persistent header');

  await page.fill('#gsearch', 'Joint Committee');
  await page.waitForSelector('#gsearch-res:not([hidden])');
  const heading = await page.textContent('#gsearch-res h3');
  ok(heading.startsWith('Forecast events'), `results are grouped by type (first group: ${heading.trim()})`);
  const title = await page.locator('#gsearch-res li button').first().evaluate(b => b.firstChild.textContent);
  await page.locator('#gsearch-res li button').first().click();
  await page.waitForTimeout(1000);
  ok(await page.evaluate(() => location.hash) === '#forecast/tracker', 'a Forecast result routes to the tracker');
  const openTitles = await page.$$eval('details[data-id][open] summary', els => els.map(e => e.textContent));
  ok(openTitles.some(t => t.includes(title)), `the clicked event row is opened (${title})`);

  await page.fill('#gsearch', 'union route');
  await page.waitForSelector('#gsearch-res:not([hidden])');
  await page.locator('#gsearch-res li button').first().click();
  await page.waitForTimeout(600);
  ok(/^#hacking\/M\d{2}$/.test(await page.evaluate(() => location.hash)), 'a machine result routes to its #hacking/Mxx page');

  await page.fill('#gsearch', 'unit digit');
  await page.waitForSelector('#gsearch-res:not([hidden])');
  await page.locator('#gsearch-res li button').first().click();
  await page.waitForTimeout(600);
  ok(await page.evaluate(() => location.hash) === '#csat', 'a CSAT result opens the CSAT tab and nothing more');

  await page.fill('#gsearch', 'bill');
  await page.waitForSelector('#gsearch-res:not([hidden])');
  await page.press('#gsearch', 'Escape');
  ok(await page.evaluate(() => document.getElementById('gsearch-res').hidden) && (await page.inputValue('#gsearch')) === '', 'Escape clears the query and hides the results');
  ok(await page.evaluate(() => document.querySelectorAll('#trkQ').length) === 1, 'the tracker input is still the only #trkQ');
  ok(errors.length === 0, `no page or console errors during the search flow${errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''}`);

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(base + 'index.html', { waitUntil: 'load' });
  await phone.waitForSelector('#gsearch');
  await phone.fill('#gsearch', 'bill');
  await phone.waitForSelector('#gsearch-res:not([hidden])');
  ok(await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'no horizontal overflow on a phone with results open');
  await phone.close();

  // Offline: the index is precached by the service worker, so search works after a reload with the network off.
  const off = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const op = await off.newPage();
  await op.goto(base + 'index.html', { waitUntil: 'load' });
  await op.waitForFunction(async () => {
    for (const name of await caches.keys()) {
      if (await (await caches.open(name)).match('./search-index.json')) return true;
    }
    return false;
  }, null, { timeout: 30000 });
  // The page must be controlled by the worker before the network goes away, so reload once while online.
  await op.evaluate(() => navigator.serviceWorker.ready);
  await op.reload({ waitUntil: 'load' });
  await op.evaluate(() => navigator.serviceWorker.ready);
  await off.setOffline(true);
  await op.goto(base + 'index.html', { waitUntil: 'load' });
  await op.waitForSelector('#gsearch', { timeout: 15000 });
  await op.fill('#gsearch', 'bill');
  await op.waitForSelector('#gsearch-res:not([hidden])', { timeout: 10000 });
  ok(true, 'search works offline from the precached index');
  await off.close();

  // Current affairs: the feed the app has loaded is searched read-only, with its date, source and status shown.
  const fixture = JSON.parse(FEED_FIXTURE);
  fixture.events = [{ id: 'EV-SEARCH-1', date: '2026-10-10', title: 'Zola search test event', subject: 'Polity', hook: 'Check the source before use.',
    status: 'UNVERIFIED', machines: ['M01'], source: { url: 'https://example.test/src', title: 'Test source' } }];
  const news = fixture.inbox[0];
  const feedCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await feedCtx.route(/raw\.githubusercontent\.com/, r => r.fulfill({ status: 200, body: JSON.stringify(fixture), headers: { 'access-control-allow-origin': '*' } }));
  const fp = await feedCtx.newPage();
  await fp.goto(base + 'index.html', { waitUntil: 'load' });
  await fp.waitForSelector('#gsearch');
  await fp.waitForTimeout(1500);
  const showResults = async (p, q, expect) => {
    await p.fill('#gsearch', q);
    await p.waitForFunction(t => { const e = document.getElementById('gsearch-res'); return !!e && !e.hidden && e.textContent.includes(t); }, expect, { timeout: 8000 });
  };
  await showResults(fp, 'Zola search test event', 'Zola search test event');
  const evSub = await fp.locator('#gsearch-res li').first().textContent();
  ok(/Feed events/.test(await fp.textContent('#gsearch-res')) && /Unverified/.test(evSub) && /Test source/.test(evSub), 'a feed event shows its date, source and verification status');
  ok(await fp.locator('#gsearch-res a.gs-src').first().getAttribute('href') === 'https://example.test/src', 'a feed event links to its own source');
  await showResults(fp, news.title, news.title);
  ok(/Feed news/.test(await fp.textContent('#gsearch-res')), 'feed news is grouped separately');
  await fp.locator('#gsearch-res li button').first().click();
  await fp.waitForTimeout(1200);
  ok(await fp.evaluate(() => location.hash) === '#forecast/tracker', 'a feed result routes to the tracker');
  const feedStatus = await fp.textContent('#gsearch-status');
  ok(/not selected|current list|not shown/.test(feedStatus) && !/Showing/.test(feedStatus), `a feed result never claims to be selected (${feedStatus.trim()})`);
  await showResults(fp, 'Zola search test event', 'Zola search test event');
  ok(/Feed: /.test(await fp.textContent('#gsearch-res')), 'the feed state is shown in the results');
  await feedCtx.close();

  // No feed on the page: the limitation is visible and the rest of search still works.
  const noFeed = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await noFeed.route(/raw\.githubusercontent\.com/, r => r.abort());
  const np = await noFeed.newPage();
  await np.goto(base + 'index.html', { waitUntil: 'load' });
  await np.waitForSelector('#gsearch');
  await np.fill('#gsearch', 'bill');
  await np.waitForSelector('#gsearch-res:not([hidden])');
  const noFeedText = await np.textContent('#gsearch-res');
  ok(/Forecast events/.test(noFeedText) && /Feed: /.test(noFeedText), 'with no feed, static results still work and the feed limitation is shown');
  await noFeed.close();
} catch (e) {
  ok(false, `browser checks ran: ${e.message.split('\n')[0]}`);
} finally {
  await browser.close();
  close();
}

console.log(failures() ? `\n✗ ${failures()} global search check(s) failed` : '\n✓ global search checks passed');
process.exit(failures() ? 1 : 0);
