// Source table for the listing engine. Only listing pages and feeds, never article bodies.
// reuse: "allowed" = the source's own terms or its public-record status allow reproducing facts with credit.
//        "link-only" = discovery only: store the headline and link, write our own facts with a citation.
// Add a source here only after its robots.txt and terms are recorded in docs/SOURCES-ZC-02.md.

import { parseRss, parsePrsBills, parseScHome } from './parse.mjs';

export const SOURCES = [
  {
    id: 'pib',
    name: 'Press Information Bureau (English, all ministries)',
    tier: 1,
    url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Reg=3&Lang=1',
    parse: parseRss,
    reuse: 'allowed',
    terms: 'https://pib.gov.in/Content/102_2_Copyright-Policy.aspx (reproduction allowed with acknowledgement; third-party material excluded)',
  },
  {
    id: 'sci-judgments',
    name: 'Supreme Court of India, latest judgments (official homepage list)',
    tier: 1,
    url: 'https://www.sci.gov.in/',
    parse: parseScHome,
    reuse: 'allowed',
    terms: 'Court judgments are public records. Cite the Supreme Court and the diary number. robots.txt disallows only /wp-admin/.',
  },
  {
    id: 'prs-billtrack',
    name: 'PRS Legislative Research, bill tracker',
    tier: 2,
    url: 'https://prsindia.org/billtrack',
    parse: parsePrsBills,
    // The tracker lists bills from every year; keep this year's bills, ordinances and rules.
    keep: i => /\b2026\b/.test(i.title) && /\b(Bill|Ordinance|Rules|Regulations)\b/.test(i.title),
    reuse: 'link-only',
    terms: 'Terms not yet recorded. Titles and links only until read.',
  },
  {
    id: 'barandbench',
    name: 'Bar & Bench (legal news, discovery only)',
    tier: 3,
    url: 'https://www.barandbench.com/feed',
    parse: parseRss,
    reuse: 'link-only',
    terms: 'News publisher. Headline, date and link only. No article text is stored.',
  },
];
