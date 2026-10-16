// robots.txt reader (RFC 9309 group rules, simplified). Our crawler token is the product name below.
// Rules:
//  - A group whose User-agent equals our token (case-insensitive) is used, and only those groups.
//  - Otherwise every "User-agent: *" group is merged. Duplicate "*" groups are combined, not ignored.
//  - Longest matching rule wins; Allow wins a tie.
// Anything we cannot interpret is the caller's problem: fetch.mjs treats a missing or broken file conservatively.

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
        current = { agents: [], allow: [], disallow: [], rulesStarted: false };
        groups.push(current);
      }
      current.agents.push(val.toLowerCase());
    } else if (current && (key === 'allow' || key === 'disallow')) {
      current.rulesStarted = true;
      if (val !== '') current[key].push(val);
    }
  }
  return groups;
}

// The rules that apply to our token.
export function parseRobots(text = '', token = TOKEN) {
  const groups = parseGroups(text);
  const specific = groups.filter(g => g.agents.includes(token.toLowerCase()));
  const pick = specific.length ? specific : groups.filter(g => g.agents.includes('*'));
  const rules = { allow: [], disallow: [] };
  for (const g of pick) { rules.allow.push(...g.allow); rules.disallow.push(...g.disallow); }
  return rules;
}

// True when the path may be fetched. The longest matching rule wins; Allow wins a tie.
export function allowed(rules, path) {
  let best = { len: -1, allow: true };
  for (const p of rules.disallow) if (path.startsWith(p) && p.length > best.len) best = { len: p.length, allow: false };
  for (const p of rules.allow) if (path.startsWith(p) && p.length >= best.len) best = { len: p.length, allow: true };
  return best.allow;
}
