# Adoption packet: Supersymmetry 5.1.0 for the Zola Corpus lanes

Status: **proposal, not adopted.** Nothing on the live branch `ccr-b52689a2-c86o8j` changes until four things are in place: the owner's decisions below are recorded, both lanes acknowledge the exact commit SHA of this packet, the owner's settings are applied where listed, and the lane that edits each file posts a claim on it. The owner asked on 17 October 2026 that the new protocol apply to the live work. This packet is how that happens safely, and it lists what is still open.

Files on this branch:
- `docs/handoff/SUPERSYMMETRY_V5.md`: protocol 5.1.0, copied from `iamhariize-maker/supersymmetry-` at `b5e5a89`.
- `docs/handoff/SUPERSYMMETRY_V5_ZOLA_BINDING.md`: the Zola binding. It passes the checker.
- `docs/handoff/LEDGER_V5.md`: the v5 ledger, starting at SUP-00.
- `tools/supersymmetry/check.mjs`: the checker, copied from the protocol repository at `b5e5a89` (sha256 prefix `1d9b215337d5c0d1`, the same as the protocol copy). Public CI can run it without a private checkout.
- Workflow guard proposals in `.github/workflows/deploy.yml` and `.github/workflows/listings.yml` (commit `aad135b`). These are not on the live branch.

The v3 protocol at the root of the live branch, and its ledger `docs/handoff/ACCEPTANCE_LEDGER.md`, stay as they are until adoption.

## Live state (read-only, fetched 17 October 2026)

- **Live branch** `ccr-b52689a2-c86o8j` is at `581dd4d`. This packet was written against that head. An adoption names the exact head it applies to, and that head will have moved by then.
- **Main** is at `d7ece49`.
- **Identity.** Every channel message on PR #1 is posted under the owner's login `iamhariize-maker` (numeric ID `314578671`, read with the GitHub connector). The Codex lane confirms this in its reply ch-047. Under v5's per-lane authority rule the lanes cannot be told apart in this state.
- **Ledger.** The v5 checker run on the live v3 ledger at `581dd4d` reports 33 problems. Most are missing status words in the Task column. The checker stops checking a row once its status is missing, so 33 is a floor. The header also names its columns differently from the v5 schema.
- **Main history.** Commit `fd8d856` (taxonomy sidecar, Zola Claude lane) is on `main`. Commit `87e2778` on the live branch asks for Codex review of "merged main at fd8d856", so the merge came before the review. Live v3 says: "Never push to main without the owner's go-ahead; no pull request unless the owner asks." I have not found an owner go-ahead for `fd8d856` in the ledger. This packet does not reclassify that merge. The owner should say whether it was authorised. The `ZC-03.4` row records the merge of `95a353e` as made on the owner's direct instruction, which is a different commit.
- **Workflows on the live branch.** `deploy.yml` has `workflow_dispatch`, `id-token: write`, the `github-pages` environment and no `main` guard. `listings.yml` has `workflow_dispatch` and `contents: write`, and its pull job pushes with `git push origin "HEAD:$GITHUB_REF_NAME"`. A dispatch from any branch therefore pushes to that branch. Whether the `github-pages` environment limits deployments to `main` is a repository setting that no lane can read. The owner must check it.

## What adoption would change

1. Root `SUPERSYMMETRY.md` is replaced by protocol 5.1.0, with the Zola binding as its project section.
2. `AGENTS.md` and `CLAUDE.md` get a pointer to v5. Their existing rules stay.
3. The v3 ledger is frozen as history and is not migrated row by row. The v5 ledger opens at SUP-00. Rows in flight finish in v3 under their leases and close by **31 October 2026**. After that date they reopen in v5. No new task opens in v3.
4. Channel messages use the v5 header (protocol section 9), with `<lane>-<tier>` senders.
5. Lane identity is **declared shared** until 30 November 2026, or until the lane apps exist, whichever is first. The owner's login speaks for every lane. The binding and its Safeguards say so, and the cards check does not run for this project.
6. CI runs the ledger check (`node tools/supersymmetry/check.mjs ledger docs/handoff/LEDGER_V5.md --today=$(date +%F)`), so the binding's required check is enforced and not only documented. This is added in the same claim as the workflow guards below.

## Identity and token custody

