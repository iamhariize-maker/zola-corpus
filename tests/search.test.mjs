// Global search (ZC-04.4): the static index, its source boundaries, the layer wiring and the browser behaviour.
// Runs against the built _site (npm test builds it first).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE, ok, failures, playwright, serve, FEED_FIXTURE } from './helpers.mjs';
import { buildSearchIndex, caseRecord, claimRecord, SEARCH_INDEX_FILE } from '../tools/search-index.mjs';
import { TAXONOMY_STATUS, UPSC_SYLLABUS_SOURCE } from '../tools/upsc-taxonomy.mjs';

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
ok(committed.records.filter(r => r.type === 'forecast').every(r => r.id === r.rowId && r.date && r.source && r.status), 'every Forecast record keeps its stable id, date, source and status');
ok(committed.records.filter(r => r.type === 'forecast').every(r => !r.url || /^https:\/\/\S+$/.test(r.url)) && committed.records.filter(r => r.type === 'forecast' && r.url).length === 4, 'only valid HTTPS Forecast source URLs are kept (four events have one)');

// Some case fields are objects (a label mapped to a reason) and some are arrays. None may be dropped or shown as [object Object].
const objectCase = caseRecord({ id: 'T-OBJ', name: 'Test v State', year: null, decided: null, court: 'Supreme Court', citation: null, posture: null,
  verified_scope: ['bail', 'appeal'], null_reason: { 'SCC citation': 'Not independently located.', 'neutral citation': null } });
ok(objectCase.limit === 'SCC citation: Not independently located.', 'an object null_reason is shown as readable label and reason text');
ok(objectCase.text.includes('SCC citation: Not independently located.') && objectCase.text.includes('bail; appeal'), 'an object null_reason and an array verified_scope are both searchable');
ok(objectCase.title === 'Test v State' && !JSON.stringify(objectCase).includes('[object Object]'), 'a missing year is not shown as null, and nothing renders as [object Object]');
ok(committed.records.every(r => !JSON.stringify(r).includes('[object Object]')), 'no committed record contains [object Object]');
ok(committed.records.filter(r => r.type === 'case').every(r => typeof r.limit === 'string'), 'every case limit is text');
ok(committed.records.every(r => typeof r.n === 'string' && r.text === undefined), 'the index carries its search text already normalised, so the page does not normalise it on load');
const machine14 = committed.records.find(r => r.type === 'machine' && r.id === 'M14');
const articleGlance = committed.records.find(r => r.type === 'article' && r.id === 'nobel-2026-at-a-glance');
const forecast17 = committed.records.find(r => r.type === 'forecast' && r.id === 'TRK-016');
ok(machine14.n.includes('m14') && machine14.n.includes('teaching model'), 'a machine is searchable by its ID and by a term from its own content');
const machine01 = committed.records.find(r => r.type === 'machine' && r.id === 'M01');
ok(machine01.n.includes('present and voting') && machine01.n.includes('silent rajya sabha') && machine01.n.includes('route chooser'),
  'a machine is searchable by its transition guard, worked scenario and calculator wording');
ok(articleGlance.n.includes('neutrino') && articleGlance.n.includes('automated tools'), 'an article is searchable by its syllabus reason and by its caveat');
ok(forecast17.n.includes('2026-07-17') && forecast17.n.includes('17 jul 2026'), 'a Forecast event is searchable by its ISO date and by its displayed date');
ok(committed.records.filter(r => r.type === 'topic').every(r => r.status === TAXONOMY_STATUS && r.sourceStatus === UPSC_SYLLABUS_SOURCE.status), 'every syllabus topic carries its taxonomy and UPSC source status as its own fields');
ok(committed.records.filter(r => r.type === 'claim' && r.detail.sources.length).every(r => r.detail.sources.every(s => s.title && (!s.url || /^https:\/\/\S+$/.test(s.url)))), 'claim sources carry a title, and a link only when it is HTTPS');
ok(committed.records.filter(r => r.type === 'claim' && r.detail.currency).every(r => (r.detail.currency.status || r.detail.currency.note) && (!r.detail.currency.status || r.detail.currency.checked)),
  'a claim currency status always comes with its checked date; a check with no status shows its note instead');
