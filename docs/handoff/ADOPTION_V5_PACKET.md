# Adoption packet: Supersymmetry 5.0.0 for the Zola Corpus lanes

Status: **proposal, not adopted.** Nothing on the live branch `ccr-b52689a2-c86o8j` changes until the Codex lane and the Zola Claude lane acknowledge this packet, and the owner decides the open items below. The protocol copy is `docs/handoff/SUPERSYMMETRY_V5.md` (copied from the protocol repository, `iamhariize-maker/supersymmetry-` at `98a4f4f`).

The v3 protocol at the repository root and the live ledger stay as they are until then.

## What adoption would change, if acknowledged

1. Root `SUPERSYMMETRY.md` is replaced by v5.0.0, with a Zola binding (see the template in the protocol repository, `templates/BINDING.md`). This is a lane edit on the live branch, so it needs a claim first.
2. `AGENTS.md` and `CLAUDE.md` get the startup pointer to v5, keeping their existing rules.
3. The ledger starts as a **v5 ledger at SUP-00**. The 12-column v3 ledger stays as history and is not migrated row by row now. Rows move to the v5 schema only when their lane next updates them.
4. Each lane gets a lane card (`schemas/agent-card.schema.json`). Cards need a GitHub user ID per lane. See blocker 1.
5. Channel messages use `<sender>-<nnn>` IDs, with the header from protocol section 9.

## What the live state shows (read-only check, `ccr-b52689a2-c86o8j` at `a1f4f0d`)

- **Ledger.** The new checker reports 32 problems in the v3 ledger: 31 Task cells lack a status word in parentheses, and the header names differ from the v5 schema. The checker stops checking a row once its status is missing, so further failures (for example, the requested and served model fields) are hidden until the status words are added. The count is therefore a floor, not a full list.
- **Identity.** Every channel message from both lanes is posted under the owner's login (`iamhariize-maker`). Authority by numeric account, which v5 requires, cannot separate the lanes in that state.
- **Workflows.** `deploy.yml` runs on `workflow_dispatch` from any branch, with `id-token: write` and the `github-pages` environment. `listings.yml` runs on `workflow_dispatch` from any branch, with `contents: write`. A workflow file edited on a lane branch runs with that branch's contents. Whether the `github-pages` environment restricts deployments to `main` is a repository setting I have not read. Each needs checking before the lanes are trusted with write access to any branch.

## Blockers and decisions for the owner

1. **Lane identities.** Each lane needs its own GitHub identity before v5's authority rule can hold. Options:
   - A GitHub App per lane, which posts with a `[bot]` login. The card schema accepts this. The app token is a write credential, so under the Rule of Two it must not sit in a lane's environment. The practical version is a non-model posting step that copies lane messages into the channel with the app's identity.
   - Or accept the shared login. Under v5 that means the project cannot pass the cards check, and it must not claim that the lanes are separated by authority.
2. **GitHub plan (for the private protocol repository).** GitHub's plan page lists branch protection and code-owner review on Pro and Team for private repositories, and lists environment deployment protection for private repositories only on Enterprise. This was read from the plan page and not checked against billing. Free does not list either feature for private repositories. Zola is a public repository, and its own settings are not read here.
3. **Ledger.** Start v5 at SUP-00 with the v3 ledger frozen as history (recommended), or migrate every row now (needs both lanes' claims).
4. **Workflow dispatch.** Remove `workflow_dispatch` from `listings.yml`, or guard its write steps with `if: github.ref == 'refs/heads/main'`. Restrict the `github-pages` environment to `main`. Both are changes to workflow files, so both need a claim.

## Acknowledgements requested

- **Codex lane:** confirm your runtime, model tier and the account you post from, accept v5 as the protocol for this project, and say whether the Zola binding draft fits your work.
- **Zola Claude lane (`ccr-b52689a2-c86o8j`):** confirm that your open claims are unaffected, and that the v5 ledger starts at SUP-00 with the v3 ledger frozen.
- **Owner:** decisions 1 to 4 above.

Until these arrive, nothing on the live branch changes.

## Not done in this packet

- No edits to the live branch, to its ledger, to `AGENTS.md`, `CLAUDE.md`, the root `SUPERSYMMETRY.md`, or to any workflow file.
- No checker is vendored into this repository. A checker run needs a checkout of the protocol repository.
