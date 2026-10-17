# Adoption packet: Supersymmetry 5.0.0 for the Zola Corpus lanes

Status: **proposal, not adopted.** Nothing on the live branch `ccr-b52689a2-c86o8j` changes until the Codex lane and the Zola Claude lane acknowledge this packet, and the owner decides the open items below. The protocol copy is `docs/handoff/SUPERSYMMETRY_V5.md` (protocol 5.1.0, copied from `iamhariize-maker/supersymmetry-` at `981c1df`). The Zola binding is `docs/handoff/SUPERSYMMETRY_V5_ZOLA_BINDING.md`, and the v5 ledger is `docs/handoff/LEDGER_V5.md`.

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

## Decisions taken (17 October 2026)

The owner delegated the protocol decisions to the coordinating agent, on condition that each decision cites research. The decisions, and their sources, are in the protocol repository's `docs/DECISIONS.md`. In summary:

- **Lane identity for this project: declared shared (protocol 5.1.0).** The Codex lane's reply (ch-047) is right that its connector posts as the owner's login, so the strict per-lane rule cannot pass. The declared mode keeps claims, leases, exact-SHA acceptance and the gates in full.
- **Target identity: one private GitHub App per lane,** installed on this repository only, with issues write, pull requests read and metadata read, and no contents, workflows or administration. Each run mints a one-hour token. The owner registers and installs the apps; a posting broker is then built, and the lanes move to separated identity. Research: personal accounts can register up to 100 apps at no cost; comment endpoints need issues write, separate from contents; user tokens would post as the owner; machine accounts are limited to one free account and share one login.
- **Ledger:** the v3 ledger is frozen; the v5 ledger opens at SUP-00. Tasks in flight finish in v3, and no new task opens there.
- **Plan:** GitHub Free stays for the protocol repository, which holds no private project code. Public Zola is not affected by the Pro question.

## Workflow and repository controls (decided 17 October 2026)

Research (GitHub documentation, read directly): on the Free plan, branch protection, rulesets, code-owner review and environments with reviewers and branch rules are available for **public** repositories, and are not for private ones. Anyone with write access can read repository secrets, and a push-triggered workflow on any branch can read them. `workflow_dispatch` runs the copy of the workflow on the chosen branch.

Decided:

1. **In the workflow files (proposed on this branch, applied to the live branch only after acknowledgement):** `deploy.yml` deploys only when `github.ref == 'refs/heads/main'`, and `listings.yml` runs its pull job only on `main`. Both files parse.
2. **Owner settings for `iamhariize-maker/zola-corpus` (only the owner can change these):**
   - a ruleset on `main` that blocks force pushes and deletions, with no pull-request requirement, so that the owner's fast-forward integration still works;
   - the `github-pages` environment limited to deployments from `main`;
   - the default workflow token set to read-only (Settings > Actions > General).
3. **No upgrade is needed for Zola.** Free covers these controls on a public repository. The protocol repository is private and holds only documents, so it stays on Free (see the protocol repository's `docs/DECISIONS.md`).

## Still open

- The owner registers the GitHub Apps and installs them on this repository (the owner's account only).
- The workflow guards and the owner settings above: the guards need a claim on the live branch, and the owner must set the settings.
- The budget of 20 USD per task in the binding is a default, for the owner to confirm.
