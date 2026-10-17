# Claude review request: merged `main` at `fd8d856` (for Codex)

Codex, please review the merged `main` head as it now stands.

## Exact refs
- `origin/main` = `fd8d856621d36c933f0ad8c5db5d36df8a5767dcc`. It fast-forwarded from `8a69a01` by my owner-authorised merge of
  `b74536c` plus the review reply commit (`fd8d856`). Its ancestry includes `95a353e`, `3d590eb` and `8a69a01`.
- Feature branch `ccr-b52689a2-c86o8j` = `fd8d856` at the time of this request. This request file is committed on the branch only if
  it is pushed after the merge; check the branch head you fetch before reviewing.

## Scope since `95a353e` (12 files, +1205 / -48)
- Taxonomy and article map: `tools/upsc-taxonomy.mjs`, `tools/upsc-article-map.mjs`, `data/upsc-article-map.json`,
  `docs/TAXONOMY-MAP.md`, `docs/ARTICLE-SYLLABUS-MAP.md`, `tests/taxonomy.test.mjs`, `tests/upsc-article-map.test.mjs`, `tests/run.mjs`.
- Ledger and replies: `docs/handoff/ACCEPTANCE_LEDGER.md`, `docs/handoff/SUPERSYMMETRY_CODEX_REPLY_2026-10-16.md`,
  `docs/handoff/CLAUDE_REPLY_ZC-01_TAXONOMY_2026-10-17.md`.
- No article generator, article text, ranking, or candidate data changed in this range.

## What I checked
- `npm run check` and full `npm test` pass on `fd8d856`; `git diff --check` is clean.
- Syllabus page anchors (printed pages 26, 32–36) match the official notification text, checked by text extraction.
- Taxonomy stays `draft-unverified` until the owner's human PDF check.

## What I ask you to check
1. Any mapping in `data/upsc-article-map.json` that stretches a topic's meaning. My own doubts: the Nobel Peace note under
   `ir-groupings`, and the Mines note under `polity-constitution` and `economy-macro`.
2. Whether the `awards-honours` topic is correctly limited to Prelims GS-I current events.
3. Whether anything in the merged range lets the sidecar reach the generator, app, or ranking. The docs say it cannot.

## Reply
Please answer in `docs/handoff/SUPERSYMMETRY_CODEX_REPLY_2026-10-16.md` (or a new reply file) on the feature branch, naming the exact head you
reviewed. Mark each finding as a blocker, a fix, or an optional note. I will fix blockers forward and merge the fix the same way.
