// Draft crosswalk between Zola Feed's headline hints and broad UPSC syllabus
// areas. A match is a review cue, not a verified syllabus link or exam prediction.
// Keep ids stable: candidate records and reviewed notes refer to these ids.

export const TAXONOMY_STATUS = 'draft-unverified';
export const TAXONOMY_USE = 'human-review-hints-only';

// Read-only input snapshot. Refresh the pinned keys and tests if Zola Feed changes.
export const FEED_TAG_SOURCE = Object.freeze({
  repository: 'iamhariize-maker/Zola-feed',
  path: 'scripts/update_feed.py',
  commit: 'cd02b42dea21578508620cc67c05bbd64d38833f',
});

// Exact chip and machine key sets read from FEED_TAG_SOURCE.
export const FEED_SUBJECT_KEYS = Object.freeze([
  'Polity',
  'Economy',
  'Environment',
  'S&T',
  'IR',
  'History',
]);

export const FEED_MACHINE_IDS = Object.freeze([
  'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08',
  'M09', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16',
  'M17', 'M18', 'M19', 'M20', 'M21', 'M22', 'M23',
]);

export const UPSC_SYLLABUS_SOURCE = Object.freeze({
  title: 'Civil Services Examination, 2026 notification',
  notificationUrl: 'https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf',
  examinationPageUrl: 'https://www.upsc.gov.in/examinations/Civil%20Services%20%28Preliminary%29%20Examination%2C%202026',
  status: 'human-pdf-check-pending',
  printedPageAnchors: Object.freeze({
    'prelims-gs1': 'Printed p. 32, Section III: Syllabi for the Examination, Part A—Preliminary Examination, Paper I (General Studies)',
    'prelims-csat': 'Printed p. 32, Section III: Syllabi for the Examination, Part A—Preliminary Examination, Paper II (CSAT); printed p. 26 states the 33% qualifying threshold',
    'mains-gs1': 'Printed pp. 33–34, General Studies Paper I',
    'mains-gs2': 'Printed pp. 34–35; GS-II begins on p. 34; p. 35 includes accountability, transparency, civil services and international relations',
    'mains-gs3': 'Printed pp. 35–36; GS-III begins on p. 35; p. 36 includes pollution, environmental impact assessment, science and technology, and IPR',
    'mains-gs4': 'Printed p. 36, General Studies Paper IV',
  }),
});

export const PAPERS = Object.freeze({
  'prelims-gs1': 'Prelims GS Paper I',
  'prelims-csat': 'Prelims CSAT (Paper II, qualifying)',
  'mains-gs1': 'Mains GS-I: culture, history, geography, society',
  'mains-gs2': 'Mains GS-II: polity, governance, social justice, IR',
  'mains-gs3': 'Mains GS-III: economy, agriculture, environment, S&T, security, disaster',
  'mains-gs4': 'Mains GS-IV: ethics, integrity and aptitude',
  'apsc-assam': 'APSC and Assam-specific (verify against the APSC notification)',
});

