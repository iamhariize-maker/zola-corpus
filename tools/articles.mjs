#!/usr/bin/env node
// Zola Corpus study articles. Plain Node 18+, no dependencies.
//
//   node tools/articles.mjs build   Validate tools/articles-data.mjs and write articles/index.html and articles/<slug>.html
//   node tools/articles.mjs check   Validate, then fail if any generated page differs from what the data would write
//
// Edit tools/articles-data.mjs, then run build. Never hand-edit the generated pages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES, CATEGORIES, VERIFIED } from './articles-data.mjs';
import { ARTICLE_SYLLABUS_DOCUMENT, getArticleSyllabus, validateArticleSyllabusMap } from './upsc-article-map.mjs';
import { PAPERS, TOPICS } from './upsc-taxonomy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'articles');

// Phrases that would predict exam questions or hype the content (AGENTS.md: voice and honesty).
const FORBIDDEN = /likely (to be )?(asked|appear)|will be asked|expected question|predicted question|guaranteed|\bfree\b(?!-return)|must[- ]read|most important question/i;
const KINDS = ['Official', 'News report', 'Government', 'Research'];
const SYLLABUS_PREDICTION = /likely (to be )?(asked|appear)|will be asked|expected question|predicted question|most important question|important for (the )?exam|must[- ]read/i;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const categoryTitle = id => CATEGORIES.find(c => c.id === id)?.title ?? '';

