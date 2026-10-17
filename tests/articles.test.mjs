// Study articles and the Supersymmetry process files. Node only, no browser needed.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, failures } from './helpers.mjs';
import { ARTICLES, VERIFIED } from '../tools/articles-data.mjs';
import { validate, render } from '../tools/articles.mjs';
import { validateTaxonomy, TAXONOMY_STATUS } from '../tools/upsc-taxonomy.mjs';
import { ARTICLE_SYLLABUS_DOCUMENT } from '../tools/upsc-article-map.mjs';

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = f => fs.existsSync(path.join(ROOT, f));

console.log('Study articles: content rules');
const problems = validate();
ok(problems.length === 0, `every article passes the content rules${problems.length ? ': ' + problems.join('; ') : ''}`);
ok(ARTICLES.length >= 12, `at least 12 articles (have ${ARTICLES.length})`);
ok(ARTICLES.filter(a => a.category === 'nobel').length >= 7, 'the six 2026 Nobel prizes plus an overview are all present');

console.log('Study articles: generated pages are current');
const files = render();
for (const [name, html] of Object.entries(files)) {
  const file = path.join('articles', name);
  ok(exists(file) && read(file) === html, `${file} matches tools/articles-data.mjs (run: npm run articles)`);
}
ok(!fs.readdirSync(path.join(ROOT, 'articles')).some(f => f.endsWith('.html') && !(f in files)), 'no stray article pages without data');

