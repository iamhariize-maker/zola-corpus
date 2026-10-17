# UPSC syllabus and Zola Feed tag crosswalk

Status: **draft, unverified**. This crosswalk is a set of controlled topic hints for human review. It is not a verdict
that a headline is syllabus-relevant, it does not predict exam questions, and it does not claim full UPSC or APSC coverage.

## Syllabus source and page anchors

Source: [UPSC Civil Services Examination 2026 notification PDF](https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf),
linked from the [UPSC CSE 2026 examination page](https://www.upsc.gov.in/examinations/Civil%20Services%20%28Preliminary%29%20Examination%2C%202026).
Page numbers below are the printed page numbers in the PDF, not PDF viewer page indices.

| Controlled paper ID | Notification anchor |
|---|---|
| `prelims-gs1` | Printed p. 32, Section III: Syllabi for the Examination, Part A—Preliminary Examination, Paper I (General Studies) |
| `prelims-csat` | Printed p. 32, Section III: Syllabi for the Examination, Part A—Preliminary Examination, Paper II (CSAT); printed p. 26 states the 33% qualifying threshold |
| `mains-gs1` | Printed pp. 33–34, General Studies Paper I |
| `mains-gs2` | Printed pp. 34–35; GS-II begins on p. 34. Printed p. 35 includes accountability, transparency, civil services and international relations |
| `mains-gs3` | Printed pp. 35–36; GS-III begins on p. 35. Printed p. 36 includes pollution, environmental impact assessment, science and technology, and IPR |
| `mains-gs4` | Printed p. 36, General Studies Paper IV |
| `apsc-assam` | No UPSC mapping. Check the relevant APSC notification before using these labels. |

The notification and printed anchors are cited for owner review. **A human has not yet checked the PDF in this task**, so
`TAXONOMY_STATUS` remains `draft-unverified`. Topic labels in the code are our summaries, not quotations from the
notification. Where a topic is a contextual link rather than a named syllabus phrase, the link is only a study aid.

## Controlled topic IDs

| Topic ID | Controlled label | Paper mapping |
|---|---|---|
| `history-ancient-medieval-modern` | Indian history: ancient, medieval and modern | Prelims GS-I; Mains GS-I |
| `history-freedom-movement` | Indian national movement and freedom struggle | Prelims GS-I; Mains GS-I |
| `art-culture-heritage` | Indian art, culture and heritage | Prelims GS-I; Mains GS-I |
| `world-history` | World history: industrial revolution, world wars and decolonisation | **Mains GS-I only** |
| `geography-physical` | Physical geography: climate, rivers, landforms and oceans | Prelims GS-I; Mains GS-I |
| `geography-human-economic` | Human and economic geography, resources and places in news | Prelims GS-I; Mains GS-I |
| `society-social-issues` | Society: population, social issues, communities, women and children | Prelims GS-I; Mains GS-I |
| `polity-constitution` | Indian polity: Constitution, political system, amendments and judgments | Prelims GS-I; Mains GS-II |
| `polity-governance` | Governance: institutions, schemes, public policy and Centre–State relations | Prelims GS-I; Mains GS-II |
| `polity-bodies` | Constitutional and statutory bodies | Prelims GS-I; Mains GS-II |
| `ir-groupings` | International relations, groupings, summits and treaties | Prelims GS-I; Mains GS-II |
| `economy-macro` | Economy: growth, fiscal policy, budget, RBI and monetary policy | Prelims GS-I; Mains GS-III |
| `economy-banking-markets` | Banking, markets and financial inclusion | Prelims GS-I; Mains GS-III |
| `economy-external-trade` | External sector: trade, FDI, forex and WTO | Prelims GS-I; Mains GS-III |
| `economy-cooperatives` | Co-operative institutions and the co-operative sector | Prelims GS-I; Mains GS-III |
| `agriculture-food` | Agriculture, food security, MSP and procurement | Prelims GS-I; Mains GS-III |
| `environment-ecology` | Environment and ecology: species, protected areas and biodiversity | Prelims GS-I; Mains GS-III |
| `environment-climate` | Climate change, environmental conventions and COPs | Prelims GS-I; Mains GS-III |
| `environment-pollution-assessment` | Environmental pollution, clearances and impact assessment | Prelims GS-I; Mains GS-III |
| `science-space` | Science and technology: space missions and programmes | Prelims GS-I; Mains GS-III |
| `science-health-biotech` | Health, biotechnology, vaccines and biomedical technology | Prelims GS-I; Mains GS-III |
| `science-general-tech-ipr` | General science and technology, digital technology and intellectual property | Prelims GS-I; Mains GS-III |
| `security-defence` | Internal security, defence and cyber security | Prelims GS-I; Mains GS-III |
| `disaster-management` | Disaster management | Prelims GS-I; Mains GS-III |
| `indices-reports` | Indices and reports: publisher, year and India rank | Prelims GS-I |
| `awards-honours` | Awards and honours: laureates, prizes and civilian distinctions | Prelims GS-I only; contextual link to printed p. 32 current events |
| `ethics-integrity-probity` | Ethics, integrity, probity and accountability in public service | Mains GS-IV |
| `csat-comprehension-reasoning` | CSAT: comprehension, reasoning, numeracy and data interpretation | Prelims CSAT; no current-affairs tag |
| `assam-state-policy` | Assam: state schemes, economy and governance | APSC only; verify separately |
| `assam-environment-disaster` | Assam and North-East: floods, Kaziranga, Manas and Brahmaputra | APSC only; verify separately |
| `assam-society-polity` | Assam and North-East: communities, Sixth Schedule and Assam Accord | APSC only; verify separately |

Four added IDs are deliberately narrow: environmental pollution/assessment, general technology/IPR, co-operatives,
and awards/honours. `awards-honours` is a Prelims GS-I current-events link used only for the Nobel Literature, Fields
Medal and Padma Awards notes in the current article map. It does not relabel non-Indian literature as Indian art and
culture or mathematics as general science and technology. The ethics/probity ID makes GS-IV accountability coverage
explicit. These labels do not assert that every source-tag match contains facts sufficient for a note.

## Pinned Zola Feed input

The maps below were read from
[`scripts/update_feed.py` at commit `cd02b42dea21578508620cc67c05bbd64d38833f`](https://github.com/iamhariize-maker/zola-feed/blob/cd02b42dea21578508620cc67c05bbd64d38833f/scripts/update_feed.py).
The source SHA is pinned in code and in the tests. It is a snapshot, **not a live dependency**. If Feed changes its
`SUBJECTS` keys, `MACHINES` IDs or matching rules, refresh the source SHA, exact-key tests, mappings and this table
after reviewing the new definitions.

### Subject chips

A broad subject chip means only that one or more of these areas may apply. It does not attach every listed topic to
each item with that chip.

| Feed subject key | Possible controlled topic IDs for human review |
|---|---|
| `Polity` | `polity-constitution`, `polity-governance`, `polity-bodies`, `ethics-integrity-probity` |
| `Economy` | `economy-macro`, `economy-banking-markets`, `economy-external-trade`, `economy-cooperatives`, `agriculture-food`, `geography-human-economic` |
| `Environment` | `environment-ecology`, `environment-climate`, `environment-pollution-assessment`, `disaster-management`, `geography-physical` |
| `S&T` | `science-space`, `science-health-biotech`, `science-general-tech-ipr`, `security-defence` |
| `IR` | `ir-groupings`, `geography-human-economic` |
| `History` | `history-ancient-medieval-modern`, `history-freedom-movement`, `art-culture-heritage`, `society-social-issues` |

### Machine tags

Machine tags are specific keyword hints, but their underlying matches still need context review. For example, M01 can
match bills from several subject areas; its mapping does not say that every such bill is a polity note.

| Feed ID | Possible controlled topic IDs for human review |
|---|---|
| M01 | `polity-governance` |
| M02 | `polity-constitution`, `polity-governance` |
| M03 | `polity-constitution`, `polity-governance` |
| M04 | `polity-constitution` |
| M05 | `polity-constitution` |
| M06 | `polity-constitution` |
| M07 | `polity-constitution`, `polity-governance` |
| M08 | `polity-constitution` |
| M09 | `polity-constitution`, `polity-governance` |
| M10 | `polity-constitution` |
| M11 | `polity-governance` |
| M12 | `polity-constitution`, `polity-governance` |
| M13 | `economy-macro`, `polity-bodies`, `polity-governance` |
| M14 | `economy-macro`, `economy-banking-markets` |
| M15 | `economy-macro` |
| M16 | `agriculture-food` |
| M17 | `polity-constitution`, `polity-bodies`, `polity-governance`, `economy-macro` |
| M18 | `environment-pollution-assessment` |
| M19 | `polity-governance`, `ethics-integrity-probity` |
| M20 | `polity-constitution`, `polity-bodies` |
| M21 | `polity-constitution`, `polity-governance`, `ethics-integrity-probity` |
| M22 | `polity-bodies`, `polity-governance`, `ethics-integrity-probity` |
| M23 | `economy-cooperatives`, `polity-governance` |

## Explicit coverage gaps

Every pinned Feed subject and machine key has at least one map entry. That does **not** mean the source keywords cover
the syllabus or that a topic will be found in the daily inbox. In this snapshot, the following controlled topics have
no direct match from any Feed key:

- `world-history`: the feed has no world-history-specific subject or machine pattern. The topic is Mains GS-I only.
- `awards-honours`: no current Feed subject or machine key identifies awards or honours.
- `indices-reports`: no current Feed key identifies indices or report rankings.
- `csat-comprehension-reasoning`: CSAT is a skills paper; this current-affairs feed has no CSAT matching rule.
- `assam-state-policy`, `assam-environment-disaster`, and `assam-society-polity`: Feed has no Assam-specific key.

Other coverage remains partial. For example, the Economy regex includes infrastructure but the current taxonomy has no
dedicated infrastructure topic; the Polity and History chips are broad; and the subject set does not guarantee
coverage of every social-justice or geography subtopic. A missing match is not evidence that an issue is unimportant.
Do not broaden a rule solely to eliminate an empty-tag item.

## Algorithm boundary

These crosswalks are not connected to an article, feed publication path or score. No mapping or keyword hint in this
module feeds `index.html`'s six editorial ranking scores, changes their weights, or affects the Forecast tracker.
They are separate reference data for review. Keep them that way unless a later, separately reviewed task changes the
app's scoring design.
