// Anonymous counting: off unless configured, counts the right things once, honours opt-out, keeps privacy text true.
import { serve, playwright, phone, ok, failures } from './helpers.mjs';

const { chromium, devices } = await playwright();
const { base, close } = await serve();
const browser = await chromium.launch();
const errs = [];
console.log('Anonymous counting');

async function session({ configured = true, standalone = false } = {}) {
  const ctx = await phone(browser, devices);
  const hits = [];
  await ctx.route(/goatcounter\.com/, r => { hits.push(new URL(r.request().url())); return r.fulfill({ status: 200, body: '' }); });
  await ctx.addInitScript(([c, s]) => {
    if (c) window.__zolaStatsConfig = { code: 'zolatest', host: location.hostname };
    if (s) { const mm = window.matchMedia.bind(window); window.matchMedia = q => /display-mode: standalone/.test(q) ? { matches: true, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} } : mm(q); }
  }, [configured, standalone]);
  const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message));
  return { ctx, page, hits };
}
const paths = hits => hits.map(u => u.searchParams.get('p') + (u.searchParams.get('e') ? '!' : ''));

{ const { ctx, page, hits } = await session({ configured: false });
  await page.goto(base + '?s=qr#forecast/brief'); await page.waitForTimeout(1500);
  ok(hits.length === 0 && !(await page.locator('.zstat').count()), 'without a site code nothing is counted and no notice shows');
  await ctx.close(); }

{ const { ctx, page, hits } = await session();
  await page.goto(base + '?s=qr#forecast/brief'); await page.waitForTimeout(1500);
  const p = paths(hits);
  ok(p.includes('/web') && p.includes('scan-qr!') && hits.length === 2, 'a QR scan counts one browser view and one scan event');
  ok(await page.evaluate(() => location.search === '' && location.hash === '#forecast/brief'), 'the source tag is removed from the address, keeping the route');
  await page.reload(); await page.waitForTimeout(1200);
  ok(!paths(hits).slice(2).includes('scan-qr!'), 'reloading does not count another scan');
  ok(hits.every(u => !/name|email|zola[A-Z]/i.test(u.search)), 'counts carry no names or progress');
  const t = await page.evaluate(() => ({ foot: document.querySelector('.foot').textContent, note: document.querySelector('.zstat').textContent }));
  ok(!/nothing leaves your device/.test(t.foot) && /progress never leave your device/.test(t.foot) && /GoatCounter/.test(t.note), 'footer states what is counted instead of "nothing leaves your device"');
  await page.evaluate(() => document.getElementById('liveBtn').click()); await page.waitForTimeout(300);
  const dlg = await page.evaluate(() => (document.getElementById('zl-dlg') || {}).textContent || '');
  ok(dlg && !/no tracking/.test(dlg) && /anonymous visit count/.test(dlg), 'the live-feed dialog no longer claims "no tracking" while counting is on');
  await page.keyboard.press('Escape');
  await page.locator('.zstat-btn').click();
  const before = hits.length; await page.reload(); await page.waitForTimeout(1200);
  ok(hits.length === before && /off on this device/.test(await page.locator('.zstat').textContent()), 'turning counting off stops every count on this device');
  await ctx.close(); }

{ const { ctx, page, hits } = await session();
  await page.goto(base + '?s=link'); await page.waitForTimeout(1200);
  ok(paths(hits).includes('open-link!'), 'a shared text link counts as a link open');
  await ctx.close(); }

{ const { ctx, page, hits } = await session({ standalone: true });
  await page.goto(base); await page.waitForTimeout(1200);
  await page.reload(); await page.waitForTimeout(1200);
  const p = paths(hits);
  ok(p.filter(x => x === '/app').length === 2 && p.filter(x => x === 'first-app-launch!').length === 1, 'installed launches count as app views, the first one once as an install');
  await ctx.close(); }

ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
await browser.close(); close();
process.exit(failures() ? 1 : 0);
