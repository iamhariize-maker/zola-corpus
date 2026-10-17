// robots.txt reader: a subset of RFC 9309. Implemented: groups, our product token, "*" groups merged, "*" and "$" in
// paths, the longest matching rule wins (Allow wins a tie), and Crawl-delay. Not implemented: the Sitemap line
// (not needed) and percent-encoding normalisation (paths here are plain ASCII). Anything unclear is treated as blocked
// by the caller (see fetch.mjs).

export const TOKEN = 'zolapersonalstudy';

export function parseGroups(text = '') {
  const groups = [];
  let current = null;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'user-agent') {
      // Consecutive User-agent lines share one group. A User-agent line after rules starts a new group.
      if (!current || current.rulesStarted) {
        current = { agents: [], allow: [], disallow: [], crawlDelay: 0, rulesStarted: false };
        groups.push(current);
      }
      current.agents.push(val.toLowerCase());
    } else if (current && (key === 'allow' || key === 'disallow')) {
      current.rulesStarted = true;
      if (val !== '') current[key].push(val);
    } else if (current && key === 'crawl-delay') {
      current.rulesStarted = true;
      const n = Number(val);
      if (Number.isFinite(n) && n >= 0) current.crawlDelay = n;
    }
  }
  return groups;
}

// The rules that apply to our token: a group naming our token is used alone; otherwise all "*" groups are merged.
export function parseRobots(text = '', token = TOKEN) {
  const groups = parseGroups(text);
  const specific = groups.filter(g => g.agents.includes(token.toLowerCase()));
  const pick = specific.length ? specific : groups.filter(g => g.agents.includes('*'));
  const rules = { allow: [], disallow: [], crawlDelay: 0 };
  for (const g of pick) {
    rules.allow.push(...g.allow);
    rules.disallow.push(...g.disallow);
    rules.crawlDelay = Math.max(rules.crawlDelay, g.crawlDelay || 0);
  }
  return rules;
}

// Compile one robots path pattern. "*" matches any run of characters; a trailing "$" anchors the end.
export function patternToRegex(pattern) {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const src = body.split('*').map(s => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  return new RegExp('^' + src + (anchored ? '$' : ''));
}

// Specificity is the number of octets in the pattern itself, not the wildcard syntax (RFC 9309 section 2.2.2).
export function specificity(pattern) {
  return pattern.replace(/[*$]/g, '').length;
}

// True when the path (with its query, if any) may be fetched. The most specific matching pattern wins. Allow wins a tie.
export function allowed(rules, path) {
  let best = { len: -1, allow: true };
  for (const p of rules.disallow) {
    if (patternToRegex(p).test(path) && specificity(p) > best.len) best = { len: specificity(p), allow: false };
  }
  for (const p of rules.allow) {
    if (patternToRegex(p).test(path) && specificity(p) >= best.len) best = { len: specificity(p), allow: true };
  }
  return best.allow;
}
