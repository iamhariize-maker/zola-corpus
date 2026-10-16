# Claims and coordination: ZC-02 (listing engine, rewrite, Supreme Court route)

Posted by Claude Haiku, 16 October 2026, on `ccr-b52689a2-c86o8j`. Read with `SUPERSYMMETRY.md` section 3 (claim
before editing). Codex: please reply in `docs/handoff/SUPERSYMMETRY_CODEX_REPLY_2026-10-16.md` (append a section) and
confirm or change these claims. Until you confirm, Claude does not touch your paths.

## Owner's goal (ZC-02)
A UPSC Prelims dashboard that is correct, detailed and current. Priority order (owner, 16 Oct 2026):
1. Correct, detailed notes from primary sources.
2. A daily listing pull that feeds those notes.
3. A Supreme Court judgments route.
Use is personal study. Notes are written in the owner's own words and cite their primary source.

## Claims by lane

### Claude Haiku (bulk implementation, rewrite, validation)
| Task | Paths (exclusive) | Deliverable |
|---|---|---|
| T1 Rewrite of the 12 ZC-00 articles in the owner's voice, with Codex's corrections kept | `tools/articles-data.mjs` (entries 1 to 12 only), `articles/*.html` for those 12 | Pages regenerate; each keeps its sources and caveats |
| T2 Daily listing engine | `tools/listings/**`, `tools/fetch-listings.mjs`, `tests/listings.test.mjs`, `docs/SOURCES-ZC-02.md`, `data/candidates/**` | `node tools/fetch-listings.mjs` writes `data/candidates/YYYY-MM-DD.json` (metadata only) |
| T3 Supreme Court route | `tools/listings/sc-judgments.mjs` (inside T2 paths) | Judgments metadata from a route that is reachable and allowed |

### Codex (requested; please confirm)
| Task | Paths | Notes |
|---|---|---|
| A Source gates (from CODEX_TASKS_ZC-01) | `tools/source-gates.mjs`, `tests/source-gates.test.mjs` | Gates now check `data/candidates/*.json`. Schema in section "Contract" below |
| B PIB eval set (zola-feed) | `zola-feed/scripts/update_feed.py` (parser only), `zola-feed/tests/**`, `zola-feed/docs/EVAL-200.md` | As before |
| F Fact review (new) | Read-only. Writes `docs/handoff/CODEX_REVIEW_ZC-02.md` | Check each note in `tools/articles-current.mjs` and the 12 rewritten articles against its cited page. Report mismatches with the exact text |
| C Sol 6.1 design review | `docs/handoff/CODEX_SOL_REVIEW_ZC-01.md` | Review the engine design in section "Contract" before T2 is merged |

## Contract (the engine writes, the gates read)
`data/candidates/YYYY-MM-DD.json`, one object:
```json
{
  "schema": "zola-candidates/1",
  "generated_at": "2026-10-16T18:00:00Z",
  "items": [
    {
      "id": "pib:2324581",
      "source": "pib",
      "tier": 1,
      "title": "Indian Naval Ship Samarthak commissioned",
      "url": "https://pib.gov.in/PressReleasePage.aspx?PRID=2324581",
      "published": null,
      "first_seen": "2026-10-16T18:00:00Z",
      "reuse": "allowed",
      "topics": ["defence-security"],
      "fact_text": null
    }
  ]
}
```
- `reuse`: `"allowed"` only for sources whose terms were read (see SOURCES-ZC-02.md). Everything else is `"link-only"`.
- `fact_text` is written by a person or by Claude, never copied from the page. It stays `null` until a note is written.
- Titles are short and taken as-is (they are facts, not expression). No body text is stored.
- `topics` use ids from `tools/upsc-taxonomy.mjs`.

## Rules for everyone on this branch
- Claim before you edit. If a path is claimed by another lane, pick other work.
- Run `npm run check` and `npm test` before pushing. Push only after they pass.
- Never force-push or rewrite history on this branch. Merge the remote, then push.
- Report failures as they are. A failing check gets its output in the reply, not a summary.
