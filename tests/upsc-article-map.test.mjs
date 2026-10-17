import assert from 'node:assert/strict';
import { ARTICLES } from '../tools/articles-data.mjs';
import { ARTICLES_OCT17 } from '../tools/articles-oct17-notes.mjs';
import {
  ARTICLE_SYLLABUS_FRAGMENT_DOCUMENT,
  ARTICLE_SYLLABUS_DOCUMENT,
  ARTICLE_SYLLABUS_MAP,
  ARTICLE_SYLLABUS_SCHEMA,
  ARTICLE_SYLLABUS_SOURCE,
  ARTICLE_SYLLABUS_STATUS,
  composeArticleSyllabusDocument,
  getArticleSyllabus,
  validateArticleSyllabusMap,
} from '../tools/upsc-article-map.mjs';
import { validate as validateArticles } from '../tools/articles.mjs';
import {
  PAPERS,
  TAXONOMY_STATUS,
  TOPICS,
  UPSC_SYLLABUS_SOURCE,
} from '../tools/upsc-taxonomy.mjs';

const EXPECTED_ARTICLE_SLUGS = [
  'nobel-2026-at-a-glance',
  'nobel-physics-2026',
  'nobel-medicine-2026',
  'nobel-chemistry-2026',
  'nobel-literature-2026',
  'nobel-peace-2026',
  'nobel-economics-2026',
  'fields-medal-2026',
  'artemis-ii-2026',
  'ai-impact-summit-2026',
  'union-budget-2026-27',
  'padma-awards-2026',
  'rbi-repo-hike-october-2026',
  'public-examinations-amendment-act-2026',
  'supreme-court-judges-amendment-2026',
  'tribunals-reforms-act-2026',
  'mines-minerals-amendment-act-2026',
  'ins-samarthak-commissioned-2026',
  'caqm-ptz-cameras-ncr-2026',
  'pmay-urban-2-csmc-october-2026',
  'constitution-131st-amendment-bill-2026',
];
const cloneDocument = () => JSON.parse(JSON.stringify(ARTICLE_SYLLABUS_DOCUMENT));
const hasProblem = (document, expression, options) =>
  validateArticleSyllabusMap({ document, ...options }).some(problem => expression.test(problem));

console.log('UPSC article syllabus sidecar');
assert.equal(ARTICLE_SYLLABUS_STATUS, 'draft-unverified');
assert.equal(ARTICLE_SYLLABUS_STATUS, TAXONOMY_STATUS);
assert.equal(ARTICLE_SYLLABUS_DOCUMENT.schema, 'zola-article-syllabus-map/1');
assert.equal(ARTICLE_SYLLABUS_SCHEMA, ARTICLE_SYLLABUS_DOCUMENT.schema);
assert.deepEqual(ARTICLES.map(article => article.slug), EXPECTED_ARTICLE_SLUGS, 'the current article export has the pinned 21 slugs');
assert.deepEqual(Object.keys(ARTICLE_SYLLABUS_MAP), EXPECTED_ARTICLE_SLUGS, 'the sidecar has exactly the current article keys in export order');
assert.deepEqual(validateArticleSyllabusMap(), [], 'the sidecar entries validate against the articles and taxonomy');
assert.ok(
  validateArticleSyllabusMap({
    articles: [...ARTICLES, ARTICLES_OCT17[0]],
    document: ARTICLE_SYLLABUS_DOCUMENT,
  }).some(problem => /slug set mismatch/.test(problem)),
  'a partial note import stays invalid until the complete extension is present',
);

