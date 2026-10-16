# Codex GPT-6 source, fact and engine review: ZC-02

**Reviewed head:** `c8664740bebf90a3c29a0913d6a9b72a96e24c6f` on `ccr-b52689a2-c86o8j`
**Review date:** 16 October 2026
**Result:** Revision requested. This is a source review, not editorial approval to publish.

I reviewed the eight current-affairs notes and the 12 rewritten ZC-00 notes, the candidate source table and fetch path, the saved listing fixtures, and 30 candidate tags. Article, parser, engine and workflow files remain Claude-owned and were not edited. The one exception is the separately claimed metadata fixture cleanup recorded as ZC-02.X in the Codex reply and acceptance ledger.

## Task F — note review

### ZC-02.1: eight current-affairs notes

1. **RBI repo-rate note — `tools/articles-current.mjs:7–49`.** The note cites a generic RBI homepage and says the RBI statement was not read. The primary record is available: [RBI Monetary Policy Statement, 2026-27, press release 2026-2027/1264](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63742). It confirms the 63rd meeting (5–7 October), a unanimous 25 bps repo increase to 5.50%, SDF 5.25%, MSF/Bank Rate 5.75%, FY27 GDP projection 7.1% and CPI projection 5.2%. It also states that two members preferred to retain a neutral stance. Replace the generic RBI link with this release and delete the stale “RBI statement itself was not read” caveat. Make clear the repo-rate decision was unanimous while the stance change was not unanimous; the 4–2 description concerns the stance. The official minutes were scheduled for 21 October, after this review date.

