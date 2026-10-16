# Supersymmetry — Hariz's reusable AI cooperation protocol
Version 3. As of 12 October 2026. Applies to participating agents in this checkout. This is a reusable process; project requirements stay in project briefs.

## Startup and precedence
Read this file, AGENTS.md, project requirements, current cooperation records and the counterpart's current remote reply before implementation. Current owner instructions take precedence. Preserve repository safety, licensing, privacy and product restrictions. Historical branches/SHAs are evidence, not a command to work on an old lane.

This file is not a GitHub-wide enforcement feature or a way to start external models. Keep a copy on each participating branch and each new project. New branches from a head containing these files inherit them; older branches do not. For an older branch, adopt these coordination files with a targeted reviewed documentation change; do not merge unrelated feature trees just to adopt this process.

## Roles: expertise directs economical execution
- Codex Sol/Astra: expert architecture, specific know-how, hard diagnosis, discriminating experiments and independent quality review.
- Codex Luna: always handles bulk implementation, fixtures, test execution, evidence extraction, docs and integration preparation.
- Claude Sonnet/Opus: expert feasibility challenge, architecture, platform/domain research, difficult diagnosis and independent review.
- Claude Haiku: always handles bulk implementation, fixtures, tests, evidence packaging and reviewed integration.
- Other participants join only after an explicit acknowledgement of their actual model, branch, scope and available execution tools.

Experts can supply a critical snippet or narrowly scoped algorithm when necessary, then return the broader work to workers. Do not mislabel the current model or silently replace unavailable workers with experts doing all bulk work. Record unavailable roles as MODEL_ROLE_BLOCKED with a ready-to-run packet, and continue useful independent work. The owner authorizes bounded expert/worker delegation for this collaboration. Actual execution depends on the participating runtime; a file cannot switch model selection.

## Work loop
1. **Reconcile:** fetch current heads and both remote replies; inspect actual code and failures. Record current branch, counterpart, baseline, model availability and source of the requirement.
2. **Design:** experts exchange a short decision packet: intended behavior, source evidence, existing failure, candidate mechanisms, strongest counterexample, chosen experiment, exact files/functions, success/failure signals and safeguards.
3. **Claim:** workers record task ID, exact owned paths, dependencies and expected deliverable before editing. Resolve overlap explicitly; meanwhile take independent work. Do not force-push, reset or erase another session's work.
4. **Implement:** workers execute small packets with measurable acceptance. Reuse already-landed fixes. Supply a focused diff, implementation SHA, tests, logs, limitations and integration instructions.
5. **Challenge:** the counterpart expert independently reviews code and evidence, identifies specific missed cases and directs corrections. Worker self-review cannot close its own task.
6. **Integrate:** the designated integration worker brings in only reviewed commits and checks the combined head. Independent green branches are insufficient.
7. **Verify and reply:** inspect exact-head checks and relevant artifacts. Resolve findings or retain explicit gaps. Answer each request as accepted with SHA, revision requested with counterexample, or blocked with evidence and next action. Silence is not acceptance.

## Keep the goal in charge
Maintain one current primary objective and an acceptance contract in the project brief. Activity, explanation, renamed controls and allowlist changes must not substitute for requested behavior. Mark deliverables separately: implemented, automated-verified, physical/device-verified where relevant. Never claim a commercial product or real-world outcome from synthetic evidence alone.

After two materially different failed experiments, workers escalate a minimal reproducer and logs to an expert. The expert supplies a concrete correction, new testable approach or bounded evidence-based conclusion. Do not repeat disproved attempts, weaken thresholds, or label product failures infrastructure failures without proof.

If an expert cannot deliver useful instructions, ask the counterpart expert for a counterexample or alternative mechanism before another implementation loop. If both lanes stall, write one shared blocker record identifying the exact missing capability/evidence, available independent work and the smallest next experiment. Do not bounce vague investigation requests indefinitely.

## Single acceptance ledger
Use the project's existing reply files rather than spawning conflicting ledgers. Each row records:
Task | requirement | actual expert/worker models | baseline | claimed paths | design/experiment | implementation SHA | independent findings | integration SHA | exact-head evidence | remaining gap | next owner/action.

States: posted → acknowledged → claimed → implemented → independently reviewed → integrated → verified. Reopen invalidated evidence after source changes. A protocol commit is only posted, not proof of adoption. Each session's first reply names actual roles, a bounded task and the next concrete contribution.

## Zola Corpus binding
Repository: iamhariize-maker/zola-corpus. Designated working branch for this lane: ccr-b52689a2-c86o8j. Never push to main without the owner's go-ahead; no pull request unless the owner asks.
Live lanes at adoption (16 October 2026): Claude ccr-b52689a2-c86o8j (Haiku: bulk implementation, content research, validation). Sonnet/Opus expert review is MODEL_ROLE_BLOCKED in this session because no expert lane is attached. Codex: lane not yet named; the owner switches it on after the Claude reply. A Codex lane must acknowledge its actual model, branch and tools before claiming anything.
Reply paths: docs/handoff/SUPERSYMMETRY_CLAUDE_REPLY_2026-10-16.md (Claude) and docs/handoff/SUPERSYMMETRY_CODEX_REPLY_2026-10-16.md (Codex, to be written by that lane). Acceptance ledger: docs/handoff/ACCEPTANCE_LEDGER.md.
Current primary objective ZC-01: make Zola a complete UPSC Prelims dashboard with a current-affairs engine that uses primary sources (PIB, Sansad, Gazette, courts, RBI and similar) as text, treats newspapers as link-only, and writes study notes in the owner's exam-note voice. Plan and evidence: docs/RESEARCH-ZC-01.md, docs/SOURCE-POLICY.md, docs/VOICE.md, docs/handoff/CODEX_TASKS_ZC-01.md. Earlier objective ZC-00 (verified articles on 2026 events) stays in force.
Safeguards that stay in force: index.html is owner content and is not hand-edited; no third-party scripts, CDNs or trackers; offline-first (new pages are precached in sw.js); plain English without hype; learner-data storage keys unchanged; npm run check and npm test pass before every push.

## Adoption in another repository
Copy SUPERSYMMETRY.md; add a startup pointer in AGENTS.md and CLAUDE.md while preserving existing instructions. Replace only the Svan binding with that project's requirements, live lanes and reply paths. Create a small acceptance ledger and exchange acknowledgements. Do not propagate Svan-specific permissions, Android tasks or branch names into unrelated projects.
