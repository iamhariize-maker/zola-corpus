# Sources for the listing engine (ZC-02)

Recorded 16 October 2026 and corrected after Codex's review (`docs/handoff/CODEX_REVIEW_ZC-02.md`). Each source was checked
for robots.txt and for its own terms before it was added to `tools/listings/sources.mjs`. The engine checks robots.txt
again on every run and skips any path it may not fetch.

| Source | Id | Tier | What the engine reads | Hosts allowed | robots.txt (read 16 Oct 2026) | Terms and reuse | Reuse flag |
|---|---|---|---|---|---|---|---|
| Press Information Bureau, English, all ministries | `pib` | 1 | RSS: title and link | `pib.gov.in`, `www.pib.gov.in` | Redirects to the www host. Followed, since it is the same site | PIB copyright policy: reproduction allowed without prior approval, with prominent acknowledgement; third-party material excluded (read through a search snippet; the page returned 403 to automated reading) | allowed (discovery hint) |
| Supreme Court of India, latest judgments | `sci-judgments` | 1 | Homepage links to `view-pdf` pages with `type=j`: case name, case number, order date. Interim orders are dropped | `www.sci.gov.in`, `sci.gov.in` | Allows everything except `/wp-admin/` (admin-ajax is allowed) | Public court records. Cite the Court and the diary number | allowed (discovery hint) |
| PRS Legislative Research, bill tracker | `prs-billtrack` | 2 | Bill titles and links, kept only if 2026 and a bill, ordinance or rules | `prsindia.org` | Disallows Drupal system folders only | Terms not read yet. Titles and links only | link-only |

**Dropped:** Bar & Bench. Its RSS feed carries full article bodies in `content:encoded`, and the engine would download
them on every run. The feed is not a metadata-only endpoint, so it is not used. A saved fixture containing that text was
also removed from the repository. The earlier commit `c866474` still holds the bytes in history. History is not rewritten
on this branch.

## What is not used, and why
- **Sansad (Lok Sabha and Rajya Sabha) bill pages**: the tracker renders on the client, so the listing has nothing to read. Bill status comes from PRS and the PIB session summary.
- **Gazette of India**: the e-Gazette host failed the TLS handshake from the build environment. Gazette facts are cited from the Codex review and marked as not re-read.
- **Cabinet decisions site**: not reachable from the build environment.
- **LiveLaw RSS**: the feed URL returned 404 or 500. Not used.
- **SC Observer RSS**: the feed was stale (newest item from 2022). Not used.
- **Indian Kanoon**: the site's terms on automated access have not been read. Not used. Ask the owner before adding it.
- **SCI search form on the judgments page**: needs a captcha and is case-number based. The homepage list covers the latest judgments.
- **RBI press releases**: no stable listing page is used. Individual releases are cited by PRID when a note needs one.

## Rules the engine follows
1. Listing pages and feeds only. No article bodies are fetched on purpose, and no feed body text is parsed.
2. Every hop of a request is checked: the host must be in the source's allowed list, and robots.txt for that host must allow the path. A redirect to any other host is refused without a request to that host. At most three redirects.
3. robots.txt rules follow RFC 9309 group rules. A group naming our product token (`ZolaPersonalStudy`) is used on its own. Otherwise every `User-agent: *` group is merged. A missing robots.txt (4xx) means no rules. Anything unreadable blocks the host.
4. One request at a time, a 30-second timeout, two retries with backoff on server errors, a one-second pause between sources, and a clear User-Agent.
5. A source that returns zero items is marked `empty`. The run exits with code 3 when any source failed or was empty, and the file is still written with the per-source status block. The workflow then fails visibly. Only when no source answers does the run exit 1 and write nothing.
6. Titles are stored as headlines. `fact_text` stays null until a person or Claude writes a note from the cited primary page.
7. The `reuse` field is a discovery hint. It never authorises article text. Every note is written by hand and cites its primary page.

## Schedule
`.github/workflows/listings.yml` runs daily at 08:00 IST and commits only `data/candidates/`. A partial or failed pull still commits what it has, then fails the run. GitHub runs scheduled workflows only from the default branch, so the schedule starts after the merge to `main`, which the owner has approved.
