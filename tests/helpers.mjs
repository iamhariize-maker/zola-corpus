// Shared test helpers: a static server for _site and a Playwright loader that works with a local or global install.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SITE = path.join(ROOT, '_site');
export const FEED_FIXTURE = fs.readFileSync(path.join(ROOT, 'tests/fixtures/zola-feed.json'), 'utf8');

export async function playwright() {
  for (const spec of ['playwright', '/opt/node-tools/node_modules/playwright/index.mjs']) {
    try { return await import(spec); } catch (e) { /* try the next */ }
  }
  throw new Error('Playwright not found. Run: npm i -D playwright && npx playwright install chromium');
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.md': 'text/plain' };

/** Serve _site like GitHub Pages does (404.html for unknown paths, ETag so update checks work). */
export function serve(dir = SITE) {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      let p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (p.endsWith(path.sep) || p.endsWith('/')) p = path.join(p, 'index.html');
      if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/html' }); return res.end(fs.existsSync(path.join(dir, '404.html')) ? fs.readFileSync(path.join(dir, '404.html')) : 'not found');
      }
      const body = fs.readFileSync(p), st = fs.statSync(p);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'ETag': `"${st.size}-${st.mtimeMs}"` });
      res.end(body);
    }).listen(0, () => resolve({ base: `http://localhost:${server.address().port}/`, close: () => server.close() }));
  });
}

let failed = 0;
export const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) failed++; };
export const failures = () => failed;

/** A phone-sized context with the install offer quiet and the live feed answered from the fixture. */
export async function phone(browser, devices, opts = {}) {
  const ctx = await browser.newContext({ ...devices['Pixel 7'], serviceWorkers: 'block', ...opts });
  await ctx.addInitScript(() => { try { localStorage.setItem('zola.pwa.dismissedAt', String(Date.now())); } catch (e) {} });
  await ctx.route(/raw\.githubusercontent\.com/, r => r.fulfill({ status: 200, body: FEED_FIXTURE, headers: { 'access-control-allow-origin': '*', 'content-type': 'text/plain' } }));
  return ctx;
}
