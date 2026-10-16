# Sources for the listing engine (ZC-02)

Recorded 16 October 2026. Each source was checked for robots.txt and for its own terms before it was added to
`tools/listings/sources.mjs`. The engine checks robots.txt again on every run and skips any path it may not fetch.

| Source | Id | Tier | What the engine reads | robots.txt (read 16 Oct 2026) | Terms and reuse | Reuse flag |
|---|---|---|---|---|---|---|
| Press Information Bureau, English, all ministries | `pib` | 1 | RSS feed `RssMain.aspx?ModId=6&Reg=3&Lang=1`: title and link | Redirects (301). Re-checked on each run | PIB copyright policy: reproduction allowed without prior approval, with prominent acknowledgement; third-party material excluded (search-snippet read; the page returned 403 to automated reading) | allowed |
| Supreme Court of India, latest judgments | `sci-judgments` | 1 | Homepage links to `view-pdf` pages with `type=j` (judgments only). Case name, case number, order date | Allows everything except `/wp-admin/` (admin-ajax is allowed) | Public court records. Cite the Court and the diary number | allowed |
| PRS Legislative Research, bill tracker | `prs-billtrack` | 2 | Bill tracker page: bill titles and links, kept if 2026 and a bill, ordinance or rules | Disallows Drupal system folders only (`/includes/`, `/misc/`, and similar) | Terms not read yet. Titles and links only | link-only |
| Bar & Bench, news | `barandbench` | 3 | RSS feed: headline, link and date | Allow all | News publisher. Headline, link and date only. No article text | link-only |

## What is not used, and why
- **Sansad (Lok Sabha and Rajya Sabha)**: not reachable from this environment (no response). Bill status comes from PRS for now.
- **Gazette of India**: not reachable (no response).
- **Cabinet decisions site**: not reachable (no response).
- **LiveLaw RSS**: the feed URL returned 404 or 500. Not used.
- **SC Observer RSS**: the feed was stale (newest item from 2022). Not used.
- **Indian Kanoon**: the search pages respond, but the site's terms on automated access were not read. Not used for bulk pulls. Ask the owner before adding it.
- **SCI search form on the judgments page**: needs a captcha and is case-number based. Not used. The homepage list covers the latest judgments.
- **RBI press releases**: the list page is dynamic, and the statement itself was not reachable in this check. Added later once a stable page is confirmed.

## Rules the engine follows
1. Listing pages and feeds only. No article bodies are fetched or stored.
2. One request per source per run, with a one-second pause between sources, a 30-second timeout and two retries.
3. A clear User-Agent (`ZolaPersonalStudy/1.0`).
4. robots.txt is read first, and a disallowed path is skipped. If robots.txt cannot be read (for example a server error), the host is treated as blocked.
5. A source that returns zero items is marked `empty`, and the run says so. A run with no source answering exits with a failure code.
6. Titles are stored as headlines (facts). `fact_text` stays null until a person or Claude writes a note from the cited primary page.

## Schedule
`.github/workflows/listings.yml` runs daily at 08:00 IST. It commits only `data/candidates/`. GitHub runs scheduled
workflows only from the default branch, so this does not start until the branch is merged to `main`. That merge needs
the owner's go-ahead.
