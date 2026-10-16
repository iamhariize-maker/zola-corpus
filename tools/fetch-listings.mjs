#!/usr/bin/env node
// Daily listing pull for the Zola current-affairs engine (ZC-02). Writes data/candidates/YYYY-MM-DD.json.
// Metadata only: titles, links, dates, topic hints. No article bodies. See docs/SOURCES-ZC-02.md.
//
//   node tools/fetch-listings.mjs            fetch every source and write today's file
//   node tools/fetch-listings.mjs --dry      fetch and print a summary, write nothing
//
// Exit codes: 0 when at least one source answered; 1 when none did (so a scheduled run fails loudly).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SOURCES } from './listings/sources.mjs';
import { fetchListing, sleep } from './listings/fetch.mjs';
import { validItems } from './listings/parse.mjs';
import { topicsFor } from './listings/tags.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'data', 'candidates');
export const SCHEMA = 'zola-candidates/1';

export const itemId = (sourceId, url) => `${sourceId}:${crypto.createHash('sha1').update(url).digest('hex').slice(0, 12)}`;

// Build the document from per-source results. Pure, so it can be tested without the network.
export function buildDocument(results, { now = new Date(), previous = null } = {}) {
  const firstSeen = new Map((previous?.items || []).map(i => [i.id, i.first_seen]));
  const nowIso = now.toISOString();
  const seen = new Set();
  const items = [];
  for (const r of results) {
    for (const it of r.items) {
      const id = itemId(r.source.id, it.url);
      if (seen.has(id)) continue;
      seen.add(id);
      items.push({
        id,
        source: r.source.id,
        tier: r.source.tier,
        title: it.title,
        url: it.url,
        published: it.published,
        first_seen: firstSeen.get(id) || nowIso,
        reuse: r.source.reuse,
        topics: topicsFor(it.title),
        fact_text: null,
      });
    }
  }
  items.sort((a, b) => (b.published || b.first_seen).localeCompare(a.published || a.first_seen));
  return {
    schema: SCHEMA,
    generated_at: nowIso,
    sources: results.map(r => ({ source: r.source.id, status: r.status, count: r.items.length, reason: r.reason })),
    items,
  };
}

// Schema check used by the tests and by any reader of the file.
export function validateDocument(doc) {
  const problems = [];
  if (doc.schema !== SCHEMA) problems.push(`schema must be ${SCHEMA}`);
  if (!Array.isArray(doc.sources) || !Array.isArray(doc.items)) return [...problems, 'sources and items must be arrays'];
  const ids = new Set();
  for (const i of doc.items) {
    if (ids.has(i.id)) problems.push(`duplicate id ${i.id}`);
    ids.add(i.id);
    if (!/^https:\/\/|^http:\/\//.test(i.url)) problems.push(`${i.id}: url is not http(s)`);
    if (!['allowed', 'link-only'].includes(i.reuse)) problems.push(`${i.id}: reuse must be allowed or link-only`);
    if (i.fact_text !== null) problems.push(`${i.id}: fact_text must stay null until a person writes it`);
    if (!Array.isArray(i.topics)) problems.push(`${i.id}: topics must be an array`);
  }
  return problems;
}

async function run(argv) {
  const dry = argv.includes('--dry');
  const results = [];
  for (const source of SOURCES) {
    const r = await fetchListing(source.url);
    if (!r.ok) { results.push({ source, status: 'failed', reason: r.reason, items: [] }); continue; }
    let items = [];
    try { items = validItems(source.parse(r.body, source.url)).filter(source.keep || (() => true)); } catch (e) {
      results.push({ source, status: 'failed', reason: `parse error: ${String(e.message).split('\n')[0]}`, items: [] });
      continue;
    }
    const status = items.length ? 'ok' : 'empty';
    results.push({ source, status, reason: items.length ? '' : 'parsed zero items; the layout may have changed', items });
    console.log(`${source.id}: ${status}, ${items.length} items`);
    await sleep(1000);
  }
  const answered = results.some(r => r.status === 'ok');
  if (!answered) { console.error('No source returned items. Nothing written.'); return 1; }

  const today = new Date();
  const day = today.toISOString().slice(0, 10);
  const prevFile = fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.json') && f < `${day}.json`).sort().pop() : null;
  const previous = prevFile ? JSON.parse(fs.readFileSync(path.join(OUT_DIR, prevFile), 'utf8')) : null;
  const doc = buildDocument(results, { now: today, previous });
  const problems = validateDocument(doc);
  if (problems.length) { console.error(problems.join('\n')); return 1; }
  if (dry) { console.log(JSON.stringify({ sources: doc.sources, count: doc.items.length }, null, 2)); return 0; }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${day}.json`), JSON.stringify(doc, null, 2) + '\n');
  console.log(`wrote data/candidates/${day}.json with ${doc.items.length} items`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).then(code => process.exit(code));
}