2. **Public Examinations amendment — `tools/articles-current.mjs:54–93`.** The exact stale lines are “the PRS summary is cut off on that point” (line 70) and “Confirm the status … before you write it as passed” (line 87). PIB says the measure passed both Houses and received Presidential assent ([PIB release 2298901](https://pib.gov.in/PressReleasePage.aspx?PRID=2298901), lines 29–31). The amending law is Act No. 10 of 2026, assented to 31 July; the Gazette record is [CG-DL-E-31072026-275035](https://egazette.gov.in/WriteReadData/2026/275035.pdf). Rewrite the note as the enacted amendment and use its enacted investigation provisions. Do not retain the bill-status caveat.

3. **Supreme Court judges amendment — `tools/articles-current.mjs:96–132`.** The line “It does not say whether the bill has been passed by both Houses” (line 127) is stale. PIB lists the Bill as passed by both Houses (release 2298901, lines 25 and 96, 124, 148). The enacted Act is No. 14 of 2026, assented to 11 August and deemed in force from 16 May; its Gazette record is [CG-DL-E-11082026-275379](https://egazette.gov.in/WriteReadData/2026/275379.pdf). Replace the unresolved status with the Act’s status and add the Gazette text as the primary source.

4. **Tribunals Reforms — `tools/articles-current.mjs:135–172`.** The note still calls the instrument a Bill and says later status is not covered (lines 138, 150, 156, 167). The official Lok Sabha tracker records Act 17 of 2026 and assent on 13 August ([Digital Sansad bill tracker](https://sansad.in/ls/legislation/bills)). All provisions commenced on 25 August under Gazette notification S.O. 4713(E), [CG-DL-E-25082026-275749](https://egazette.gov.in/WriteReadData/2026/275749.pdf). Rename/recast the note as the Tribunals Reforms Act, cite the Act and commencement notification, and remove the status caveat. At line 143, “or related fields” is broader than the Bill’s technical-member fields; use the Act’s exact list. The qualifications should describe judges who “have been” judges, not imply that they must still hold office.

5. **Mines and Minerals amendment — `tools/articles-current.mjs:175–213`.** Lines 177–190 present the measure as a Bill and say it “would limit” State taxation. The enacted Act is No. 20 of 2026, assented to 17 August; the official Sansad tracker records the status and Act number. Its Gazette record is [CG-DL-E-17082026-275519](https://egazette.gov.in/WriteReadData/2026/275519.pdf). The Act took effect on 22 August under [CG-DL-E-22082026-275676](https://egazette.gov.in/WriteReadData/2026/275676.pdf). Recast the note around the enacted section 9D: specified State levies on mineral rights or mineral-bearing lands that were not deposited/recovered before commencement are invalid; already deposited/recovered sums are not refundable. Keep the Article 14 point identified as PRS analysis, not a statutory finding.

6. **INS Samarthak — `tools/articles-current.mjs:216–254`.** No mismatch found in the checked commissioning, builder, indigenous-content, modular-build, presiding-official or vessel-purpose claims against [PIB release 2324581](https://pib.gov.in/PressReleasePage.aspx?PRID=2324581). The existing caveat correctly excludes displacement and length because the cited PIB page does not give them.

7. **CAQM PTZ order — `tools/articles-current.mjs:259–295`.** The coverage and superseded-order claims match [PIB release 2324557](https://pib.gov.in/PressReleasePage.aspx?PRID=2324557). Its headline gives a 30 November 2026 installation deadline, which the note omits. Add it only after reading the CAQM direction and cite that direction for deadline, camera placement and streaming details; PIB alone is a secondary description of the order.

8. **PMAY-U 2.0 — `tools/articles-current.mjs:298–329`.** The 1.93 lakh and 20.80 lakh sanction figures, meeting date and this round’s BLC/AHP approvals match [PIB release 2324593](https://pib.gov.in/PressReleasePage.aspx?PRID=2324593). The exact overbroad line is at 314: “For PMAY-U 2.0 the target group is urban EWS families, and the two verticals are BLC and AHP.” That describes this meeting’s approvals as if they were the whole scheme. Narrow it to “At this meeting, the approvals were for EWS families under BLC and AHP.” Add the scheme-wide eligible groups and all four verticals only from a primary scheme guideline.

### ZC-00.2/.3: 12 rewritten notes

The 12 rewritten slugs are `nobel-2026-at-a-glance`, six Nobel subject notes, `fields-medal-2026`, `artemis-ii-2026`, `ai-impact-summit-2026`, `union-budget-2026-27`, and `padma-awards-2026`.

The corrected changed claims for Soai/Kagan ages, Hong Wang’s field, the AI declaration’s 92 endorsers and 18–19 February dates, separate Biopharma SHAKTI and Semiconductor Mission 2.0 initiatives, and the three Padma categories are present. The IMU page confirms Hong Wang’s field; PIB release 2231208 confirms the AI dates/count; the MHA list supports the Padma count. The live web reader returned 403 for several Nobel pages in this pass; I do not claim to have independently re-verified every Nobel fact or background paragraph at this exact head.

9. **Peace — `tools/articles-base.mjs:226–267`.** The exact unresolved text at lines 232 and 258 says the ICJ role was not confirmed. The [UN biography](https://www.un.org/en/about-us/nobel-peace-prize/navi-pillay-2026) identifies Pillay as a judge ad hoc at the ICJ in *The Gambia v. Myanmar* under the Genocide Convention. Replace both caveats with that precise role; do not describe her as a permanent ICJ judge. Add the UN page to the article’s sources.

10. **Artemis II — `tools/articles-base.mjs:341–379`.** Line 349 gives closest approach as “about 4,066 miles”; line 363 says reports disagree whether splashdown was 10 or 11 April and asks the reader to check NASA. NASA’s [mission page](https://www.nasa.gov/mission/artemis-ii/) gives the launch and splashdown dates; its [post-mission account](https://www.nasa.gov/blogs/missions/2026/04/11/artemis-ii-astronauts-back-in-houston-reunite-with-families/) records 4,067 miles above the lunar surface and 252,756 miles from Earth. Change 4,066 to 4,067, use the official April 10 splashdown date, and remove the contradictory “reports disagree” caveats. Keep the separate 8-second correction-burn fact, supported by the cited NASA flight-day report.

The remaining ZC-00 notes preserve the previously reviewed corrections. The accessible primary pages used in that review support the Fields Medal citation, AI summit figures, budget initiative split and Padma totals. I found no new mismatch in those changed claims. This review does not certify the uncited background passages or independently validate every secondary-source biographical detail.

## Task C — listing-engine design challenge

### P0 — Bar & Bench body is fetched and committed

`tests/fixtures/listings/barandbench-feed.xml` was 32,849 bytes and contained a full Bar & Bench article inside `<content:encoded>`. The parser extracts only title/link/date, but `fetchListing()` downloads the full response into memory before parsing. Thus the source claim “No article bodies are fetched or stored” is false for this feed, even though candidate JSON only contains metadata. The source is marked `link-only`, and the saved fixture contradicts both `docs/SOURCES-ZC-02.md` and the project rule “no full text of news articles, no reworded copies.”

Codex claimed and sanitized only this unclaimed fixture path, replacing article content with a synthetic marker while preserving metadata needed by the parser. The current file is 6,595 bytes, down from 32,849. That removes the body from the current tree but does not fix the live full-body response. The prior commit `c866474` still retains the full body in Git history. The protocol prohibits history rewriting, so this cleanup does not purge that old object. **Do not run Bar & Bench as an active source until it offers a metadata-only endpoint or the source is removed from the daily fetch.** A link-only license label does not make a full-body fetch metadata-only.

### P1 — robots rules can be under-enforced

In `tools/listings/robots.mjs:14–23`, the parser takes only the first `User-agent: *` group; it neither merges duplicate matching groups nor evaluates groups for the actual `ZolaPersonalStudy` agent. RFC 9309 says matching groups are combined and the most-specific matching product token is used. This concrete case is mishandled: a `User-agent: *` group allows `/`, followed by a second `User-agent: *` group disallowing `/private/`; the current parser permits `/private/`. A `User-agent: ZolaPersonalStudy` restriction is ignored too. Add tests for duplicate and product-specific groups, then implement matching/merge behavior or stop fetch when the rules cannot be interpreted safely.

### P1 — redirects bypass the checked host’s rules

`tools/listings/fetch.mjs:10, 17–40` uses `curl -L`, but checks robots for only the original URL before following redirects. A redirect to another host can therefore fetch a path without checking that host’s robots policy. Capture the final URL, re-check host allowlisting and robots rules, and refuse a cross-host redirect unless that target is explicitly configured.

### P1 — a partial source outage leaves CI green

`tools/fetch-listings.mjs:78–92` records a per-source failure but exits successfully whenever any single source has items. A four-source run with three failed sources remains green in GitHub Actions. Per-source status in JSON helps after the fact, but does not make a green scheduled job a reliable outage signal. Fail or explicitly surface a partial-source error in the workflow summary, and decide whether a stale/empty source blocks publication of the candidate set.

### Contract and product gaps

- `reuse: "allowed"` in `tools/listings/sources.mjs` is a source-wide label. It does not encode what item/document, operation, attribution, exclusion or terms evidence the label covers. In particular, PIB’s policy excludes third-party material. Keep the metadata flag as a discovery hint; do not let it authorize article content.
- A similarity/token check can only flag a draft for review. It cannot establish legal permission, facts, attribution or factual relationships. Any future generation/publish path needs a human approval record tied to the exact draft and evidence revision.
- The daily workflow writes candidates, not study notes. There is no article refresh, per-note status evidence/check date, stale-note transition, or review/approval workflow wired to it. The 20 static notes plus a metadata feed are useful groundwork, not a complete UPSC dashboard.
- The Supreme Court route correctly keeps judgments (`type=j`) and excludes orders in the fixture. It covers only the homepage’s latest 25; longer history remains an owner decision.
- `.github/workflows/listings.yml` runs on the default branch’s daily schedule; it does not become active from this feature branch. Keep it inactive until the owner approves a merge to `main`.

## Task-tag audit

I sampled 30 of the 76 items with a Fisher–Yates shuffle using the LCG seed `20261016` (`state = 1664525 × state + 1013904223 mod 2^32`). **No clearly false-positive assigned tag was found in this sample.** The tagger’s “prefer no tag to a wrong tag” rule is working for the sampled titles. The current sample and assigned topics are recorded below; `[]` means the parser assigned no tag.

| Candidate ID | Assigned topic(s) |
|---|---|
| `pib:e51068edcf9d` | `polity-governance` |
| `sci-judgments:5785eb90620e` | `[]` |
| `sci-judgments:1b847a83fbac` | `[]` |
| `pib:7128588ec7d9` | `[]` |
| `pib:b039cce0b93e` | `[]` |
| `sci-judgments:ff924856b0e2` | `[]` |
| `pib:629167ca885f` | `[]` |
| `pib:253b6e2ebfd6` | `[]` |
| `prs-billtrack:b2fb3f436475` | `polity-governance` |
| `pib:bc4d07a40b37` | `[]` |
| `barandbench:60acb3de8751` | `[]` |
| `pib:76db8e98c905` | `science-health-biotech` |
| `prs-billtrack:36ea41573562` | `polity-governance` |
| `prs-billtrack:6d87a74ac012` | `polity-governance` |
| `prs-billtrack:5ecc1c1b61d4` | `polity-governance` |
| `prs-billtrack:0a275d8e2863` | `polity-governance` |
| `sci-judgments:5c294898e186` | `[]` |
| `prs-billtrack:011162feb9e0` | `polity-governance` |
| `sci-judgments:1cdd5a2ef7cb` | `[]` |
| `prs-billtrack:e7d23a419092` | `polity-governance` |
| `sci-judgments:2fc52e4451c6` | `[]` |
| `prs-billtrack:954a96cbae49` | `polity-governance` |
| `prs-billtrack:f9161ce03c43` | `polity-governance` |
| `prs-billtrack:322e4b792e58` | `polity-governance` |
| `prs-billtrack:066ed8c87535` | `polity-governance` |
| `pib:3f46b65f1b9e` | `[]` |
| `pib:6d3d9a64a65b` | `[]` |
| `sci-judgments:18745161775d` | `[]` |
| `barandbench:66d8e3e05dc3` | `[]` |
| `sci-judgments:a8b6b736e3e8` | `[]` |

Not counted as wrong assigned tags, but likely misses in this sample: the Central Armed Police Forces Bill lacks `security-defence`; the Tribunals Bill gets `polity-governance` but misses `polity-bodies` because the rule matches singular `tribunal`; the PM-AJAY title lacks `polity-governance`; the NHRC and Ustad Bismillah Khan award titles have no relevant body/culture topic; and MSME/taxation bills lack economy-domain hints. A controlled taxonomy can add those when it has enough context; avoid adding a broad rule that makes unrelated headlines falsely match.

## Protocol status and next owner

- Task F: **revision requested** on the listed bill/RBI/scheme/status corrections and the two ZC-00 factual updates.
- Task C: **revision requested** on full-body retrieval/fixture, robots groups, redirects and partial-source CI behavior.
- T3: **accepted for the stated latest-25 scope**, with the history limit still open for the owner.
- Tasks A/B/D/E and the formal Sol 6.1 review: **not claimed**. This runtime exposes GPT-6 but not the requested Luna, Sol or Astra tiers. The `zola-feed` remote also does not contain the named `ccr-b52689a2-c86o8j` branch; its existing work branch is `ccr-65126776-1twa3p`.
- No article or engine implementation was changed by this fact/design review. Re-run `npm run check`, `npm test`, and the available feed `--check` on the final exact head before pushing the reply.

## Exact-head re-review: `1866fe1` (16 October 2026)

I read Claude's `CLAUDE_REPLY_ZC-02_REVIEW_2026-10-16.md` and checked the resulting notes, engine and deployment at `1866fe1`. This section supersedes the earlier “revision requested” status only where Claude's fixes are present. It does not claim that inaccessible primary pages were independently verified.

### Task F — 20 notes

- **Eight current-affairs notes:** the RBI entry now links the exact release 2026-2027/1264 and distinguishes the unanimous repo-rate decision from the opposed stance change. The RBI page itself was not accessible through this review's browser, so I accept the corrected citation and wording with a retrieval limit. PIB's Monsoon Session release 2298901 confirms passage/assent for Public Examinations and passage of the Supreme Court judges bill replacing the ordinance. The Public Examinations, Supreme Court judges, Tribunals and Mines notes continue to label bill-introduced provisions and/or Gazette-derived Act dates as unverified where appropriate; I could not fetch the e-Gazette PDFs from this environment. Keep those caveats. INS Samarthak's commissioning details, builder and indigenous-content claims match the cited PIB release. PIB's CAQM release confirms the 30 November deadline and quoted coverage, but the CAQM direction itself remains unread. PIB's PMAY release supports the meeting figures, locations and EWS/BLC/AHP scope; the note now clearly limits the scope to that meeting.
- **12 rewritten ZC-00 notes:** the checked corrections remain in the current pages. The IMU's official 2026 Fields Medal page confirms all four winners and Hong Wang's field. PIB confirms the AI Summit dates, declaration, 92 endorsers and seven pillars; its Budget releases support the headline figures, and the MHA PDF is the source for the Padma totals. NASA's mission page directly confirms Artemis II's 1 April launch and 10 April splashdown; NASA's mission coverage confirms 4,067 miles and 252,756 miles. The Peace note now correctly limits Pillay's ICJ role to judge ad hoc in *The Gambia v. Myanmar*, with the UN biography cited, though the UN page returned 403 in this pass. Nobel Prize pages were not reachable through this review, so I do not give an article-by-article primary-source sign-off for the Nobel claims or uncited background passages.
- **Result:** the corrected claims are accepted with the stated source limits. The four Gazette-derived Act/date claims and the CAQM order details remain explicitly unverified; do not mark them fully verified until the primary documents are read.

### Constitution (131st Amendment) Bill source packet for Claude

The note is not present at `1866fe1`. These checked facts can guide Claude's draft; they do not replace his claim or his article review:

1. The Ministry of Parliamentary Affairs' [PIB session release 2253254](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253254&lang=2&reg=48), lines 45–46, says the Constitution (One Hundred and Thirty-First Amendment) Bill, the Union Territories Laws (Amendment) Bill and the Delimitation Bill were introduced in the third part of the Budget Session for women's reservation through delimitation. On the motion for consideration, the 131st Bill did not get the required Article 368(2) majority; no further action was taken, and the two dependent Bills were not proceeded with. State plainly that it did **not** become an Act and that the proposal did not change the Constitution.
2. The [Bill as introduced, Bill No. 107 of 2026](https://prsindia.org/files/bills_acts/bills_parliament/2026/Constitution_%28131st_Amendment%29_Bill%2C2026.pdf), is hosted by PRS. Its clauses amend Articles 55, 81, 82, 170, 330 and 332 and substitute Article 334A. Among the proposed changes, the Lok Sabha ceiling rises to 850 members: up to 815 from States and 35 from Union territories. It would let Parliament determine by law which published census figures are used for delimitation and link women's reservation to a delimitation exercise. Attribute all of these to the Bill *as introduced*.
3. Keep the companion Bill distinct. The [PRS summary](https://prsindia.org/files/bills_acts/bills_parliament/2026/Summary_Constitution_%28131st_A%29_Bill_2026.pdf) says the separate Delimitation Bill would use the latest census whose figures were published when the Commission is constituted, which it says would mean the 2011 Census for the next delimitation. Do not attribute that implementing rule to the Constitution Amendment Bill itself.
4. The Bill's clause 2 changes Article 55. Under the [official Constitution text, Article 368(2)](https://www.indiacode.nic.in/bitstream/123456789/19151/1/constitution_of_india.pdf), that means a bill that cleared both Houses would also need ratification by at least half of State legislatures before assent. Separately explain the special majority in each House: a majority of total membership and at least two-thirds of members present and voting. Since the Bill failed on consideration in Lok Sabha, it never reached State ratification. Avoid unsourced vote totals or partisan framing.
5. The [Sansad e-Library record](https://elibrary.sansad.in/items/50ee895c-e29c-4d40-bfa0-7f1f6212d8a8) is the official parliamentary record. The [PRS session wrap](https://prsindia.org/sessiontrack/budget-session-2026/session-wrap) is useful status context, but label it as PRS.

### Task C — exact-head engine review

- **Accepted fixes:** Bar & Bench is absent from active sources and current candidate data; the full-body fixture is gone from the tree, though commit `c866474` still retains the historic bytes. Robots groups for the exact product token and duplicate `*` groups are merged, each redirect hop checks the allowed host and that host's robots rules, and a partial/empty source makes the workflow fail after writing the per-source result. Candidate records still keep `fact_text: null`.
- **Revision requested before claiming full RFC 9309 coverage:** `allowed()` in `tools/listings/robots.mjs` compares paths with `startsWith`; it does not implement `*` or terminal `$` patterns. `parseRobots()` matches the agent group by exact token rather than the RFC's most-specific substring match. The live configured `sci.gov.in` and `prsindia.org` files use ordinary prefix paths, so this limitation was not observed to block those specific source paths. Either implement and test the remaining matching rules or describe the parser narrowly and block sources whose rules it cannot interpret.
- **Source-specific politeness gap:** the live `https://prsindia.org/robots.txt` fetched on 16 October 2026 says `Crawl-delay: 10`. The fetcher does not honor it: it can request `/billtrack` immediately after reading that robots file and only waits one second between sources. `Crawl-delay` is outside RFC 9309, but this source's published request should be respected or PRS should be disabled until it is.
- **Tag audit at current head:** `data/candidates/2026-10-16.json` has 72 items (SHA-256 `3494e1c736634d00749d2147711b5c6b22fc1d959568817e3d5202533064d6e7`). A reproducible Fisher–Yates sample of 30 using LCG seed `20261016` produced no clear false positive in the sampled items. A wider check of the same file found two likely false positives: `pib:d3370abf600b` (“INDIAN NAVY COMMISSIONS INS SAMARTHAK…”) receives `polity-bodies` because the rule matches the verb “commissions”; `sci-judgments:5af2e77fbd09` (“…LODHA HEALTHY CONSTRUCTIONS…”) receives `science-health-biotech` because a company name contains “Healthy”. It also found a missed `economy-macro` tag for `prs-billtrack:6d87a74ac012`, whose title spells out “Micro, Small and Medium Enterprises” rather than using “MSME”. Please narrow the keyword matches and test these exact titles.
- **Similarity and approval gate:** still open and absent from the repository. A similarity score may reject or flag excessive overlap; it cannot establish rights, attribution, factual accuracy or approval. Before automated drafting/publishing, bind a human approval to immutable hashes of the exact draft and source/evidence manifest, store the source-specific reuse basis and exclusions, and invalidate approval if either hash changes. Never use word shuffling or similarity thresholds to disguise copied prose.

### Integration evidence at `1866fe1`

`origin/main` and `origin/ccr-b52689a2-c86o8j` both pointed to `1866fe1` when checked. GitHub Actions run [38954518865](https://github.com/iamhariize-maker/zola-corpus/actions/runs/38954518865) completed successfully for that SHA, and the live [article hub](https://iamhariize-maker.github.io/zola-corpus/articles/index.html) returned the current Public Examinations, INS Samarthak and Artemis II entries. The daily listings workflow exists on `main`; its Actions API had no run yet at this check, so the first scheduled pull is pending.

## Exact-head re-review: `7aa0286` (16 October 2026)

I read Claude's [`CLAUDE_REPLY_ZC-03_2026-10-16.md`](CLAUDE_REPLY_ZC-03_2026-10-16.md), checked the new Constitution note and source-gate implementation, and ran the repository checks at this exact head. `npm run check` and the complete `npm test` suite pass. This is a design and fact review, not approval to merge: `origin/main` remains at `1866fe1`, while the feature branch is at `7aa0286`.

### Constitution (131st Amendment) note — revision requested

The note is now present, but three points need correction before acceptance:

1. **The 2011 census is attributed to the wrong Bill.** The note says the 131st Amendment Bill would use the latest published census, “which is the 2011 census.” The [PRS summary of the 131st Amendment Bill](https://prsindia.org/files/bills_acts/bills_parliament/2026/Summary_Constitution_%28131st_A%29_Bill_2026.pdf) says that Bill would let Parliament determine by law which census figures to use. It separately says the companion [Delimitation Bill](https://prsindia.org/files/bills_acts/bills_parliament/2026/Delimitation_Bill,_2026.pdf) would use the latest published census when the Commission is constituted, which PRS identified as the 2011 Census. Attribute the 2011 rule only to the companion Bill. The 131st Bill's Bill-as-introduced text is linked in PRS's [Bill page](https://prsindia.org/billtrack/the-constitution-131st-amendment-bill-2026).
2. **“Withdrawn” is not supported by the primary status record.** The Ministry of Parliamentary Affairs' [PIB release 2253254](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253254&lang=2&reg=48) says the 131st Bill did not obtain the required Article 368(2) majority on its motion for consideration, so no further action was taken; the two dependent Bills were “not proceeded further.” Replace the deck and fact line that call them withdrawn with that official wording. The [Lok Sabha e-Library record for 17 April](https://elibrary.sansad.in/search?f.dateIssued.max=2026&f.dateIssued.min=2021&f.dateIssuedDay=2026-04-17%2Cequals&f.members=Amit+Shah%2Cequals&f.members=Om+Birla%2Cequals&f.sessionnumber=VII%2Cequals&spc.page=1&view=table) labels the continued debate “not passed.”
3. **The exact division tally still lacks primary confirmation.** The note attributes 298 for, 230 against and 528 present and voting to LiveLaw and Vision IAS, and correctly admits those are secondary reports. The official PIB status confirms the required majority was not obtained, but does not supply a tally. The official e-Library entry confirms the Bill was not passed, but I did not retrieve an official division list with those numbers. Remove the tally or keep it explicitly marked as a secondary report; do not call it verified from Sansad. An official e-Library [record for the Bill's introduction on 16 April](https://elibrary.sansad.in/items/50ee895c-e29c-4d40-bfa0-7f1f6212d8a8) confirms the bill's parliamentary record.

The proposed 850-seat maximum (815 States and 35 Union territories) and proposal to let Parliament determine the census by law are supported by the Bill summary and text. Add a short Article 368 note that the Bill also changed Article 55 and would therefore require State ratification by at least half the States if it had cleared both Houses; the Bill failed earlier at consideration. The current Prelims section covers special majority but omits this ratification consequence. The Mains angle should link its 2011 population premise to the separate Delimitation Bill and cite the debate or clearly mark the observation as analysis.

### Source gates — revision requested

`tools/source-gates.mjs` is a useful set of pure checks, and all 27 current synthetic cases pass. The tests do not cover these concrete bypasses:

- **Combined check omits two claimed gates.** `checkDraft()` (lines 101–111) never calls `freshnessGate()` or `volumeGate()` and accepts no timestamp or source-count inputs. A draft can pass the combined check with a stale candidate file or a failed/silent source. The overall engine must call these gates with the real current and previous candidate metadata, or `checkDraft()` must be expanded so the claimed combined policy actually applies.
- **A source can silently disappear.** `volumeGate([], [{source: 'pib', status: 'ok', count: 20}])` returns `ok: true` because it loops only over current entries. Compare the union of current and previous source IDs and flag a missing current source.
- **A future file passes freshness.** `freshnessGate('2099-01-01T00:00:00Z', new Date('2026-10-16T00:00:00Z'))` returns `ok: true` with a large negative age. Reject timestamps later than the check time, allowing only a small explicit clock-skew tolerance if needed.
- **Short copied text passes similarity.** `similarityGate('India is a Union', 'India is a Union')` returns `ok: true`: there are no five-word shingles and the four-word run is below the 12-word limit. A shingle threshold cannot certify originality; add a short-text exact/near-exact rule and retain human review.
- **Numbers are not associated with their claims.** `numberGate('The Act starts in 1990 and ends in 2000.', 'The Act starts in 2000 and ends in 1990.')` passes because both tokens occur in both texts. Compare claim-value pairs or require fact-level review; token presence alone does not check a changed fact.
- **Approval identity is self-asserted.** A record with `approved_by: 'owner'`, `approved_at: 'not-a-date'`, and matching draft/evidence hashes passes `approvalGate()`. Hash matching catches later edits, but this pure function does not authenticate the signer, validate the timestamp, or prove an owner performed the approval. Bind the record to an authenticated approval action and validate its schema.
- **The reuse flag is not proof of rights.** `licenceGate({reuse: 'allowed', fact_text: 'copied source body'})` passes. That can be a trusted internal source-registry flag, but its source-specific permission basis and exclusions must be recorded and validated before it can enable reproduction. A candidate-supplied string alone is not that evidence. Also, `checkDraft()` skips the licence check entirely when `candidate` is absent.

The exact-hash check itself correctly rejects changes to the draft or evidence byte strings. However, the functions are not yet connected to any draft-generation or publication path, and a green similarity score is not a copyright clearance, accurate paraphrase, or human approval. Do not describe the implementation as a publication gate until those controls are integrated and the approval action is authenticated.

### Earlier 20-note fact review

The 20-note review at `1866fe1` remains accepted only with the source limits recorded above. I rechecked the new note against PIB and the PRS Bill summary. The e-Gazette PDF URLs for the four statute notes still returned HTTP 503 in this environment; the RBI page and UN biography were also not retrievable here. Those act-number, assent, commencement and section-specific claims remain caveated rather than independently signed off from their cited primary PDFs. The current ZC-02 notes retain their limits for the unread CAQM order and inaccessible Nobel pages.

### Checks and coordination

At `7aa0286`, `npm run check` passed and `npm test` passed all suites, including the 27 source-gate cases. `python3 scripts/update_feed.py --check` in the separate `zola-feed` worktree (`ccr-65126776-1twa3p`, `cd02b42`) also passed. The direct e-Gazette PDF requests returned HTTP 503, so that retrieval limit remains open. Claude's ZC-03 code stays on the feature branch pending the corrections above; no change to Claude-owned article or gate files was made in this review.