export function validate(articles = ARTICLES, syllabusDocument = ARTICLE_SYLLABUS_DOCUMENT) {
  const problems = [];
  const slugs = new Set();
  for (const a of articles) {
    const where = a.slug || '(no slug)';
    for (const k of ['slug', 'category', 'title', 'dek', 'event']) if (!a[k]) problems.push(`${where}: missing ${k}`);
    if (slugs.has(a.slug)) problems.push(`${where}: duplicate slug`);
    slugs.add(a.slug);
    if (!CATEGORIES.some(c => c.id === a.category)) problems.push(`${where}: unknown category ${a.category}`);
    if (!/^[a-z0-9-]+$/.test(a.slug || '')) problems.push(`${where}: slug must be lowercase letters, digits and hyphens`);
    if (!a.facts?.length) problems.push(`${where}: needs key facts`);
    if (!a.sections?.length) problems.push(`${where}: needs at least one section`);
    if (!a.caveats?.length) problems.push(`${where}: needs a caveats entry, even if it says nothing is unverified`);
    if (!a.sources || a.sources.length < 2) problems.push(`${where}: needs at least two sources`);
    for (const s of a.sources || []) {
      if (!/^https:\/\//.test(s.url)) problems.push(`${where}: source is not https: ${s.url}`);
      if (!KINDS.includes(s.kind)) problems.push(`${where}: source kind must be one of ${KINDS.join(', ')}`);
    }
    const text = [a.title, a.dek, a.event, ...(a.facts || []), ...(a.caveats || []), ...(a.sections || []).flatMap(s => [s.heading, ...s.paragraphs])].join(' ');
    const bad = text.match(FORBIDDEN);
    if (bad) problems.push(`${where}: forbidden phrase "${bad[0]}"`);
    const words = text.split(/\s+/).length;
    if (words < 200) problems.push(`${where}: only ${words} words; articles need enough detail to study from`);
  }
  // The syllabus sidecar must match these exact slugs; a stale or invalid map fails the build.
  problems.push(...validateArticleSyllabusMap({ articles, document: syllabusDocument }));
  // Reasons and gaps are shown to readers, so they must not predict questions. Only this narrow detector applies
  // here; ordinary legal and economic wording such as "free trade" stays allowed.
  for (const [slug, entry] of Object.entries(syllabusDocument?.articles ?? {})) {
    const reasons = Array.isArray(entry?.mappings) ? entry.mappings.map(m => m?.reason) : [];
    for (const text of [entry?.mapping_gap, ...reasons]) {
      if (typeof text !== 'string') continue;
      const bad = text.match(SYLLABUS_PREDICTION);
      if (bad) problems.push(`${slug}: syllabus text predicts questions: "${bad[0]}"`);
    }
  }
  return problems;
}

// Draft syllabus links: metadata only, labelled unverified, and never a prediction of questions.
function renderSyllabus(syllabus) {
  const body = syllabus.mappings.length
    ? `      <ul>\n${syllabus.mappings.map(m => `        <li><strong>${esc(TOPICS[m.topic].title)}</strong> <span class="papers">${esc(m.papers.map(id => PAPERS[id]).join('; '))}</span><br>${esc(m.reason)}</li>`).join('\n')}\n      </ul>`
    : `      <p>${esc(syllabus.mappingGap)}</p>`;
  return `    <section class="syllabus" aria-labelledby="syllabus-links">
      <h2 id="syllabus-links">Draft syllabus links</h2>
      <p class="verified draft-status">Draft, unverified. These link the note to UPSC syllabus areas as study aids. They are not official UPSC wording, not a verdict on any syllabus section, and not a list of exam questions. The owner's check of the notification PDF is still pending.</p>
${body}
    </section>`;
}

function renderArticle(a, syllabusDocument) {
  // Fail closed: a page without a valid syllabus entry is never written.
  const syllabus = getArticleSyllabus(a.slug, { document: syllabusDocument });
  if (!syllabus) throw new Error(`${a.slug}: no valid syllabus map entry; fix data/upsc-article-map.json`);
  const sections = a.sections.map(s => `      <section>\n        <h2>${esc(s.heading)}</h2>\n${s.paragraphs.map(p => `        <p>${esc(p)}</p>`).join('\n')}\n      </section>`).join('\n');
  const caveats = a.caveats.map(c => `        <li>${esc(c)}</li>`).join('\n');
  const sources = a.sources.map(s => `        <li><a href="${esc(s.url)}">${esc(s.label)}</a> <span class="kind">${esc(s.kind)}</span></li>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.title)} · Zola Corpus</title>
<meta name="description" content="${esc(a.dek)}">
<meta name="theme-color" content="#f7f4ec">
<link rel="stylesheet" href="articles.css">
<link rel="icon" href="../icons/favicon.svg" type="image/svg+xml">
</head>
<body>
<a class="skip" href="#main">Skip to the article</a>
<header class="bar"><a class="brand" href="../">Zola Corpus</a><nav aria-label="Articles"><a href="index.html">All articles</a></nav></header>
<main id="main">
  <article>
    <p class="kicker">${esc(categoryTitle(a.category))} · ${esc(a.event)}</p>
    <h1>${esc(a.title)}</h1>
    <p class="dek">${esc(a.dek)}</p>
    <p class="verified">Checked against the sources below on ${esc(VERIFIED)}. Items marked "background" are general knowledge, not taken from the sources.</p>
    <section>
      <h2>Key facts</h2>
      <ul>
${a.facts.map(f => `        <li>${esc(f)}</li>`).join('\n')}
      </ul>
    </section>
${sections}
${renderSyllabus(syllabus)}
    <section class="caveats">
      <h2>Caveats and unverified points</h2>
      <ul>
${caveats}
      </ul>
    </section>
    <section class="sources">
      <h2>Sources</h2>
      <ol>
${sources}
      </ol>
    </section>
  </article>
</main>
<footer><p>Study notes on recent events. They say what happened and what to verify; they do not predict exam questions.</p><p><a href="index.html">All articles</a> · <a href="../">Back to the app</a></p></footer>
</body>
</html>
`;
}

function renderIndex(articles) {
  const groups = CATEGORIES.map(c => {
    const items = articles.filter(a => a.category === c.id);
    if (!items.length) return '';
    const cards = items.map(a => `        <li><a href="${esc(a.slug)}.html"><span class="card-title">${esc(a.title)}</span><span class="card-dek">${esc(a.dek)}</span><span class="card-meta">${esc(a.event)}</span></a></li>`).join('\n');
    return `    <section>\n      <h2>${esc(c.title)}</h2>\n      <ul class="cards">\n${cards}\n      </ul>\n    </section>`;
  }).filter(Boolean).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Study articles · Zola Corpus</title>
<meta name="description" content="Detailed study notes on important recent events for UPSC and APSC Prelims 2027, each with sources.">
<meta name="theme-color" content="#f7f4ec">
<link rel="stylesheet" href="articles.css">
<link rel="icon" href="../icons/favicon.svg" type="image/svg+xml">
</head>
<body>
<a class="skip" href="#main">Skip to the articles</a>
<header class="bar"><a class="brand" href="../">Zola Corpus</a><nav aria-label="Articles"><a href="../">Back to the app</a></nav></header>
<main id="main">
  <h1>Study articles on recent events</h1>
  <p class="dek">Detailed notes on important events for UPSC and APSC Prelims 2027. Each article gives the key facts, what is still unverified, and its sources. Every article was checked on ${esc(VERIFIED)}.</p>
${groups}
</main>
<footer><p>Study notes on recent events. They say what happened and what to verify; they do not predict exam questions.</p><p><a href="../">Back to the app</a></p></footer>
</body>
</html>
`;
}

export function render(articles = ARTICLES, syllabusDocument = ARTICLE_SYLLABUS_DOCUMENT) {
  const files = { 'index.html': renderIndex(articles) };
  for (const a of articles) files[`${a.slug}.html`] = renderArticle(a, syllabusDocument);
  return files;
}

function main() {
  const cmd = process.argv[2] || 'build';
  const problems = validate();
  if (problems.length) { console.error(problems.map(p => '✗ ' + p).join('\n')); process.exit(1); }
  const files = render();
  if (cmd === 'build') {
    fs.mkdirSync(OUT, { recursive: true });
    for (const [name, html] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), html);
    console.log(`✓ wrote ${Object.keys(files).length} pages to articles/`);
    return;
  }
  if (cmd === 'check') {
    const stale = Object.entries(files).filter(([name, html]) => {
      const file = path.join(OUT, name);
      return !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== html;
    }).map(([name]) => name);
    if (stale.length) { console.error(`✗ out of date: ${stale.join(', ')}. Run: node tools/articles.mjs build`); process.exit(1); }
    console.log(`✓ ${Object.keys(files).length} article pages match the data`);
    return;
  }
  console.error(`unknown command: ${cmd}`);
  process.exit(2);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
