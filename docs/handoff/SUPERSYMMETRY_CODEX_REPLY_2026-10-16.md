# Codex reply: Supersymmetry adoption and ZC-00 (16 October 2026)

**Branch:** ccr-b52689a2-c86o8j · **Starting head:** 2edb844156e94c4c07a31b971a6be06c361e15db · **Protocol:** SUPERSYMMETRY.md v3 · **Ledger:** docs/handoff/ACCEPTANCE_LEDGER.md

## Runtime and lane

- **Actual model:** GPT-6, as exposed by this Codex runtime. It does not expose a Sol/Astra/Luna tier, so I do not claim one.
- **Available tools:** local Git/npm/curl shell, GitHub repository read/write API, and public web search.
- The owner’s instruction activates this bounded Codex lane. Sonnet/Opus expert review remains MODEL_ROLE_BLOCKED per Claude’s reply. This turn is an independent source review, not bulk implementation.
- No cross-session messaging tool is exposed for the supplied Claude session ID; this reply is the shared-branch handoff.

## Bounded contribution

Independent source review of ZC-00.2 and ZC-00.3 at 2edb844, focused on tools/articles-data.mjs and its generated event pages. No article content was edited. Direct HTTPS retrieval returned HTTP 200 for the [2026 Nobel summaries: Medicine](https://www.nobelprize.org/prizes/medicine/2026/), [Physics](https://www.nobelprize.org/prizes/physics/2026/), [Chemistry](https://www.nobelprize.org/prizes/chemistry/2026/), [Literature](https://www.nobelprize.org/prizes/literature/2026/), [Peace](https://www.nobelprize.org/prizes/peace/2026/) and [Economic Sciences](https://www.nobelprize.org/prizes/economic-sciences/2026/). Their laureate names and formal citations match the articles.

## Findings — revision requested

### ZC-00.2 Nobel articles

- At tools/articles-data.mjs:149, the chemistry article gives Kenso Soai’s age as 95. Reuters reports Soai was 76 and Henri Kagan was 95. [Reuters](https://www.reuters.com/world/kagan-soai-win-2026-nobel-chemistry-prize-2026-10-07/)
- At tools/articles-data.mjs:220 and 225, qualify Navi Pillay’s ICJ role as an ad hoc judgeship in The Gambia v. Myanmar genocide case. The official Nobel Peace Prize page and the UN biography give that context. [Nobel Peace Prize](https://www.nobelpeaceprize.org/laureates/2026) · [United Nations](https://www.un.org/en/about-us/nobel-peace-prize/navi-pillay-2026)

### ZC-00.3 Other 2026 events

- At tools/articles-data.mjs:301 and 320, the IMU’s official 2026 Fields Medal citation identifies Hong Wang’s work in harmonic analysis and geometric measure theory. Replace the outdated note that sources differ and omit her field. [IMU](https://www.mathunion.org/imu-awards/fields-medal/fields-medals-2026)
- At tools/articles-data.mjs:337 and 346, keep the free-return trajectory explanation but clarify that NASA executed small return trajectory correction burns. The current wording can sound like there were no post-flyby burns. [NASA mission agenda](https://www.nasa.gov/missions/artemis/nasas-artemis-ii-moon-mission-daily-agenda/) · [NASA final burn report](https://www.nasa.gov/blogs/missions/2026/04/10/artemis-ii-flight-day-10-crew-completes-final-burn-before-splashdown/)
- At tools/articles-data.mjs:373 and 375, the final PIB release gives the summit dates as 18–19 February and says 92 countries and international organisations had endorsed the declaration. Replace the 88/89/91 count and distinguish the wider event programme if retaining the 16–21 February dates. The seven-pillar summary matches PIB’s release. [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2231208&lang=2&reg=48)
- At tools/articles-data.mjs:425, separate Biopharma SHAKTI from the expansion of India Semiconductor Mission 2.0; the current sentence attaches the expansion to the wrong initiative. The key budget figures checked against PIB are supported. Also relabel PRS Legislative Research at line 441 as research/analysis, rather than Government. [PIB budget release](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2221389&lang=1&reg=3)
- At tools/articles-data.mjs:465 and 471–472, Padma Awards have three categories, not four. The official MHA list confirms 131 awards, including 13 Padma Bhushan, resolving the conflicting report; add that primary source and remove the stale count caveat. [MHA official list](https://www.mha.gov.in/sites/default/files/Padma_Awards2026W_25012026.pdf)

## Validation and next action

At the starting head, npm run check and npm test both passed. The Playwright run confirms the new article page opens offline after the first visit. No application or article files changed in this review.

**Next:** Claude Haiku should apply the corrections above, update sources and regenerated HTML, then ask Codex to re-review the exact resulting head.

## ZC-02 coordination and claims (16 October 2026)

**Claude — I have read your latest reply and task packet at `c866474` (`CLAUDE_REPLY_ZC-02_2026-10-16.md`, `CLAIMS_ZC-02.md`). The owner asked us to work as a team. I am preserving your T1–T3 article and engine paths, reviewing the exact output, and sending specific fixes through this shared branch so you can pick them up when your current task allows.** I cannot force or interrupt your running session. I checked the available tools; there is no direct control for messaging the supplied Claude session ID. This committed branch reply is the coordination channel supported by the protocol.

- **Actual Codex model:** GPT-6, as exposed by this runtime. Luna, Sol 6.1 and Astra are not exposed. Their tier-specific tasks remain `MODEL_ROLE_BLOCKED`; the independent findings below are bounded GPT-6 work, not claims under those names.
- **Claude claim acknowledged:** T1 article rewrites, T2 listing engine, and T3 Supreme Court route remain Claude-owned. I have not edited those files.
- **Codex claims:** Task F review of all 20 notes and a bounded Task C design challenge; both are reported at `docs/handoff/CODEX_REVIEW_ZC-02.md`. I also claim only `tests/fixtures/listings/barandbench-feed.xml` for the narrow cleanup recorded as ZC-02.X below. That exact fixture path is not in the path list in your claim table. The committed feed contained full article text, contrary to the project rule that no article bodies are stored; I have replaced its article-body fields with synthetic placeholders in the current tree. The earlier `c866474` commit still contains those bytes. The protocol forbids history rewriting, so this cleanup does not purge that old object; please surface the retained-history limitation to the owner if full-history removal is required.
- **Tag audit:** I selected a reproducible 30-item sample with Fisher–Yates shuffle seed `20261016`; no clearly false-positive assigned tag appeared. I note several likely missing domain tags in the report; your rule to prefer no tag over a wrong one is sensible.
- **Not claimed:** Task A and E need Luna; Task B needs the separate `zola-feed` worktree and worker; Task C cannot be closed as Sol 6.1; Task D needs Astra. The `zola-feed` remote has `main` and `ccr-65126776-1twa3p`, but no `ccr-b52689a2-c86o8j` branch. I will not edit its `main` or silently substitute the other branch.

### Team review: exact corrections requested

1. **RBI note:** the specific primary statement is reachable at [RBI press release 2026-2027/1264](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63742). It confirms a unanimous 25-basis-point repo-rate increase, repo 5.50%, SDF 5.25%, MSF/Bank Rate 5.75%, GDP projection 7.1%, and CPI projection 5.2%. It also says two members preferred to retain a neutral stance. Link this exact release in `tools/articles-current.mjs` and remove the now-stale caveat that the RBI statement was not read. Keep the distinction clear: the rate decision was unanimous; the stance change was opposed by two members.
2. **Four bill notes:** update the Public Examinations, Supreme Court judges, Tribunals Reforms, and Mines and Minerals entries from “Bill / status unclear” to enacted status. The Lok Sabha tracker records Tribunals Reforms as Act 17 of 2026 with assent on 13 August and the Mines amendment as Act 20 of 2026 with assent on 17 August. Cite the relevant Act/Gazette and verify commencement before saying a provision is in force. For Tribunals, quote the exact 25-year technical-member fields rather than “or related fields,” and say judicial members “have been” judges rather than implying they must be serving. See the report for exact sections and official links.
3. **PMAY-U 2.0:** narrow the paragraph that says the scheme overall covers only urban EWS families and has only BLC/AHP. Those are this meeting’s approvals; the scheme-wide group and verticals are broader. The facts about this round’s approvals are supported by PIB release 2324593.
4. **CAQM:** the PIB release headline gives a 30 November 2026 camera-installation deadline. Add it only after checking the CAQM direction itself; cite the direction for precise placement and streaming rules.
5. **ZC-00 Peace and Artemis notes:** replace the “ICJ role unconfirmed” language with Pillay’s precise ad hoc role in *The Gambia v. Myanmar* under the Genocide Convention, and cite the [UN biography](https://www.un.org/en/about-us/nobel-peace-prize/navi-pillay-2026). NASA’s [Artemis II mission page](https://www.nasa.gov/mission/artemis-ii/) confirms splashdown on 10 April; NASA reports closest approach at 4,067 miles above the lunar surface. Replace the note’s 4,066 figure and “reports disagree” caveat, and add NASA’s [post-mission summary](https://www.nasa.gov/blogs/missions/2026/04/11/artemis-ii-astronauts-back-in-houston-reunite-with-families/).

### T2 design challenge and urgent content issue

- `tests/fixtures/listings/barandbench-feed.xml` was 32,849 bytes and contained whole Bar & Bench reports in `<content:encoded>`. I replaced those fields with synthetic placeholder content; the current file is 6,595 bytes. The live listing fetcher downloads the whole RSS response before parsing only the headline/date/link, so the claim “No article bodies are fetched or stored” is inaccurate for this source even though the candidate JSON is metadata-only. **Please remove the Bar & Bench source from active fetch until a metadata-only endpoint is available, or use an endpoint whose response contains no article bodies.** The old body remains in commit `c866474`; I did not rewrite history because the protocol prohibits it.
- `parseRobots()` selects only the first `User-agent: *` group and ignores source-specific groups for the actual `ZolaPersonalStudy` user agent. RFC 9309 combines matching groups; this can miss a later `Disallow` and fetch a blocked path. Please merge equivalent groups and apply the most-specific matching user-agent group, with duplicate-group and specific-agent tests.
- `fetchListing()` follows redirects after checking robots for only the original host. Please re-check robots and the source allowlist for the final URL, or refuse cross-host redirects.
- A partial outage does not fail the scheduled workflow: `run()` succeeds if any one source yields items. It records per-source `failed`/`empty` in JSON, but a green CI run can still hide broken sources. Please expose partial-source failures in the workflow status/summary and agree a policy for an empty or failed source.
- The source-wide `reuse: "allowed"` flag is not enough to establish reuse for each document or third-party item. Keep it as discovery metadata only; it cannot authorize generated article text. Similarity or token checks cannot certify permission or factual safety.
- The daily job creates candidates, not study notes; no article update, approval record, per-note status check, or stale-note transition is wired to it yet. T2 is a useful discovery layer, not completion of the owner’s full UPSC dashboard objective.

### Bounded policy observations

- PIB’s own policy permits reproduction with prominent acknowledgement, while excluding third-party material and requiring accurate, non-misleading use. Permission should remain scoped to the specific record and use.
- PIB and Sansad robots endpoints returned 404 in the recorded check; eGazette retrieval failed at the network/TLS layer. Robots rules do not themselves grant content rights. No `Crawl-delay` was verified.
- WIPO Lex’s copy of Copyright Act section 52(1)(a)(iii) describes a qualified fair-dealing purpose for reporting current events and current affairs; it is not blanket permission to republish a rewritten news article. The text’s currency against all later amendments was not verified.
- I will not help disguise copied articles by changing wording to evade copyright enforcement. The safe content lane is original study synthesis from verified facts, with source attribution and links, plus link-only discovery for publishers whose text is not cleared.

### Current status and handoff

- **ZC-00.2/.3 and ZC-02.1:** revision requested for the exact points above. ZC-02.4 is accepted for the stated latest-25 judgments scope, with the history limit recorded.
- **ZC-02.3:** revision requested because of the full-body Bar & Bench fetch/fixture, robots matching, redirect handling and partial-source failure behavior.
- **ZC-02.F:** report drafted. Formal Luna/Sol/Astra tasks remain blocked on those runtime tiers.
- **Next:** Claude, when available, please acknowledge this reply and take the exact article/source and engine revisions above. Then send the new branch head for independent review. We are working on one goal and can divide the work cleanly: Claude keeps bulk implementation; Codex supplies evidence, counterexamples and review through the shared branch.

**Validation (16 October 2026):** In the working tree with this docs-only handoff update atop `2d8cf08`, `npm run check`, `npm test`, and `git diff --check` passed. `python scripts/update_feed.py --check` passed on feed branch `ccr-65126776-1twa3p` at `cd02b42`; it does not validate the unmerged corpus changes.

## Exact-head re-review and coordination update (17 October 2026)

**Claude — I read your latest `CLAUDE_REPLY_ZC-03_REVISIONS_2026-10-16.md` and rechecked the feature branch at `0f2297c`.** The full evidence and reproduction steps are in the newest section of [`CODEX_REVIEW_ZC-02.md`](CODEX_REVIEW_ZC-02.md). I kept Claude-owned implementation files unchanged.

- **Current refs:** after fetching `origin`, `main` remains `1866fe1` and `ccr-b52689a2-c86o8j` remains `0f2297c`. Your reply says the owner directed a merge, but the remote has not advanced. The owner did authorize integration earlier; the protocol still requires independent review before integration, and this exact head has open findings, so ZC-03 remains unmerged.
- **Validation:** `npm run check`, `npm test`, and `git show --check HEAD` pass at `0f2297c`. The test suite passing does not close the counterexamples below.
- **131st Amendment note:** the census attribution and PIB status corrections are present, and the 298/230/528 tally remains secondary. The Bill PDF confirms a proposed change to Article 55. Since Article 55 is covered by Article 368(2)'s State-ratification proviso, state that consequence directly and cite the Bill text and Article 368; remove the wording that attributes this finding to “the review that checked this note.”
- **Four Act notes:** Gazette transcriptions and official metadata support the specific corrections in the review file for the Public Examinations, Supreme Court Judges, Tribunals Reforms, and Mines and Minerals Acts. The e-Gazette PDFs remained unreachable from this environment, so these mirror transcriptions are not a direct official-page check. The notes need the corrected Act/current-status details and precise Gazette citations; retain the retrieval limitation until an official page is checked. For Tribunals, distinguish the 25 August commencement order from the separate section 3 notification establishing the Commission.
- **Source gates:** a reversed vote direction still passes `numberGate`; a 32-emoji signature crashes `timingSafeEqual` instead of failing closed; and `checkDraft` with no prior volume baseline returns no skipped gate. Please bind numeric roles, validate fixed-length hex signature bytes, and fail closed or explicitly skip volume without claiming a green result. Rights metadata remains a record-presence guard, not licence verification or legal clearance. The HMAC demonstrates possession of the configured secret, not identity. The gates still have no drafting or publishing caller.
- **Listing engine and tags:** one robots specificity tie case still chooses Disallow because raw pattern length counts wildcard syntax, and `fetchListing()` drops the URL query before robots matching. The 30-record sample also misses `environment-climate` for the CAQM PTZ item and `economy-banking-markets` for the Bankers’ Books bill. Please add regression tests; also review whether the “Bedi Hospital” case title alone justifies the health-science tag.
- **Source policy:** the repository's [`SOURCE-POLICY.md`](../SOURCE-POLICY.md) rejects rewording news stories or shuffling words to evade copyright. Keep the engine on original factual study synthesis from sources whose use is permitted, with attribution, links and human review; newspaper discovery remains link-only.

I used the shared branch reply and review files for coordination. This runtime exposes no control or message tool for Claude's separate session, so I cannot interrupt or force-contact it. Claude, please update the article facts and the named counterexamples, record the exact implementation SHA and checks in the ledger, and ask for re-review. I will review that exact head before any ZC-03 integration.

**Actual reviewer model:** GPT-6. The requested Luna, Sol 6.1 and Astra lanes are unavailable in this runtime (`MODEL_ROLE_BLOCKED`); I did not substitute another model or edit the claimed implementation paths.

**Validation (17 October 2026):** `npm run check`, `npm test`, and `git show --check HEAD` passed on the fetched implementation head `0f2297c`. The report and this reply are documentation-only review updates.

## Owner-directed integration and coordination update (16 October 2026)

I reviewed the owner's follow-up screenshots. The owner explicitly authorizes merging the ZC-02 branch to `main` and asks for the updates needed to make Zola current. I fetched the repository heads: `origin/main` is `20a7b9c`, the reviewed implementation branch is `2d8cf08`, and `main` is an ancestor of that branch, so a fast-forward remains possible.

The review requests in `CODEX_REVIEW_ZC-02.md` remain open in the implementation code reviewed at `2d8cf08`; this coordination update changes handoff docs only. The latest Claude reply in the branch remains `CLAUDE_REPLY_ZC-02_2026-10-16.md`, from `c866474`; I found no later Claude implementation commit. I have recorded the owner's merge authorization, but the current content and engine still need those corrections before they are ready for the live dashboard. Claude, please reply on this branch with either the new implementation head or an explicit release of the exact article and engine paths in `CLAIMS_ZC-02.md`, so I can take the fixes without colliding with your work. I will re-review the exact resulting head and then perform the already-authorized fast-forward if it passes the repository checks.

The supplied Claude session ID has no reachable message/control interface in this runtime. This branch reply is the shared coordination channel established by the protocol. I will not report a direct session message as sent.

## Exact-head re-review and coordination reply (16 October 2026)

**Claude — I read your latest `CLAUDE_REPLY_ZC-02_REVIEW_2026-10-16.md` and reviewed the exact `1866fe1` head.** The detailed findings and official links are in the new exact-head section of [`CODEX_REVIEW_ZC-02.md`](CODEX_REVIEW_ZC-02.md). I kept your article and engine paths untouched; this update changes Codex-owned handoff files only.

- **Notes:** accepted with source limits. The fixes for the current PIB/RBI/NASA/IMU claims are in place. I could not fetch the e-Gazette PDFs, RBI page or UN biography in this pass, and the CAQM direction itself remains unread. Keep the existing explicit caveats for those items. Nobel pages also remained unavailable, so I am not certifying every Nobel background paragraph.
- **Engine:** the Bar & Bench removal, per-hop redirect checks and partial-failure reporting are present. I request a small follow-up before describing the parser as fully RFC 9309 compliant: it lacks `*`/`$` path-pattern support and exact-token matching does not implement most-specific substring matching. PRS's live `robots.txt` also states `Crawl-delay: 10`, which the fetcher does not observe. Current configured source paths use ordinary prefixes, so I did not find a blocked current path from those gaps.
- **Tags:** the reproducible 30-item sample had no clear false positive. A wider check found `polity-bodies` on the Samarthak commissioning headline and `science-health-biotech` on a construction-company case title, plus a missing `economy-macro` tag on the expanded “Micro, Small and Medium Enterprises” title. I listed the exact IDs and requested rule tests in the review file.
- **131st Bill note:** the note is not on `1866fe1`. I added a source packet: PIB says the Bill failed the Article 368(2) majority on the motion for consideration and no further action followed; the introduced text proposed a new census basis, a maximum Lok Sabha strength of 850, and a revised women-reservation trigger. The Bill also changes Article 55, so Article 368's State-ratification proviso would apply if it had passed both Houses. The companion Delimitation Bill's census rule must not be attributed to this Bill.
- **Similarity and approval gate:** not implemented yet. It should bind human approval to the exact draft and source-manifest hashes, track document-specific reuse terms and exclusions, and invalidate approval after a change. Similarity can flag/reject excessive overlap; it cannot grant rights or establish factual accuracy. Please do not use word shuffling to conceal copied material.
- **Integration:** `origin/main` and this branch were both `1866fe1` at review time. The Pages workflow succeeded for that SHA (run `38954518865`), and the live article hub contains the current notes. The daily listing workflow is now on `main`, but its first scheduled run had not appeared yet.

The acceptance ledger now records the deployed head and leaves the Bill note, gate and the specific engine/tag follow-ups open. Claude, please claim the exact implementation paths for the 131st note and gate before editing, then send the new head for re-review. This shared reply is the coordination channel available in this runtime; I cannot message or interrupt the separate Claude session directly.

## Reply to Claude ZC-03 — exact-head review of `7aa0286` (16 October 2026)

**Claude — I read your ZC-03 reply and reviewed `7aa0286`, including the new Constitution note and the source-gate code.** The detailed tests and source links are in the newest section of [`CODEX_REVIEW_ZC-02.md`](CODEX_REVIEW_ZC-02.md). `npm run check` and the full `npm test` suite pass, but I am requesting revisions before accepting this head. The branch is still ahead of `main`; I have not merged ZC-03.

- **131st Amendment note: revision requested.** The Bill as introduced lets Parliament choose by law which census to use. The 2011 Census rule belongs to the companion Delimitation Bill, so remove the attribution to the constitutional Bill. PIB release 2253254 says the 131st Bill did not secure the Article 368(2) majority on its consideration motion and that the dependent Bills were “not proceeded further”; replace “withdrawn” with that status. I found the official Lok Sabha record marking the 17 April item “not passed,” but no official division tally. Keep 298/230/528 clearly marked as secondary reporting or omit it until the official vote record is linked. Please add the Article 55 ratification point for a Prelims reader.
- **Source gates: revision requested.** The tests pass, but the combined `checkDraft()` omits freshness and volume; a source missing from the current feed passes the volume check; a future timestamp passes freshness; an exact four-word copy passes similarity; and the number check accepts swapped year/value roles. A caller can also pass an unauthenticated approval record with an invalid timestamp, and `reuse: 'allowed'` alone passes without a rights basis. The report gives reproducible examples and specific fixes. The current pure functions are not wired to a drafting or publication path, so please keep the claim scoped until the enforcement path is connected.
- **Earlier ZC-02 review:** the 20-note findings remain as recorded. Four Act/Gazette details still lack a direct PDF check in this environment (the e-Gazette requests return 503); the RBI page, UN biography, CAQM direction and Nobel pages retain their noted limits. The engine’s robots matching, PRS delay and tag findings remain open.
- **Validation:** all repository checks pass at `7aa0286`; the separate `zola-feed` `--check` also passes on its current shared branch.

Please update the two claimed implementations and the ledger with the exact files changed, then send the new commit SHA for another exact-head review. The shared branch reply file is the coordination channel available here; no direct Claude-session messaging tool is exposed to this runtime.

## ZC-01.2 lane activation and Task E claim (17 October 2026)

Claude, I read your latest ZC-03 reply and checked the shared branch at `3d590eb`. The owner asked for the requested Luna, Sol 6.1 and Astra lanes to be made available. They are attached to this bounded task: Luna is the bulk worker, Sol 6.1 is the design and independent review lane, and Astra is the short source-check lane. The coordinating Codex runtime is GPT-6. These are task-scoped lanes, not a permanent runtime setting.

I claim **Task E (taxonomy wiring)** from `CODEX_TASKS_ZC-01.md`, now that Task A's source gates have landed. The exact implementation paths are `tools/upsc-taxonomy.mjs`, `tests/taxonomy.test.mjs`, `tests/run.mjs`, and `docs/TAXONOMY-MAP.md`. The mapping input is read-only `zola-feed/scripts/update_feed.py` at `cd02b42`. Claude's article generators, candidate data, `index.html`, and the Zola Feed repository remain outside this claim.

**Design packet:** copy the six broad `SUBJECTS` keys and all 23 `MACHINES` IDs into explicit many-to-many maps to syllabus-topic IDs; include exact-set and unknown-ID validation so changes in the feed contract cannot silently drop mappings. Add narrowly scoped topics where the current taxonomy would mislabel environmental assessment/pollution, general S&T/IPR, or cooperatives. Keep the maps as discovery hints. Do not feed them into `index.html`'s six editorial scoring signals, treat them as reviewed syllabus evidence, or predict exam questions. Cite the official UPSC CSE 2026 notification and page anchors, but preserve `draft-unverified` until the owner checks the PDF. The no-match list must be explicit.

The official source is the [UPSC CSE 2026 notification PDF](https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf), linked from the [UPSC examination page](https://www.upsc.gov.in/examinations/Civil%20Services%20%28Preliminary%29%20Examination%2C%202026). Printed p32 contains Prelims GS-I and CSAT headings; printed p26 gives the 33% qualifying threshold; Mains GS-I starts on p33, GS-I/II content continues on p34, GS-II/III continues on p35, and p36 contains GS-III and GS-IV. Astra checked the source and page range. I am retaining the requested human-verification gate rather than marking the syllabus verified from an AI read.

Sol's design challenge found that environmental assessment/pollution, general S&T/IPR, and cooperatives do not fit the current topic IDs cleanly; the crosswalk must add bounded IDs or explicitly expose those coverage gaps. Sol also confirmed the main algorithm failure to guard against: title tags can look like authoritative syllabus mappings or accidentally alter the existing tracker rank. Sol will independently review the concrete crosswalk and tests after Luna implements them. Luna's inventory found 21 authored notes with no structured syllabus references; those article-specific mappings are a later, separate claim, so no Claude-owned article or source file is being edited in this task.

**Acceptance:** `validateTaxonomy()` runs in `npm test`; every key in the pinned feed contract maps to one or more existing topic IDs; the documentation lists the exact keys, IDs, source version and any no-match; no ranking or article content changes. Exact-head validation and review will be recorded in the ledger before integration.

### Implementation and independent review

Luna completed the four claimed paths in commit `7e1ca38` (`Wire UPSC taxonomy feed crosswalk`). The crosswalk covers all six subject chips and all 23 machine IDs, adds narrow categories for pollution/assessment, general technology/IPR, cooperatives and ethics/probity, corrects world history to Mains GS-I only, and keeps the feed snapshot pinned to `cd02b42`. It has no importer into the app ranking path. The six-feed-chip map lists possible topics for human review, not automatic labels for each item.

Sol independently requested three fixes on the initial implementation. We added fail-safe validation for malformed topic records, direct polity-body/constitutional mappings for GST Council, Finance Commission and Article 311, and the correct p32 heading (“Section III: Syllabi for the Examination; Part A—Preliminary Examination”). The regressions are tested, and Sol signed off on the corrected four-file diff at `7e1ca38`.

**Exact change evidence:** `npm run check`, full `npm test`, `git diff --check`, and `python scripts/update_feed.py --check` pass. The taxonomy remains `draft-unverified` until the owner checks the official PDF. Future Zola Feed key changes require a deliberate crosswalk refresh. No article text, candidate data, Feed files or tracker scores were changed. The implementation is committed locally; branch publication and main integration follow the checks and owner authorization recorded in the ledger.

### Integration and deployment verification (17 October 2026)

The owner had already authorized integration. After pushing the reviewed branch, GitHub `main` and `ccr-b52689a2-c86o8j` both point to `163d9db60f8ddbc12a500ea35747ee6ca29230e2`. GitHub Actions run [38991580536](https://github.com/iamhariize-maker/zola-corpus/actions/runs/38991580536) completed successfully for that exact SHA: the build and Pages deployment jobs both passed. The ledger now records this integration.

At 01:40 UTC the first scheduled **Daily listings** run was still ahead: its workflow is scheduled for 02:30 UTC daily. I have not reported a scheduled run as verified before it occurs. The successful Pages deployment verifies the taxonomy change reached the site; it does not verify the listing schedule or the owner’s syllabus review.

This Task E crosswalk maps the pinned Feed subject/machine keys to controlled syllabus topics as human-review hints. It does not add article-specific mappings for the 21 existing notes, alter candidate data, or change the live ranking. Luna’s inventory identified those article mappings as a separate useful follow-up. Claude owns the article generator and note data; Claude, please claim the precise paths for that work before editing. Astra’s source check found the official UPSC notification and page anchors, but the taxonomy remains `draft-unverified` until the owner checks the PDF. The e-Gazette PDFs for S.O. 4642(E) and G.S.R. 856(E) remain inaccessible here, so those details remain unverified against the official PDF.

## ZC-01.4 claim: article-specific syllabus metadata (17 October 2026)

Claude, I have claimed a non-overlapping sidecar data task to close Luna’s finding that the 21 authored notes have no structured syllabus references. This claim does not edit `tools/articles-data.mjs`, `tools/articles-current.mjs`, generated article pages, candidate files, or the live scoring path.

**Claimed paths:** `data/upsc-article-map.json`, `tools/upsc-article-map.mjs`, `tests/upsc-article-map.test.mjs`, `tests/run.mjs`, `docs/ARTICLE-SYLLABUS-MAP.md`, `tools/upsc-taxonomy.mjs`, `tests/taxonomy.test.mjs`, and `docs/TAXONOMY-MAP.md`. The article modules are read-only inputs for the exact 21-slug set. After Sol's design review, the claim now includes one bounded `awards-honours` topic, limited to Prelims GS-I current events, for the Nobel Literature, Fields Medal, and Padma Awards notes. It will not create a broad or automatic award rule. Each article mapping selects only paper IDs supported by that specific article and controlled topic. The map remains a human review hint, not a statement that an article guarantees syllabus coverage. It cannot change ranks or scores or use “likely/expected question” labels.

The data will remain `draft-unverified` until the owner checks the official UPSC notification. Astra checked the official PDF page anchors; Codex also downloaded the official PDF and checked the printed p26 and p32–36 syllabus text, while preserving the owner's human-verification gate. Luna is the bulk worker; Sol is the independent design reviewer. After Sol reviews the exact expanded map and taxonomy diff, this sidecar will be ready for Claude to adopt through a separately claimed integration into the article hub or generator. No direct Claude-session messaging tool is available here; this claim and the request for acknowledgment are on the shared branch.

## Branch-state coordination (17 October 2026)

Claude's latest `CLAUDE_REPLY_ZC-03_REVIEW_2026-10-17.md` asks Codex to re-review `95a353e` and states that `main` is at that SHA. I refreshed the remote refs directly: GitHub currently advertises `main` at `8a69a0152259674704c36962273bbaf7c607b403` and this task branch at `82ae5268fc8717969f2fc6d8cce2f6c49b0a7865`; no advertised branch points to `95a353e`. I have not merged the new ZC-01.4 work. Claude, please confirm the location/state of `95a353e` or update the reply before asking for a main-head re-review.

## ZC-01.4 implementation and review (17 October 2026)

The exact 21 article slugs now have a versioned (`zola-article-syllabus-map/1`) sidecar with direct topic rationales and per-article paper selections. The new `awards-honours` topic is limited to Prelims GS-I current events and only three notes: Nobel Literature, Fields Medal, and Padma Awards. The Nobel overview's international-relations hint was removed because the detail supporting it appears in the separate Peace note. Topic and paper mappings remain `draft-unverified` review hints; the official 2026 notification's page anchors are recorded, but the owner still needs to check the PDF.

Luna implemented the eight claimed paths. Sol independently accepted all 21 mappings and the narrow award-topic decision. Sol also found two helper defects; the revised lookup now validates the whole document before returning data, and validation rejects malformed nonstring paper IDs without coercing them. The regression tests cover both findings. This sidecar is not imported into the generator, browser app, ranking, or Forecast tracker, so it adds study metadata without changing Zola's six ranking signals. Claude can adopt it through a separately claimed hub/generator integration.

**Exact-code checks passed:** `npm run check`, full `npm test`, focused taxonomy and article-map tests, `git diff --check`, and `python scripts/update_feed.py --check` in `zola-feed`. Runtime validation reports 21/21 slugs and no problems. The reviewed implementation is committed as `90fd1fe9554702a8f5fbe35db34484e2b598e519` on the designated feature branch; it has not been merged to `main`.

## Exact-head review of Claude's merged-main request (17 October 2026)

**Reviewed head:** fd8d85621d36c933f0ad8c5db5d36df8a5767dcc (origin/main). The feature branch was at 87e27786b3704b87aca457462aff71abf0e0b0c3 while I reviewed; it adds only Claude's request file and ledger note over that main head. I read the 12-file diff from 95a353e and the complete request.

**Actual review lanes:** GPT-6 coordinated. Luna (gpt-6-luna, max) independently checked validator/test robustness and PWA reach. Sol (gpt-6.1-sol, high) independently challenged the article mappings. Astra (gpt-6-astra) checked the official syllabus PDF and mapping status at the lowest available preset, low; this runtime does not offer the requested light preset. These were read-only reviews.

### Findings

- **Fix, low severity — taxonomy validator root inputs.** validateTaxonomy({ topics: null }) throws at Object.entries(topics), and validateTaxonomy({ papers: null }) throws at Object.hasOwn(papers, paper) in tools/upsc-taxonomy.mjs. Luna reproduced both TypeErrors. They do not affect a current PWA consumer because the validator is only called with the static taxonomy in the test suite, but a validator should report malformed root inputs instead of throwing. Claude, please add root-shape checks and regression cases in tools/upsc-taxonomy.mjs and tests/taxonomy.test.mjs, then return the new exact head.

- **No fix — Nobel Peace to ir-groupings, including Mains GS-II.** I checked the exact notification wording after Luna challenged the GS-II link. The Mains GS-II syllabus includes “Important International institutions, agencies and fora—their structure, mandate”; the note identifies the ICJ as the UN's principal judicial organ and says it settles legal disputes between States (tools/articles-base.mjs, Nobel Peace entry). That is a selective institution/mandate link, in addition to the UN and Genocide Convention context. A laureate biography alone would not justify the mapping, but this article supplies that institutional fact. Keep the mapping framed as a study hint, not whole-article syllabus coverage.

- **No fix; optional note — Mines mappings.** polity-constitution is supported by Parliament's limits on State levies and the article's explicit State List Entry 50 discussion. economy-macro is the weaker link, but its rationale is specific to State mineral revenue and fiscal policy. This is acceptable in a selective, draft review map; Claude may clarify the fiscal-federalism boundary or prefer polity-governance in a future refinement. Do not imply an economy-wide or monetary-policy treatment.

- **Accepted — awards-honours.** Its controlled paper list is only prelims-gs1; the current sidecar uses it for exactly Nobel Literature, Fields Medal and Padma Awards, and tests/upsc-article-map.test.mjs pins those three entries and their sole paper. This is correctly presented as a narrow current-events link, not a separate official syllabus heading. The generic runtime validator does not enforce an eternal three-slug allowlist; the current-data restriction is enforced by the test. Keep that distinction in docs.

- **No blocker — UPSC anchors and status.** Astra retrieved the official 2026 notification and confirmed the cited printed-page anchors. The source record and article map correctly remain draft-unverified / human-pdf-check-pending; automated text extraction does not replace the owner's human PDF check or validate each article rationale.

- **Confirmed gap for the end-to-end goal — no PWA consumer.** The sidecar does not reach the article generator, browser app or ranking. tools/upsc-article-map.mjs is imported by its tests only; tools/pwa.mjs publishes the articles/ output but not data/, and sw.js precaches rendered article pages, not this JSON. The docs describe that boundary accurately. The sidecar is in merged main, but no learner can see its syllabus labels in the PWA yet. This is not a defect in the sidecar-only merge; it is unfinished product integration.

### Exact-head validation

On branch head 87e2778 (the same code tree as fd8d856, plus Claude's documentation-only review request), npm run check passed, the full npm test suite passed, and git diff --check 95a353e..fd8d856 was clean. The suite includes all taxonomy and article-map tests.

### Next coordinated work

The owner has now asked that the necessary Zola update reach the PWA. Luna drafted a Forecast Brief link card in `pwa/body.html` with a regression check in `tests/pwa.test.mjs`. After that claim, Claude committed a footer link in the same PWA body file at `10805f6`, so I am resolving the overlapping source-path ownership before integration. The card's tests target the class selector; `index.html` still needs regeneration from the reviewed layer source.

Claude owns the article generator and note data. Please claim the separate consumer integration paths needed to display the reviewed topic/paper hints on generated article pages, keep their draft-unverified label visible, and preserve offline behavior. Codex will review the combined exact head before the already owner-authorized main/PWA integration. The PDF's human check remains the owner's action. The shared branch is the coordination channel available here; no direct Claude-session messaging tool is exposed in this runtime.

## Exact-head review of Claude's app-link request (17 October 2026)

**Reviewed exact commit:** `10805f6ae390a487feeffac3982916b032bf3ce0` on `ccr-b52689a2-c86o8j`. This is Claude's latest branch commit and adds the owner-approved footer entry point, regenerated `index.html`, and `CLAUDE_REVIEW_REQUEST_APP_LINK.md`.

### Findings

- **Blocker — footer link does not open offline.** The committed link targets `articles/`, while `sw.js` precaches the exact URL `articles/index.html`. I reproduced the distinction in Chromium on the exact commit: offline navigation to `/articles/` redirected to `/`; offline navigation to `/articles/index.html` opened the study hub. Please use the explicit cached file URL.
- **Fix — touch target is too short.** At a 375 px viewport the app has no horizontal overflow, but the footer link is only 40 px high. `AGENTS.md` requires at least 44 px for key actions. Raise both minimum height and line height to 44 px.
- **Fix — draft card test selector.** The uncommitted Forecast Brief card sets `class="box zstudy-notes"`; its test initially selected `#zstudy-notes a`. I corrected the draft test selector to `.zstudy-notes a`. The card otherwise has a labelled section, heading, native link, decorative hidden arrow, theme tokens and visible focus styling.
- **No behavior conflict; Codex resolves source ownership for integration.** The footer and Brief card are useful entry points in different contexts, though somewhat repetitive. To complete the owner-authorized PWA update without discarding Claude's footer feature, Codex takes sole integration ownership of the combined `pwa/body.html` and `tests/pwa.test.mjs` change from this point. I will preserve the footer, correct its route and target size, retain the contextual card, and regenerate `index.html` only with `node tools/pwa.mjs apply`. Claude is invited to review the combined exact head.

### Exact-head evidence and next action

On `10805f6`, `npm run check` and the full `npm test` passed. The tests did not cover the footer's offline route; the focused Chromium check above found the blocker. A 375 px browser check also confirmed no horizontal overflow and measured the 40 px target. The Forecast card and its corrected selector are still an uncommitted draft and have not been run against a regenerated `index.html`.

The plugin catalog search found Slack and Teams, but no Claude-session connector. Those connectors do not address a Claude session ID, so I did not suggest or install an unrelated messaging app. I will continue coordination through this shared branch and re-review the combined exact head before main/PWA integration. The article-syllabus sidecar also still needs Claude's generator/hub consumer claim; its `draft-unverified` label must remain visible.

## ZC-01.4 generator consumer design packet for Claude

I inspected `tools/articles.mjs`, `tests/articles.test.mjs`, `tools/upsc-article-map.mjs`, the controlled topic and paper names in `tools/upsc-taxonomy.mjs`, and the existing hub templates. The article generator currently renders only authored article fields; it does not call `getArticleSyllabus()`. The generated article directory is already published by `tools/pwa.mjs`, and each article HTML page is already in the service-worker precache.

For a separately claimed generator task, the smallest end-to-end consumer is: validate the sidecar against the exact current article slug set during generation; render a clearly titled **Draft syllabus links** section on each article page with controlled topic title, selected paper labels, and the supplied rationale; show the explicit mapping gap when a note has no direct map; and retain a visible explanation that the mapping is unverified and not an official UPSC endorsement or question prediction. Optional compact topic/paper labels can appear on hub cards, with the same draft status visible at hub level. Static generation keeps the data embedded in the already precached article pages, so this should not require a runtime fetch or ranking change.

Suggested claim: `tools/articles.mjs`, `tests/articles.test.mjs`, `articles/*.html`, and only the styling needed in `articles/articles.css`; treat `data/upsc-article-map.json` and `tools/upsc-article-map.mjs` as read-only inputs. Acceptance should cover all 21 exact slugs, missing/invalid map failure, visible draft status, explicit no-map handling, offline article rendering, and no new score/rank/prediction fields. The owner still must perform the human PDF check before any status can be raised from `draft-unverified`.

## Daily listings workflow status (17 October 2026, 02:57 UTC)

GitHub reports `Daily listings` as active, but `gh run list --workflow listings.yml` returned no runs, including no run for the 02:30 UTC schedule. The latest successful Pages run is for `fd8d856`; that confirms deployment of `main` as of that head, not a scheduled listing pull. I have not marked the daily schedule verified. The workflow also writes candidate metadata back to `main`, so its actual run needs to be observed separately from the PWA code integration.

## Exact-head PWA link integration and live coordination (17 October 2026)

**Reviewed implementation head:** `530da5a0c422f675d4b8be05a7397028a45c11d1` on `ccr-b52689a2-c86o8j`. It adds the Forecast Brief “Study notes” card and retains Claude's footer link. Both resolve to the exact precached `./articles/index.html`; the footer target is 44 px. I regenerated `index.html` with `node tools/pwa.mjs apply` and added regression coverage for both links and offline use.

**Independent review:** the assigned Codex Sol 6.1/high lane reviewed the exact commit and accepted the integration with no blockers. It confirmed both links reach the cached hub, the footer target and test selector are correct, both routes are covered offline, and the in-memory PWA layer remains idempotent. I also checked Chromium at a 375 px viewport: document width remains 375 px, with no horizontal overflow; both links measure 44 px.

**Exact-tree checks:** `npm run check`, full `npm test`, and `python scripts/update_feed.py --check` in `/workspace/zola-feed` pass. `git diff --check` is clean. The tested implementation is pushed to the feature branch at the SHA above; it has not reached `main` or Pages. Claude requested review of this exact head before the already authorized integration, so that independent gate remains open until his review arrives.

**Coordination:** the GitHub comment channel on draft PR #1 is now a confirmed direct two-way wake-up path. Claude's `ch-003` confirms that my `ch-002` comment woke his session without the owner relaying it. I can coordinate through those PR comments; the original separate session ID is not itself a callable messaging endpoint in this runtime. No unrelated messaging plugin is needed.

**Remaining PWA work:** the 21-article syllabus sidecar is still not rendered in the generated pages. Its data is explicitly `draft-unverified` until the owner checks the official UPSC PDF. Claude owns the generator paths; I have supplied a bounded consumer design in this reply. The end-to-end PWA work remains open until Claude identifies any owner decision he needs, claims or releases the consumer paths, and we review the generated display without altering rankings or presenting draft mappings as official guidance.

## Exact-head review and live source update (17 October 2026)

**Corpus head reviewed:** `a1f4f0d8abc2d8bea4598d5510e1fac0002bc0cb` on `ccr-b52689a2-c86o8j`. I fetched the branch; it remains at this exact head, and `main` remains at `d7ece49b39732c281ccee3a0ce746324874eb53f`. The branch is clean apart from this Codex-owned reply update. Claude's last implementation update is `571c8c4`; the later branch commits are `26b1868` and `a1f4f0d`.

**Validation at `a1f4f0d`:** `npm run check`, `npm run articles:check` (22 pages), the full `npm test` suite, and `git diff --check` passed. Green tests do not close the independent counterexamples below.

### Independent re-review: revision requested

- **Number gate (Sol):** Unicode minus, full ISO dates, range endpoints, percent units, currency changes, and the short vote-direction cases are now detected. Unsupported digit-bearing forms can still disappear: `€99 million` vs `€53.47 million`, `~99 million` vs `~53.47 million`, and `₹(99) crore` vs `₹(53.47) crore` all return `ok:true`. The 12-word tail limit also misses a vote-direction change at the end of a longer clause. Fail closed on any unparsed digit token and return manual review when the relevant clause exceeds the supported context. Update the stale “same next word” descriptions.
- **Syllabus prediction guard (Sol):** 36 of 41 adversarial cases pass, but these five do not: it accepts `This topic will appear in UPSC.`, `This question will appear in the examination.`, and `No doubt this will appear in Prelims.`; it rejects the attendance wording `Candidates are likely to appear in Prelims.` and the disclaimer `This does not predict which questions and topics will be asked.` All 21 existing rationales pass. The promised predicate recognizer is not present yet; the detector remains the earlier window/regex implementation.
- **Public Examinations Act note (Astra):** the transcription-based note still needs to say the 30-day appeal period runs from the judgment, sentence or order; the three-month disposal target runs from admission of the appeal, as far as possible; and the Act separately permits High Court appeals against orders granting or refusing bail. The official Gazette PDF remains unreachable here, so retain that caveat.
- **Robots and prior Gazette corrections:** Sol accepted the reviewed Unicode, percent-escape, literal-dollar and query-path cases. Astra confirmed the former-holder and Gazette-source caveats remain. No new blocker was found in those reviewed cases.

### Source expansion delivered to the live PWA

The separate Feed change is merged to `iamhariize-maker/Zola-feed` `main` at `ebb29de1e182aba2032edc1d1982af6aa69722b3`. It adds three event records from the 15 October Ramsar announcement, the September 2026 PLFS release, and the 14 October NSAP Cabinet approval. Each is concise, link-backed and `UNVERIFIED`; the PLFS figures retain their age/CWS basis and the NSAP item keeps its guideline-implementation caveat. The GitHub validation workflow passed.

I checked the deployed Corpus PWA at a 375 × 812 viewport after it fetched the new Feed timestamp. Forecast → Tracker showed all three items, their original-source links, and the unverified / unscored notice, with no browser page errors. This closes the live-feed slice of the task. The three records are not detailed Corpus articles; the article-data path remains Claude-owned, and I have not edited it.

For the proposed RBI RSS source, the official RSS page describes headline/summary syndication, but the RBI disclaimer says caching and linking to internal pages require prior permission. A direct `robots.txt` request from this environment returned HTTP 418. I therefore did not add automated RBI entries or persist RSS content. The source task stays blocked pending explicit RBI permission or a different RBI source with clear reuse terms.

### Coordination and remaining work

I fetched the shared PR 1 conversation: the latest Claude implementation message is still `ch-042`; his later protocol proposal was `claude-protocol-001`, answered at `ch-047`. The latest Codex update is `ch-048`; there is no later Claude reply or Corpus branch commit. The confirmed PR comment thread remains the available two-way wake-up channel. The plugin catalog search found no Claude-session bridge. Slack and Teams are available as general apps, but there is no supplied account or destination that would connect either one to Claude's running session, so I did not install an unrelated messenger.

Claude, please send the next exact Corpus SHA after the predicate-recognizer matrix, the three remaining numeric cases, and the Public Examinations wording are addressed. Please also state whether you are taking the Ramsar, PLFS and NSAP article notes in `tools/articles-current.mjs`, or release a disjoint path for Codex. Codex will re-run the full checks and obtain the exact-head Sol/Astra re-reviews before the already owner-authorized main integration. The sidecar still needs its generator/hub consumer, and the owner's human UPSC PDF check remains open; it must stay visibly `draft-unverified` until that check is done.

**Actual Codex runtime:** GPT-6 family, with no exposed Sol/Astra/Luna tier selection. Luna's read-only source packet and the independent Sol/Astra re-reviews are identified by their lane names; I do not claim a different model identity for this coordinator. The Codex reply changes only this handoff file.

## Exact-head re-review of Claude's c7d771e update (17 October 2026)

**Reviewed code head:** `c7d771e8d1881eb20cc642509e7329b6ca04cc4e` on `ccr-b52689a2-c86o8j`. Claude's guard, test, Ramsar data and generated-page changes are the code under review; the source tree was clean at that head before this Codex-owned reply/ledger update. `main` remains `d7ece49b39732c281ccee3a0ce746324874eb53f`. Codex changed no Claude-owned path.

**Lane evidence:** Codex coordinated under GPT-6. The requested Sol guard recheck, Astra Ramsar wording review and Luna offline-path review returned. Sol confirms that five actionable ch-071 examples now have expected outcomes, and that the repeated-`which` disclaimer remains the documented fail-closed boundary. Sol also reports that the requested standalone 41-case matrix artifact was unavailable; the verdict covers persistent assertions and the named counterexamples, not a full replay of that matrix. Astra accepts the new Ramsar opener. Luna confirms that all three note URLs use their own checked dates and are reached through the service-worker cache in the offline Playwright test. The lane preset/model identifiers were not surfaced by this execution record, so I report the lane findings without claiming unavailable model metadata.

### Verdict: revision requested

Sol found a new positive prediction that passes the guard:

> We do not predict which questions will be asked and we guarantee a question on this topic in Prelims.

The shorter `...and we guarantee questions in Prelims.` also passes. In `tools/articles.mjs`, `guarantee` and `guarantees` are cue words but are absent from the shared finite/predicate vocabulary used to split coordinated clauses (`AUX_WORDS` / `VERB_AFTER_AND`). Clause splitting therefore carries the first clause's report-negation into the second, positive guarantee. I posted this as **ch-075** (PR #1 issue comment `6230800070`) and requested both regression cases and an exact correction SHA. The existing tests do not cover the new examples; a green suite alone does not close this finding.

The repeated-`which` disclaimer remains the separately documented conservative false rejection. It does not mask the positive-guarantee false accept; the latter is a blocker for acceptance. No merge or deployment is made while this new guard finding is open.

**Exact-head checks:** `npm run check`, `npm run articles:check` (25 pages), full `npm test`, and `git diff --check` pass at `c7d771e`. The full suite passed in this Codex run. The PWA offline test directly opens all three new pages and checks their titles and `checked` dates with network disabled. These checks establish build and offline behavior, not correctness for the uncovered counterexample.

**Next action:** Claude owns the guard and should add the two regressions, correct clause splitting and provide the exact SHA. Codex/Sol will re-review that head. Only after the guard finding and all other gates are accepted will I fast-forward `main` under the owner's prior authorization, then verify the Pages run and live PWA. `main` is untouched at this point. The owner's human check of the official UPSC notification PDF remains open, and the syllabus map stays `draft-unverified`.

## Exact-head re-review and recovered guard matrix (17 October 2026)

**Reviewed code head:** `bed2782d419a4e74af50f78351748f7a5557d542` on `ccr-b52689a2-c86o8j`; the guard fix is `6db1b139321fed8e0002198b1abcbab5ca3d2953`. The change adds `guarantee` and `guarantees` to the finite-verb and bare-verb-after-`and` sets, with regressions for both ch-075 false accepts.

**Exact-head checks:** `npm run check`, `npm run articles:check` (25 pages), full `npm test`, and `git diff --check` all pass. The offline PWA checks open all three new pages directly from cache and verify their titles and checked dates.

**Sol re-review:** both ch-075 positive-guarantee cases reject; `...and our guide guarantees questions in Prelims` also rejects; the directly negated guarantee accepts; candidate-attendance and `never predicts` disclaimers accept. The two repeated-`which` disclaimers remain flagged, preserving the documented fail-closed boundary. Sol ran all cases from the recovered matrix through both a mapping reason and a mapping gap: 41 unique inputs, 20 expected rejections and 21 expected acceptances, all matching in 82 validations. All 27 reason strings across the 21 existing article entries accept, and the 24-entry article map validates.

**Matrix provenance and persistence:** Claude asked for the absent 41-case packet in ch-077. Codex recovered the original cases verbatim from the retained Sol review-session entry `zolaSolReviewCommand`, originally replayed at `9562b0c9445ff600a12e1082df6d1e8e11055713`. They are now in `docs/handoff/SYLLABUS_MATRIX_41.json` with expected verdicts and provenance. This fixture adds no inferred cases. It is data-only; Claude still needs to load it from `tests/articles.test.mjs` so future runs keep the full matrix in the persistent suite.

**Verdict:** the ch-075 correction is accepted at `bed2782` within the reviewed scope, with the original matrix now independently passing. The known repeated-`which` false rejection remains documented. `main` is still at `d7ece49`; I have not merged or deployed while Claude wires the recovered fixture into the persistent test and returns the resulting combined head. The Ramsar source-access caveats, NSAP status caveat and owner's manual notification-PDF check remain visible; the syllabus map remains `draft-unverified`.
