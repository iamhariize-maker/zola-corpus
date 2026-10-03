// Design layer and everyday UX: launch screen, motion, figures, navigation, header, calendar. Run via: npm test
import fs from 'node:fs';
import { serve, playwright, phone, ok, failures } from './helpers.mjs';

const { chromium, devices } = await playwright();
const { base, close } = await serve();
const browser = await chromium.launch();
const errs = [];
console.log('UX: launch, motion, navigation, calendar');

let ctx = await phone(browser, devices, { acceptDownloads: true });
const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
const y = () => p.evaluate(() => Math.round(scrollY));
const click = sel => p.evaluate(s => document.querySelector(s).click(), sel);   // in-page click: Playwright's own click scrolls sticky bars

await p.goto(base + '#forecast/brief');
await p.waitForFunction(() => !document.documentElement.classList.contains('zboot'), null, { timeout: 6000 });
ok(true, 'launch screen lifts');
await p.waitForTimeout(2200);
const figs = await p.evaluate(() => [...document.querySelectorAll('.stat .num')].map(e => e.textContent));
ok(figs.length >= 4 && figs.every(f => /^\d+$/.test(f) && f !== '0'), 'counting figures settle on their real values: ' + figs.join(' '));

for (let s = 0; s < 12000; s += 500) { await p.evaluate(v => scrollTo(0, v), s); await p.waitForTimeout(100); }
await p.waitForTimeout(1300);
ok(await p.evaluate(() => [...document.querySelectorAll('.zr')].filter(e => getComputedStyle(e).opacity < .99).length) === 0, 'nothing stays hidden after scrolling through');
ok(+(await p.evaluate(() => getComputedStyle(document.querySelector('.hdr')).getPropertyValue('--zprog'))) > .95, 'reading-progress bar reaches the end');

await p.evaluate(() => scrollTo(0, 1600)); await p.waitForTimeout(250);
await click('.sub button:nth-child(2)'); await p.waitForTimeout(450);
ok(await y() < 5, 'a new sub-section opens at its top');
await p.evaluate(() => scrollTo(0, 900)); await p.waitForTimeout(250);
await click('#tab-hacking'); await p.waitForTimeout(450);
ok(await y() < 5, 'switching category opens at its top');
await click('#tab-forecast'); await p.waitForTimeout(550);
ok(Math.abs(await y() - 900) < 40, 'coming back returns to where you were');

await p.evaluate(() => scrollTo(0, 200)); await p.waitForTimeout(150);
for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(60); }
await p.waitForTimeout(450);
const col = await p.evaluate(() => ({ on: document.documentElement.classList.contains('zcollapse'), h: Math.round(document.querySelector('.hdr').getBoundingClientRect().bottom), s: Math.round(document.querySelector('.sub').getBoundingClientRect().top) }));
ok(col.on && Math.abs(col.h - col.s) <= 2, 'header steps aside on scroll down; section bar stays docked under it');
await p.mouse.wheel(0, -60); await p.waitForTimeout(450);
ok(!(await p.evaluate(() => document.documentElement.classList.contains('zcollapse'))), 'header returns on scroll up');

await p.evaluate(() => { const d = document.querySelector('details.item'); d.scrollIntoView(); scrollBy(0, -200); });
await click('details.item summary'); await p.waitForTimeout(80);
const mid = await p.evaluate(() => getComputedStyle(document.querySelector('details.item[open] .bar i')).transform);
await p.waitForTimeout(1200);
ok(mid !== 'none' && await p.evaluate(() => getComputedStyle(document.querySelector('details.item[open] .bar i')).transform) === 'none', 'signal bars grow in when an event opens');

await p.tap('.chip');
ok(await p.evaluate(() => !!document.querySelector('.zrip')), 'buttons and chips ripple under a tap');
await click('#themeBtn'); await p.waitForTimeout(60);
ok(await p.evaluate(() => document.documentElement.classList.contains('zthemefade')), 'theme switch cross-fades');
await click('#themeBtn'); await click('#themeBtn'); await p.waitForTimeout(700);

await p.evaluate(() => scrollTo(0, 0));
await click('#clock'); await p.waitForTimeout(500);
const rows = await p.evaluate(() => document.querySelectorAll('#zcal li').length);
ok(rows >= 1, `tapping the countdown lists the exam dates (${rows})`);
const [dl] = await Promise.all([p.waitForEvent('download'), click('#zcal .zc-acts .btn:not(.ghost)')]);
const ics = fs.readFileSync(await dl.path(), 'utf8');
ok(/BEGIN:VCALENDAR[\s\S]*BEGIN:VEVENT[\s\S]*DTSTART;VALUE=DATE:\d{8}[\s\S]*TRIGGER:-P7D[\s\S]*END:VCALENDAR/.test(ics) && ics.includes('\r\n'), 'calendar file is a valid all-day .ics with reminders');
await p.keyboard.press('Escape');
await click('.sub button:nth-child(3)'); await p.waitForTimeout(600);
ok(await p.evaluate(() => !!document.querySelector('.zcal-add')), '"Add exam dates to my calendar" sits under the Watch list');

await click('#tab-hacking'); await p.waitForTimeout(2000);
ok(/^\d+,\d+,\d+,\d+$/.test(await p.evaluate(() => [...document.querySelectorAll('#frB .b-ledger b')].map(e => e.textContent).join(','))), 'Hacking ledger figures intact');
await click('#tab-csat'); await p.waitForTimeout(1500);
const f = p.frames().find(fr => fr !== p.mainFrame());
ok(await f.evaluate(() => !!document.getElementById('zneo-frame') && [...document.fonts].some(x => x.family.includes('Space Grotesk') && x.status === 'loaded')), 'CSAT Question Forge wears the design layer and fonts');
await ctx.close();

ctx = await phone(browser, devices, { reducedMotion: 'reduce' });
const q = await ctx.newPage(); await q.goto(base); await q.waitForTimeout(2000);
ok(await q.evaluate(() => document.querySelectorAll('.zr').length) === 0, 'reduce motion: nothing is hidden for reveal');
await ctx.close();

ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
await browser.close(); close();
process.exit(failures() ? 1 : 0);
