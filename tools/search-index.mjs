#!/usr/bin/env node
// Global search index for the Zola Corpus PWA (ZC-04.4). Plain Node 18+, no dependencies.
//
//   node tools/search-index.mjs          Write search-index.json at the repo root
//   node tools/search-index.mjs --check  Fail if the committed search-index.json differs from a fresh build
//
// Every record is read as static data: the embedded JSON blocks in index.html, the CSAT source as text (decoded
// from base64 and parsed with a pattern, never executed), and the taxonomy and article modules. Nothing here runs
// the app's generators, opens a frame, or reads storage. The browser only loads the committed file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOPICS } from './upsc-taxonomy.mjs';
import { ARTICLES } from './articles-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SEARCH_INDEX_SCHEMA = 'zola-search-index/1';
export const SEARCH_INDEX_FILE = 'search-index.json';

const TYPES = ['topic', 'article', 'forecast', 'machine', 'claim', 'case', 'csat'];

function jsonBlock(html, id) {
  const m = html.match(new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`));
  if (!m) throw new Error(`search index: block ${id} not found in index.html`);
  return JSON.parse(m[1]);
}

// The CSAT generator source is base64 text. Each record starts "G.<key> = { name: '...', sec: '...', fam: '...'".
// The records are read with a pattern and never evaluated. The count must match every "G.<key> = {" definition, so a
// record the pattern cannot read fails the build instead of being dropped.
function csatRecords(html) {
  const m = html.match(/<script type="text\/plain" id="srcC">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('search index: srcC not found in index.html');
  const text = Buffer.from(m[1].trim(), 'base64').toString('utf8');
  const unescape = s => s.replace(/\\(.)/g, '$1');
  const rx = /G\.([A-Za-z0-9_]+)\s*=\s*\{\s*name:\s*'((?:[^'\\]|\\.)*)',\s*sec:\s*'((?:[^'\\]|\\.)*)',\s*fam:\s*'((?:[^'\\]|\\.)*)'/g;
  const out = [];
  for (const r of text.matchAll(rx)) out.push({ key: r[1], name: unescape(r[2]), sec: unescape(r[3]), fam: unescape(r[4]) });
  const defined = (text.match(/G\.[A-Za-z0-9_]+\s*=\s*\{/g) || []).length;
  if (out.length !== defined) throw new Error(`search index: read ${out.length} CSAT records of ${defined} definitions`);
  return out;
}

const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const parts = (...xs) => xs.filter(x => typeof x === 'string' && x.trim()).join(' ');

export function buildSearchIndex({
  html,
  topics = TOPICS,
  articles = ARTICLES,
} = {}) {
  const items = jsonBlock(html, 'dataItems');
  const zb = jsonBlock(html, 'zolaBData');
  const records = [];

  for (const [id, t] of Object.entries(topics)) {
    records.push({ type: 'topic', id, title: t.title, sub: t.papers.join(', '), text: parts(t.title, t.papers.join(' ')), route: null, detail: { papers: t.papers } });
  }
  for (const a of articles) {
    records.push({
      type: 'article', id: a.slug, title: a.title, sub: a.event,
      text: parts(a.title, a.dek, a.event, (a.facts || []).join(' ')),
      route: `articles/${a.slug}.html`,
    });
  }
  for (const it of items) {
    records.push({
      type: 'forecast', id: it.id, title: it.t, sub: parts(it.d, it.w), text: parts(it.t, it.d, it.what, it.hook, it.src),
      route: '#forecast/tracker', rowId: it.id,
    });
  }
  for (const m of zb.machines) {
    records.push({ type: 'machine', id: m.id, title: m.title, sub: m.id, text: parts(m.title, m.purpose), route: `#hacking/${m.id}` });
  }
  for (const c of zb.claim_bank) {
    records.push({
      type: 'claim', id: c.id, title: clip(c.text, 160), sub: parts(c.tag, c.currency_check && `currency: ${c.currency_check}`),
      limit: c.note || '', text: parts(c.text, c.note, c.evidence_phrase, c.locator), route: null,
      detail: { text: c.text, tag: c.tag, currency_check: c.currency_check || '', note: c.note || '', locator: c.locator || '', evidence_phrase: c.evidence_phrase || '' },
    });
  }
  for (const c of zb.case_bank) {
    records.push({
      type: 'case', id: c.id, title: `${c.name} (${c.year})`, sub: parts(c.court, c.decided && `decided ${c.decided}`),
      limit: c.null_reason || c.verified_scope || '', text: parts(c.name, c.citation, c.court, c.posture, c.verified_scope, c.null_reason),
      route: null,
      detail: {
        name: c.name, year: c.year, decided: c.decided || '', citation: c.citation || '', court: c.court || '', posture: c.posture || '',
        verified_scope: c.verified_scope || '', null_reason: c.null_reason || '',
      },
    });
  }
  for (const c of csatRecords(html)) {
    records.push({ type: 'csat', id: c.key, title: c.name, sub: parts(c.sec, c.fam), text: parts(c.name, c.sec, c.fam, c.key), route: '#csat' });
  }

  const counts = Object.fromEntries(TYPES.map(t => [t, records.filter(r => r.type === t).length]));
  return { schema: SEARCH_INDEX_SCHEMA, status: 'static-extract', counts, records };
}

function main() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const fresh = JSON.stringify(buildSearchIndex({ html }), null, 1) + '\n';
  const out = path.join(ROOT, SEARCH_INDEX_FILE);
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
    if (current !== fresh) {
      console.error(`✗ ${SEARCH_INDEX_FILE} is out of date (run: node tools/search-index.mjs)`);
      process.exit(1);
    }
    console.log(`✓ ${SEARCH_INDEX_FILE} is current`);
    return;
  }
  fs.writeFileSync(out, fresh);
  console.log(`✓ wrote ${SEARCH_INDEX_FILE}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
