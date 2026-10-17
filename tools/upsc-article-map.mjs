// Article-to-syllabus sidecar. This module is metadata-only: it is not imported
// by the article generator, browser app, ranking, or tracker.
import { readFileSync } from 'node:fs';
import { ARTICLES } from './articles-data.mjs';
import {
  PAPERS,
  TAXONOMY_STATUS,
  TOPICS,
  UPSC_SYLLABUS_SOURCE,
} from './upsc-taxonomy.mjs';

const documentUrl = new URL('../data/upsc-article-map.json', import.meta.url);
export const ARTICLE_SYLLABUS_DOCUMENT = JSON.parse(readFileSync(documentUrl, 'utf8'));
export const ARTICLE_SYLLABUS_SCHEMA = 'zola-article-syllabus-map/1';
export const ARTICLE_SYLLABUS_STATUS = ARTICLE_SYLLABUS_DOCUMENT.status;
export const ARTICLE_SYLLABUS_SOURCE = ARTICLE_SYLLABUS_DOCUMENT.syllabus_source;
export const ARTICLE_SYLLABUS_MAP = ARTICLE_SYLLABUS_DOCUMENT.articles;

const hasOwn = (object, key) => Object.hasOwn(object, key);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const FORBIDDEN_ALGORITHM_FIELD = /(?:score|rank|weight|probability)/i;

function validateAllowedKeys(record, allowed, label, problems) {
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_ALGORITHM_FIELD.test(key)) {
      problems.push(`${label}: forbidden algorithm field ${key}`);
    } else if (!allowed.includes(key)) {
      problems.push(`${label}: unexpected field ${key}`);
    }
  }
}

/**
 * Validate the sidecar against the current article slug list and taxonomy.
 * Returns human-readable problems; malformed JSON-shaped input is reported,
 * not thrown. Each mapping selects a nonempty subset of its topic's papers.
 */
export function validateArticleSyllabusMap({
  articles = ARTICLES,
  document = ARTICLE_SYLLABUS_DOCUMENT,
  topics = TOPICS,
  papers = PAPERS,
} = {}) {
  const problems = [];
  if (!isRecord(document)) {
    return ['article syllabus document: must be an object'];
  }
  validateAllowedKeys(document, ['schema', 'status', 'syllabus_source', 'articles'], 'article syllabus document', problems);
  if (document.schema !== ARTICLE_SYLLABUS_SCHEMA) {
    problems.push(`article syllabus document: schema must be ${ARTICLE_SYLLABUS_SCHEMA}`);
  }
  if (document.status !== TAXONOMY_STATUS || document.status !== 'draft-unverified') {
    problems.push('article syllabus document: status must remain draft-unverified');
  }
  const topicMap = isRecord(topics) ? topics : Object.create(null);
  const paperMap = isRecord(papers) ? papers : Object.create(null);
  if (!isRecord(topics)) problems.push('taxonomy topics: must be an object');
  if (!isRecord(papers)) problems.push('taxonomy papers: must be an object');

  const source = document.syllabus_source;
  if (!isRecord(source)) {
    problems.push('syllabus source: must be an object');
  } else {
    validateAllowedKeys(source, ['title', 'notificationUrl', 'examinationPageUrl', 'status', 'printedPageAnchors'], 'syllabus source', problems);
    for (const field of ['title', 'notificationUrl', 'examinationPageUrl', 'status']) {
      if (source[field] !== UPSC_SYLLABUS_SOURCE[field]) {
        problems.push(`syllabus source: ${field} does not match the cited taxonomy source`);
      }
    }
    if (!isRecord(source.printedPageAnchors)) {
      problems.push('syllabus source: printedPageAnchors must be an object');
    } else {
      validateAllowedKeys(
        source.printedPageAnchors,
        Object.keys(UPSC_SYLLABUS_SOURCE.printedPageAnchors),
        'printedPageAnchors',
        problems,
      );
      for (const [paperId, anchor] of Object.entries(UPSC_SYLLABUS_SOURCE.printedPageAnchors)) {
        if (source.printedPageAnchors[paperId] !== anchor) {
          problems.push(`printedPageAnchors ${paperId}: does not match the cited taxonomy anchor`);
        }
      }
    }
  }

  if (!Array.isArray(articles)) {
    problems.push('article source: must be an array');
  }
  const articleSlugs = [];
  if (Array.isArray(articles)) {
    for (const article of articles) {
      if (!isRecord(article) || typeof article.slug !== 'string' || !article.slug) {
        problems.push('article source: each article must have a nonempty slug');
        continue;
      }
      articleSlugs.push(article.slug);
    }
  }
  if (new Set(articleSlugs).size !== articleSlugs.length) {
    problems.push('article source: duplicate slug');
  }

  const articleMap = document.articles;
  if (!isRecord(articleMap)) {
    problems.push('article map: must be an object');
    return problems;
  }
  const actualSlugs = Object.keys(articleMap);
  const missingSlugs = articleSlugs.filter(slug => !hasOwn(articleMap, slug));
  const extraSlugs = actualSlugs.filter(slug => !articleSlugs.includes(slug));
  if (missingSlugs.length || extraSlugs.length) {
    problems.push(`article map: slug set mismatch (missing: ${missingSlugs.join(', ') || 'none'}; extra: ${extraSlugs.join(', ') || 'none'})`);
  }

  for (const slug of actualSlugs) {
    const entry = articleMap[slug];
    const label = `article ${slug}`;
    if (!isRecord(entry)) {
      problems.push(`${label}: entry must be an object`);
      continue;
    }
    validateAllowedKeys(entry, ['mappings', 'mapping_gap'], label, problems);
    if (!Array.isArray(entry.mappings)) {
      problems.push(`${label}: mappings must be an array`);
      continue;
    }
    if (entry.mappings.length === 0) {
      if (typeof entry.mapping_gap !== 'string' || !entry.mapping_gap.trim()) {
        problems.push(`${label}: empty mappings require a nonempty mapping_gap`);
      }
    } else if (hasOwn(entry, 'mapping_gap')) {
      problems.push(`${label}: mapped records cannot also claim a whole-article mapping_gap`);
    }

    const seenTopics = new Set();
    for (const [index, mapping] of entry.mappings.entries()) {
      const mappingLabel = `${label} mapping ${index + 1}`;
      if (!isRecord(mapping)) {
        problems.push(`${mappingLabel}: must be an object`);
        continue;
      }
      validateAllowedKeys(mapping, ['topic', 'papers', 'reason'], mappingLabel, problems);
      if (typeof mapping.topic !== 'string' || !mapping.topic) {
        problems.push(`${mappingLabel}: topic must be a nonempty ID`);
      } else {
        if (seenTopics.has(mapping.topic)) problems.push(`${label}: duplicate topic ${mapping.topic}`);
        seenTopics.add(mapping.topic);
        if (!hasOwn(topicMap, mapping.topic)) {
          problems.push(`${mappingLabel}: unknown topic ${mapping.topic}`);
        }
      }
      if (typeof mapping.reason !== 'string' || !mapping.reason.trim()) {
        problems.push(`${mappingLabel}: reason must be nonempty`);
      }
      if (!Array.isArray(mapping.papers) || mapping.papers.length === 0) {
        problems.push(`${mappingLabel}: papers must be a nonempty array`);
      } else {
        if (new Set(mapping.papers).size !== mapping.papers.length) {
          problems.push(`${mappingLabel}: duplicate paper ID`);
        }
        for (const paperId of mapping.papers) {
          if (typeof paperId !== 'string') problems.push(`${mappingLabel}: paper IDs must be strings`);
          else if (!hasOwn(paperMap, paperId)) problems.push(`${mappingLabel}: unknown paper ${paperId}`);
        }
      }

      if (typeof mapping.topic === 'string' && hasOwn(topicMap, mapping.topic)) {
        const topic = topicMap[mapping.topic];
        if (!isRecord(topic) || !Array.isArray(topic.papers) || topic.papers.length === 0) {
          problems.push(`${mappingLabel}: taxonomy topic has no valid paper list`);
        } else if (!Array.isArray(mapping.papers) || !mapping.papers.every(paperId => topic.papers.includes(paperId))) {
          problems.push(`${mappingLabel}: papers must be a nonempty subset of topic ${mapping.topic}`);
        }
      }
    }
  }
  return problems;
}