// id -> { title, papers }. These are controlled study labels, not verbatim
// quotations from the notification. See docs/TAXONOMY-MAP.md for the anchors.
export const TOPICS = Object.freeze({
  'history-ancient-medieval-modern': { title: 'Indian history: ancient, medieval and modern', papers: ['prelims-gs1', 'mains-gs1'] },
  'history-freedom-movement': { title: 'Indian national movement and freedom struggle', papers: ['prelims-gs1', 'mains-gs1'] },
  'art-culture-heritage': { title: 'Indian art, culture and heritage', papers: ['prelims-gs1', 'mains-gs1'] },
  // World history appears in Mains GS-I; it is not listed in Prelims GS-I.
  'world-history': { title: 'World history: industrial revolution, world wars and decolonisation', papers: ['mains-gs1'] },
  'geography-physical': { title: 'Physical geography: climate, rivers, landforms and oceans', papers: ['prelims-gs1', 'mains-gs1'] },
  'geography-human-economic': { title: 'Human and economic geography, resources and places in news', papers: ['prelims-gs1', 'mains-gs1'] },
  'society-social-issues': { title: 'Society: population, social issues, communities, women and children', papers: ['prelims-gs1', 'mains-gs1'] },
  'polity-constitution': { title: 'Indian polity: Constitution, political system, amendments and judgments', papers: ['prelims-gs1', 'mains-gs2'] },
  'polity-governance': { title: 'Governance: institutions, schemes, public policy and Centre–State relations', papers: ['prelims-gs1', 'mains-gs2'] },
  'polity-bodies': { title: 'Constitutional and statutory bodies', papers: ['prelims-gs1', 'mains-gs2'] },
  'ir-groupings': { title: 'International relations, groupings, summits and treaties', papers: ['prelims-gs1', 'mains-gs2'] },
  'economy-macro': { title: 'Economy: growth, fiscal policy, budget, RBI and monetary policy', papers: ['prelims-gs1', 'mains-gs3'] },
  'economy-banking-markets': { title: 'Banking, markets and financial inclusion', papers: ['prelims-gs1', 'mains-gs3'] },
  'economy-external-trade': { title: 'External sector: trade, FDI, forex and WTO', papers: ['prelims-gs1', 'mains-gs3'] },
  'economy-cooperatives': { title: 'Co-operative institutions and the co-operative sector', papers: ['prelims-gs1', 'mains-gs3'] },
  'agriculture-food': { title: 'Agriculture, food security, MSP and procurement', papers: ['prelims-gs1', 'mains-gs3'] },
  'environment-ecology': { title: 'Environment and ecology: species, protected areas and biodiversity', papers: ['prelims-gs1', 'mains-gs3'] },
  'environment-climate': { title: 'Climate change, environmental conventions and COPs', papers: ['prelims-gs1', 'mains-gs3'] },
  'environment-pollution-assessment': { title: 'Environmental pollution, clearances and impact assessment', papers: ['prelims-gs1', 'mains-gs3'] },
  'science-space': { title: 'Science and technology: space missions and programmes', papers: ['prelims-gs1', 'mains-gs3'] },
  'science-health-biotech': { title: 'Health, biotechnology, vaccines and biomedical technology', papers: ['prelims-gs1', 'mains-gs3'] },
  'science-general-tech-ipr': { title: 'General science and technology, digital technology and intellectual property', papers: ['prelims-gs1', 'mains-gs3'] },
  'security-defence': { title: 'Internal security, defence and cyber security', papers: ['prelims-gs1', 'mains-gs3'] },
  'disaster-management': { title: 'Disaster management', papers: ['prelims-gs1', 'mains-gs3'] },
  'indices-reports': { title: 'Indices and reports: publisher, year and India rank', papers: ['prelims-gs1'] },
  // A narrow current-events link; not a claim that awards form a broader UPSC syllabus section.
  'awards-honours': { title: 'Awards and honours: laureates, prizes and civilian distinctions', papers: ['prelims-gs1'] },
  'ethics-integrity-probity': { title: 'Ethics, integrity, probity and accountability in public service', papers: ['mains-gs4'] },
  'csat-comprehension-reasoning': { title: 'CSAT: comprehension, reasoning, numeracy and data interpretation (no current-affairs mapping)', papers: ['prelims-csat'] },
  'assam-state-policy': { title: 'Assam: state schemes, economy and governance', papers: ['apsc-assam'] },
  'assam-environment-disaster': { title: 'Assam and North-East: floods, Kaziranga, Manas and Brahmaputra', papers: ['apsc-assam'] },
  'assam-society-polity': { title: 'Assam and North-East: communities, Sixth Schedule and Assam Accord', papers: ['apsc-assam'] },
});

// A broad subject chip can suggest multiple areas. It does not assign every
// listed area to every item carrying that chip; a person must inspect the item.
export const SUBJECT_TOPIC_MAP = Object.freeze({
  Polity: Object.freeze([
    'polity-constitution',
    'polity-governance',
    'polity-bodies',
    'ethics-integrity-probity',
  ]),
  Economy: Object.freeze([
    'economy-macro',
    'economy-banking-markets',
    'economy-external-trade',
    'economy-cooperatives',
    'agriculture-food',
    'geography-human-economic',
  ]),
  Environment: Object.freeze([
    'environment-ecology',
    'environment-climate',
    'environment-pollution-assessment',
    'disaster-management',
    'geography-physical',
  ]),
  'S&T': Object.freeze([
    'science-space',
    'science-health-biotech',
    'science-general-tech-ipr',
    'security-defence',
  ]),
  IR: Object.freeze([
    'ir-groupings',
    'geography-human-economic',
  ]),
  History: Object.freeze([
    'history-ancient-medieval-modern',
    'history-freedom-movement',
    'art-culture-heritage',
    'society-social-issues',
  ]),
});

// Machine keys identify specific content patterns and can map more narrowly.
// The mappings are still hints; for example, M01 can match bills from many fields.
export const MACHINE_TOPIC_MAP = Object.freeze({
  M01: Object.freeze(['polity-governance']),
  M02: Object.freeze(['polity-constitution', 'polity-governance']),
  M03: Object.freeze(['polity-constitution', 'polity-governance']),
  M04: Object.freeze(['polity-constitution']),
  M05: Object.freeze(['polity-constitution']),
  M06: Object.freeze(['polity-constitution']),
  M07: Object.freeze(['polity-constitution', 'polity-governance']),
  M08: Object.freeze(['polity-constitution']),
  M09: Object.freeze(['polity-constitution', 'polity-governance']),
  M10: Object.freeze(['polity-constitution']),
  M11: Object.freeze(['polity-governance']),
  M12: Object.freeze(['polity-constitution', 'polity-governance']),
  M13: Object.freeze(['economy-macro', 'polity-bodies', 'polity-governance']),
  M14: Object.freeze(['economy-macro', 'economy-banking-markets']),
  M15: Object.freeze(['economy-macro']),
  M16: Object.freeze(['agriculture-food']),
  M17: Object.freeze(['polity-constitution', 'polity-bodies', 'polity-governance', 'economy-macro']),
  M18: Object.freeze(['environment-pollution-assessment']),
  M19: Object.freeze(['polity-governance', 'ethics-integrity-probity']),
  M20: Object.freeze(['polity-constitution', 'polity-bodies']),
  M21: Object.freeze(['polity-constitution', 'polity-governance', 'ethics-integrity-probity']),
  M22: Object.freeze(['polity-bodies', 'polity-governance', 'ethics-integrity-probity']),
  M23: Object.freeze(['economy-cooperatives', 'polity-governance']),
});

