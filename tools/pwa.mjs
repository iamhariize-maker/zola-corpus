#!/usr/bin/env node
// Zola Corpus PWA tooling. Plain Node 18+, no dependencies.
//
//   node tools/pwa.mjs apply [fresh-build.html]  Carry the install/offline layer (pwa/head.html, pwa/body.html)
//                                                into index.html. Given a fresh build, it reads that file instead
//                                                and writes the result to index.html.
//   node tools/pwa.mjs check                     Check the manifest, icons, screenshots, service worker and layer.
//   node tools/pwa.mjs build [out]               Check, then write the deployable site to out (default _site)
//                                                with the layer applied and a content-hashed cache version.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { applyAppFixes } from './app-fixes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_FILES = ['index.html', 'manifest.webmanifest', 'sw.js', '404.html', '.nojekyll', 'icons', 'screenshots', 'fonts'];
const HEAD_RX = /[ \t]*<!-- zola-pwa:head[\s\S]*?<!-- \/zola-pwa:head -->\n?/g;
const BODY_RX = /[ \t]*<!-- zola-pwa:body[\s\S]*?<!-- \/zola-pwa:body -->\n?/g;
// Tags the layer owns. A fresh build's own copies are dropped so the layer's win.
const OWNED_TAGS = [
  /<link\b[^>]*\brel=["']?(?:manifest|icon|shortcut icon|apple-touch-icon)["'\s>][^>]*>\n?/gi,
  /<meta\b[^>]*\bname=["'](?:theme-color|application-name|mobile-web-app-capable|apple-mobile-web-app-[a-z-]+|format-detection|twitter:card)["'][^>]*>\n?/gi,
  /<meta\b[^>]*\bproperty=["']og:[^"']+["'][^>]*>\n?/gi,
];
const LEGACY_BODY = [/<style id="pwa-css">[\s\S]*?<\/style>\n?/g, /<script>\/\/ Zola PWA layer[\s\S]*?<\/script>\n?/g];

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const problems = [], notes = [];
const fail = m => problems.push(m);

// Apply a regex only to markup, never inside <script> or <style> text.
function outsideCode(html, fn) {
  return html.split(/(<(script|style)\b[\s\S]*?<\/\2>)/i).map((part, i) => {
    if (i % 3 === 2) return '';            // the captured tag name
    return i % 3 === 1 ? part : fn(part);
  }).join('');
}

export function applyLayer(html) {
  html = applyAppFixes(html);
  const head = read('pwa/head.html').trim().replace('<!-- zola-data -->', '<script id="zola-data">\n' + read('pwa/data.js').trim() + '\n</script>') + '\n';
  const studio = '<style id="zstudio">\n' + read('pwa/studio.css') + '\n</style>\n<style id="zstudio-frame-source" media="not all">\n' + read('pwa/studio-frame.css') + '\n</style>\n<script>\n' + read('pwa/studio.js') + '\n</script>';
  const body = read('pwa/body.html').trim().replace('<!-- zola-studio -->', studio) + '\n';
  const h = html.search(/<\/head>/i);
  if (h < 0) throw new Error('no </head> in the page');
  let top = html.slice(0, h).replace(HEAD_RX, '');
  top = outsideCode(top, s => OWNED_TAGS.reduce((acc, rx) => acc.replace(rx, ''), s));
  let rest = html.slice(h).replace(BODY_RX, '');
  for (const rx of LEGACY_BODY) rest = rest.replace(rx, '');
  const b = rest.search(/<\/body>(?![\s\S]*<\/body>)/i);
  rest = b < 0 ? rest + '\n' + body : rest.slice(0, b) + body + rest.slice(b);
  return top + head + rest;
}

// --- tiny image header readers ------------------------------------------------------------
function imageSize(buf) {
  if (buf.slice(1, 4).toString() === 'PNG') return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') {
    const kind = buf.slice(12, 16).toString();
    if (kind === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
    if (kind === 'VP8L') { const b = buf.readUInt32LE(21); return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]; }
    if (kind === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  return null;
}

function checkImage(dir, src, sizes, where) {
  const file = path.join(dir, src.replace(/^\.\//, ''));
  if (!fs.existsSync(file)) return fail(`${where}: ${src} is missing`);
  if (!sizes || sizes === 'any' || src.endsWith('.svg')) return;
  const got = imageSize(fs.readFileSync(file));
  if (!got) return fail(`${where}: ${src} is not a PNG or WebP`);
  if (!sizes.split(/\s+/).includes(`${got[0]}x${got[1]}`)) fail(`${where}: ${src} is ${got[0]}x${got[1]}, manifest says ${sizes}`);
}

export function check(dir = ROOT, { strict = false } = {}) {
  const at = f => path.join(dir, f);
  // manifest
  let m;
  try { m = JSON.parse(fs.readFileSync(at('manifest.webmanifest'), 'utf8')); } catch (e) { fail(`manifest.webmanifest: ${e.message}`); m = {}; }
  for (const k of ['id', 'name', 'short_name', 'start_url', 'scope', 'display', 'theme_color', 'background_color']) if (!m[k]) fail(`manifest: "${k}" is missing`);
  const icons = m.icons || [];
  const has = (size, purpose) => icons.some(i => (i.purpose || 'any').split(' ').includes(purpose) && (i.sizes || '').split(' ').includes(size));
  for (const s of ['192x192', '512x512']) { if (!has(s, 'any')) fail(`manifest: no ${s} "any" icon`); if (!has(s, 'maskable')) fail(`manifest: no ${s} maskable icon`); }
  icons.forEach(i => checkImage(dir, i.src, i.sizes, 'manifest icon'));
  (m.shortcuts || []).forEach(s => (s.icons || []).forEach(i => checkImage(dir, i.src, i.sizes, `shortcut "${s.short_name || s.name}"`)));
  const shots = m.screenshots || [];
  shots.forEach(s => checkImage(dir, s.src, s.sizes, 'screenshot'));
  if (!shots.some(s => s.form_factor === 'wide')) fail('manifest: no wide screenshot (desktop install dialog)');
  if (!shots.some(s => s.form_factor !== 'wide')) fail('manifest: no narrow screenshot (phone install dialog)');

  // service worker
  const sw = fs.readFileSync(at('sw.js'), 'utf8');
  try { new vm.Script(sw, { filename: 'sw.js' }); } catch (e) { fail(`sw.js does not compile: ${e.message}`); }
  if (!/const VERSION = '[^']+';/.test(sw)) fail("sw.js: no `const VERSION = '...';` line");
  for (const [, p] of sw.matchAll(/'\.\/([^']+)'/g)) if (!fs.existsSync(at(p))) fail(`sw.js precaches ./${p}, which is missing`);

  // the page and its layer
  const html = fs.readFileSync(at('index.html'), 'utf8');
  const fresh = applyLayer(html) === html;
  if (!fresh) (strict ? fail : n => notes.push(n))('index.html does not carry the current PWA layer (run: node tools/pwa.mjs apply)');
  if (!/<html[^>]*\blang=/i.test(html)) fail('index.html: <html> has no lang');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) fail('index.html: no viewport meta');
  notes.push(`index.html is ${(html.length / 1048576).toFixed(2)} MB; ${icons.length} icons, ${(m.shortcuts || []).length} shortcuts, ${shots.length} screenshots`);
  return problems.length === 0;
}

function copy(src, dst) {
  if (!fs.existsSync(src)) return;
  if (fs.statSync(src).isDirectory()) { fs.mkdirSync(dst, { recursive: true }); for (const f of fs.readdirSync(src)) copy(path.join(src, f), path.join(dst, f)); }
  else fs.copyFileSync(src, dst);
}

function build(out) {
  out = path.resolve(ROOT, out);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  for (const f of SITE_FILES) copy(path.join(ROOT, f), path.join(out, f));
  fs.writeFileSync(path.join(out, 'index.html'), applyLayer(read('index.html')));
  // Cache version = hash of everything the service worker precaches, so every real change reaches installed copies.
  const sw = fs.readFileSync(path.join(out, 'sw.js'), 'utf8');
  const h = crypto.createHash('sha256').update(sw);
  for (const [, p] of sw.matchAll(/'\.\/([^']+)'/g)) h.update(fs.readFileSync(path.join(out, p)));
  h.update(fs.readFileSync(path.join(out, 'index.html')));
  const version = 'zola-shell-' + h.digest('hex').slice(0, 12);
  fs.writeFileSync(path.join(out, 'sw.js'), sw.replace(/const VERSION = '[^']+';/, `const VERSION = '${version}';`));
  notes.push(`built ${path.relative(ROOT, out) || '.'} with cache ${version}`);
  return check(out, { strict: true });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd = 'check', arg] = process.argv.slice(2);
  let ok = true;
  if (cmd === 'apply') {
    const src = arg ? path.resolve(arg) : path.join(ROOT, 'index.html');
    fs.writeFileSync(path.join(ROOT, 'index.html'), applyLayer(fs.readFileSync(src, 'utf8')));
    notes.push(`index.html now carries the PWA layer${arg ? ` (from ${arg})` : ''}`);
    ok = check();
  } else if (cmd === 'check') ok = check();
  else if (cmd === 'build') ok = build(arg || '_site');
  else { console.error('usage: node tools/pwa.mjs apply [file] | check | build [out]'); process.exit(2); }
  notes.forEach(n => console.log('·', n));
  problems.forEach(p => console.error('✗', p));
  console.log(ok ? '✓ all checks passed' : `✗ ${problems.length} problem(s)`);
  process.exit(ok ? 0 : 1);
}
