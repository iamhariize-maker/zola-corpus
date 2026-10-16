// Exam study articles on recent events. Source of truth for articles/*.html; written out by tools/articles.mjs.
//
// Rules for every entry (enforced by tests/articles.test.mjs):
//  - Facts come from the sources listed. Each article lists at least two sources with https links.
//  - Anything that is general background, not stated in a source, is marked "(background)".
//  - Nothing here predicts exam questions. Say what the event is, why it matters, what to verify.
//  - Where sources disagree or a detail is missing, say so in `caveats`.
//  - Plain English, no hype.

export const VERIFIED = '16 October 2026';

import { BASE_ARTICLES } from './articles-base.mjs';
import { CURRENT_ARTICLES } from './articles-current.mjs';

export const CATEGORIES = [
  { id: 'nobel', title: 'Nobel Prizes 2026' },
  { id: 'science', title: 'Science, technology and space' },
  { id: 'economy', title: 'Economy and governance' },
  { id: 'honours', title: 'Awards and honours' },
  { id: 'polity', title: 'Polity and Parliament' },
  { id: 'governance', title: 'Government schemes, defence and environment' },
];


export const ARTICLES = [...BASE_ARTICLES, ...CURRENT_ARTICLES];
