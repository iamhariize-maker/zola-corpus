# Zola Corpus binding for Supersymmetry 5.1.0

This section is the project binding for the live Codex and Zola Claude work. It is the `## Project binding` section that the root `SUPERSYMMETRY.md` will carry on adoption. Until the owner's adoption is applied to the live branch, the root file stays at version 3.

## Project binding

- **Protocol version:** 5.1.0
- **Project:** Zola Corpus (UPSC and APSC Prelims study app, public)
- **Repository:** iamhariize-maker/zola-corpus
- **Default branch:** main
- **Lane branches:** one shared work branch for the live work, with path ownership by claim
  - codex and claude share `ccr-b52689a2-c86o8j`; each lane edits only the paths its claim names
- **Live lanes and tiers:** codex: expert and worker tiers attached per task (task-scoped); claude: worker tier, with expert tier attached per task or MODEL_ROLE_BLOCKED
- **Reply paths:** PR #1 comments (the coordination channel) and `docs/handoff/` reply files on the work branch
- **Acceptance ledger:** docs/handoff/LEDGER_V5.md (the v5 ledger, starting at SUP-00). The v3 ledger `docs/handoff/ACCEPTANCE_LEDGER.md` is frozen: tasks in flight finish there under v3 rules, and no new task opens there
- **Channel:** PR #1 on iamhariize-maker/zola-corpus (draft, not to be merged); message IDs follow section 9
- **Current primary objective:** ZC-01, a complete UPSC Prelims dashboard with a current-affairs engine on primary sources, newspapers link-only, notes in the owner's exam-note voice; acceptance contract: docs/RESEARCH-ZC-01.md and docs/SOURCE-POLICY.md
- **Required checks:** node /path/to/supersymmetry/scripts/check.mjs ledger docs/handoff/LEDGER_V5.md --today=$(date +%F); npm run check; npm test
- **Integration owner and rule:** the owner merges to main, after the counterpart's exact-SHA accept and green checks. The owner's go-ahead is required for main
- **Post-integration runs:** Deploy Zola Corpus (GitHub Pages, on main); Daily listings (scheduled, observe one scheduled run before it counts as verified)
- **Provider policy:** public repository content only; no private owner data is sent to any provider; zero-retention routing where a router is used
- **Allowed routes:** direct:openai; direct:anthropic
- **Lane identity:** declared shared: the owner's login speaks for every lane; channel authority is not separated by lane
- **Budget:** per task: 20 USD, or the token equivalent, unless the owner changes it; each lane card carries its own cap
- **Safeguards:** index.html is owner content and is not hand-edited; no third-party scripts, CDNs or trackers, except the owner-approved anonymous counting in pwa/stats.js; offline-first, with new pages precached in sw.js; plain English without hype; learner-data storage keys unchanged; channel authority is the owner's login, and the lanes are a declared shared identity; npm run check and npm test pass before every push
