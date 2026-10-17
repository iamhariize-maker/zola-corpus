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
// Syllabus reasons and gaps must not predict questions. A cue is exempt only when it is directly negated
// ("not expected questions", "is not guaranteed to be asked") or sits under "does not predict". Every match in
// a clause is checked, and clause breaks stop a cue from reaching into an unrelated clause.
// Each cue attaches a prediction directly to a question or to an exam term. A bare "likely to appear in the Gazette"
// or "guaranteed by Article 19" carries no exam term or question, so it is not a prediction.
// Token recognizer for syllabus reasons and gaps. The text is split into clauses. Each clause is read for its subject
// (a candidate or applicant, or a question, topic or other item), its predicate (an appearance, a being-asked, or an exam
// preparation claim) and its negation. A negation counts only when it governs the cue: a not/no/never directly before it, a
// no or none subject, or a not-claim/not-predict whose complement starts the clause. "No doubt" is an idiom, not a
// negation, and "cannot" is a negation. A coordinating "and" starts a new clause before a subject or a predicate verb,
// and before a determiner once the clause already has a finite predicate. Every cue in every clause is checked.
const EXAM_WORDS = new Set(['prelims', 'prelim', 'mains', 'exam', 'exams', 'examination', 'examinations', 'paper', 'papers']);
const NON_EXAM_AFTER_UPSC = new Set(['calendar', 'calendars', 'website', 'notice', 'notices', 'timetable', 'portal', 'office', 'chairman', 'member', 'members', 'circular', 'advertisement', 'notification']);
const PERSON_WORDS = new Set(['candidate', 'candidates', 'applicant', 'applicants', 'aspirant', 'aspirants', 'examinee', 'examinees', 'student', 'students', 'individual', 'individuals', 'people', 'person', 'persons']);
const QUESTION_SG = new Set(['question', 'questions']);
const QUESTION_ANY = new Set(['question', 'questions', 'topic', 'topics', 'subject', 'subjects', 'item', 'items']);
const ATTR_HEADS = new Set(['guaranteed', 'expected', 'likely', 'predicted']);
const ADJ_WORDS = new Set(['expected', 'guaranteed', 'likely', 'predicted', 'certain', 'sure', 'definitely', 'certainly', 'surely', 'important']);
const MODAL_HEADS = new Set(['will', 'going', 'expected', 'likely', 'certain', 'sure', 'guaranteed', 'definitely', 'certainly', 'surely']);
const CUE_SKIP = new Set(['to', 'be', 'definitely', 'certainly', 'surely', 'going', 'not']);
const PREP_WORDS = new Set(['in', 'for', 'at']);
const AUX_WORDS = new Set(['is', 'are', 'was', 'were', 'will', 'would', 'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'does', 'do', 'did', 'has', 'have', 'had', 'be', 'appear', 'appears', 'come', 'comes', 'expect', 'expects', 'offer', 'offers', 'raise', 'raises', 'cover', 'covers', 'discuss', 'discusses', 'list', 'lists', 'listed', 'include', 'includes', 'need', 'needs', 'require', 'requires', 'required', 'draw', 'draws', 'see', 'sees', 'claim', 'claims', 'read']);
const NEG_SUBJECT = new Set(['no', 'none', 'nothing', 'nobody']);
const NEG_WORDS = new Set(['not', 'never', 'no', 'nor', 'neither']);
const DET_WORDS = new Set(['a', 'an', 'the', 'this', 'these', 'those', 'some', 'any']);
const REPORTING_WORDS = new Set(['predict', 'claim', 'claims', 'claimed', 'say', 'says', 'said', 'state', 'states', 'stated', 'suggest', 'suggests', 'imply', 'implies', 'direct', 'directs', 'mention', 'mentions', 'mentioned']);
const COMPLEMENT_START = new Set(['that', 'which', 'what', 'how', 'whether', 'any', 'all', 'these', 'this', 'some', 'none', 'no', 'many', 'those', 'the', 'each', 'every']);
const SUBJECT_START_FOR_AND = new Set(['this', 'it', 'these', 'that', 'they', 'there', 'none', 'no', 'candidates', 'applicants', 'students']);
// A bare predicate verb after "and" begins a new predicate ("...will be asked and offer guaranteed questions").
const VERB_AFTER_AND = new Set(['be', 'is', 'are', 'was', 'were', 'will', 'would', 'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'has', 'have', 'had', 'appear', 'appears', 'come', 'comes', 'expect', 'expects', 'offer', 'offers', 'raise', 'raises', 'cover', 'covers', 'discuss', 'discusses', 'include', 'includes', 'need', 'needs', 'require', 'requires', 'draw', 'draws', 'see', 'sees', 'mention', 'mentions']);
// A preposition before a person word makes it a modifier, not the subject ("questions for candidates").
const PREP_IN_SUBJECT = new Set(['for', 'of', 'in', 'to', 'from', 'by', 'with', 'on', 'at', 'among', 'about']);
const CONTRAST_WORDS = new Set(['but', 'though', 'while', 'whereas', 'yet']);
const CLAUSE_PUNCT = new Set(['.', ';', ':', '!', '?', ',']);

function tokenizeSyllabus(text) {
  const expanded = String(text)
    .replace(/\bcannot\b/gi, 'can not')
    .replace(/\bwon't\b/gi, 'will not')
    .replace(/\bcan't\b/gi, 'can not')
    .replace(/([a-z])n't\b/gi, '$1 not');
  const raw = expanded.match(/[A-Za-z0-9]+|[.;:!?,]/g) ?? [];
  const toks = raw.map(t => (CLAUSE_PUNCT.has(t) ? t : t.toLowerCase()));
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    if (toks[i] === 'no' && toks[i + 1] === 'doubt') { i++; continue; }
    out.push(toks[i]);
  }
  return out;
}

// "questions and topics" keeps its object, but "...appear and a topic will appear" splits: a determiner after "and"
// starts a clause only when the clause so far already has a finite verb.
function startsClause(tokens, i, cur) {
  const next = tokens[i + 1];
  if (SUBJECT_START_FOR_AND.has(next) || VERB_AFTER_AND.has(next)) return true;
  return DET_WORDS.has(next) && cur.some(t => AUX_WORDS.has(t));
}

// Splits into clauses. A clause after a reporting verb records whether that verb is negated and its complement starts a
// noun phrase or clause (so "does not predict which questions..." is negated, but "do not claim otherwise and..." is not).
function splitClauses(tokens) {
  const clauses = [];
  let cur = [];
  let curNeg = false;
  const breakAt = keepNeg => {
    if (cur.length) clauses.push({ tokens: cur, reportNeg: curNeg });
    cur = [];
    curNeg = keepNeg;
  };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (CLAUSE_PUNCT.has(t) || CONTRAST_WORDS.has(t)) { breakAt(false); continue; }
    if (t === 'and' && startsClause(tokens, i, cur)) { breakAt(false); continue; }
    if (REPORTING_WORDS.has(t)) {
      const neg = tokens[i - 1] === 'not' || (['does', 'do', 'did'].includes(tokens[i - 1]) && tokens[i - 2] === 'not');
      const j = tokens[i + 1] === 'that' ? i + 2 : i + 1;
      breakAt(neg && COMPLEMENT_START.has(tokens[j]));
      continue;
    }
    cur.push(t);
  }
  breakAt(false);
  return clauses;
}

function examAt(tokens, idx) {
  if (idx < 0 || idx >= tokens.length) return false;
  const w = tokens[idx];
  if (EXAM_WORDS.has(w)) return true;
  if (w === 'upsc') return tokens[idx + 1] === undefined || !NON_EXAM_AFTER_UPSC.has(tokens[idx + 1]);
  return false;
}

function hasExamFrom(tokens, from) {
  for (let i = from; i < tokens.length; i++) if (examAt(tokens, i)) return true;
  return false;
}

// True when a negation word sits directly before the cue, allowing only determiners between them.
function negatedBefore(tokens, k) {
  let m = k - 1;
  while (m >= 0 && DET_WORDS.has(tokens[m])) m--;
  return m >= 0 && NEG_WORDS.has(tokens[m]);
}

function cuesIn(tokens) {
  const out = [];
  const n = tokens.length;
  for (let k = 0; k < n; k++) {
    const w = tokens[k];
    if (ATTR_HEADS.has(w)) {
      let j = k + 1;
      while (j < n && ADJ_WORDS.has(tokens[j])) j++;
      if (j < n && QUESTION_SG.has(tokens[j])) out.push({ kind: 'attr', neg: negatedBefore(tokens, k), text: tokens.slice(k, j + 1).join(' ') });
    }
    if (w === 'expect' || w === 'expects') {
      const q = tokens.slice(k + 1, k + 7).findIndex(t => QUESTION_ANY.has(t));
      if (q >= 0 && hasExamFrom(tokens, k + 1 + q + 1)) out.push({ kind: 'expect', neg: negatedBefore(tokens, k), text: w });
    }
    if (MODAL_HEADS.has(w)) {
      let j = k + 1;
      let skipNot = false;
      while (j < n && CUE_SKIP.has(tokens[j])) { if (tokens[j] === 'not') skipNot = true; j++; }
      if (j < n) {
        const nx = tokens[j];
        let kind = null;
        if (nx === 'appear' || (nx === 'come' && tokens[j + 1] === 'up')) kind = 'appear';
        else if (nx === 'asked' || nx === 'tested') kind = 'asked';
        else if (PREP_WORDS.has(nx) && tokens.slice(j + 1, j + 5).some((_, i2) => examAt(tokens, j + 1 + i2))) kind = 'exam-prep';
        if (kind) out.push({ kind, neg: skipNot || negatedBefore(tokens, k), text: tokens.slice(k, j + 1).join(' ') });
      }
    }
    if (w === 'read' && tokens[k - 1] === 'must') out.push({ kind: 'hype', neg: negatedBefore(tokens, k - 1), text: 'must read' });
    if (w === 'important' && QUESTION_ANY.has(tokens[k + 1])) out.push({ kind: 'hype', neg: negatedBefore(tokens, k), text: `important ${tokens[k + 1]}` });
  }
  return out;
}

function personSubject(subject) {
  const i = subject.findIndex(t => PERSON_WORDS.has(t));
  return i >= 0 && !subject.slice(0, i).some(t => PREP_IN_SUBJECT.has(t));
}

function clausePredicts(tokens, reportNeg) {
  const aux = tokens.findIndex(t => AUX_WORDS.has(t));
  const subject = aux < 0 ? tokens : tokens.slice(0, aux);
  const person = personSubject(subject);
  const subjectNegated = NEG_SUBJECT.has(tokens[0]);
  for (const cue of cuesIn(tokens)) {
    if (cue.neg || subjectNegated || reportNeg) continue;
    if (cue.kind === 'attr' || cue.kind === 'expect' || cue.kind === 'hype') return cue.text;
    if (person) continue;
    if (cue.kind === 'appear') {
      if (tokens.some((_, i) => examAt(tokens, i))) return cue.text;
      continue;
    }
    return cue.text;
  }
  return null;
}

function predictionIn(text) {
  const tokens = tokenizeSyllabus(text);
  for (const clause of splitClauses(tokens)) {
    const hit = clausePredicts(clause.tokens, clause.reportNeg);
    if (hit) return hit;
  }
  return null;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const categoryTitle = id => CATEGORIES.find(c => c.id === id)?.title ?? '';
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const DATE_RX = new RegExp(`^\\d{1,2} (${MONTHS}) \\d{4}$`);
// An article shows the date it was last checked. Articles without their own date share the build date in VERIFIED.
const checkedOn = a => a.checked ?? VERIFIED;

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
    if (a.checked !== undefined && !DATE_RX.test(a.checked)) problems.push(`${where}: checked must be a date like 16 October 2026`);
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
      const bad = predictionIn(text);
      if (bad) problems.push(`${slug}: syllabus text predicts questions: "${bad}"`);
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
    <p class="verified">Checked against the sources below on ${esc(checkedOn(a))}. Items marked "background" are general knowledge, not taken from the sources.</p>
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
  <p class="dek">Detailed notes on important events for UPSC and APSC Prelims 2027. Each article gives the key facts, what is still unverified, and its sources, and says when it was last checked.</p>
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