const OCT17_ARTICLES = [...ARTICLES, ...ARTICLES_OCT17];
const OCT17_SYLLABUS_DOCUMENT = composeArticleSyllabusDocument(
  ARTICLE_SYLLABUS_DOCUMENT,
  [ARTICLE_SYLLABUS_FRAGMENT_DOCUMENT],
);
assert.deepEqual(
  validateArticleSyllabusMap({ articles: OCT17_ARTICLES, document: OCT17_SYLLABUS_DOCUMENT }),
  [],
  'the 17 October fragment composes into a complete, exact-slug sidecar',
);
assert.deepEqual(
  validateArticles(OCT17_ARTICLES, OCT17_SYLLABUS_DOCUMENT),
  [],
  'all 17 October article content and syllabus text pass the existing article contract',
);
for (const article of ARTICLES_OCT17) {
  assert.equal(article.checked, '17 October 2026', `${article.slug} uses the generator's per-article date field`);
  assert.ok(
    getArticleSyllabus(article.slug, { articles: OCT17_ARTICLES, document: OCT17_SYLLABUS_DOCUMENT }),
    `${article.slug} resolves against the supplied combined article list`,
  );
}
assert.throws(
  () => composeArticleSyllabusDocument(ARTICLE_SYLLABUS_DOCUMENT, [
    { ...ARTICLE_SYLLABUS_FRAGMENT_DOCUMENT, schema: 'unsupported/0' },
  ]),
  /fragment schema must be/,
  'unsupported fragment versions fail closed',
);
assert.throws(
  () => composeArticleSyllabusDocument(ARTICLE_SYLLABUS_DOCUMENT, [
    ARTICLE_SYLLABUS_FRAGMENT_DOCUMENT,
    ARTICLE_SYLLABUS_FRAGMENT_DOCUMENT,
  ]),
  /duplicates slug/,
  'duplicate extension slugs fail closed',
);
const prototypeKeyFragment = JSON.parse('{"schema":"zola-article-syllabus-map-fragment/1","status":"draft-unverified","articles":{"__proto__":{"mappings":[],"mapping_gap":"synthetic test row"}}}');
const prototypeKeyDocument = composeArticleSyllabusDocument(ARTICLE_SYLLABUS_DOCUMENT, [prototypeKeyFragment]);
assert.ok(Object.hasOwn(prototypeKeyDocument.articles, '__proto__'), 'composition preserves a JSON __proto__ key as ordinary data');
assert.equal(Object.getPrototypeOf(prototypeKeyDocument.articles), Object.prototype, 'extension data cannot change the sidecar prototype');

assert.equal(ARTICLE_SYLLABUS_SOURCE.notificationUrl, 'https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf');
assert.equal(ARTICLE_SYLLABUS_SOURCE.examinationPageUrl, UPSC_SYLLABUS_SOURCE.examinationPageUrl);
assert.equal(ARTICLE_SYLLABUS_SOURCE.status, 'human-pdf-check-pending');
assert.deepEqual(ARTICLE_SYLLABUS_SOURCE.printedPageAnchors, UPSC_SYLLABUS_SOURCE.printedPageAnchors);
assert.match(ARTICLE_SYLLABUS_SOURCE.printedPageAnchors['prelims-gs1'], /printed p\. 32.*Part A—Preliminary Examination, Paper I/i);
assert.match(ARTICLE_SYLLABUS_SOURCE.printedPageAnchors['prelims-csat'], /printed p\. 32.*Paper II \(CSAT\).*printed p\. 26/i);
assert.match(ARTICLE_SYLLABUS_SOURCE.printedPageAnchors['mains-gs1'], /printed pp\. 33–34/i);
assert.match(ARTICLE_SYLLABUS_SOURCE.printedPageAnchors['mains-gs2'], /printed pp\. 34–35.*accountability.*international relations/i);
assert.match(ARTICLE_SYLLABUS_SOURCE.printedPageAnchors['mains-gs3'], /printed pp\. 35–36.*pollution.*environmental impact assessment.*IPR/i);
assert.match(ARTICLE_SYLLABUS_SOURCE.printedPageAnchors['mains-gs4'], /printed p\. 36/i);

const AWARD_HONOUR_ARTICLES = [
  'nobel-literature-2026',
  'fields-medal-2026',
  'padma-awards-2026',
];
assert.deepEqual(
  Object.entries(ARTICLE_SYLLABUS_MAP)
    .filter(([, entry]) => entry.mappings.some(mapping => mapping.topic === 'awards-honours'))
    .map(([slug]) => slug),
  AWARD_HONOUR_ARTICLES,
  'the narrow awards topic is used only by the three reviewed award articles',
);
for (const slug of AWARD_HONOUR_ARTICLES) {
  assert.deepEqual(ARTICLE_SYLLABUS_MAP[slug].mappings, [
    {
      topic: 'awards-honours',
      papers: ['prelims-gs1'],
      reason: ARTICLE_SYLLABUS_MAP[slug].mappings[0].reason,
    },
  ]);
  assert.equal(ARTICLE_SYLLABUS_MAP[slug].mapping_gap, undefined);
}

