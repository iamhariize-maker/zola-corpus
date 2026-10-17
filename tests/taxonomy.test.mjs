// Controlled topic crosswalk for the Zola Feed snapshot. These are review
// hints and are not a substitute for source checks or the owner's syllabus check.
import assert from 'node:assert/strict';
import {
  FEED_MACHINE_IDS,
  FEED_SUBJECT_KEYS,
  FEED_TAG_SOURCE,
  MACHINE_TOPIC_MAP,
  SUBJECT_TOPIC_MAP,
  TAXONOMY_STATUS,
  TOPICS,
  TOPICS_WITHOUT_FEED_TAG,
  UPSC_SYLLABUS_SOURCE,
  validateTaxonomy,
} from '../tools/upsc-taxonomy.mjs';

const EXPECTED_SUBJECT_KEYS = ['Polity', 'Economy', 'Environment', 'S&T', 'IR', 'History'];
const EXPECTED_MACHINE_IDS = [
  'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08',
  'M09', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16',
  'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M23',
];
const cloneMap = map => Object.fromEntries(Object.entries(map).map(([key, ids]) => [key, [...ids]]));

console.log('UPSC syllabus taxonomy');
assert.equal(TAXONOMY_STATUS, 'draft-unverified', 'human PDF verification remains pending');
assert.equal(UPSC_SYLLABUS_SOURCE.status, 'human-pdf-check-pending');
assert.equal(
  UPSC_SYLLABUS_SOURCE.notificationUrl,
  'https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf',
  'the official CSE 2026 notification is the cited source',
);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['prelims-gs1'], /printed p\. 32.*Section III: Syllabi for the Examination.*Part A—Preliminary Examination/i);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['prelims-csat'], /printed p\. 32.*Section III: Syllabi for the Examination.*printed p\. 26/i);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['mains-gs1'], /33.*34/);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['mains-gs2'], /34.*35/);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['mains-gs2'], /accountability.*international relations/);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['mains-gs3'], /35.*36/);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['mains-gs3'], /pollution.*environmental impact assessment.*IPR/);
assert.match(UPSC_SYLLABUS_SOURCE.printedPageAnchors['mains-gs4'], /36/);
assert.equal(FEED_TAG_SOURCE.commit, 'cd02b42dea21578508620cc67c05bbd64d38833f');
assert.equal(FEED_TAG_SOURCE.path, 'scripts/update_feed.py');

assert.deepEqual(FEED_SUBJECT_KEYS, EXPECTED_SUBJECT_KEYS, 'the six Feed subject chips are pinned');
assert.deepEqual(FEED_MACHINE_IDS, EXPECTED_MACHINE_IDS, 'all 23 Feed machine IDs are pinned');
assert.deepEqual(Object.keys(SUBJECT_TOPIC_MAP), EXPECTED_SUBJECT_KEYS, 'every pinned subject key has exactly one map entry');
assert.deepEqual(Object.keys(MACHINE_TOPIC_MAP), EXPECTED_MACHINE_IDS, 'every pinned machine ID has exactly one map entry');
for (const [key, ids] of Object.entries(SUBJECT_TOPIC_MAP)) {
  assert.ok(ids.length > 0, `subject ${key} has at least one topic hint`);
  assert.equal(new Set(ids).size, ids.length, `subject ${key} has no duplicate topic hints`);
  for (const id of ids) assert.ok(TOPICS[id], `subject ${key} maps to known topic ${id}`);
}
for (const [key, ids] of Object.entries(MACHINE_TOPIC_MAP)) {
  assert.ok(ids.length > 0, `machine ${key} has at least one topic hint`);
  assert.equal(new Set(ids).size, ids.length, `machine ${key} has no duplicate topic hints`);
  for (const id of ids) assert.ok(TOPICS[id], `machine ${key} maps to known topic ${id}`);
}

