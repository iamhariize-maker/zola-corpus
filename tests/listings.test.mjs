// Listing engine (ZC-02): parsers on saved fixtures, robots rules, redirect handling, tags, exit codes, document
// contract. Nothing here touches the network: fetch logic is tested with a fake request function.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, failures } from './helpers.mjs';
import { parseRss, parsePrsBills, parseScHome, decode, validItems } from '../tools/listings/parse.mjs';
import { parseRobots, allowed } from '../tools/listings/robots.mjs';
import { fetchListing, robotsFor, clearRobotsCache } from '../tools/listings/fetch.mjs';
import { topicsFor, RULES } from '../tools/listings/tags.mjs';
import { SOURCES } from '../tools/listings/sources.mjs';
import { buildDocument, validateDocument, itemId, exitCodeFor, SCHEMA } from '../tools/fetch-listings.mjs';
import { TOPICS } from '../tools/upsc-taxonomy.mjs';

const fx = f => fs.readFileSync(path.join(ROOT, 'tests/fixtures/listings', f), 'utf8');

console.log('Listing engine: parsers');
const pib = parseRss(fx('pib-rss.xml'), 'https://pib.gov.in/');
ok(pib.length >= 15, `PIB feed yields items (${pib.length})`);
ok(pib.every(i => /^https:\/\/pib\.gov\.in\/PressReleaseIframePage\.aspx\?PRID=\d+$/.test(i.url)), 'every PIB link is a PRID link');
ok(pib.every(i => i.published === null), 'PIB has no dates in its feed (published stays null; first_seen is used)');
ok(!pib.some(i => /&amp;|&lt;|&#/.test(i.title)), 'PIB titles are decoded text');

const prs = parsePrsBills(fx('prs-billtrack-links.html'));
ok(prs.length > 20 && new Set(prs.map(i => i.url)).size === prs.length, `PRS links are unique (${prs.length})`);
ok(prs.some(i => i.title === 'The Tribunals Reforms Bill, 2026'), 'PRS title is decoded and kept as written');
ok(prs.every(i => i.url.startsWith('https://prsindia.org/billtrack/')), 'PRS links resolve to the bill tracker');

const sci = parseScHome(fx('sci-home-links.html'));
ok(sci.length === 25, `Supreme Court homepage yields 25 judgments (${sci.length})`);
ok(sci.every(i => /[?&]type=j\b/.test(i.url)), 'only judgments are kept, interim orders are dropped');
ok(sci.every(i => /^\d{4}-\d{2}-\d{2}T00:00:00\+05:30$/.test(i.published)), 'order date becomes an IST date');
ok(sci.some(i => i.title.startsWith('TEJARAM VS. STATE OF RAJASTHAN (Crl.A. No. 4988/2026)')), 'case name and number parsed from the label');
ok(!sci.some(i => /Uploaded On|Diary Number/.test(i.title)), 'upload stamp and diary text are removed from titles');

const rssBody = '<rss><channel><item><title>Short</title><link>https://x.gov.in/a</link></item><item><title>Long enough headline</title><link>https://x.gov.in/b</link><pubDate>Fri, 16 Oct 2026 20:37:12 +0530</pubDate><content:encoded>BODY TEXT THAT MUST NOT BE READ</content:encoded></item></channel></rss>';
const rssItems = parseRss(rssBody, 'https://x.gov.in/');
ok(rssItems.length === 2 && rssItems[1].published === '2026-10-16T15:07:12.000Z', 'RSS dates parse to ISO');
ok(!JSON.stringify(rssItems).includes('BODY TEXT'), 'the parser never carries feed body text into a candidate');

console.log('Listing engine: decoding and validation');
ok(decode('A &amp; B &rsquo;s &#8217; <b>x</b>') === 'A & B ’s ’ x', 'decode handles named, numeric and tags');
ok(decode('<![CDATA[Hello & bye]]>') === 'Hello & bye', 'decode unwraps CDATA');
ok(validItems([{ title: 'short', url: 'https://a.gov.in/x' }, { title: 'A proper long title', url: 'javascript:alert(1)' }, { title: 'A proper long title', url: 'https://a.gov.in/x' }]).length === 1, 'validItems drops short titles and non-http links');

console.log('Listing engine: robots.txt (RFC 9309 groups)');
const sciRobots = parseRobots('User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n');
ok(allowed(sciRobots, '/'), 'homepage is allowed');
ok(!allowed(sciRobots, '/wp-admin/options.php'), 'wp-admin is blocked');
ok(allowed(sciRobots, '/wp-admin/admin-ajax.php'), 'a longer Allow overrides the Disallow');
const prsRobots = parseRobots('User-agent: Googlebot\nDisallow: /\n\nUser-agent: *\nDisallow: /search/\n');
ok(allowed(prsRobots, '/billtrack'), 'the * group is used, not another agent');
ok(!allowed(prsRobots, '/search/x'), '/search/ is blocked for *');
ok(allowed(parseRobots(''), '/anything'), 'an empty robots.txt allows everything');
const dupStar = parseRobots('User-agent: *\nAllow: /\n\nUser-agent: *\nDisallow: /private/\n');
ok(!allowed(dupStar, '/private/report'), 'duplicate * groups are merged: the second group still blocks /private/');
ok(allowed(dupStar, '/public'), 'duplicate * groups keep their allowed paths');
const specific = parseRobots('User-agent: *\nAllow: /\n\nUser-agent: ZolaPersonalStudy\nDisallow: /\n');
ok(!allowed(specific, '/anything'), 'a group naming our product token is used, and * is ignored for us');
const specificCase = parseRobots('User-agent: zolapersonalstudy\nDisallow: /news\n\nUser-agent: *\nAllow: /\n');
ok(!allowed(specificCase, '/news/today') && allowed(specificCase, '/billtrack'), 'the product token matches case-insensitively');
const other = parseRobots('User-agent: OtherBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n');
ok(allowed(other, '/anything'), 'a rule for another bot does not apply to us');

const tie = parseRobots('User-agent: *\nDisallow: /a/verylong*pattern*\nAllow: /a/verylongpattern\n');
ok(allowed(tie, '/a/verylongpattern'), 'an equally specific Allow beats a Disallow whose wildcard syntax is not counted (Codex bypass)');
const queryRules = parseRobots('User-agent: *\nDisallow: /list?*secret\n');
ok(!allowed(queryRules, '/list?x=1&secret=2') && allowed(queryRules, '/list'), 'robots rules see the query string, not only the path (Codex bypass)');
const wild = parseRobots('User-agent: *\nDisallow: /*.json$\nDisallow: /private/*\nAllow: /private/open/\nCrawl-delay: 10\n');
ok(!allowed(wild, '/a/b.json') && allowed(wild, '/a/b.json?x=1'), 'a "$" anchor matches the end of the path only');
ok(!allowed(wild, '/private/x/y') && allowed(wild, '/private/open/x'), 'a "*" pattern blocks, and a longer Allow wins');
ok(wild.crawlDelay === 10, 'Crawl-delay is read from our group');
console.log('Listing engine: fetch, redirects and robots (fake requests, no network)');
const fakeRequest = routes => url => {
  const r = routes[url];
  if (!r) throw new Error(`no fake route for ${url}`);
  return { code: r.code, body: r.body || '', location: r.location || '' };
};
const noPause = async () => {};
clearRobotsCache();
{
  const waits = [];
  const req = fakeRequest({
    'https://slow.gov.in/robots.txt': { code: 200, body: 'User-agent: *\nAllow: /\nCrawl-delay: 10\n' },
    'https://slow.gov.in/a': { code: 200, body: '<html></html>' },
    'https://slow.gov.in/b': { code: 200, body: '<html></html>' },
  });
  await fetchListing('https://slow.gov.in/a', { hosts: ['slow.gov.in'], request: req, pause: async ms => { waits.push(ms); } });
  await fetchListing('https://slow.gov.in/b', { hosts: ['slow.gov.in'], request: req, pause: async ms => { waits.push(ms); } });
  ok(waits.some(ms => ms >= 9000), 'a second request to the same host waits for the Crawl-delay');
}
clearRobotsCache();
{
  const hosts = ['pib.gov.in', 'www.pib.gov.in'];
  const req = fakeRequest({
    'https://pib.gov.in/robots.txt': { code: 200, body: 'User-agent: *\nAllow: /\n' },
    'https://pib.gov.in/rss': { code: 301, location: 'https://www.pib.gov.in/rss' },
    'https://www.pib.gov.in/rss': { code: 200, body: '<rss></rss>' },
    'https://www.pib.gov.in/robots.txt': { code: 200, body: 'User-agent: *\nAllow: /\n' },
  });
  const r = await fetchListing('https://pib.gov.in/rss', { hosts, request: req, pause: noPause });
  ok(r.ok && r.finalUrl === 'https://www.pib.gov.in/rss', 'a same-source redirect to the allowed www host is followed');
}
clearRobotsCache();
{
  const hosts = ['pib.gov.in'];
  const req = fakeRequest({
    'https://pib.gov.in/robots.txt': { code: 200, body: 'User-agent: *\nAllow: /\n' },
    'https://pib.gov.in/rss': { code: 302, location: 'https://evil.example.com/steal' },
  });
  const r = await fetchListing('https://pib.gov.in/rss', { hosts, request: req, pause: noPause });
  ok(!r.ok && /not an allowed host/.test(r.reason), 'a cross-host redirect is refused without a request to the new host');
}
clearRobotsCache();
{
  const hosts = ['prsindia.org', 'example.gov.in'];
  const req = fakeRequest({
    'https://prsindia.org/robots.txt': { code: 200, body: 'User-agent: *\nAllow: /\n' },
    'https://prsindia.org/billtrack': { code: 302, location: 'https://example.gov.in/private/x' },
    'https://example.gov.in/robots.txt': { code: 200, body: 'User-agent: *\nDisallow: /private/\n' },
  });
  const r = await fetchListing('https://prsindia.org/billtrack', { hosts, request: req, pause: noPause });
  ok(!r.ok && /robots/.test(r.reason), 'an allowed-host redirect still obeys that host\'s robots.txt');
}
clearRobotsCache();
{
  const req = fakeRequest({
    'https://x.gov.in/robots.txt': { code: 200, body: 'User-agent: *\nAllow: /\n' },
    'https://x.gov.in/a': { code: 404 },
  });
  const r = await fetchListing('https://x.gov.in/a', { hosts: ['x.gov.in'], request: req, pause: noPause });
  ok(!r.ok && r.reason === 'HTTP 404', 'a 404 fails at once, with no retries');
}
clearRobotsCache();
{
  const req = fakeRequest({
    'https://x.gov.in/robots.txt': { code: 500 },
  });
  const r = await fetchListing('https://x.gov.in/a', { hosts: ['x.gov.in'], request: req, pause: noPause });
  ok(!r.ok && /robots/.test(r.reason), 'an unreadable robots.txt blocks the host (conservative)');
}
clearRobotsCache();
ok(robotsFor('https://x.gov.in/a', fakeRequest({ 'https://x.gov.in/robots.txt': { code: 404 } })).disallow.length === 0, 'a 404 robots.txt means no rules');
clearRobotsCache();
ok(robotsFor('https://pib.gov.in/x', fakeRequest({ 'https://pib.gov.in/robots.txt': { code: 301, location: 'https://www.pib.gov.in/robots.txt' }, 'https://www.pib.gov.in/robots.txt': { code: 200, body: 'User-agent: *\nAllow: /\n' }, }), ['pib.gov.in', 'www.pib.gov.in']).disallow.length === 0, 'a robots redirect to an allowed alias host is followed');
clearRobotsCache();
ok(robotsFor('https://pib.gov.in/x', fakeRequest({ 'https://pib.gov.in/robots.txt': { code: 301, location: 'https://evil.example.com/robots.txt' } }), ['pib.gov.in']).disallow.includes('/'), 'a robots redirect to an unlisted host is treated as blocked');

console.log('Listing engine: topic tags');
const T = (title, id) => ok(topicsFor(title).includes(id), `"${title.slice(0, 48)}" tags ${id}`);
T('RBI raises repo rate to 5.50%', 'economy-macro');
T('Indian Naval Ship Samarthak commissioned', 'security-defence');
T('CAQM expands PTZ camera monitoring to industries under air quality rules', 'environment-climate');
T('The Tribunals Reforms Bill, 2026', 'polity-governance');
T('The Tribunals Reforms Bill, 2026', 'polity-bodies');
T('Supreme Court held that the constitution protects the right', 'polity-constitution');
T('Kaziranga National Park flood alert', 'environment-ecology');
T('AIIA treated 37.74 lakh patients across its healthcare network', 'science-health-biotech');
T('Vice-President inaugurates Navaratri Sargotsavam 2026', 'art-culture-heritage');
T('Central Armed Police Forces Bill, 2026 introduced', 'security-defence');
T('PM-AJAY drives inclusive development', 'polity-governance');
T('NHRC takes suo motu cognizance of the reported assault', 'polity-bodies');
T('Taxation and Other Laws (Amendment) Bill, 2026', 'economy-macro');
T('CAQM expands PTZ Camera-based Remote Monitoring to all Industries', 'environment-climate');
T("The Bankers’ Books Evidence Bill, 2026", 'economy-banking-markets');
ok(buildDocument([{ source: SOURCES[1], status: 'ok', items: [{ title: 'K. X VS. BEDI HOSPITAL (C.A. No. 1/2026)', url: 'https://www.sci.gov.in/view-pdf/?diary_no=1&type=j', published: null }] }]).items[0].topics.length === 0, 'court case titles are not tagged by subject (Codex: Bedi Hospital)');
ok(!topicsFor('Foreign Contribution (Regulation) Amendment Rules, 2026').includes('polity-constitution'), 'an amendment to rules is not tagged as constitution');
ok(!topicsFor('INDIAN NAVY COMMISSIONS INS SAMARTHAK, THE FIRST INDIGENOUS MULTI-PURPOSE VESSEL').includes('polity-bodies'), 'the verb commissions is not a commission body');
ok(!topicsFor('K. MADHUSUDHAN RAO VS. M/S LODHA HEALTHY CONSTRUCTIONS AND DEVELOPER PRIVATE LIMITED').includes('science-health-biotech'), 'Healthy in a company name is not a health topic');
T('The Micro, Small and Medium Enterprises Development (Amendment) Bill, 2026', 'economy-macro');
T('National Commission for Women reviews complaints', 'polity-bodies');
ok(topicsFor('').length === 0, 'an empty title gets no tags');
ok(RULES.every(([id]) => id in TOPICS), 'every tag rule points to a taxonomy id');

console.log('Listing engine: exit codes');
const okSrc = { id: 'a', tier: 1, reuse: 'allowed' };
const badSrc = { id: 'b', tier: 2, reuse: 'link-only' };
const withItems = [{ title: 'Some item title', url: 'https://a.gov.in/1', published: null }];
ok(exitCodeFor([{ source: okSrc, status: 'ok', items: withItems }, { source: badSrc, status: 'ok', items: withItems }]) === 0, 'all sources ok: exit 0');
ok(exitCodeFor([{ source: okSrc, status: 'ok', items: withItems }, { source: badSrc, status: 'failed', items: [] }]) === 3, 'one source failed: exit 3 (partial), not green');
ok(exitCodeFor([{ source: okSrc, status: 'ok', items: withItems }, { source: badSrc, status: 'empty', items: [] }]) === 3, 'one source empty: exit 3');
ok(exitCodeFor([{ source: okSrc, status: 'failed', items: [] }, { source: badSrc, status: 'failed', items: [] }]) === 1, 'nothing answered: exit 1');

console.log('Listing engine: sources and document contract');
ok(!SOURCES.some(s => /barandbench/i.test(s.id + s.url)), 'Bar & Bench is not in the daily pull');
ok(SOURCES.every(s => Array.isArray(s.hosts) && s.hosts.length > 0), 'every source lists the hosts it may use');
ok(SOURCES.every(s => s.hosts.includes(new URL(s.url).host)), 'each source\'s own URL host is in its allowed hosts');
const now = new Date('2026-10-16T18:00:00Z');
const results = [
  { source: SOURCES[0], status: 'ok', reason: '', items: pib.slice(0, 3) },
  { source: SOURCES[1], status: 'ok', reason: '', items: sci.slice(0, 2) },
];
const doc1 = buildDocument(results, { now });
ok(doc1.schema === SCHEMA, 'schema is zola-candidates/1');
ok(validateDocument(doc1).length === 0, `a built document is valid${validateDocument(doc1).length ? ': ' + validateDocument(doc1).join('; ') : ''}`);
ok(doc1.items.every(i => i.fact_text === null), 'fact_text stays null');
ok(doc1.items.every(i => i.reuse === 'allowed'), 'reuse comes from the source record');
ok(doc1.sources.length === 2 && doc1.sources[1].count === 2, 'per-source status and count are recorded');
ok(new Set(doc1.items.map(i => i.id)).size === doc1.items.length, 'ids are unique');
ok(itemId('pib', pib[0].url) === itemId('pib', pib[0].url) && itemId('pib', pib[0].url) !== itemId('sci-judgments', pib[0].url), 'ids are stable and per source');
const later = new Date('2026-10-17T18:00:00Z');
const doc2 = buildDocument(results, { now: later, previous: doc1 });
ok(doc2.items.every(i => i.first_seen === doc1.items.find(j => j.id === i.id).first_seen), 'first_seen carries forward from the previous file');
const dup = buildDocument([...results, results[0]], { now });
ok(dup.items.length === doc1.items.length, 'the same URL from a repeated source is kept once');
ok(validateDocument({ ...doc1, items: [{ ...doc1.items[0], fact_text: 'copied text' }] }).length > 0, 'a filled fact_text is rejected by the contract');
ok(validateDocument({ ...doc1, items: [{ ...doc1.items[0], reuse: 'free' }] }).length > 0, 'an unknown reuse value is rejected');

console.log(failures() ? `\n✗ ${failures()} listing check(s) failed` : '\n✓ listing checks passed');
process.exit(failures() ? 1 : 0);