/** Return a metadata-only view whose papers are derived from the controlled taxonomy. */
export function getArticleSyllabus(slug, {
  document = ARTICLE_SYLLABUS_DOCUMENT,
  topics = TOPICS,
  papers = PAPERS,
} = {}) {
  if (!isRecord(document) || !isRecord(document.articles)) return null;
  if (validateArticleSyllabusMap({ document, topics, papers }).length) return null;
  const articleMap = document.articles;
  const topicMap = isRecord(topics) ? topics : Object.create(null);
  const paperMap = isRecord(papers) ? papers : Object.create(null);
  if (typeof slug !== 'string' || !hasOwn(articleMap, slug)) return null;
  const entry = articleMap[slug];
  if (!isRecord(entry) || !Array.isArray(entry.mappings)) return null;

  const mappings = [];
  const paperIds = new Set();
  for (const mapping of entry.mappings) {
    if (!isRecord(mapping) || typeof mapping.topic !== 'string' || !hasOwn(topicMap, mapping.topic)) continue;
    const topic = topicMap[mapping.topic];
    if (!isRecord(topic) || !Array.isArray(topic.papers)) continue;
    const selectedPapers = Array.isArray(mapping.papers) ? mapping.papers : [];
    const derivedPapers = selectedPapers.filter(paperId =>
      typeof paperId === 'string' && hasOwn(paperMap, paperId) && topic.papers.includes(paperId));
    for (const paperId of derivedPapers) paperIds.add(paperId);
    mappings.push({
      topic: mapping.topic,
      papers: derivedPapers,
      reason: typeof mapping.reason === 'string' ? mapping.reason : '',
    });
  }
  return {
    slug,
    status: document.status,
    mappings,
    papers: Object.keys(paperMap).filter(paperId => paperIds.has(paperId)),
    mappingGap: typeof entry.mapping_gap === 'string' ? entry.mapping_gap : null,
  };
}
