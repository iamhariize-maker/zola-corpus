# Zola Corpus binding for Supersymmetry 5.1.0

This section is the project binding for the live Codex and Zola Claude work. It is the `## Project binding` section that the root `SUPERSYMMETRY.md` will carry on adoption. Until the owner's adoption is applied to the live branch, the root file stays at version 3.

The checker is copied to `tools/supersymmetry/check.mjs` from the protocol repository `iamhariize-maker/supersymmetry-` at commit `b5e5a89`, so that public CI can run it without fetching a private repository.

## Project binding

- **Protocol version:** 5.1.0
- **Project:** Zola Corpus (UPSC and APSC Prelims study app, public)
- **Repository:** iamhariize-maker/zola-corpus
- **Default branch:** main
- **Lane branches:** one shared work branch for the live work, with path ownership by claim
  - codex and claude share `ccr-b52689a2-c86o8j`; each lane edits only the paths its claim names
- **Live lanes and tiers:** codex: expert and worker tiers attached per task (task-scoped); claude: worker tier, with expert tier attached per task or MODEL_ROLE_BLOCKED
- **Reply paths:** PR #1 comments (the coordination channel) and `docs/handoff/` reply files on the work branch
- **Acceptance ledger:** docs/handoff/LEDGER_V5.md (the v5 ledger, starting at SUP-00). The v3 ledger `docs/handoff/ACCEPTANCE_LEDGER.md` is frozen. Every in-flight v3 row carries a lease and closes by 2026-10-31; after that date it reopens in v5. No new task opens in v3. Until this adoption merges to main, claims recorded on the work branch bind only the lanes that acknowledge it
- **Channel:** PR #1 on iamhariize-maker/zola-corpus (draft, not to be merged); message IDs follow section 9
- **Current primary objective:** ZC-01, a complete UPSC Prelims dashboard with a current-affairs engine on primary sources, newspapers link-only, notes in the owner's exam-note voice; acceptance contract: docs/RESEARCH-ZC-01.md and docs/SOURCE-POLICY.md
- **Required checks:** node tools/supersymmetry/check.mjs ledger docs/handoff/LEDGER_V5.md --today=$(date +%F); npm run check; npm test
- **Integration owner and rule:** the owner merges to main by pull request, after the counterpart's exact-SHA accept, green required checks on that SHA, and `git diff --quiet ACCEPTED_SHA INTEGRATED_SHA` with no output. The owner's go-ahead is required for main
- **Post-integration runs:** Deploy Zola Corpus (GitHub Pages, on main); Daily listings (scheduled, observe one scheduled run before it counts as verified)
- **Provider policy:** public repository content only; no private owner data is sent to any provider; zero-retention routing where a router is used
- **Allowed routes:** direct:openai; direct:anthropic
- **Lane identity:** declared shared until 2026-11-30, or until the lane apps exist, whichever is first. The owner's login speaks for every lane; channel authority is not separated by lane; owner decisions are recorded on main by a pull request that the owner merges
- **Budget:** proposed, owner to confirm: 3000000 tokens or 60 turns per task, reported by each lane with its source; each lane card carries its own cap. USD is not reported by the lanes
- **Safeguards:** index.html is owner content and is not hand-edited; no third-party scripts, CDNs or trackers, except the owner-approved anonymous counting in pwa/stats.js; offline-first, with new pages precached in sw.js; plain English without hype; learner-data storage keys unchanged; channel authority is the owner's login, and the lanes are a declared shared identity; npm run check and npm test pass before every push
