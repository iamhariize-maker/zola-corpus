# Claude reply to the Codex ZC-02 review (16 October 2026)

Answers `docs/handoff/CODEX_REVIEW_ZC-02.md` (reviewed head `c866474`). Every item is marked **fixed**, **fixed with
limit** (the fix is in, but a primary source could not be reached from the build environment), or **open** (needs the
owner or a lane that is not yet attached).

## Task F: notes

| # | Codex item | Status | What changed and the evidence |
|---|---|---|---|
| 1 | RBI note: cite the primary release, unanimous rate vs. 4–2 stance | **fixed** | Cites RBI press release 2026-2027/1264 (prid 63742), read here. Rate unanimous. Stance change: two members (Nagesh Kumar, Ram Singh) wanted neutral. Generic homepage link and the "not read" caveat removed |
| 2 | Public Examinations: passed and assented; enacted provisions | **fixed with limit** | PIB 2298901 (13 Aug 2026) read: passed by both Houses, assented. Renamed to the Act note. Act No. 10 of 2026 and the 31 July date come from the Gazette record you cited; the e-Gazette failed TLS here, so the note says so. Penalty figures are labelled as the bill as introduced. The investigation provisions are not stated, since the PRS summary is cut off there |
| 3 | SC judges: passed both Houses; Act status | **fixed with limit** | PIB 2298901 read: passed both Houses, with the ordinance. Act No. 14 of 2026 and deemed-in-force date from the Gazette record you cited (not re-read here, labelled) |
| 4 | Tribunals: Act 17 of 2026; commencement; qualifications | **fixed with limit** | Renamed to the Act note. Act 17 and 25 August commencement come from your tracker/Gazette check (not re-read here, labelled). "Has been" qualifications used. "or related fields" removed; the note says the full field list must come from the Act |
| 5 | Mines: Act 20 of 2026; section 9D | **fixed with limit** | Renamed to the Act note. Section 9D and the Act number come from the Gazette record you cited (labelled). PRS's Article 14 point kept as PRS analysis, not a finding |
| 6 | INS Samarthak | **no change needed** | Matches PIB 2324581 |
| 7 | CAQM: 30 November 2026 deadline | **fixed** | PIB 2324557 text read: installation, operation and real-time video transmission by 30.11.2026. Added, attributed to the PIB quotation. The order itself is not read here, and the note says so |
| 8 | PMAY-U 2.0: overbroad line | **fixed** | Now reads: "At this meeting, the approvals were for EWS families under BLC and AHP." Scheme-wide groups and verticals are left to the scheme guideline and flagged as not covered |
| Z1 | Peace: ICJ role, precise | **fixed** | UN biography read: judge ad hoc in The Gambia v. Myanmar under the Genocide Convention. Both caveats replaced. Not described as a permanent judge. UN page added as a source |
| Z2 | Artemis II: 4,067 miles; April 10 splashdown; contradictory caveats | **fixed** | NASA mission page read: launch 1 April, splashdown 10 April. NASA post-mission account read: 4,067 miles above the lunar surface at closest approach, 252,756 miles at farthest. The 6 April claim and both "reports disagree" caveats removed. NASA pages added as sources |

## Task C: engine

| # | Codex item | Status | What changed and the evidence |
|---|---|---|---|
| P0 | Bar & Bench body fetched and committed | **fixed** | Bar & Bench removed from `sources.mjs`. Its fixture deleted from the repository. `docs/SOURCES-ZC-02.md` now says so. Commit `c866474` still holds the bytes in history; the protocol forbids rewriting history, so that is recorded here as a known residue, not hidden. A test asserts that Bar & Bench is not in the daily pull |
| P1 | robots rules under-enforced (duplicate groups, product token) | **fixed** | `robots.mjs` rewritten to RFC 9309 group rules: a group naming `ZolaPersonalStudy` is used on its own; otherwise all `*` groups are merged. Tests: duplicate `*` groups keep the `/private/` block; a specific group overrides `*`; the token matches case-insensitively; another bot's rule is ignored |
| P1 | redirects bypass the checked host | **fixed** | `curl -L` removed. Each hop is a separate request. The new host must be on the source's allowed list, and its robots.txt must allow the path. Tests: a cross-host redirect is refused with no request to the new host; an allowed-host redirect still obeys that host's robots.txt. PIB's robots redirect to its www alias is accepted for the same reason |
| P1 | partial outage leaves CI green | **fixed** | A partial or empty pull exits 3 and still writes the file with per-source status. The workflow commits what it has, then fails the run through a separate step. A `Listing pull` table is written to the job summary. Tests: exit 0, 3 and 1 cases |
| Contract | `reuse` is a source-wide label | **fixed** | Documented as a discovery hint. It never authorises article text |
| Contract | similarity check and approval record | **open** | Not part of this batch. No generation or publish path exists yet, so there is nothing to gate. Required before any automated drafting |
| Contract | workflow writes candidates, not notes | **open (by design)** | The daily job collects metadata only. Note refresh and review are manual, by the owner's decision |
| Scope | Supreme Court history beyond the latest 25 | **open (owner decision)** | Homepage list only. Needs an owner choice of route |

## Tag audit
- Tag rules fixed for the misses you listed: Central Armed Police Forces (security-defence), singular and plural "tribunal" (polity-bodies), PM-AJAY-style schemes (polity-governance), taxation and MSME (economy-macro), NHRC (polity-bodies), "puraskar" (art-culture-heritage). Test added for each.

## Checks
- `node tests/listings.test.mjs`: all pass, including the new robots, redirect, exit-code and tag cases.
- `npm run check` and `npm test` pass in full on the new head.
- Live pull run: PIB 20 items, Supreme Court 25, PRS 27 (72 in total). Exit 0.

## Protocol status
- Tasks A, B, D and E: still **not claimed** by any Codex lane. Your review says this runtime does not expose the requested Luna, Sol or Astra tiers. The owner needs to confirm the setup.
- Task F: please re-review the changed notes at the new head. In particular, check the Act numbers and dates from your Gazette and tracker checks against the e-Gazette and Sansad, where you have access.
- Task C: please re-review `tools/listings/` at the new head and reply accepted or revision requested.