let unresolved = false;
try { claimRecord({ id: 'T-NOSRC', text: 'Test claim', sources: ['NO-SUCH-SOURCE'] }); } catch (e) { unresolved = /NO-SUCH-SOURCE not found/.test(e.message); }
ok(unresolved, 'a claim whose source id does not resolve fails the build instead of dropping its provenance');

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

  // Records with no page of their own open in the results panel. They do not navigate, and they do not claim a page opened.
  const clickFirstIn = (p, group) => p.evaluate(g => {
    const h = [...document.querySelectorAll('#gsearch-res h3')].find(x => x.textContent.startsWith(g));
    const b = h && h.nextElementSibling && h.nextElementSibling.querySelector('li button');
    if (!b) return false;
    b.click();
    return true;
  }, group);
  const dp = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await dp.goto(base + 'index.html', { waitUntil: 'load' });
  await dp.waitForSelector('#gsearch');
  const hashBefore = await dp.evaluate(() => location.hash);
  await showResults(dp, 'bill', 'Hacking claims');
  ok(await clickFirstIn(dp, 'Hacking claims'), 'a Hacking claim result can be activated');
  await dp.waitForSelector('.gs-detail');
  const claimText = await dp.textContent('.gs-detail');
  ok(/Hacking claim/.test(claimText) && /Tag/.test(claimText), 'a claim opens its full detail in the results panel');
  ok(await dp.evaluate(() => location.hash) === hashBefore, 'a claim does not navigate away');
  await dp.click('[data-back]');
  ok(await dp.locator('.gs-detail').count() === 0 && await dp.locator('#gsearch-res li').count() > 0, 'Back returns to the results');
  await showResults(dp, 'assent', 'Hacking cases');
  ok(await clickFirstIn(dp, 'Hacking cases'), 'a Hacking case result can be activated');
  await dp.waitForSelector('.gs-detail');
  ok(/Hacking case/.test(await dp.textContent('.gs-detail')), 'a case opens its detail in the results panel');
  ok(await dp.evaluate(() => location.hash) === hashBefore, 'a case does not navigate away');
  await dp.click('[data-back]');
  await showResults(dp, 'political system', 'Syllabus topics');
  ok(await clickFirstIn(dp, 'Syllabus topics'), 'a syllabus topic result can be activated');
  await dp.waitForSelector('.gs-detail');
  ok(/Syllabus topic/.test(await dp.textContent('.gs-detail')) && /Papers/.test(await dp.textContent('.gs-detail')), 'a topic shows its papers in the panel, not as a silent status');
  await dp.close();

  // Machine and article content, syllabus reasons, caveats and dates are searchable, and a topic and a claim show their
  // qualifiers and sources as separate fields.
  const mp = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await mp.goto(base + 'index.html', { waitUntil: 'load' });
  await mp.waitForSelector('#gsearch');
  await showResults(mp, 'teaching model', machine14.title);
  ok(/Hacking machines/.test(await mp.textContent('#gsearch-res')), 'a machine is found by a term from its own content');
  await showResults(mp, 'neutrino', articleGlance.title);
  ok(/Articles/.test(await mp.textContent('#gsearch-res')), 'an article is found by a syllabus reason term');
  await showResults(mp, 'automated tools', articleGlance.title);
  ok(/Articles/.test(await mp.textContent('#gsearch-res')), 'an article is found by a caveat term');
  await showResults(mp, '17 Jul 2026', forecast17.title);
  ok(/Forecast events/.test(await mp.textContent('#gsearch-res')), 'a Forecast event is found by its displayed date');
  await showResults(mp, '2026-07-17', forecast17.title);
  ok(/Forecast events/.test(await mp.textContent('#gsearch-res')), 'a Forecast event is found by its ISO date');
  await showResults(mp, 'political system', 'Syllabus topics');
  await clickFirstIn(mp, 'Syllabus topics');
  await mp.waitForSelector('.gs-detail');
  const topicDetail = await mp.textContent('.gs-detail');
  ok(/Taxonomy status/.test(topicDetail) && topicDetail.includes(TAXONOMY_STATUS) && /UPSC source status/.test(topicDetail) && topicDetail.includes(UPSC_SYLLABUS_SOURCE.status),
    'a syllabus topic shows its taxonomy and UPSC source status as separate fields');
  await mp.click('[data-back]');
  const provClaim = committed.records.find(r => r.type === 'claim' && r.detail.currency && r.detail.sources.some(s => s.url));
  const linkedSrc = provClaim.detail.sources.find(s => s.url);
  await showResults(mp, provClaim.title, provClaim.title);
  await mp.evaluate(t => {
    const b = [...document.querySelectorAll('#gsearch-res li button')].find(x => x.firstChild && x.firstChild.textContent === t);
    if (b) b.click();
  }, provClaim.title);
  await mp.waitForFunction(() => { const d = document.querySelector('.gs-detail'); return !!d && /Sources/.test(d.textContent); }, null, { timeout: 8000 });
  const provText = await mp.textContent('.gs-detail');
  ok(provText.includes(linkedSrc.title) && provText.includes(provClaim.detail.currency.status) && /Currency status/.test(provText),
    'a claim shows its resolved source title and its currency status as separate fields');
  ok((await mp.locator('.gs-detail a').first().getAttribute('href')) === linkedSrc.url, 'a claim source link is the source’s own HTTPS address');
  await mp.close();

  // Feed items: machine tags are searchable and shown, and a date-only value keeps its calendar day in a western timezone.
  const tzFixture = JSON.parse(FEED_FIXTURE);
  tzFixture.events = [{ id: 'EV-TZ-1', date: '2026-10-10', title: 'Timezone date test event', subject: 'Polity', hook: '', status: 'VERIFIED',
    machines: ['M01'], source: { url: 'https://example.test/tz', title: 'TZ source' } }];
  const tzCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, timezoneId: 'America/Los_Angeles' });
  await tzCtx.route(/raw\.githubusercontent\.com/, r => r.fulfill({ status: 200, body: JSON.stringify(tzFixture), headers: { 'access-control-allow-origin': '*' } }));
  const tzp = await tzCtx.newPage();
  await tzp.goto(base + 'index.html', { waitUntil: 'load' });
  await tzp.waitForSelector('#gsearch');
  await tzp.waitForTimeout(1500);
  await showResults(tzp, 'M01 timezone date', 'Timezone date test event');
  const tzItem = await tzp.locator('#gsearch-res li', { hasText: 'Timezone date test event' }).first().textContent();
  ok(/10 Oct 2026/.test(tzItem) && !/9 Oct 2026/.test(tzItem) && /Machines M01/.test(tzItem),
    `a feed date keeps its calendar day in a western timezone, and its machine tag is shown (${tzItem.slice(0, 90)})`);
  await tzCtx.close();

  // A search whose index arrives late is dropped once Escape, a click outside, or a newer query has overtaken it.
  const lag = await browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: 'block' });
  const lagged = async () => {
    const p = await lag.newPage();
    await p.route(/search-index\.json/, async r => { await new Promise(s => setTimeout(s, 900)); await r.continue(); });
    await p.goto(base + 'index.html', { waitUntil: 'load' });
    await p.waitForSelector('#gsearch');
    return p;
  };
  const escRace = await lagged();
  await escRace.fill('#gsearch', 'bill');
  await escRace.waitForTimeout(150);
  await escRace.press('#gsearch', 'Escape');
  await escRace.waitForTimeout(1500);
  ok(await escRace.evaluate(() => document.getElementById('gsearch-res').hidden) && (await escRace.inputValue('#gsearch')) === '',
    'a search that finishes after Escape does not reopen the panel');
  await escRace.close();
  const outRace = await lagged();
  await outRace.fill('#gsearch', 'bill');
  await outRace.waitForTimeout(150);
  await outRace.mouse.click(20, 700);
  await outRace.waitForTimeout(1500);
  ok(await outRace.evaluate(() => document.getElementById('gsearch-res').hidden), 'a search that finishes after a click outside does not reopen the panel');
  await outRace.close();
  const newerRace = await lagged();
  await newerRace.fill('#gsearch', 'bill');
  await newerRace.waitForTimeout(150);
  await newerRace.fill('#gsearch', 'unit digit');
  await newerRace.waitForFunction(() => { const e = document.getElementById('gsearch-res'); return !!e && !e.hidden && e.textContent.includes('CSAT labels'); }, null, { timeout: 8000 });
  ok(!/Hacking claims/.test(await newerRace.textContent('#gsearch-res')), 'a newer query replaces the results of an older one that finishes late');
  await newerRace.close();
  await lag.close();

  // Focus and keys: Escape in the results closes them and returns focus to the box; a detail moves focus to its heading and
  // Back returns it to the box; Show all moves focus to the first new item; a CSAT result says it is not selected.
  const er = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await er.goto(base + 'index.html', { waitUntil: 'load' });
  await er.waitForSelector('#gsearch');
  await showResults(er, 'bill', 'Hacking claims');
  await er.focus('#gsearch-res li button');
  await er.keyboard.press('Escape');
  ok(await er.evaluate(() => document.getElementById('gsearch-res').hidden) && (await er.inputValue('#gsearch')) === '' &&
    (await er.evaluate(() => document.activeElement && document.activeElement.id)) === 'gsearch',
    'Escape in the results closes them, clears the query and returns focus to the search box');
  await showResults(er, 'bill', 'Hacking claims');
  await er.click('#gsearch-res [data-more="claim"]');
  ok(await er.evaluate(() => document.activeElement === document.querySelector('ul[data-group="claim"] li:nth-child(9) button')),
    'Show all moves focus to the first newly shown item');
  await er.locator('ul[data-group="claim"] li button').first().click();
  await er.waitForSelector('.gs-detail');
  ok(await er.evaluate(() => { const a = document.activeElement; return !!a && a.tagName === 'H3' && !!a.closest('.gs-detail'); }), 'opening a detail moves focus to its heading');
  await er.click('[data-back]');
  ok(await er.evaluate(() => document.activeElement && document.activeElement.id) === 'gsearch', 'Back returns focus to the search box');
  await showResults(er, 'unit digit', 'CSAT labels');
  await er.evaluate(() => { const b = document.querySelector('ul[data-group="csat"] li button'); if (b) b.click(); });
  await er.waitForFunction(() => /Opened the CSAT tab/.test(document.getElementById('gsearch-status').textContent), null, { timeout: 5000 });
  const csatStatus = await er.textContent('#gsearch-status');
  ok(/is not selected there/.test(csatStatus) && !/listed in the results/.test(csatStatus), 'a CSAT label result says it is not selected, and not that it is listed in closed results');
  await er.close();

  // Phone: the box, result rows, Show all and a Source link are at least 44 px tall, and long text wraps.
  const tap = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await tap.goto(base + 'index.html', { waitUntil: 'load' });
  await tap.waitForSelector('#gsearch');
  await showResults(tap, 'bill', 'Hacking claims');
  const sizes = await tap.evaluate(() => {
    const h = sel => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().height) : 0; };
    return { box: h('#gsearch'), row: h('#gsearch-res li button'), more: h('#gsearch-res .gs-more') };
  });
  ok(sizes.box >= 44 && sizes.row >= 44 && sizes.more >= 44, `the search box, a result row and Show all are at least 44 px tall (${JSON.stringify(sizes)})`);
  const linkedForecast = committed.records.find(r => r.type === 'forecast' && r.url);
  await showResults(tap, linkedForecast.title, linkedForecast.title);
  const srcH = await tap.evaluate(() => { const a = document.querySelector('#gsearch-res .gs-src'); return a ? Math.round(a.getBoundingClientRect().height) : 0; });
  ok(srcH >= 44, `a Source link is at least 44 px tall (${srcH})`);
  ok(await tap.evaluate(() => getComputedStyle(document.getElementById('gsearch-res')).overflowWrap === 'anywhere'), 'long text in the results wraps instead of overflowing');
  await tap.close();

  // The index fails to load: the box says the results are open, and the message is shown.
  // The service worker is blocked here: once it has installed and claimed the page, its precached copy of the index would
  // answer the search and the failure would never happen. Blocking it makes the failure path the one under test.
  const failCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: 'block' });
  const fail = await failCtx.newPage();
  await fail.route(/search-index\.json/, r => r.abort());
  await fail.goto(base + 'index.html', { waitUntil: 'load' });
  await fail.waitForSelector('#gsearch');
  await fail.fill('#gsearch', 'bill');
  await fail.waitForFunction(() => /Search is unavailable/.test(document.getElementById('gsearch-res').textContent), null, { timeout: 8000 });
  ok((await fail.getAttribute('#gsearch', 'aria-expanded')) === 'true', 'when the index cannot load, the search box reports that its results are open');
  await failCtx.close();

  // zola-live: an event the app loads after this control is set up appears once the app fires zola-live.
  const lp = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await lp.goto(base + 'index.html', { waitUntil: 'load' });
  await lp.waitForSelector('#gsearch');
  await lp.waitForFunction(() => !!window.ZOLA_LIVE);
  // The search is open before the update arrives, so the update has to refresh the open results.
  await lp.fill('#gsearch', 'Live update test event');
  await lp.waitForFunction(() => { const e = document.getElementById('gsearch-res'); return !!e && !e.hidden; }, null, { timeout: 8000 });
  await lp.evaluate(() => {
    window.ZOLA_LIVE.events = function () {
      return [{ id: 'EV-LIVE-2', date: '2026-10-16', title: 'Live update test event', subject: 'Polity', hook: '', status: 'VERIFIED',
        machines: [], source: { url: 'https://example.test/live', title: 'Live source' } }];
    };
    window.dispatchEvent(new CustomEvent('zola-live', { detail: { state: 'live' } }));
  });
  await lp.waitForFunction(() => { const e = document.getElementById('gsearch-res'); return !!e && e.textContent.includes('Live update test event'); }, null, { timeout: 8000 });
  const liveText = await lp.textContent('#gsearch-res');
  ok(/Feed events/.test(liveText) && /Checked/.test(liveText) && /Live source/.test(liveText), 'an event that arrives on zola-live appears with its status and source');
  await lp.close();

  // A feed item the tracker's feed box does not list (the box shows only its newest items): its title, date, source and
  // status stay in the panel, with the reason, and nothing claims it is listed or selected.
  const oldest = [...fixture.inbox].sort((a, b) => String(b.published).localeCompare(String(a.published))).at(-1);
  const fb = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await fb.route(/raw\.githubusercontent\.com/, r => r.fulfill({ status: 200, body: JSON.stringify(fixture), headers: { 'access-control-allow-origin': '*' } }));
  const fbp = await fb.newPage();
  await fbp.goto(base + 'index.html', { waitUntil: 'load' });
  await fbp.waitForSelector('#gsearch');
  await fbp.waitForTimeout(1500);
  await showResults(fbp, oldest.title, oldest.title);
  await fbp.evaluate(t => {
    const b = [...document.querySelectorAll('#gsearch-res li button')].find(x => x.firstChild && x.firstChild.textContent === t);
    if (b) b.click();
  }, oldest.title);
  await fbp.waitForSelector('.gs-detail');
  const fbText = await fbp.textContent('.gs-detail');
  ok(/Why it is not selected here/.test(fbText) && /not in the feed box/.test(fbText) && fbText.includes(oldest.title), 'a feed item outside the tracker box keeps its title and the reason in the panel');
  ok(await fbp.locator('.gs-detail a').count() === 1 && /Feed item/.test(fbText), 'the fallback keeps the source link and labels the item as a feed item');
  ok(!/is listed in the feed box/.test(await fbp.textContent('#gsearch-status')), 'the fallback never says the item is listed in the box');
  await fb.close();

  // Forced not-shown paths: the tracker's Forecast panel is hidden, so the row cannot be revealed; and a feed event on a
  // page with no feed box cannot be selected. Both keep the title and reason in the panel, and neither claims success.
  const hidden = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const hp = await hidden.newPage();
  await hp.goto(base + 'index.html', { waitUntil: 'load' });
  await hp.waitForSelector('#gsearch');
  await hp.addStyleTag({ content: '#catA{display:none !important}' });
  await showResults(hp, 'Joint Committee', 'Joint Committee');
  await hp.evaluate(() => {
    const b = [...document.querySelectorAll('#gsearch-res li button')].find(x => x.firstChild && /Joint Committee/.test(x.firstChild.textContent));
    if (b) b.click();
  });
  await hp.waitForSelector('.gs-detail', { timeout: 8000 });
  const hpText = await hp.textContent('.gs-detail');
  ok(/Tracker event/.test(hpText) && /does not show this event/.test(hpText) && /Joint Committee/.test(hpText), 'a Forecast event the tracker cannot show keeps its title and the reason in the panel');
  ok(!/Showing/.test(await hp.textContent('#gsearch-status')), 'a Forecast event that cannot be shown never claims it is showing');
  ok(/17 Jul 2026/.test(hpText) && /PRS Bill Track and committee record/.test(hpText) && /occurred/.test(hpText) && /Checked/.test(hpText), 'the Forecast fallback shows its date, source, status and verification as separate fields');
  // An event with a valid HTTPS source keeps that link in the fallback panel.
  const withUrl = committed.records.find(r => r.type === 'forecast' && r.url);
  await showResults(hp, withUrl.title, withUrl.title);
  await hp.evaluate(t => {
    const b = [...document.querySelectorAll('#gsearch-res li button')].find(x => x.firstChild && x.firstChild.textContent === t);
    if (b) b.click();
  }, withUrl.title);
  await hp.waitForFunction(t => { const d = document.querySelector('.gs-detail'); return !!d && d.textContent.includes(t) && /Why it is not selected here/.test(d.textContent); }, withUrl.title, { timeout: 8000 });
  ok((await hp.locator('.gs-detail a').first().getAttribute('href')) === withUrl.url, 'a Forecast event with a valid HTTPS source keeps its own source link in the fallback');
  await hidden.close();

  const nf = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await nf.route(/raw\.githubusercontent\.com/, r => r.abort());
  const nfp = await nf.newPage();
  await nfp.goto(base + 'index.html', { waitUntil: 'load' });
  await nfp.waitForFunction(() => !!window.ZOLA_LIVE);
  await nfp.evaluate(() => {
    window.ZOLA_LIVE.events = function () {
      return [{ id: 'EV-NOBOX-1', date: '2026-10-15', title: 'No box test event', subject: 'Polity', hook: '', status: 'UNVERIFIED',
        machines: [], source: { url: 'https://example.test/nobox', title: 'No box source' } }];
    };
    window.dispatchEvent(new CustomEvent('zola-live', { detail: { state: 'live' } }));
  });
  await showResults(nfp, 'No box test event', 'No box test event');
  await nfp.evaluate(() => {
    const b = [...document.querySelectorAll('#gsearch-res li button')].find(x => x.firstChild && x.firstChild.textContent === 'No box test event');
    if (b) b.click();
  });
  await nfp.waitForSelector('.gs-detail', { timeout: 8000 });
  const nfText = await nfp.textContent('.gs-detail');
  ok(/does not show the feed box/.test(nfText) && /Feed item/.test(nfText) && (await nfp.locator('.gs-detail a').count()) === 1, 'a feed event with no feed box keeps its title and source in the panel');
  ok((await nfp.locator('.gs-detail a').first().getAttribute('href')) === 'https://example.test/nobox', 'the fallback source link is the item’s own source');
  await nf.close();

  // A cached feed with the network blocked: the saved copy is searched, and the footer says it is a saved copy.
  const cache = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await cache.addInitScript(f => {
    localStorage.setItem('zola.live.v1', JSON.stringify({ url: 'https://feed.example.test/zola.json', feed: f,
      fetchedAt: Date.now() - 3600e3, lastAttempt: Date.now() - 3600e3, lastError: 'offline' }));
  }, fixture);
  await cache.route(/raw\.githubusercontent\.com/, r => r.abort());
  await cache.route(/feed\.example\.test/, r => r.abort());
  const cp = await cache.newPage();
  await cp.goto(base + 'index.html', { waitUntil: 'load' });
  await cp.waitForSelector('#gsearch');
  await cp.waitForTimeout(1200);
  await showResults(cp, news.title, news.title);
  const cacheText = await cp.textContent('#gsearch-res');
  ok(/Feed news/.test(cacheText) && /Feed: /.test(cacheText) && /fetched/.test(cacheText), 'a cached feed is searched and its fetch time is shown');
  await cache.close();

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
