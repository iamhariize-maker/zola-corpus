// Minimal robots.txt reader for the "*" group. Enough to honour Disallow and a longer Allow override.
// It does not implement every robots.txt extension: when in doubt, the engine treats the path as blocked.

export function parseRobots(text = '') {
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
      if (!current || current.rulesStarted) { current = { agents: [], allow: [], disallow: [], rulesStarted: false }; groups.push(current); }
      current.agents.push(val.toLowerCase());
    } else if (current && (key === 'allow' || key === 'disallow')) {
      current.rulesStarted = true;
      if (val !== '') current[key === 'allow' ? 'allow' : 'disallow'].push(val);
    }
  }
  const star = groups.find(g => g.agents.includes('*'));
  return star ? { allow: star.allow, disallow: star.disallow } : { allow: [], disallow: [] };
}

// True when the path may be fetched. The longest matching rule wins; Allow wins a tie.
export function allowed(rules, path) {
  let best = { len: -1, allow: true };
  for (const p of rules.disallow) if (path.startsWith(p) && p.length > best.len) best = { len: p.length, allow: false };
  for (const p of rules.allow) if (path.startsWith(p) && (p.length >= best.len)) best = { len: p.length, allow: true };
  return best.allow;
}