for (const slug of EXPECTED_ARTICLE_SLUGS) {
  const entry = ARTICLE_SYLLABUS_MAP[slug];
  const record = getArticleSyllabus(slug);
  assert.ok(record, `${slug} has a lookup result`);
  assert.equal(record.status, 'draft-unverified');
  const topicIds = entry.mappings.map(mapping => mapping.topic);
  assert.equal(new Set(topicIds).size, topicIds.length, `${slug} has no duplicate topic IDs`);
  for (const mapping of entry.mappings) {
    assert.ok(Object.hasOwn(TOPICS, mapping.topic), `${slug} uses known topic ${mapping.topic}`);
    assert.ok(mapping.papers.length > 0, `${slug} selects at least one paper for ${mapping.topic}`);
    for (const paperId of mapping.papers) {
      assert.ok(Object.hasOwn(PAPERS, paperId), `${slug} uses known paper ${paperId}`);
      assert.ok(TOPICS[mapping.topic].papers.includes(paperId), `${slug} paper ${paperId} is supported by ${mapping.topic}`);
    }
  }
  const selectedPaperIds = new Set(entry.mappings.flatMap(mapping => mapping.papers));
  const derived = Object.keys(PAPERS).filter(paperId => selectedPaperIds.has(paperId));
  assert.deepEqual(record.papers, derived, `${slug} paper hints derive from the mapped taxonomy topics`);
  assert.deepEqual(record.mappings.map(mapping => mapping.papers), entry.mappings.map(mapping => mapping.papers));
  assert.deepEqual(record.mappings.map(mapping => mapping.topic), topicIds);
}
assert.deepEqual(getArticleSyllabus('nobel-literature-2026').papers, ['prelims-gs1'], 'the awards hint is Prelims-only');
assert.equal(getArticleSyllabus('nobel-literature-2026').mappingGap, null);
assert.equal(getArticleSyllabus('not-an-article'), null, 'unknown article slugs return null');

const validGap = cloneDocument();
validGap.articles['nobel-physics-2026'].mappings = [];
validGap.articles['nobel-physics-2026'].mapping_gap = 'No supported topic is assigned in this fixture.';
assert.deepEqual(validateArticleSyllabusMap({ document: validGap }), [], 'a no-match row with a reason validates');
assert.deepEqual(getArticleSyllabus('nobel-physics-2026', { document: validGap }).papers, []);
assert.equal(getArticleSyllabus('nobel-physics-2026', { document: validGap }).mappingGap, validGap.articles['nobel-physics-2026'].mapping_gap);

const missingSlug = cloneDocument();
delete missingSlug.articles['nobel-physics-2026'];
assert.ok(hasProblem(missingSlug, /slug set mismatch.*nobel-physics-2026/), 'missing article mappings fail exact slug coverage');

const extraSlug = cloneDocument();
extraSlug.articles['invented-article'] = { mappings: [], mapping_gap: 'test-only row' };
assert.ok(hasProblem(extraSlug, /slug set mismatch.*invented-article/), 'extra article mappings fail exact slug coverage');

const duplicateArticleSlug = [...ARTICLES, { ...ARTICLES[0] }];
assert.ok(hasProblem(cloneDocument(), /article source: duplicate slug/, { articles: duplicateArticleSlug }), 'duplicate source slugs fail validation');

const unknownTopic = cloneDocument();
unknownTopic.articles['nobel-physics-2026'].mappings[0].topic = 'constructor';
assert.ok(hasProblem(unknownTopic, /unknown topic constructor/), 'unknown or inherited topic properties are rejected');

