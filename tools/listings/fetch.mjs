// Polite fetcher. curl runs without automatic redirects, so every hop is checked by us:
//   - the host must be one the source lists (a redirect to any other host is refused),
//   - robots.txt for that host must allow the path,
//   - at most three redirects, one request at a time, a timeout, and backoff on server errors.
// Arguments go to execFile as an array (no shell). Nothing here throws to the caller.
import { execFileSync } from 'node:child_process';
import { parseRobots, allowed } from './robots.mjs';
import { absolute } from './parse.mjs';

export const UA = 'ZolaPersonalStudy/1.0 (personal study app; contact: repo owner)';
const REDIRECTS = new Set([301, 302, 303, 307, 308]);
const MAX_HOPS = 3;

// One request, no redirect following. Returns { code, body, location }.
export function curlOnce(url) {
  const out = execFileSync('curl', ['-s', '--max-time', '30', '-A', UA, '-w', '\n%{http_code}\n%{redirect_url}', url], {
    encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  });
  const last = out.lastIndexOf('\n');
  const location = out.slice(last + 1);
  const rest = out.slice(0, last);
  const prev = rest.lastIndexOf('\n');
  return { code: Number(rest.slice(prev + 1)) || 0, body: rest.slice(0, prev), location };
}

export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const robotsCache = new Map();
const lastRequestAt = new Map();

// Rules for one origin. A missing robots.txt (4xx) means no rules. Anything unclear means blocked.
export function robotsFor(url, request = curlOnce, hosts = []) {
  const origin = new URL(url).origin;
  if (!robotsCache.has(origin)) {
    let rules = { allow: [], disallow: ['/'] };
    try {
      let r = request(`${origin}/robots.txt`);
      if (REDIRECTS.has(r.code) && r.location) {
        const next = absolute(r.location, `${origin}/robots.txt`);
        const sameSite = next && (new URL(next).origin === origin || hosts.includes(new URL(next).host));
        r = sameSite ? request(next) : { code: 0, body: '', location: '' };
      }
      if (r.code >= 200 && r.code < 300) rules = parseRobots(r.body);
      else if (r.code >= 400 && r.code < 500) rules = { allow: [], disallow: [] };
    } catch (_) { /* keep the conservative default */ }
    robotsCache.set(origin, rules);
  }
  return robotsCache.get(origin);
}

export function clearRobotsCache() { robotsCache.clear(); }

// Fetch a listing page. `hosts` lists the hosts a source may use, including its own www/non-www pair.
// Returns { ok, status, body, finalUrl, reason }.
export async function fetchListing(url, {
  hosts = [new URL(url).host],
  request = curlOnce,
  getRobots = u => robotsFor(u, request, hosts),
  retries = 2,
  delayMs = 1500,
  pause = sleep,
} = {}) {
  const fail = (reason, status = 0) => ({ ok: false, status, body: '', finalUrl: url, reason });
  let current = url;
  let hops = 0;
  let tries = 0;
  for (;;) {
    let parsed;
    try { parsed = new URL(current); } catch (_) { return fail('invalid URL'); }
    if (!hosts.includes(parsed.host)) return fail(`redirect or link to ${parsed.host} is not an allowed host`);
    const rules = getRobots(current);
    if (!allowed(rules, parsed.pathname)) return fail('blocked by robots.txt');
    // Honour Crawl-delay between requests to the same host.
    const gap = (rules.crawlDelay || 0) * 1000;
    const wait = (lastRequestAt.get(parsed.host) || 0) + gap - Date.now();
    if (gap > 0 && wait > 0) await pause(wait);
    lastRequestAt.set(parsed.host, Date.now());
    let r;
    try { r = request(current); } catch (e) {
      if (tries++ < retries) { await pause(delayMs * tries); continue; }
      return fail(`curl failed: ${String(e.message).split('\n')[0]}`);
    }
    if (REDIRECTS.has(r.code) && r.location) {
      if (++hops > MAX_HOPS) return fail('too many redirects');
      const next = absolute(r.location, current);
      if (!next) return fail('redirect target is not a web address');
      current = next;
      continue;
    }
    if (r.code === 200 && r.body.length > 0) return { ok: true, status: 200, body: r.body, finalUrl: current, reason: '' };
    if (r.code >= 400 && r.code < 500) return fail(`HTTP ${r.code}`, r.code);
    if (tries++ < retries) { await pause(delayMs * tries); continue; }
    return fail(`no usable response (HTTP ${r.code})`, r.code);
  }
}