console.log('Study articles: draft syllabus links');
const escapeText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unlabelled = ARTICLES.filter(a => {
  const html = read(path.join('articles', `${a.slug}.html`));
  const entry = ARTICLE_SYLLABUS_DOCUMENT.articles[a.slug];
  // A mapped note must show its papers; a gap note must show its gap and no paper list.
  const shown = entry.mappings.length
    ? /class="papers"/.test(html)
    : html.includes(escapeText(entry.mapping_gap)) && !/class="papers"/.test(html);
  return !(/id="syllabus-links"/.test(html) && /Draft, unverified\./.test(html) && shown);
}).map(a => a.slug);
ok(unlabelled.length === 0, `every article page shows its draft syllabus links, or its gap, with the unverified label${unlabelled.length ? ': ' + unlabelled.join(', ') : ''}`);
const gapDoc = structuredClone(ARTICLE_SYLLABUS_DOCUMENT);
gapDoc.articles['union-budget-2026-27'] = { mappings: [], mapping_gap: 'Test gap: no current topic fits this note.' };
ok(validate(ARTICLES, gapDoc).length === 0, 'an explicit whole-article mapping gap is a valid entry');
const gapPage = render(ARTICLES, gapDoc)['union-budget-2026-27.html'];
ok(gapPage.includes('Test gap: no current topic fits this note.') && !/class="papers"/.test(gapPage), 'a mapping gap is shown on the page and lists no topic links');
const missingDoc = structuredClone(ARTICLE_SYLLABUS_DOCUMENT);
delete missingDoc.articles['padma-awards-2026'];
ok(validate(ARTICLES, missingDoc).some(p => /slug set mismatch/.test(p)), 'a syllabus map missing an article fails the content rules');
let failedClosed = false;
try { render(ARTICLES, missingDoc); } catch (e) { failedClosed = /no valid syllabus map entry/.test(e.message); }
ok(failedClosed, 'rendering fails closed when an article has no valid syllabus entry');
const forbiddenReasonDoc = structuredClone(ARTICLE_SYLLABUS_DOCUMENT);
forbiddenReasonDoc.articles['nobel-peace-2026'].mappings[0].reason = 'This is a guaranteed expected question.';
ok(validate(ARTICLES, forbiddenReasonDoc).some(p => /nobel-peace-2026: syllabus text predicts questions/.test(p)), 'a forbidden phrase in a syllabus reason fails the content rules');
const forbiddenGapDoc = structuredClone(ARTICLE_SYLLABUS_DOCUMENT);
forbiddenGapDoc.articles['union-budget-2026-27'] = { mappings: [], mapping_gap: 'Likely to be asked in Prelims.' };
ok(validate(ARTICLES, forbiddenGapDoc).some(p => /union-budget-2026-27: syllabus text predicts questions/.test(p)), 'a forbidden phrase in a mapping gap fails the content rules');
ok(validate(ARTICLES, ARTICLE_SYLLABUS_DOCUMENT).length === 0, 'ordinary factual rationales still pass the content rules');
const ordinaryDoc = structuredClone(ARTICLE_SYLLABUS_DOCUMENT);
ordinaryDoc.articles['nobel-peace-2026'].mappings[0].reason = 'Covers free trade and freedom of speech, which is guaranteed by Article 19.';
ok(validate(ARTICLES, ordinaryDoc).length === 0, 'ordinary wording such as "free trade" and "guaranteed by Article 19" is not blocked');
const reasonProblems = text => {
  const d = structuredClone(ARTICLE_SYLLABUS_DOCUMENT);
  d.articles['nobel-peace-2026'].mappings[0].reason = text;
  return validate(ARTICLES, d);
};
ok(reasonProblems('This is a guaranteed question.').some(p => /predicts questions/.test(p)), 'a guaranteed question is rejected on its own');
ok(reasonProblems('This topic is guaranteed to be asked in Prelims.').some(p => /predicts questions/.test(p)), 'a topic guaranteed to be asked is rejected');
ok(reasonProblems('These are not expected questions. This is guaranteed to be asked.').some(p => /predicts questions/.test(p)), 'a disclaimer does not exempt a separate prediction in the same text');
ok(reasonProblems('These links are study aids, not expected questions.').length === 0, 'a study-aid disclaimer that negates the cue is accepted');
ok(reasonProblems('This does not predict which questions will be asked.').length === 0, 'a statement that does not predict questions is accepted');
ok(reasonProblems('The topic is unlikely to be asked.').length === 0, 'unlikely to be asked is accepted (not the substring likely)');
ok(reasonProblems('This topic is not the only issue; it is guaranteed to be asked.').some(p => /predicts questions/.test(p)), 'a negation in another clause does not cancel a guaranteed prediction');
ok(reasonProblems('This is not a forecast, but likely to be asked in Prelims.').some(p => /predicts questions/.test(p)), 'a negation before a contrast does not cancel a likely prediction after it');
ok(reasonProblems('This topic is not guaranteed to be asked.').length === 0, 'a directly negated guarantee is accepted');
ok(reasonProblems('There is no doubt this is a guaranteed question.').some(p => /predicts questions/.test(p)), 'a negation elsewhere in the clause does not exempt a guaranteed question');
ok(reasonProblems('These are not expected questions; this topic is guaranteed to be asked.').some(p => /predicts questions/.test(p)), 'a negated cue does not exempt a second, unnegated prediction after a semicolon');
ok(reasonProblems('Rights are guaranteed by Article 19; the note discusses constitutional questions.').length === 0, 'a guarantee and a separate questions mention in different clauses are accepted');
ok(reasonProblems('This will appear in the Prelims exam.').some(p => /predicts questions/.test(p)), 'will appear is a prediction');
ok(reasonProblems('This is not a guaranteed question.').length === 0, 'a directly negated guaranteed question is accepted');
const predicts = text => reasonProblems(text).some(p => /predicts questions/.test(p));
ok(predicts('Not expected questions and guaranteed to be asked.'), 'a negated cue does not exempt a second cue later in the clause');
ok(predicts('This topic is not the only issue and it is guaranteed to be asked.'), 'a negation that governs another word does not exempt a guarantee');
ok(predicts('This is not only a guaranteed question.'), '"not only" does not directly negate a guaranteed question');
ok(predicts('This will appear in Prelims.'), 'will appear in Prelims is a prediction');
ok(!predicts('Rights guaranteed by Article 19 raise constitutional questions.'), 'a guarantee and an unrelated questions mention in one clause are accepted');
ok(!predicts('The notice will appear in the Gazette.'), 'will appear in the Gazette is accepted (not exam wording)');
ok(predicts('This does not predict which questions will be asked and this is guaranteed to be asked.'), 'does not predict does not exempt a later guarantee in the same clause');
ok(!predicts('This does not predict which questions will be asked.'), 'does not predict which questions will be asked is accepted');
const probe = [
  ['This does not predict which questions will be asked and this is a guaranteed question.', true],
  ['This does not predict which questions will be asked and this is guaranteed to be asked.', true],
  ['This does not predict which questions will be asked and this will appear in Prelims.', true],
  ['This does not predict which questions will be asked and this is an expected question.', true],
  ['This question will definitely be asked in Prelims.', true],
  ['This question is expected in Prelims.', true],
  ['The notice is likely to appear in the Gazette.', false],
];
for (const [text, rejected] of probe) ok(predicts(text) === rejected, `${rejected ? 'rejects' : 'accepts'}: ${text}`);
ok(predicts('This question will definitely be asked in Prelims.') === true, 'rejects: This question will definitely be asked in Prelims.');
ok(predicts('This question is expected in Prelims.') === true, 'rejects: This question is expected in Prelims.');
ok(predicts('This question is expected to appear in Prelims.') === true, 'rejects: This question is expected to appear in Prelims.');
ok(predicts('This topic is likely to come up in Prelims.') === true, 'rejects: This topic is likely to come up in Prelims.');
ok(predicts('This topic is guaranteed to come up in Prelims.') === true, 'rejects: This topic is guaranteed to come up in Prelims.');
ok(predicts('This question is certainly going to appear in Prelims.') === true, 'rejects: This question is certainly going to appear in Prelims.');
ok(predicts('This will appear in Prelims.') === true, 'rejects: This will appear in Prelims.');
ok(predicts('The notice is likely to appear in the Gazette.') === false, 'accepts: The notice is likely to appear in the Gazette.');
ok(predicts('The Gazette notice is expected to appear tomorrow.') === false, 'accepts: The Gazette notice is expected to appear tomorrow.');
ok(predicts('The Gazette notice is certain to appear tomorrow.') === false, 'accepts: The Gazette notice is certain to appear tomorrow.');
ok(predicts('The notice will definitely appear in the Gazette.') === false, 'accepts: The notice will definitely appear in the Gazette.');
ok(predicts('The notice will appear in the Gazette.') === false, 'accepts: The notice will appear in the Gazette.');
ok(predicts('No expected questions are listed here.') === false, 'accepts: No expected questions are listed here.');
ok(predicts('No question is expected to appear in Prelims.') === false, 'accepts: No question is expected to appear in Prelims.');
ok(predicts('No questions are expected in Prelims.') === false, 'accepts: No questions are expected in Prelims.');
ok(predicts('No questions will be asked in Prelims.') === false, 'accepts: No questions will be asked in Prelims.');
ok(predicts('No topic is likely to come up in the exam.') === false, 'accepts: No topic is likely to come up in the exam.');
ok(predicts('Candidates are required to appear in the UPSC examination.') === false, 'accepts: Candidates are required to appear in the UPSC examination.');
ok(predicts('The UPSC notice directs candidates to appear in the examination.') === false, 'accepts: The UPSC notice directs candidates to appear in the examination.');
ok(predicts('The timetable will appear in the UPSC calendar.') === false, 'accepts: The timetable will appear in the UPSC calendar.');
ok(predicts('The notice says applicants will be asked to produce identification.') === false, 'accepts: The notice says applicants will be asked to produce identification.');
ok(predicts('The article does not claim that any of these topics is guaranteed to be asked.') === false, 'accepts: The article does not claim that any of these topics is guaranteed to be asked.');
ok(predicts('We do not claim otherwise and offer guaranteed questions.') === true, 'rejects: We do not claim otherwise and offer guaranteed questions.');
ok(predicts('This question will be in Prelims.') === true, 'rejects: This question will be in Prelims.');
ok(predicts('Expect a question on this topic in Prelims.') === true, 'rejects: Expect a question on this topic in Prelims.');
ok(predicts('A question on this topic is certain for Prelims.') === true, 'rejects: A question on this topic is certain for Prelims.');
ok(predicts('There is no doubt this is a guaranteed question.') === true, 'rejects: There is no doubt this is a guaranteed question.');
ok(predicts('This does not predict how many questions will be asked.') === false, 'accepts: This does not predict how many questions will be asked.');
ok(predicts('The article does not claim that this topic is guaranteed to be asked.') === false, 'accepts: The article does not claim that this topic is guaranteed to be asked.');
ok(predicts('This topic is not guaranteed to be asked.') === false, 'accepts: This topic is not guaranteed to be asked.');
ok(predicts('No question is expected and a topic will appear in Prelims.') === true, 'rejects: No question is expected and a topic will appear in Prelims. (a later assertion after and)');
ok(predicts('We do not predict which questions will be asked and offer guaranteed questions.') === true, 'rejects: We do not predict which questions will be asked and offer guaranteed questions. (negation does not reach a second predicate)');
ok(predicts('The note does not claim that this topic will appear in UPSC and the topic is guaranteed to be asked.') === true, 'rejects: The note does not claim that this topic will appear in UPSC and the topic is guaranteed to be asked.');
ok(predicts('This cannot predict which questions will be asked.') === false, 'accepts: This cannot predict which questions will be asked. (cannot is a negation)');
ok(predicts('Questions for candidates will be asked in Prelims.') === true, 'rejects: Questions for candidates will be asked in Prelims. (candidates after for is a modifier)');
ok(predicts('This does not predict which questions and topics will be asked.') === false, 'accepts: This does not predict which questions and topics will be asked. (coordinated object stays negated)');
ok(predicts('Candidates are likely to appear in Prelims.') === false, 'accepts: Candidates are likely to appear in Prelims. (attendance)');
const nonArrayDoc = structuredClone(ARTICLE_SYLLABUS_DOCUMENT);
nonArrayDoc.articles['nobel-peace-2026'].mappings = {};
let nonArrayThrew = false, nonArrayProblems = [];
try { nonArrayProblems = validate(ARTICLES, nonArrayDoc); } catch { nonArrayThrew = true; }
ok(!nonArrayThrew && nonArrayProblems.some(p => /mappings must be an array/.test(p)), 'a non-array mappings field is reported, not thrown');

