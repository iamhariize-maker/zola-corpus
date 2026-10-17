#!/usr/bin/env node
// Daily listing pull for the Zola current-affairs engine (ZC-02). Writes data/candidates/YYYY-MM-DD.json.
// Metadata only: titles, links, dates, topic hints. No article bodies. See docs/SOURCES-ZC-02.md.
//
//   node tools/fetch-listings.mjs            fetch every source and write today's file
//   node tools/fetch-listings.mjs --dry      fetch and print a summary, write nothing
//
// Exit codes:
//   0  every source answered with items
//   3  partial: at least one source failed or came back empty (the file is still written, with per-source status)
//   1  nothing answered (nothing written)
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
        rights: r.source.reuse === 'allowed' ? { terms: r.source.terms, checked_on: r.source.checked_on } : null,
        topics: r.source.tagTopics === false ? [] : topicsFor(it.title),
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

// The exit code for a run, from per-source statuses ("ok", "empty" or "failed").
export function exitCodeFor(results) {
  if (!results.some(r => r.status === 'ok')) return 1;
  return results.every(r => r.status === 'ok') ? 0 : 3;
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
    if (i.reuse === 'allowed' && !(i.rights && i.rights.terms && i.rights.checked_on)) problems.push(`${i.id}: reuse allowed needs a recorded rights basis`);
    if (i.fact_text !== null) problems.push(`${i.id}: fact_text must stay null until a person writes it`);
    if (!Array.isArray(i.topics)) problems.push(`${i.id}: topics must be an array`);
  }
  return problems;
}

function summary(results) {
  const rows = results.map(r => `| ${r.source.id} | ${r.status} | ${r.items.length} | ${r.reason || '-'} |`);
  return ['### Listing pull', '', '| source | status | items | note |', '|---|---|---|---|', ...rows, ''].join('\n');
}

async function run(argv) {
  const dry = argv.includes('--dry');
  const results = [];
  for (const source of SOURCES) {
    const r = await fetchListing(source.url, { hosts: source.hosts });
    if (!r.ok) { results.push({ source, status: 'failed', reason: r.reason, items: [] }); await sleep(1000); continue; }
    let items = [];
    try {
      items = validItems(source.parse(r.body, r.finalUrl)).filter(source.keep || (() => true));
    } catch (e) {
      results.push({ source, status: 'failed', reason: `parse error: ${String(e.message).split('\n')[0]}`, items: [] });
      await sleep(1000);
      continue;
    }
    const status = items.length ? 'ok' : 'empty';
    results.push({ source, status, reason: items.length ? '' : 'parsed zero items; the layout may have changed', items });
    console.log(`${source.id}: ${status}, ${items.length} items`);
    await sleep(1000);
  }
  for (const r of results) if (r.status !== 'ok') console.error(`${r.source.id}: ${r.status}: ${r.reason}`);
  const code = exitCodeFor(results);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary(results));
  if (code === 1) { console.error('No source returned items. Nothing written.'); return 1; }

  const today = new Date();
  const day = today.toISOString().slice(0, 10);
  const prevFile = fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.json') && f < `${day}.json`).sort().pop() : null;
  const previous = prevFile ? JSON.parse(fs.readFileSync(path.join(OUT_DIR, prevFile), 'utf8')) : null;
  const doc = buildDocument(results, { now: today, previous });
  const problems = validateDocument(doc);
  if (problems.length) { console.error(problems.join('\n')); return 1; }
  if (dry) { console.log(JSON.stringify({ sources: doc.sources, count: doc.items.length }, null, 2)); return code; }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${day}.json`), JSON.stringify(doc, null, 2) + '\n');
  console.log(`wrote data/candidates/${day}.json with ${doc.items.length} items${code === 3 ? ' (partial: see the failed sources above)' : ''}`);
  return code;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).then(code => process.exit(code));
}
