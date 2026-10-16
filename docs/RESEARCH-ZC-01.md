# ZC-01 research memo: a UPSC Prelims current-affairs dashboard for Zola

Status: research and framework, 16 October 2026. Written by Claude Haiku from two bounded opinions (Sonnet, Opus) and
checks of primary sites. Owner decisions are listed at the end. Nothing here is legal advice.

## 1. What the owner asked for

1. Zola as a complete UPSC Prelims dashboard: tracker, articles, current affairs, and updates that keep coming.
2. An engine that pulls from more sources than PIB, weighted to Prelims and to Mains.
3. Articles written from those sources in the owner's own exam-note voice (see `docs/VOICE.md`).
4. No copyright strikes. The owner's first idea was to reword copied articles. This memo recommends against it (see
   `docs/SOURCE-POLICY.md`) and proposes primary sources as the text instead.

## 2. What exists now

- Feed repo `iamhariize-maker/zola-feed`: one source (PIB English, all ministries, `Reg=3`). The bot keeps items that
  match tags (`SUBJECTS`, `MACHINES`), 45-day window, up to 150 items. Schema `zola-feed/1`. Validation runs on push.
- App repo `zola-corpus`: 12 study articles (generated from `tools/articles-data.mjs`), tests, offline precache.
- The app has a Forecast tracker, Hacking the System (machines and walkthroughs) and a CSAT forge. Those are owner content.

## 3. Source tiers (proposed, to verify)

Tiering combines the two opinions with what was checked. Reuse labels are guesses until each site's terms are read.

| Tier | Sources | Use in the engine | Text stored |
|---|---|---|---|
| 1. Official primary | PIB, Sansad (Lok Sabha, Rajya Sabha), e-Gazette, Supreme Court and High Court judgments, RBI, Union Budget and Economic Survey, MEA, MoEFCC, ISRO, Election Commission, Census/NSO/data.gov.in | Headline, date, link, facts with citation, our explanation | Short facts; short quotes only where reuse is clear |
| 2. Quasi-official and reports | PRS Legislative Research, NITI Aayog, UN and WHO press pages, World Bank open data, Nobel Foundation, IUCN and Ramsar (licence check first) | Same as Tier 1, plus index rankings | Summaries we write |
| 3. Newspapers and magazines | The Hindu, Indian Express, Down To Earth, The Assam Tribune, The Sentinel, Business Standard, Mint | Discovery only: link, headline, publisher, date, topic tag, one or two factual lines with the link | Nothing from the article body |
| Excluded | Coaching-institute digests, paywalled text, anything that needs a login | Not ingested | None |

The PIB reuse position was checked from the PIB copyright page as shown in search results: reproduction is allowed
without prior approval, third-party material is excluded, and the source must be acknowledged. The page itself returned
HTTP 403 to automated reading, so that wording needs a manual check before bulk use.

## 4. Priority topic clusters (proposed)

Each cluster maps to syllabus tags and to one or more Tier 1 or 2 sources.

1. Polity and governance: new Acts and bills, constitutional amendments, landmark judgments, constitutional bodies.
2. Government schemes and missions: ministry, beneficiaries, launch date. PIB covers this well.
3. Economy: RBI policy, banking, Budget and Survey data, trade, GST.
4. Environment and ecology: protected areas, Ramsar sites, species, climate conventions and COPs, pollution rules.
5. Science and technology: space missions, health and vaccines, emerging tech, defence platforms.
6. International relations and places in news: summits, groupings, conflict locations (feeds a map-practice feature).
7. Indices and reports: who publishes, the rank, the year.
8. Art, culture and history in news: GI tags, UNESCO listings, excavations, anniversaries (links to static GS-I).
9. Security and disaster management: exercises, cyber, NDMA guidance, major disasters.
10. Assam and the North-East (APSC): state schemes, economy, floods, Kaziranga and Manas, Sixth Schedule and ethnic issues.

## 5. Syllabus tagging

- Build a controlled taxonomy from the official Prelims syllabus (GS Paper I list and CSAT). The official UPSC PDF
  could not be read here (HTTP 403), so the taxonomy in `tools/upsc-taxonomy.mjs` is a draft and must be checked
  against the notification before use.
- Each item gets: topic, subtopic, Prelims flag, Mains GS paper flag, and a static-linkage note.
- Rules and keywords first. Low-confidence items go to a human review queue. Prefer a missing tag to a wrong one.
- Rank by exam relevance, not by volume. The app shows a short daily list (8 to 15 items), not everything.
- Do not rank likely questions. The app never does.

## 6. The engine (proposed design)

1. **Ingest:** one fetcher per source. Respect robots.txt and terms, identify the User-Agent, at most one request per
   source per run. Store raw metadata only for Tier 3.
2. **Normalise:** headline, publisher, date (the feed carries none for PIB: use first-seen time, as now), link, content
   hash. Dedupe by hash and by event.
3. **Tag:** keyword rules (as in `update_feed.py`), then review.
4. **Draft:** for Tier 1 and 2, write facts and a citation. For Tier 3, write a link note only. Drafts are reviewed by a
   person before they go live.
5. **Gate:** the four gates listed in `docs/SOURCE-POLICY.md` (licence field, similarity, number and name check,
   freshness and volume alerts).
6. **Publish:** into the feed (short items) and into `articles/` (longer notes, regenerated by the existing generator).
7. **Watch:** daily counts per source, dead-link check each week, a takedown log, and a one-click unpublish.

Where the code lives:
- Feed fetch and tags: `Zola-feed/scripts/update_feed.py` (extend `SOURCES`, add a per-source parser).
- Article generation: `zola-corpus/tools/articles.mjs` (keep it; add an import step from a reviewed JSON).
- Taxonomy: `zola-corpus/tools/upsc-taxonomy.mjs` (new, draft).
- Gates: a new `tools/source-gates.mjs` in zola-corpus, run in `npm test`.

## 7. Date window and scope (proposed, owner to decide)

- Window: from 1 January 2026 for the backlog, then rolling 18 months. Prelims 2027 date is not confirmed here.
- States: Assam in depth for APSC. Light North-East coverage. Other states later, if the owner wants them.

## 8. Risks

- Copyright and terms of use (see SOURCE-POLICY). Biggest risk is Tier 3 text, so it stays out.
- Factual drift. Mitigated by the number and name gate and human review.
- Silent pipeline failure. Mitigated by per-source counts and freshness alerts.
- Tagging errors. Mitigated by confidence scores and a review queue.
- Legal review of the approach before a large public launch is recommended. This memo is not legal advice.

## 9. Decisions for the owner

1. Accept primary sources as the text, with Tier 3 as link-only and our own factual lines. Or stop Tier 3 entirely.
2. Confirm the date window (from 1 January 2026?) and the state scope.
3. Confirm the app stays free and non-commercial, since several source permissions depend on it.
4. Approve a short legal review before a large publish.
5. Confirm whether the app should link to the articles hub (still open from ZC-00).
