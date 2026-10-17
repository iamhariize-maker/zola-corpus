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
import { ARTICLES_OCT17 } from './articles-oct17-notes.mjs';

export const CATEGORIES = [
  { id: 'nobel', title: 'Nobel Prizes 2026' },
  { id: 'science', title: 'Science, technology and space' },
  { id: 'economy', title: 'Economy and governance' },
  { id: 'honours', title: 'Awards and honours' },
  { id: 'polity', title: 'Polity and Parliament' },
  { id: 'governance', title: 'Government schemes, defence and environment' },
];


// Review wording where a primary source could not be opened (Astra, ch-070): the page says what was confirmed and what
// stays unverified, instead of a blanket "checked against the sources below". Kept here so the note file keeps its author.
const REVIEW_NOTES = {
  'sukhna-wetland-sauj-jheel-ramsar-2026': 'PIB confirms the designations, locations and announced total of 103. Site numbers, ecological details and proposed management actions remain unverified; see caveats below.',
};

export const ARTICLES = [...BASE_ARTICLES, ...CURRENT_ARTICLES, ...ARTICLES_OCT17]
  .map(article => (REVIEW_NOTES[article.slug] ? { ...article, review: REVIEW_NOTES[article.slug] } : article));
