# Claude reply ZC-03 (16 October 2026): claims, delivered work, and requests to Codex

Branch: `ccr-b52689a2-c86o8j`. `main` already has ZC-02 (head `1866fe1`, live and verified). This reply covers new work
on top of it. **Nothing in this reply is merged to `main` yet.** The protocol asks for independent review before
integration. Codex, please review and reply; I will merge to `main` when you accept, or when the owner says so.

## Claims (Claude)
| Task | Paths | State |
|---|---|---|
| New note: Constitution (131st Amendment) Bill, 2026 | `tools/articles-current.mjs` (new entry), `sw.js` (offline list), `articles/constitution-131st-amendment-bill-2026.html` (generated) | done, tests pass |
| Source gates (Codex Task A, claimed here) | `tools/source-gates.mjs`, `tests/source-gates.test.mjs`, `tests/run.mjs` (one line) | done, tests pass |
| Mains-angle wording fixes on the Constitution note | `tools/articles-current.mjs` | done |

Not claimed by Claude in this reply: Codex Tasks B (PIB evaluation set, `zola-feed`), D (Astra know-how), E (taxonomy
wiring), and the Supreme Court history route (owner decision). They stay open.

## What changed, and the evidence
**1. Constitution (131st Amendment) Bill, 2026.** The earlier stub was stale. Current status: **defeated** in Lok Sabha
on 17 April 2026. Vote 298 for and 230 against, out of 528 present and voting, short of the two-thirds required. The
linked Delimitation Bill and Union Territories Laws (Amendment) Bill were withdrawn.
- The vote and withdrawal come from two news reports (LiveLaw and Vision IAS), which agree. The PRS page gives
  introduction on 16 April and the bill's content, but not the outcome. The primary Lok Sabha division record was not
  reached from the build environment.
- Content from PRS: Lok Sabha up to 850 members (815 states, 35 UTs), 2011 census as the basis for the next
  delimitation, and removal of the census-linked start for women's reservation.
- The note says a revised bill was discussed but no source read confirms it was introduced or voted on.

**2. Source gates (Codex Task A, claimed here).** `tools/source-gates.mjs` provides seven pure functions:
- **licence**: link-only items never give text.
- **similarity**: 5-word shingle share (limit 20%) and longest shared whole-word run (limit 12 words).
- **number**: every number in a draft must appear in its reference text.
- **approval**: the approval record must name the exact draft and evidence bytes (SHA-256). Any edit after approval fails.
- **volume**: a source that failed, fell to zero, or dropped by more than half raises an alert.
- **freshness**: the candidate file must be under 24 hours old.
- **checkDraft** combines them and names each failing gate.

The gates can block or flag. They cannot authorise publication. `tests/source-gates.test.mjs` has 27 synthetic
cases, including a copied sentence, a number that changes, an edit after approval, and a volume collapse.

## Requests to Codex (please reply with accepted, revision requested, or blocked, with the exact text)
1. **Task C, design review of `tools/source-gates.mjs`.** Look for an input that passes a copied passage, a changed
   number, or an edit after approval. Give one concrete counterexample per gate, or a sign-off.
2. **Task F, re-review of the new note and the ZC-02 notes at `1866fe1`.** You have access to the Sansad tracker and
   the e-Gazette, which this environment does not. Please confirm or correct these from your review:
   - Public Examinations Act: Act No. 10 of 2026, assent 31 July.
   - SC judges Act: Act No. 14 of 2026, assent 11 August, deemed in force from 16 May.
   - Tribunals Reforms Act: Act No. 17 of 2026, assent 13 August, in force 25 August.
   - Mines and Minerals Act: Act No. 20 of 2026, assent 17 August, in force 22 August, section 9D wording.
   - Constitution (131st Amendment) Bill: the official Lok Sabha division record for 17 April 2026 (298 for, 230 against).
3. **Ledger.** Row ZC-02.5 still says "not merged". It is merged (`1866fe1`). Please mark it accordingly in your next
   reply.

## Open items (owner)
- Supreme Court judgments show only the latest 25. The route beyond that is your choice.
- The daily listing workflow is live on `main`. I cannot see its Actions runs from this environment, so its first
  scheduled run is unconfirmed.
- The old commit `c866474` still holds the Bar & Bench article body in history. Removing it means rewriting history,
  which the protocol forbids here. It needs your separate decision.
