// DRAFT syllabus taxonomy for the current-affairs engine (ZC-01).
// Built from general knowledge of the Prelims GS-I list and the Mains GS-I to GS-IV headings. The official UPSC PDF could
// not be read during this research (HTTP 403), so every heading is unverified until checked against the notification.
// Keep ids stable: items in the feed refer to them.

export const TAXONOMY_STATUS = 'draft-unverified';

export const PAPERS = {
  'prelims-gs1': 'Prelims GS Paper I',
  'prelims-csat': 'Prelims CSAT (Paper II, qualifying)',
  'mains-gs1': 'Mains GS-I: heritage, culture, history, geography, society',
  'mains-gs2': 'Mains GS-II: polity, governance, IR',
  'mains-gs3': 'Mains GS-III: economy, agriculture, environment, S&T, security, disaster',
  'mains-gs4': 'Mains GS-IV: ethics and integrity',
  'apsc-assam': 'APSC and Assam-specific (verify against the APSC notification)',
};

// id -> { title, papers, sub: [subtopic ids] }
export const TOPICS = {
  'history-ancient-medieval-modern': { title: 'Indian history: ancient, medieval, modern', papers: ['prelims-gs1', 'mains-gs1'] },
  'history-freedom-movement': { title: 'Freedom movement and national movement', papers: ['prelims-gs1', 'mains-gs1'] },
  'art-culture-heritage': { title: 'Art, culture, heritage, UNESCO listings, GI tags', papers: ['prelims-gs1', 'mains-gs1'] },
  'world-history': { title: 'World history: industrial revolution, world wars, decolonisation', papers: ['prelims-gs1', 'mains-gs1'] },
  'geography-physical': { title: 'Physical geography: climate, rivers, landforms, oceans', papers: ['prelims-gs1', 'mains-gs1'] },
  'geography-human-economic': { title: 'Human and economic geography, resources, places in news', papers: ['prelims-gs1', 'mains-gs1'] },
  'society-social-issues': { title: 'Society: population, social issues, communities, women and children', papers: ['prelims-gs1', 'mains-gs1'] },
  'polity-constitution': { title: 'Indian polity: Constitution, amendments, judgments', papers: ['prelims-gs1', 'mains-gs2'] },
  'polity-governance': { title: 'Governance: schemes, institutions, Centre-state relations', papers: ['prelims-gs1', 'mains-gs2'] },
  'polity-bodies': { title: 'Constitutional and statutory bodies', papers: ['prelims-gs1', 'mains-gs2'] },
  'ir-groupings': { title: 'International relations, groupings, summits', papers: ['prelims-gs1', 'mains-gs2'] },
  'economy-macro': { title: 'Economy: growth, fiscal policy, budget, RBI and monetary policy', papers: ['prelims-gs1', 'mains-gs3'] },
  'economy-banking-markets': { title: 'Banking, markets, financial inclusion', papers: ['prelims-gs1', 'mains-gs3'] },
  'economy-external-trade': { title: 'External sector: trade, FDI, forex, WTO', papers: ['prelims-gs1', 'mains-gs3'] },
  'agriculture-food': { title: 'Agriculture, food security, MSP', papers: ['prelims-gs1', 'mains-gs3'] },
  'environment-ecology': { title: 'Environment and ecology: species, protected areas, Ramsar sites', papers: ['prelims-gs1', 'mains-gs3'] },
  'environment-climate': { title: 'Climate change and environmental conventions and COPs', papers: ['prelims-gs1', 'mains-gs3'] },
  'science-space': { title: 'Science and technology: space missions and programmes', papers: ['prelims-gs1', 'mains-gs3'] },
  'science-health-biotech': { title: 'Health, biotech, vaccines, emerging tech', papers: ['prelims-gs1', 'mains-gs3'] },
  'security-defence': { title: 'Internal security, defence, cyber', papers: ['prelims-gs1', 'mains-gs3'] },
  'disaster-management': { title: 'Disaster management', papers: ['prelims-gs1', 'mains-gs3'] },
  'indices-reports': { title: 'Indices and reports: publisher, year, India rank', papers: ['prelims-gs1'] },
  'csat-comprehension-reasoning': { title: 'CSAT: comprehension, reasoning, numeracy (no current affairs)', papers: ['prelims-csat'] },
  'assam-state-policy': { title: 'Assam: state schemes, economy, governance', papers: ['apsc-assam'] },
  'assam-environment-disaster': { title: 'Assam and North-East: floods, Kaziranga, Manas, Brahmaputra', papers: ['apsc-assam'] },
  'assam-society-polity': { title: 'Assam and North-East: communities, Sixth Schedule, Assam Accord', papers: ['apsc-assam'] },
};

// Items the engine must never tag: they would invite question prediction or mislead.
export const NEVER_TAG = ['likely question', 'expected question', 'important for exam'];

export function validateTaxonomy() {
  const problems = [];
  for (const [id, t] of Object.entries(TOPICS)) {
    if (!/^[a-z0-9-]+$/.test(id)) problems.push(`${id}: id must be lowercase, digits and hyphens`);
    for (const p of t.papers || []) if (!(p in PAPERS)) problems.push(`${id}: unknown paper ${p}`);
    if (!t.papers?.length) problems.push(`${id}: needs at least one paper`);
  }
  return problems;
}
