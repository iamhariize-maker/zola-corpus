// Polite fetcher: curl (already on the owner's machine and on GitHub runners), a clear User-Agent, a timeout,
// retries with backoff, and a robots.txt check before every request. Uses execFile with arguments, never a shell.
import { execFileSync } from 'node:child_process';
import { parseRobots, allowed } from './robots.mjs';

export const UA = 'ZolaPersonalStudy/1.0 (personal study app; contact: repo owner)';
const robotsCache = new Map();

function curl(url) {
  const out = execFileSync('curl', ['-sL', '--max-time', '30', '-A', UA, '-w', '\n%{http_code}', url], {
    encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  });
  const cut = out.lastIndexOf('\n');
  return { status: Number(out.slice(cut + 1)) || 0, body: out.slice(0, cut) };
}

export function robotsFor(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.host)) {
    let rules = { allow: [], disallow: [] };
    try {
      const r = curl(`${u.protocol}//${u.host}/robots.txt`);
      if (r.status === 200) rules = parseRobots(r.body);
      else if (r.status >= 400 && r.status < 500) rules = { allow: [], disallow: [] };
      else rules = { allow: [], disallow: ['/'] };        // unknown: be conservative
    } catch (_) { rules = { allow: [], disallow: ['/'] }; }
    robotsCache.set(u.host, rules);
  }
  return robotsCache.get(u.host);
}

export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Returns { ok, status, body, reason }. Never throws.
export async function fetchListing(url, { retries = 2, delayMs = 1500 } = {}) {
  const path = new URL(url).pathname;
  if (!allowed(robotsFor(url), path)) return { ok: false, status: 0, body: '', reason: 'blocked by robots.txt' };
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const r = curl(url);
      if (r.status === 200 && r.body.length > 0) return { ok: true, status: 200, body: r.body, reason: '' };
      if (r.status >= 400 && r.status < 500) return { ok: false, status: r.status, body: '', reason: `HTTP ${r.status}` };
    } catch (e) {
      if (attempt === retries) return { ok: false, status: 0, body: '', reason: `curl failed: ${String(e.message).split('\n')[0]}` };
    }
    await sleep(delayMs * (attempt + 1));
  }
  return { ok: false, status: 0, body: '', reason: 'no usable response after retries' };
}
