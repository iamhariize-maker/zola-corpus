# Source policy for the Zola current-affairs engine

Status: draft for owner decision (16 October 2026). Owner decisions are marked in the ledger.

## The position in one paragraph

The engine may use facts from any public source. It may copy text only from sources that allow reuse. It never
republishes a copyrighted news article, whether verbatim or reworded, and it never stores the full text of one. For
news outlets it keeps the headline, date, link and publisher, a one-line topic tag, and a short factual note written by
us that cites the link. Rewording an article while keeping its structure and facts does not remove the copyright in
it. It also breaks most sites' terms of use and invites takedowns. So the engine avoids that route rather than hiding it.

## Source classes

| Class | Examples | What the engine may store | Basis |
|---|---|---|---|
| A. Government primary | PIB releases, Gazette of India, Lok Sabha and Rajya Sabha question records, RBI press releases, ministry annual reports, Election Commission orders | Title, date, link, short facts with source, our own explanation | PIB policy: reproduction allowed with prominent acknowledgment, except third-party material. Confirm each source's own notice before bulk use |
| B. Courts | Supreme Court and High Court judgments, from the official portals | Case name, date, bench, link, our summary of the holding | Judgments are public documents; cite the court |
| C. Statistical and open data | Census, NSO, RBI data, World Bank (open licence), data.gov.in datasets | Numbers, with dataset name and licence | Check each dataset's licence on the portal |
| D. International organisations and reports | UN, WHO, IMF, UNDP, World Bank, Nobel Foundation, ICM, NASA | Title, date, link, short facts, our explanation; quote only short passages | Each site's terms; prefer the official press page |
| E. Quasi-official and think tanks | PRS Legislative Research, NITI Aayog, IDSA, ORF, Carnegie India | Title, date, link, our summary; no bulk text | Terms vary; ask the owner before any bulk use |
| F. Newspapers and magazines | The Hindu, Indian Express, Mint, Business Standard, Down To Earth, The Print | Headline, date, publisher, link, topic tag, our one-line factual note with the link | Copyright and terms of use; no full text, no rewording of articles |

Class F is link-only in practice. The engine sends students to the article. It never rebuilds the article.

## What we do with a news story

1. The engine finds the story from a feed or a listing page that allows it.
2. It stores: headline, publisher, date, link, and topic tags from our own keyword rules.
3. A human (the owner, or a worker under the ledger) writes one or two factual lines in our own words, using facts from
   the story and from class A to D sources where possible. The line cites the link.
4. Nothing from the article body is stored or shown. If the facts only exist in the article, the line says so.

## Hard rules

- No full text of class F articles in the repo, the feed, the app or the logs.
- No scraping where robots.txt or the terms forbid it. Check before adding a source. Record the check in the source table.
- No paywall bypass. No login scraping. No captchas.
- Identify the engine in the User-Agent and keep the request rate low (at most one request per source per run).
- Every item shows its publisher and link. Every article shows its sources.
- If a source asks to be removed, remove it within one run and log it.
- No predictions of exam questions. The engine tags topics; it does not rank likely questions.

## Why not reword

Two independent opinions (Sonnet and Opus, 16 October 2026, not legal advice) agree on this:

- Indian copyright protects expression, not facts. A close rewrite that keeps the structure, order and emphasis of an
  article can still be an infringing adaptation. Selection and arrangement can be protected too (the Supreme Court's
  Eastern Book Company v. Modak, 2008, is the usual reference; to be checked by a lawyer).
- Fair dealing for reporting current events is narrower than the US fair use idea. Do not rely on it for a study site
  that republishes rewritten articles.
- The bigger risk is practical: takedown notices to the host, the registrar and search engines, and scraping complaints.
- Machine rewriting also drifts factually, which hurts an exam product more than a takedown does.
- Pending AI and copyright cases in India (for example ANI v. OpenAI, Delhi High Court) may change the picture. Status
  not checked here.

Engineering consequence: the engine stores facts with citations and never the expression of a news story.

## Gates the engine must enforce

1. A source licence field on every item. Publish only when it says "allowed".
2. A similarity check on every generated line against its source (for example 5-gram overlap). Block above a set threshold.
   Cap any quotation length.
3. A number, date and name check: values in our line must appear in the cited source. A mismatch blocks the item.
4. A per-source daily count against a baseline, and a freshness alert (for example no PIB items in 24 hours).
5. A one-click unpublish and a removal log for any takedown request.

## Open decisions for the owner

1. Accept link-only plus our own factual lines for class F (recommended), or ask us to stop class F entirely.
2. Which class E sources (PRS, think tanks) can be used beyond links.
3. Whether to get a short legal opinion before publishing a large batch of news-derived notes.
   We are not lawyers. This document is an engineering policy, not legal advice.