assert.deepEqual(TOPICS['world-history'].papers, ['mains-gs1'], 'world history maps only to Mains GS-I');
assert.deepEqual(TOPICS['environment-pollution-assessment'].papers, ['prelims-gs1', 'mains-gs3']);
assert.deepEqual(TOPICS['science-general-tech-ipr'].papers, ['prelims-gs1', 'mains-gs3']);
assert.deepEqual(TOPICS['economy-cooperatives'].papers, ['prelims-gs1', 'mains-gs3']);
assert.deepEqual(TOPICS['ethics-integrity-probity'].papers, ['mains-gs4']);
assert.ok(MACHINE_TOPIC_MAP.M13.includes('polity-bodies'), 'GST Council can map to constitutional bodies');
assert.ok(MACHINE_TOPIC_MAP.M17.includes('polity-bodies'), 'Finance Commission can map to constitutional bodies');
assert.ok(MACHINE_TOPIC_MAP.M17.includes('polity-constitution'), 'fiscal devolution can map to federal constitutional topics');
assert.ok(MACHINE_TOPIC_MAP.M21.includes('polity-constitution'), 'Article 311 can map to constitutional protections');
assert.deepEqual(TOPICS_WITHOUT_FEED_TAG, [
  'world-history',
  'indices-reports',
  'csat-comprehension-reasoning',
  'assam-state-policy',
  'assam-environment-disaster',
  'assam-society-polity',
], 'topics with no direct Feed key remain visible as coverage gaps');

assert.deepEqual(validateTaxonomy(), [], 'the shipped topics, paper refs and Feed maps validate');

const malformedTopic = { ...TOPICS, 'polity-constitution': null };
assert.ok(
  validateTaxonomy({ topics: malformedTopic }).some(problem => /polity-constitution: topic record must be an object/.test(problem)),
  'a malformed topic record reports a problem instead of throwing',
);

const duplicatePaper = { ...TOPICS, 'polity-constitution': { ...TOPICS['polity-constitution'], papers: ['prelims-gs1', 'prelims-gs1'] } };
assert.ok(
  validateTaxonomy({ topics: duplicatePaper }).some(problem => /polity-constitution: duplicate paper mapping/.test(problem)),
  'duplicate paper references fail validation',
);

const emptySubject = cloneMap(SUBJECT_TOPIC_MAP);
emptySubject.Economy = [];
assert.ok(
  validateTaxonomy({ subjectMap: emptySubject }).some(problem => /subject map Economy: needs at least one topic id/.test(problem)),
  'empty mappings fail validation',
);

const unknownSubject = cloneMap(SUBJECT_TOPIC_MAP);
unknownSubject.Economy[0] = 'constructor';
assert.ok(
  validateTaxonomy({ subjectMap: unknownSubject }).some(problem => /subject map Economy: unknown topic constructor/.test(problem)),
  'unknown and inherited object property topic IDs fail validation',
);

const duplicateMachine = cloneMap(MACHINE_TOPIC_MAP);
duplicateMachine.M18.push(duplicateMachine.M18[0]);
assert.ok(
  validateTaxonomy({ machineMap: duplicateMachine }).some(problem => /machine map M18: duplicate topic id/.test(problem)),
  'duplicate mappings fail validation',
);

const missingSubject = cloneMap(SUBJECT_TOPIC_MAP);
delete missingSubject.History;
assert.ok(
  validateTaxonomy({ subjectMap: missingSubject }).some(problem => /subject map: key set mismatch/.test(problem)),
  'a missing Feed key fails the exact-key check',
);

const extraMachine = cloneMap(MACHINE_TOPIC_MAP);
extraMachine.M24 = ['polity-governance'];
assert.ok(
  validateTaxonomy({ machineMap: extraMachine }).some(problem => /machine map: key set mismatch/.test(problem)),
  'an unexpected Feed key fails the exact-key check',
);

console.log('✓ taxonomy mappings and pinned syllabus anchors pass');
