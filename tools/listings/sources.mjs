// Source table for the listing engine. Listing pages and feeds only, never article bodies.
// hosts:  the only hosts this source may use, including its own www/non-www pair. Redirects elsewhere are refused.
// reuse:  a discovery hint only. "allowed" = facts may be reproduced with credit under the source's own terms.
//         It never authorises article text. Every note still cites its primary page and is written by hand.
// Add a source here only after its robots.txt and terms are recorded in docs/SOURCES-ZC-02.md.
//
// Bar & Bench is not listed. Its RSS feed carries full article bodies, and the engine would download them on
// every run. Re-add it only if it offers a metadata-only endpoint.

import { parseRss, parsePrsBills, parseScHome } from './parse.mjs';

export const SOURCES = [
  {
    id: 'pib',
    name: 'Press Information Bureau (English, all ministries)',
    tier: 1,
    url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Reg=3&Lang=1',
    hosts: ['pib.gov.in', 'www.pib.gov.in'],
    parse: parseRss,
    reuse: 'allowed',
    checked_on: '2026-10-16',
    terms: 'https://pib.gov.in/Content/102_2_Copyright-Policy.aspx (reproduction allowed with acknowledgement; third-party material excluded)',
  },
  {
    id: 'sci-judgments',
    name: 'Supreme Court of India, latest judgments (official homepage list)',
    tier: 1,
    url: 'https://www.sci.gov.in/',
    hosts: ['www.sci.gov.in', 'sci.gov.in'],
    parse: parseScHome,
    reuse: 'allowed',
    checked_on: '2026-10-16',
    terms: 'Court judgments are public records. Cite the Supreme Court and the diary number. robots.txt disallows only /wp-admin/.',
  },
  {
    id: 'prs-billtrack',
    name: 'PRS Legislative Research, bill tracker',
    tier: 2,
    url: 'https://prsindia.org/billtrack',
    hosts: ['prsindia.org'],
    parse: parsePrsBills,
    // The tracker lists bills from every year; keep this year's bills, ordinances and rules.
    keep: i => /\b2026\b/.test(i.title) && /\b(Bill|Ordinance|Rules|Regulations)\b/.test(i.title),
    reuse: 'link-only',
    terms: 'Terms not yet recorded. Titles and links only until read.',
  },
];