console.log('Study articles: per-article checked date');
const badDateArticles = ARTICLES.map(a => (a.slug === 'nobel-peace-2026' ? { ...a, checked: '17 Oct 2026' } : a));
ok(validate(badDateArticles).some(p => /nobel-peace-2026: checked must be a date/.test(p)), 'a checked date must be written out in full (17 Oct 2026 is rejected)');
const datedArticles = ARTICLES.map(a => (a.slug === 'nobel-peace-2026' ? { ...a, checked: '17 October 2026' } : a));
const datedFiles = render(datedArticles);
ok(datedFiles['nobel-peace-2026.html'].includes('Checked against the sources below on 17 October 2026.'), 'an article with its own checked date shows that date');
ok(datedFiles['union-budget-2026-27.html'].includes(`Checked against the sources below on ${VERIFIED}.`), 'an article without its own date keeps the build date');
ok(datedFiles['index.html'].includes('says when it was last checked') && !/Every article was checked/.test(datedFiles['index.html']), 'the index no longer says every article was checked on one date');

console.log('Study articles: pages are self-contained and offline-safe');
for (const name of Object.keys(files)) {
  const html = read(path.join('articles', name));
  ok(!/<script\b[^>]*\bsrc=/i.test(html), `${name}: no external scripts`);
  ok(!/@import|url\(\s*['"]?https?:/i.test(html), `${name}: no external stylesheets or fonts`);
  const hrefs = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&'));
  const allowed = new Set(ARTICLES.flatMap(a => a.sources.map(s => s.url)));
  ok(hrefs.every(h => allowed.has(h)), `${name}: every external link is a listed source`);
}
ok(read('articles/articles.css').includes('prefers-color-scheme: dark') && read('articles/articles.css').includes('data-theme="dark"'), 'articles.css: dark theme under both guards');

console.log('Study articles: offline cache and publishing');
const sw = read('sw.js');
const pages = fs.readdirSync(path.join(ROOT, 'articles')).filter(f => /\.(html|css)$/.test(f));
for (const p of pages) ok(sw.includes(`'./articles/${p}'`), `sw.js precaches articles/${p}`);
ok(/caches\.match\(req, \{ignoreSearch: true\}\)\.then\(hit => hit \|\| fetch\(req\)/.test(sw), 'sw.js serves a cached article page for navigation before the network');
ok(/SITE_FILES = \[[^\]]*'articles'/.test(read('tools/pwa.mjs')), 'tools/pwa.mjs publishes the articles folder');
ok(read('articles/index.html').includes('Study articles on recent events'), 'hub page is generated');
for (const a of ARTICLES) ok(read('articles/index.html').includes(`${a.slug}.html`), `hub links to ${a.slug}`);

console.log('UPSC taxonomy draft');
ok(validateTaxonomy().length === 0, 'taxonomy ids and papers are valid');
ok(TAXONOMY_STATUS === 'draft-unverified', 'taxonomy is marked unverified until checked against the UPSC notification');

console.log('Supersymmetry process files');
ok(exists('SUPERSYMMETRY.md'), 'SUPERSYMMETRY.md is in the repo');
const sup = exists('SUPERSYMMETRY.md') ? read('SUPERSYMMETRY.md') : '';
ok(sup.includes('## Zola Corpus binding'), 'SUPERSYMMETRY.md has the Zola Corpus binding');
ok(!/ccr-4ad6dc17|ccr-35128f32|Shizuku|deepseek\/supersymmetry/i.test(sup), 'no Svan lanes, Svan tasks or Svan branches in the binding');
ok(read('AGENTS.md').includes('SUPERSYMMETRY.md') && read('AGENTS.md').includes('## What this is'), 'AGENTS.md points to SUPERSYMMETRY.md and keeps its existing sections');
ok(read('CLAUDE.md').includes('SUPERSYMMETRY.md') && read('CLAUDE.md').includes('AGENTS.md'), 'CLAUDE.md points to SUPERSYMMETRY.md and AGENTS.md');
ok(exists('docs/handoff/ACCEPTANCE_LEDGER.md'), 'acceptance ledger exists');

console.log('Study articles: opens offline after the first visit');
{
  const { playwright, serve } = await import('./helpers.mjs');
  const { chromium } = await playwright();
  const { base, close } = await serve();
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(base);
    await page.evaluate(() => navigator.serviceWorker.ready);
    // The install step precaches every article; wait until the physics page is in the cache.
    await page.waitForFunction(async () => {
      for (const name of await caches.keys()) {
        if (await (await caches.open(name)).match('./articles/nobel-physics-2026.html')) return true;
      }
      return false;
    }, null, { timeout: 30000 });
    await context.setOffline(true);
    const res = await page.goto(base + 'articles/nobel-physics-2026.html');
    const h1 = await page.textContent('h1');
    ok(res && res.ok() && /Francis Halzen/.test(h1 || ''), `physics article opens offline from the cache (h1: "${(h1 || '').trim()}")`);
    await context.close();
  } catch (e) {
    ok(false, `offline article check ran: ${e.message.split('\n')[0]}`);
  } finally {
    await browser.close();
    close();
  }
}

console.log(failures() ? `\n✗ ${failures()} articles check(s) failed` : '\n✓ articles checks passed');
process.exit(failures() ? 1 : 0);
