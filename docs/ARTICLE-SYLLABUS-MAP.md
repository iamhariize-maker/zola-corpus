# Article-to-syllabus sidecar

Status: **draft, unverified**. This sidecar links the current article slugs to existing controlled topic IDs where the
article has a direct syllabus connection. It is a human review aid, not a syllabus-completeness claim, exam prediction,
or verdict that every part of an article belongs to every listed topic. Exact slug coverage means only that the sidecar
has a row for each article currently exported by `tools/articles-data.mjs`.

## Syllabus source and page anchors

Source: [UPSC Civil Services Examination 2026 notification PDF](https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf),
linked from the [UPSC CSE 2026 examination page](https://www.upsc.gov.in/examinations/Civil%20Services%20%28Preliminary%29%20Examination%2C%202026).
The anchors below use printed page numbers, not PDF viewer indices. They match the source references in
[`TAXONOMY-MAP.md`](TAXONOMY-MAP.md).

| Paper ID | Notification anchor |
|---|---|
| `prelims-gs1` | Printed p. 32, Section III: Syllabi for the Examination, Part A—Preliminary Examination, Paper I (General Studies) |
| `prelims-csat` | Printed p. 32, Section III: Syllabi for the Examination, Part A—Preliminary Examination, Paper II (CSAT); printed p. 26 states the 33% qualifying threshold |
| `mains-gs1` | Printed pp. 33–34, General Studies Paper I |
| `mains-gs2` | Printed pp. 34–35; GS-II begins on p. 34; p. 35 includes accountability, transparency, civil services and international relations |
| `mains-gs3` | Printed pp. 35–36; GS-III begins on p. 35; p. 36 includes pollution, environmental impact assessment, science and technology, and IPR |
| `mains-gs4` | Printed p. 36, General Studies Paper IV |

The PDF still needs the owner's human check. The data retains `draft-unverified` and `human-pdf-check-pending` until
that check is recorded. Topic IDs and page anchors are study labels, not quotations from or official endorsements by UPSC.

## Mapping rules

The JSON uses schema `zola-article-syllabus-map/1`. Each slug has one or more `{topic, papers, reason}` records, or an
empty `mappings` list with a nonempty `mapping_gap`. A mapped entry cannot also claim a whole-article mapping gap.
Each mapping selects a nonempty subset of the paper IDs allowed by its topic in `tools/upsc-taxonomy.mjs`;
`getArticleSyllabus()` returns only those selected paper IDs and their union. An explicit gap is used when no current
topic ID fits without stretching its meaning.

The list is intentionally selective. For example, the overview of Nobel prizes has several direct topic links, but
those links do not claim to capture every prize in that article. Exact article-key coverage does not mean complete
syllabus coverage, exhaustive article coverage, or verified factual content.

| Article slug | Direct topic IDs | Derived paper IDs | Rationale or explicit gap |
|---|---|---|---|
| `nobel-2026-at-a-glance` | `science-general-tech-ipr`; `science-health-biotech`; `economy-macro` | Prelims GS-I; Mains GS-III | The overview directly links to the Physics/Chemistry research, optogenetics and macroeconomic stabilisation. It does not contain the detail on Pillay's UN/ICJ roles found in the separate Peace note. This is a partial map of a multi-prize overview. |
| `nobel-physics-2026` | `science-general-tech-ipr` | Prelims GS-I; Mains GS-III | Covers high-energy astrophysical neutrinos and the IceCube observatory. |
| `nobel-medicine-2026` | `science-health-biotech` | Prelims GS-I; Mains GS-III | Explains light-gated ion channels and optogenetics as a biomedical research method. |
| `nobel-chemistry-2026` | `science-general-tech-ipr` | Prelims GS-I; Mains GS-III | Explains chirality, autocatalysis and asymmetric organic synthesis. |
| `nobel-literature-2026` | `awards-honours` | Prelims GS-I | Links the note to the Nobel distinction as a current-affairs award fact, not to Indian art and culture. |
| `nobel-peace-2026` | `ir-groupings` | Prelims GS-I; Mains GS-II | The article discusses Pillay's UN human-rights role and an ICJ case under the Genocide Convention. |
| `nobel-economics-2026` | `economy-macro` | Prelims GS-I; Mains GS-III | The prize concerns the microeconomic foundations of macroeconomic stabilisation. |
| `fields-medal-2026` | `awards-honours` | Prelims GS-I | Links the note to the Fields Medal and its laureates as a current-affairs award fact, not to general science and technology. |
| `artemis-ii-2026` | `science-space` | Prelims GS-I; Mains GS-III | Covers a crewed lunar mission, its trajectory and spacecraft systems testing. |
| `ai-impact-summit-2026` | `science-general-tech-ipr`; `ir-groupings` | Prelims GS-I; Mains GS-II; Mains GS-III | Covers the AI declaration's technology-policy themes and its endorsement at a global summit by countries and international organisations. |
| `union-budget-2026-27` | `economy-macro` | Prelims GS-I; Mains GS-III | Focuses on fiscal deficit, expenditure, capital spending and budget allocations. |
| `padma-awards-2026` | `awards-honours` | Prelims GS-I | Covers Padma civilian honours, their three tiers and the annual award list. |
| `rbi-repo-hike-october-2026` | `economy-macro` | Prelims GS-I; Mains GS-III | Covers repo rates, the Monetary Policy Committee, inflation and growth projections. |
| `public-examinations-amendment-act-2026` | `polity-governance` | Prelims GS-I; Mains GS-II | Changes investigation, trial and appeal arrangements for public examinations, including UPSC examinations. |
| `supreme-court-judges-amendment-2026` | `polity-constitution` | Prelims GS-I; Mains GS-II | Covers the statutory number of Supreme Court judges and its constitutional basis under Article 124. |
| `tribunals-reforms-act-2026` | `polity-governance`; `polity-bodies` | Prelims GS-I; Mains GS-II | Covers tribunal administration and a statutory National Tribunals Commission, including its functions and pending establishment date. |
| `mines-minerals-amendment-act-2026` | `polity-constitution`; `economy-macro` | Prelims GS-I; Mains GS-II; Mains GS-III | Covers limits on State levies, fiscal federalism and State revenue from mineral rights. |
| `ins-samarthak-commissioned-2026` | `security-defence` | Prelims GS-I; Mains GS-III | Covers an Indian Navy vessel, defence manufacturing and indigenous content. |
| `caqm-ptz-cameras-ncr-2026` | `environment-pollution-assessment`; `polity-bodies` | Prelims GS-I; Mains GS-II; Mains GS-III | Covers industrial emissions monitoring and a regulatory direction issued by the statutory CAQM. |
| `pmay-urban-2-csmc-october-2026` | `polity-governance` | Prelims GS-I; Mains GS-II | Reports implementation and approvals under a Union urban-housing scheme. |
| `constitution-131st-amendment-bill-2026` | `polity-constitution` | Prelims GS-I; Mains GS-II | Covers a constitutional amendment, Article 368 procedure, delimitation and Lok Sabha representation. |

## Engine boundary

`tools/upsc-article-map.mjs` is a metadata-only lookup and validator. This sidecar is not imported by the article
generator, the browser app, the ranking code or the Forecast tracker. It contains no score, rank, weight or probability
fields and does not change the app's six ranking signals. It does not generate or predict questions. A separate reviewed
task would be needed before integrating this reference data into any article-generation or display path.