const duplicateTopic = cloneDocument();
duplicateTopic.articles['nobel-physics-2026'].mappings.push({ ...duplicateTopic.articles['nobel-physics-2026'].mappings[0] });
assert.ok(hasProblem(duplicateTopic, /duplicate topic science-general-tech-ipr/), 'duplicate topic mappings fail');

const unknownPaper = cloneDocument();
unknownPaper.articles['nobel-physics-2026'].mappings[0].papers[0] = 'constructor';
assert.ok(hasProblem(unknownPaper, /unknown paper constructor/), 'unknown or inherited paper properties are rejected');

const malformedPaperId = cloneDocument();
malformedPaperId.articles['nobel-physics-2026'].mappings[0].papers = [{ toString: null }];
assert.doesNotThrow(() => validateArticleSyllabusMap({ document: malformedPaperId }), 'malformed paper IDs do not trigger coercion errors');
assert.ok(hasProblem(malformedPaperId, /paper IDs must be strings/), 'non-string paper IDs fail with a type error');
assert.equal(getArticleSyllabus('nobel-physics-2026', { document: malformedPaperId }), null, 'lookup fails closed on malformed paper IDs');

const wrongPaper = cloneDocument();
wrongPaper.articles['nobel-physics-2026'].mappings[0].papers[0] = 'prelims-csat';
assert.ok(hasProblem(wrongPaper, /papers must be a nonempty subset of topic science-general-tech-ipr/), 'a known but unsupported paper mapping fails');

const selectedSubset = cloneDocument();
selectedSubset.articles['nobel-physics-2026'].mappings[0].papers = ['prelims-gs1'];
assert.deepEqual(validateArticleSyllabusMap({ document: selectedSubset }), [], 'a valid article-specific paper subset passes');
const subsetLookup = getArticleSyllabus('nobel-physics-2026', { document: selectedSubset });
assert.deepEqual(subsetLookup.papers, ['prelims-gs1'], 'lookup derives only the papers selected by the article mapping');
assert.deepEqual(subsetLookup.mappings[0].papers, ['prelims-gs1']);

const wrongSchema = cloneDocument();
wrongSchema.schema = 'zola-article-syllabus-map/0';
assert.ok(hasProblem(wrongSchema, /schema must be zola-article-syllabus-map\/1/), 'unsupported sidecar schema versions fail');
assert.equal(getArticleSyllabus('nobel-physics-2026', { document: wrongSchema }), null, 'lookup fails closed on an unsupported schema');

const wrongStatus = cloneDocument();
wrongStatus.status = 'verified';
assert.ok(hasProblem(wrongStatus, /status must remain draft-unverified/), 'unverified status cannot be promoted by data');
assert.equal(getArticleSyllabus('nobel-physics-2026', { document: wrongStatus }), null, 'lookup does not return an invalid status');

const duplicatePaper = cloneDocument();
duplicatePaper.articles['nobel-physics-2026'].mappings[0].papers.push('prelims-gs1');
assert.ok(hasProblem(duplicatePaper, /duplicate paper ID/), 'duplicate paper IDs fail');

const emptyGap = cloneDocument();
emptyGap.articles['nobel-physics-2026'].mappings = [];
assert.ok(hasProblem(emptyGap, /empty mappings require a nonempty mapping_gap/), 'empty mappings require a reason');

const mapWithGap = cloneDocument();
mapWithGap.articles['nobel-physics-2026'].mapping_gap = 'whole article remains unmapped';
assert.ok(hasProblem(mapWithGap, /mapped records cannot also claim/), 'mapped records cannot also claim a whole-article gap');

const malformedRecord = cloneDocument();
malformedRecord.articles['nobel-physics-2026'] = null;
assert.ok(hasProblem(malformedRecord, /entry must be an object/), 'malformed entries fail safely');

const forbiddenAlgorithmField = cloneDocument();
forbiddenAlgorithmField.articles['nobel-physics-2026'].score = 10;
assert.ok(hasProblem(forbiddenAlgorithmField, /forbidden algorithm field score/), 'score and ranking metadata are rejected');

console.log('✓ exact article slugs, controlled topics, paper derivation, explicit gaps and source anchors pass');
