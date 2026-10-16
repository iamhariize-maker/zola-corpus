// Study articles and the Supersymmetry process files. Node only, no browser needed.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, failures } from './helpers.mjs';
import { ARTICLES } from '../tools/articles-data.mjs';
import { validate, render } from '../tools/articles.mjs';

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = f => fs.existsSync(path.join(ROOT, f));

console.log('Study articles: content rules');
const problems = validate();
ok(problems.length === 0, `every article passes the content rules${problems.length ? ': ' + problems.join('; ') : ''}`);
ok(ARTICLES.length >= 12, `at least 12 articles (have ${ARTICLES.length})`);
ok(ARTICLES.filter(a => a.category === 'nobel').length >= 7, 'the six 2026 Nobel prizes plus an overview are all present');

console.log('Study articles: generated pages are current');
const files = render();
for (const [name, html] of Object.entries(files)) {
  const file = path.join('articles', name);
  ok(exists(file) && read(file) === html, `${file} matches tools/articles-data.mjs (run: npm run articles)`);
}
ok(!fs.readdirSync(path.join(ROOT, 'articles')).some(f => f.endsWith('.html') && !(f in files)), 'no stray article pages without data');

console.log('Study articles: pages are self-contained and offline-safe');
for (const name of Object.keys(files)) {
  const html = read(path.join('articles', name));
  ok(!/<script\b[^>]*\bsrc=/i.test(html), `${name}: no external scripts`);
  ok(!/@import|url\(\s*['"]?https?:/i.test(html), `${name}: no external stylesheets or fonts`);
  const hrefs = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1]);
  const allowed = new Set(ARTICLES.flatMap(a => a.sources.map(s => s.url)));
  ok(hrefs.every(h => allowed.has(h)), `${name}: every external link is a listed source`);
}
ok(read('articles/articles.css').includes('prefers-color-scheme: dark') && read('articles/articles.css').includes('data-theme="dark"'), 'articles.css: dark theme under both guards');

console.log('Study articles: offline cache and publishing');
const sw = read('sw.js');
const pages = fs.readdirSync(path.join(ROOT, 'articles')).filter(f => /\.(html|css)$/.test(f));
for (const p of pages) ok(sw.includes(`'./articles/${p}'`), `sw.js precaches articles/${p}`);
ok(/caches\.match\(req, \{ignoreSearch: true\}\)\.then\(hit => hit \|\| fetch\(req\)/.test(sw), 'sw.js serves a cached article page for navigation before the network');
ok(/SITE_FILES = \[[^\]]*'articles'/.test(read('tools/pwa.mjs')), 'tools/pwa.mjs publishes the articles folder');
ok(read('articles/index.html').includes('Study articles on recent events'), 'hub page is generated');
for (const a of ARTICLES) ok(read('articles/index.html').includes(`${a.slug}.html`), `hub links to ${a.slug}`);

console.log('Supersymmetry process files');
ok(exists('SUPERSYMMETRY.md'), 'SUPERSYMMETRY.md is in the repo');
const sup = exists('SUPERSYMMETRY.md') ? read('SUPERSYMMETRY.md') : '';
ok(sup.includes('## Zola Corpus binding'), 'SUPERSYMMETRY.md has the Zola Corpus binding');
ok(!/ccr-4ad6dc17|ccr-35128f32|Shizuku|deepseek\/supersymmetry/i.test(sup), 'no Svan lanes, Svan tasks or Svan branches in the binding');
ok(read('AGENTS.md').includes('SUPERSYMMETRY.md') && read('AGENTS.md').includes('## What this is'), 'AGENTS.md points to SUPERSYMMETRY.md and keeps its existing sections');
ok(read('CLAUDE.md').includes('SUPERSYMMETRY.md') && read('CLAUDE.md').includes('AGENTS.md'), 'CLAUDE.md points to SUPERSYMMETRY.md and AGENTS.md');
ok(exists('docs/handoff/ACCEPTANCE_LEDGER.md'), 'acceptance ledger exists');

console.log('Study articles: opens offline after the first visit');
{
  const { playwright, serve } = await import('./helpers.mjs');
  const { chromium } = await playwright();
  const { base, close } = await serve();
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(base);
    await page.evaluate(() => navigator.serviceWorker.ready);
    // The install step precaches every article; wait until the physics page is in the cache.
    await page.waitForFunction(async () => {
      for (const name of await caches.keys()) {
        if (await (await caches.open(name)).match('./articles/nobel-physics-2026.html')) return true;
      }
      return false;
    }, null, { timeout: 30000 });
    await context.setOffline(true);
    const res = await page.goto(base + 'articles/nobel-physics-2026.html');
    const h1 = await page.textContent('h1');
    ok(res && res.ok() && /Francis Halzen/.test(h1 || ''), `physics article opens offline from the cache (h1: "${(h1 || '').trim()}")`);
    await context.close();
  } catch (e) {
    ok(false, `offline article check ran: ${e.message.split('\n')[0]}`);
  } finally {
    await browser.close();
    close();
  }
}

console.log(failures() ? `\n✗ ${failures()} articles check(s) failed` : '\n✓ articles checks passed');
process.exit(failures() ? 1 : 0);
