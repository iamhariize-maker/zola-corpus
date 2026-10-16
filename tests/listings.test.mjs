// Listing engine (ZC-02): parsers on saved fixtures, robots rules, topic tags, document contract. No network.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, failures } from './helpers.mjs';
import { parseRss, parsePrsBills, parseScHome, decode, validItems } from '../tools/listings/parse.mjs';
import { parseRobots, allowed } from '../tools/listings/robots.mjs';
import { topicsFor, RULES } from '../tools/listings/tags.mjs';
import { SOURCES } from '../tools/listings/sources.mjs';
import { buildDocument, validateDocument, itemId, SCHEMA } from '../tools/fetch-listings.mjs';
import { TOPICS } from '../tools/upsc-taxonomy.mjs';

const fx = f => fs.readFileSync(path.join(ROOT, 'tests/fixtures/listings', f), 'utf8');

console.log('Listing engine: parsers');
const pib = parseRss(fx('pib-rss.xml'), 'https://pib.gov.in/');
ok(pib.length >= 15, `PIB feed yields items (${pib.length})`);
ok(pib.every(i => /^https:\/\/pib\.gov\.in\/PressReleaseIframePage\.aspx\?PRID=\d+$/.test(i.url)), 'every PIB link is a PRID link');
ok(pib.every(i => i.published === null), 'PIB has no dates in its feed (published stays null; first_seen is used)');
ok(!pib.some(i => /&amp;|&lt;|&#/.test(i.title)), 'PIB titles are decoded text');

const bnb = parseRss(fx('barandbench-feed.xml'), 'https://www.barandbench.com/');
ok(bnb.length === 4, `Bar & Bench feed yields 4 items (${bnb.length})`);
ok(bnb.every(i => /^\d{4}-\d{2}-\d{2}T/.test(i.published || '')), 'Bar & Bench dates parse to ISO');
ok(bnb.some(i => i.title.includes('Tahir Hussain')), 'a known Bar & Bench headline is found');

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

console.log('Listing engine: decoding and validation');
ok(decode('A &amp; B &rsquo;s &#8217; <b>x</b>') === 'A & B ’s ’ x', 'decode handles named, numeric and tags');
ok(decode('<![CDATA[Hello & bye]]>') === 'Hello & bye', 'decode unwraps CDATA');
ok(validItems([{ title: 'short', url: 'https://a.gov.in/x' }, { title: 'A proper long title', url: 'javascript:alert(1)' }, { title: 'A proper long title', url: 'https://a.gov.in/x' }]).length === 1, 'validItems drops short titles and non-http links');

console.log('Listing engine: robots.txt');
const sciRobots = parseRobots('User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n');
ok(allowed(sciRobots, '/'), 'homepage is allowed');
ok(!allowed(sciRobots, '/wp-admin/options.php'), 'wp-admin is blocked');
ok(allowed(sciRobots, '/wp-admin/admin-ajax.php'), 'a longer Allow overrides the Disallow');
const prsRobots = parseRobots('User-agent: Googlebot\nDisallow: /\n\nUser-agent: *\nDisallow: /search/\n');
ok(allowed(prsRobots, '/billtrack'), 'the * group is used, not another agent');
ok(!allowed(prsRobots, '/search/x'), '/search/ is blocked for *');
ok(allowed(parseRobots(''), '/anything'), 'an empty robots.txt allows everything');

console.log('Listing engine: topic tags');
const T = (title, id) => ok(topicsFor(title).includes(id), `"${title.slice(0, 48)}" tags ${id}`);
T('RBI raises repo rate to 5.50%', 'economy-macro');
T('Indian Naval Ship Samarthak commissioned', 'security-defence');
T('CAQM expands PTZ camera monitoring to industries under air quality rules', 'environment-climate');
T('The Tribunals Reforms Bill, 2026', 'polity-governance');
T('Supreme Court held that the constitution protects the right', 'polity-constitution');
T('Kaziranga National Park flood alert', 'environment-ecology');
ok(!topicsFor('Foreign Contribution (Regulation) Amendment Rules, 2026').includes('polity-constitution'), 'an amendment to rules is not tagged as constitution');
T('AIIA treated 37.74 lakh patients across its healthcare network', 'science-health-biotech');
T('Vice-President inaugurates Navaratri Sargotsavam 2026', 'art-culture-heritage');
ok(topicsFor('Tea estate workers receive new housing').length === 0 || !topicsFor('Tea estate workers receive new housing').includes('security-defence'), 'an unrelated title is not tagged as defence');
ok(topicsFor('').length === 0, 'an empty title gets no tags');
const everyRuleIsTaxonomy = RULES.every(([id]) => id in TOPICS);
ok(everyRuleIsTaxonomy, 'every tag rule points to a taxonomy id');

console.log('Listing engine: document contract');
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
