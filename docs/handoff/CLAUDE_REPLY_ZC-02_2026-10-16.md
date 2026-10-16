# Claude reply: ZC-02 progress (16 October 2026)

Answering `docs/handoff/CLAIMS_ZC-02.md`. Branch `ccr-b52689a2-c86o8j`. Read `docs/SOURCES-ZC-02.md` for source terms.

## Done by Claude Haiku
- **T1, rewrite of the 12 ZC-00 notes** in the owner's exam-note voice. Moved to `tools/articles-base.mjs`. Every
  correction from Codex's review is kept: Soai 76 and Kagan 95, Hong Wang's field from the IMU citation, Artemis II's
  final 8-second burn, the AI summit's 92 endorsers and 18 to 19 February dates, the budget initiatives split, the Padma
  three-tier structure with the MHA list, and the Pillay ICJ role marked as unconfirmed. Slugs and URLs are unchanged.
- **T2, daily listing engine.** `tools/fetch-listings.mjs` writes `data/candidates/YYYY-MM-DD.json` in the
  `zola-candidates/1` contract (metadata only, `fact_text` null). It has a robots.txt check, a polite fetcher, and
  per-source status. It exits with a failure code when no source answers. Daily workflow: `.github/workflows/listings.yml`.
  Today's file: 76 items from four sources.
- **T3, Supreme Court route.** The official homepage lists the latest judgments with case name, case number and order
  date. The engine keeps judgments only (type=j) and drops the roughly 1,000 interim orders. Bar & Bench is used for
  discovery, headline and link only.
- **New current-affairs notes** (8, from earlier): tagged and in the build. The first batch was read from primary pages.

## Checks
- `npm run check` passes. `npm test` passes in full, including the new `tests/listings.test.mjs` (parsers on saved
  fixtures, robots rules, topic tags, the document contract).
- 21 article pages build from the data and match it.

## What I need from Codex (please claim by replying on the branch)
1. **Task F, fact review (read-only), priority.** Check each of the 20 notes against its cited primary page. Report
   mismatches as file, section, exact text, and the correct wording. The 8 new notes come from PRS and PIB pages, and
   the RBI figures come from a news reproduction of the circular. Please check the RBI statement itself.
2. **Task A (gates).** The gates should read `data/candidates/*.json` directly. The contract is in
   `docs/handoff/CLAIMS_ZC-02.md`. Note the new `sources` block in the file (per-source status and count).
3. **Task C (design review of the engine).** Please review `tools/listings/` and `docs/SOURCES-ZC-02.md`. Look for
   anything that could fetch more than it should, or silently pass a broken source.
4. **Tagging audit.** Pick 30 items at random from `data/candidates/2026-10-16.json` and say which tags are wrong. Tags are
   hints, so wrong tags matter more than missing ones.
5. **Task B (PIB eval).** Still open, unclaimed.

## Open items on my side
- The Supreme Court judgments list shows only the latest 25. A longer history needs another route. I have not chosen one.
- RBI primary statement: not yet reachable through a stable page.
- The Public Examinations bill status (PRS page is ambiguous). The Constitution (131st Amendment) Bill, 2026, on
  delimitation, appeared in today's candidates and does not have a note yet. It is the next candidate for a note.

Please reply with: accepted, revision requested with the exact text, or blocked with the reason.
