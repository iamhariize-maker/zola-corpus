# Codex task packet: ZC-01 (UPSC Prelims dashboard and current-affairs engine)

Issued by: Claude Haiku, 16 October 2026. Branch: `ccr-b52689a2-c86o8j` in `iamhariize-maker/zola-corpus` and
`iamhariize-maker/zola-feed`. Read first: `SUPERSYMMETRY.md`, `AGENTS.md`, `docs/RESEARCH-ZC-01.md`,
`docs/SOURCE-POLICY.md`, `docs/VOICE.md`, `docs/handoff/ACCEPTANCE_LEDGER.md`.

Roles (owner's allocation): Codex Luna (max) does most of the bulk work. Codex Sol 6.1 is the expert for design and
independent review, and does most of the expert work. Codex Astra is light: only short, specific know-how questions.
Claude Haiku does bulk writing and validation. Claude Sonnet and Opus give opinions only, when asked.

Please post your first reply at `docs/handoff/SUPERSYMMETRY_CODEX_REPLY_2026-10-16.md` on the branch, naming your actual
model, roles, tools, the tasks you claim, and the next contribution. Do not claim a task before that reply.

## Global rules (apply to every task)
- Never hand-edit `index.html` (zola-corpus owner content).
- No copyright text in the repo: no full text of news articles, no reworded copies. Facts with citations only.
- No prediction of exam questions. No hype. Voice per `docs/VOICE.md`.
- Before every push: `npm run check`, `npm test` (zola-corpus) and `python scripts/update_feed.py --check` (zola-feed).
- Claim paths in the ledger before editing. Two lanes never edit the same file at once.
- Commits: plain message, no model names. Trailer: the `Claude-Session` line is not yours, so omit it.

## Task A (Luna, max): source gates
Claim: `zola-corpus/tools/source-gates.mjs`, `zola-corpus/tests/source-gates.test.mjs`, `zola-corpus/tests/run.mjs` (add one line).
Build the four gates in `docs/SOURCE-POLICY.md`:
1. Licence field: an item publishes only when its source record says `"reuse": "allowed"`. Reject any other value.
2. Similarity: 5-gram shingle overlap between a generated line and its source text, plus longest common substring.
   Block at a threshold you set in code and document. Cap any quotation length.
3. Number, date and name check: every number, date and capitalised name in our line must appear in the cited source.
4. Volume and freshness: per-source daily count against a baseline, and an alert when a source is silent for 24 hours.
Acceptance: unit tests with at least 12 cases (pass and block for each gate). `npm test` passes. Explain the threshold choice.

## Task B (Luna, max): PIB eval set and feed source
Claim: `zola-feed/scripts/update_feed.py` (add a source parser only, do not change the bot loop), `zola-feed/tests/` (new fixtures),
`zola-feed/docs/EVAL-200.md`.
1. Collect 200 recent PIB English headlines (the feed already reads them). Store as a JSON fixture with the expected
   `subjects` and `machines` tags, labelled by a person (the owner or a reviewer) where possible. Mark uncertain ones.
2. Report the current tagging accuracy on the 200 and the false-keep rate (method in ROADMAP item 4).
3. Do not add non-PIB sources in this task. That waits for the source table approval.
Acceptance: the fixture and the report are committed; `update_feed.py --check` passes.

## Task C (Sol 6.1, expert): design and independent review
Claim: review only. Write `docs/handoff/CODEX_SOL_REVIEW_ZC-01.md`. Do not edit code in this task.
1. Review `docs/SOURCE-POLICY.md` and `docs/RESEARCH-ZC-01.md`. Find gaps: any source that could carry copyrighted text
   without us noticing, and any gate that can be bypassed.
2. Review Task A's gates after Luna posts them. Give one concrete counterexample for each gate, or a sign-off.
3. Give the engine's failure-mode list a ranking, with the detection signal for each.
Acceptance: a findings list with file, line or section, and the correct wording or fix. No finding is closed by its author.

## Task D (Astra, light): specific know-how only
Up to three questions, each in its own short file under `docs/handoff/astra/`:
1. Indian Copyright Act 1957: exact scope of s.52 fair dealing for reporting current events, and whether s.52(1)(q) covers
   government Acts, judgments and reports. Quote the text.
2. robots.txt handling and Crawl-delay conventions for Indian government sites (pib.gov.in, sansad.in, egazette.gov.in).
3. Whether the Government Open Data Licence - India applies to PIB releases, and its attribution text.
Answer with a source link and the exact wording. Mark anything you cannot confirm. Astra does not own any file.

## Task E (Luna, after A): taxonomy wiring
Claim: `zola-corpus/tools/upsc-taxonomy.mjs` (draft, already in the repo), `zola-corpus/tests/taxonomy.test.mjs`.
1. Make `validateTaxonomy()` run in `npm test`.
2. Map every current `SUBJECTS` chip and every `MACHINES` entry to a taxonomy id. List any that map to nothing.
3. Do not edit the official syllabus headings. Mark them unverified until a human checks the UPSC PDF.
Acceptance: the mapping table in `docs/TAXONOMY-MAP.md`, tests pass.

## Not in this packet
- Writing new articles (Claude Haiku, in the owner's voice).
- Any change to `index.html`, the app UI (`pwa/body.html`), or the owner's data. The app link to the hub waits for the owner.
- Adding any news site beyond PIB. That waits for the owner's decision on the source table (RESEARCH-ZC-01 section 9).

## Stop rules
- After two failed approaches on the same task, stop and write the minimal reproducer to the ledger row, then ask Sol 6.1.
- If a source's terms are unclear, mark the source "not allowed yet" and move on. Do not guess.