// These topics have no direct machine or subject key in this pinned feed
// snapshot. Their absence is a coverage limit, not a claim that the topic is
// unimportant or absent from current affairs.
export const TOPICS_WITHOUT_FEED_TAG = Object.freeze([
  'world-history',
  'awards-honours',
  'indices-reports',
  'csat-comprehension-reasoning',
  'assam-state-policy',
  'assam-environment-disaster',
  'assam-society-polity',
]);

// Items the engine must never tag: they would invite question prediction or mislead.
export const NEVER_TAG = Object.freeze(['likely question', 'expected question', 'important for exam']);

function exactKeys(map, expected, label, problems) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    problems.push(`${label}: must be an object`);
    return;
  }
  const actual = Object.keys(map);
  const missing = expected.filter(key => !Object.hasOwn(map, key));
  const extra = actual.filter(key => !expected.includes(key));
  if (missing.length || extra.length) {
    problems.push(`${label}: key set mismatch (missing: ${missing.join(', ') || 'none'}; extra: ${extra.join(', ') || 'none'})`);
  }
}

function validateMappings(map, expectedKeys, topics, label, problems) {
  exactKeys(map, expectedKeys, label, problems);
  if (!map || typeof map !== 'object' || Array.isArray(map)) return new Set();
  const mapped = new Set();
  for (const key of expectedKeys) {
    const ids = map[key];
    if (!Array.isArray(ids) || ids.length === 0) {
      problems.push(`${label} ${key}: needs at least one topic id`);
      continue;
    }
    if (new Set(ids).size !== ids.length) problems.push(`${label} ${key}: duplicate topic id`);
    for (const id of ids) {
      if (!Object.hasOwn(topics, id)) problems.push(`${label} ${key}: unknown topic ${id}`);
      else mapped.add(id);
    }
  }
  return mapped;
}

export function validateTaxonomy({
  topics = TOPICS,
  papers = PAPERS,
  subjectMap = SUBJECT_TOPIC_MAP,
  machineMap = MACHINE_TOPIC_MAP,
  topicsWithoutFeedTag = TOPICS_WITHOUT_FEED_TAG,
} = {}) {
  const problems = [];
  for (const [id, topic] of Object.entries(topics)) {
    if (!/^[a-z0-9-]+$/.test(id)) problems.push(`${id}: id must be lowercase, digits and hyphens`);
    if (!topic || typeof topic !== 'object' || Array.isArray(topic)) {
      problems.push(`${id}: topic record must be an object`);
      continue;
    }
    if (typeof topic.title !== 'string' || !topic.title.trim()) problems.push(`${id}: needs a title`);
    if (!Array.isArray(topic.papers) || !topic.papers.length) problems.push(`${id}: needs at least one paper`);
    else {
      if (new Set(topic.papers).size !== topic.papers.length) problems.push(`${id}: duplicate paper mapping`);
      for (const paper of topic.papers) if (!Object.hasOwn(papers, paper)) problems.push(`${id}: unknown paper ${paper}`);
    }
  }

  const subjectTopics = validateMappings(subjectMap, FEED_SUBJECT_KEYS, topics, 'subject map', problems);
  const machineTopics = validateMappings(machineMap, FEED_MACHINE_IDS, topics, 'machine map', problems);
  const expectedUnmatched = Object.keys(topics).filter(id => !subjectTopics.has(id) && !machineTopics.has(id)).sort();
  if (!Array.isArray(topicsWithoutFeedTag)) {
    problems.push('topics without feed tags: must be an array');
  } else {
    if (new Set(topicsWithoutFeedTag).size !== topicsWithoutFeedTag.length) {
      problems.push('topics without feed tags: duplicate topic id');
    }
    for (const id of topicsWithoutFeedTag) if (!Object.hasOwn(topics, id)) problems.push(`topics without feed tags: unknown topic ${id}`);
    const declared = [...topicsWithoutFeedTag].sort();
    if (declared.join('|') !== expectedUnmatched.join('|')) {
      problems.push(`topics without feed tags: expected ${expectedUnmatched.join(', ') || 'none'}`);
    }
  }
  return problems;
}