- **Target:** one GitHub App per lane, registered under the owner's account and installed on `zola-corpus` only. Permissions: issues write, pull requests read and metadata read. No contents, workflows or administration.
- **Custody:** a non-model broker holds the app keys and mints a one-hour installation token for each post. **No lane holds a key or a token that can post.** A lane hands its message to the broker, and the broker posts it under the app's bot login (`slug[bot]`). This follows `docs/SECURITY.md` C3 and C13.
- **Until the apps and the broker exist,** lanes post as the owner's login under declared shared identity. That is the state this packet asks both lanes to accept, with the exit date above.
- **Edits.** A lane edits only its own comments. The broker audits edits through the GraphQL `editor` field and `userContentEdits`, and audits deletions through `CommentDeletedEvent`. Whether an app may edit another author's comment is unverified, so lanes do not rely on it.

## Owner decisions

Only the owner can change settings, billing and GitHub Apps. The protocol delegation covers protocol decisions only, and it asks that each decision cite research (`docs/DECISIONS.md`).

1. **Lane identity.** Accept declared shared identity until 30 November 2026, or until the apps exist. Register and install the three apps when ready. (Proposed; owner to confirm.)
2. **Budget.** 3,000,000 tokens or 60 turns per task, reported by each lane with its source. USD is not reported by the lanes, so it is not the cap. (Proposed; owner to confirm.) This replaces the earlier 20 USD per-task default, which is withdrawn.
3. **Integration by pull request.** The owner merges to `main` by pull request, after the counterpart's exact-SHA accept, green required checks on that SHA, and `git diff --quiet ACCEPTED_SHA INTEGRATED_SHA` with no output. This changes the v3 rule ("no pull request unless the owner asks"), so it needs the owner's recorded go-ahead. (Proposed; owner to confirm.)
4. **Plan.** GitHub Free stays for the public Zola repository, which needs no upgrade for these controls. Pro is needed only before private project code joins the lanes (`docs/DECISIONS.md`).
5. **The `fd8d856` merge.** State whether it was authorised, so the record is accurate.

## Order of changes

Each step depends on the one before it. A lane posts a claim on the live branch before editing any file there.

1. **Claim, then workflow changes on the live branch.** Add `if: github.ref == 'refs/heads/main'` to the deploy job. Change `listings.yml` so that its pull job opens a pull request rather than pushing, and remove `workflow_dispatch` from it or guard that job with the same `main` condition. Add the ledger check step to CI. These `if:` guards are accident prevention only (`docs/SECURITY.md` C5).
2. **Owner: `github-pages` environment** limited to deployments from `main`. This is the real control for deployment.
3. **Owner: default workflow token** set to read-only (Settings, Actions, General).
4. **Owner: ruleset on `main`** that blocks force pushes and deletions, requires a pull request, and has no bypass list. The rulesets documentation does not say whether repository admins are exempt, so the owner tests it on the repository and records the result in `docs/DECISIONS.md`. Do this only after step 1, because a direct push by the listings job would fail under this rule.
5. **Claim, then adoption on the live branch.** Root `SUPERSYMMETRY.md`, `AGENTS.md`, `CLAUDE.md`, the binding and the ledger change in one lane commit. It lands only after the acknowledgements below.
6. **Later:** the owner registers the apps, and a lane builds the broker under a claim. Lanes then move from declared shared identity to separated identity, and the cards check starts to run.

## Acknowledgements requested

Acknowledgement means naming this packet's exact commit SHA in a channel message.

- **Codex lane.** Its ch-047 already answered the runtime and identity questions. It reported the model family and tier it runs under, that it posts as the owner's login, and that it will follow v3 until the owner adopts v5. Requested now: confirm the ledger freeze and the 31 October close date for in-flight v3 rows, confirm that its row `ZC-04.3` (`f2fb99b`) finishes in v3, and review this binding at the exact SHA of this packet's commit.
- **Zola Claude lane (`ccr-b52689a2-c86o8j`).** It has not replied to `claude-protocol-002` in the channel at the time of writing. Requested: confirm the ledger freeze, confirm that no open claim is changed by it, confirm the order of changes above, and name the head its work is on.
- **Owner.** Decisions 1 to 5 above.

Until these arrive and the claims are posted, nothing on the live branch changes.

## Not done in this packet

- No edits to the live branch, its ledger, `AGENTS.md`, `CLAUDE.md`, the root `SUPERSYMMETRY.md` or any workflow file on the live branch.
- No GitHub App, ruleset, environment or token setting was created or changed. Those are owner actions.
- No lane's posting identity was changed.
- The checker in `tools/supersymmetry/` is pinned at `b5e5a89`. CI does not run it yet; step 1 adds that.

## Research basis

The decisions and their sources are in the protocol repository's `docs/DECISIONS.md`, `docs/SECURITY.md` (controls C3, C5, C7, C13) and `docs/RESEARCH.md`, at `b5e5a89`. The GitHub facts were read from docs.github.com on 17 October 2026. Where they depend on the owner's plan or on a repository setting, they are marked unverified in those files.
