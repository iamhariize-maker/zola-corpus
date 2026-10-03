// Zola Corpus service worker.
// The app shell is served from cache instantly (works offline), then refreshed in the background.
// When a newer index.html or a newer service worker is published, open pages are told so they can offer a reload.
// Requests to other sites (the live feed on raw.githubusercontent.com, source links) are never touched.
'use strict';
const VERSION = 'zola-shell-2.5.0';           // the deploy workflow stamps a content hash here; bump by hand otherwise
const SCOPE = self.registration.scope;
const INDEX = new URL('./index.html', SCOPE).href;
const SHELL = [INDEX,
  './manifest.webmanifest',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png',
  './icons/maskable-192.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'
].map(p => new URL(p, SCOPE).href);

const tell = async msg => (await self.clients.matchAll({type: 'window'})).forEach(c => c.postMessage(msg));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const old = (await caches.keys()).filter(k => k.startsWith('zola-shell-') && k !== VERSION);
    await Promise.all(old.map(k => caches.delete(k)));
    await self.clients.claim();
    if (old.length) await tell({type: 'zola-update'});   // an update, not a first install
  })());
});

const tagOf = r => r ? (r.headers.get('etag') || r.headers.get('last-modified') || '') : '';
let refreshing = null;

// Fetch index.html again; if it differs from the saved copy, save it and tell open pages.
function refreshIndex() {
  return refreshing || (refreshing = (async () => {
    const cache = await caches.open(VERSION);
    const old = await cache.match(INDEX);
    let fresh;
    try { fresh = await fetch(INDEX, {cache: 'no-cache'}); } catch (_) { return; }   // offline: keep what we have
    if (!fresh || !fresh.ok) return;
    let changed = false;
    if (old && tagOf(fresh) && tagOf(old)) changed = tagOf(fresh) !== tagOf(old);
    else if (old) changed = (await fresh.clone().text()) !== (await old.text());
    await cache.put(INDEX, fresh);
    if (changed) await tell({type: 'zola-update'});
  })().finally(() => { refreshing = null; }));
}

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'zola-check') e.waitUntil(refreshIndex());
});

const OFFLINE = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#4A2BB0"><title>Zola Corpus</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F3F1F7;color:#1D1533;font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
@media (prefers-color-scheme:dark){body{background:#0F0B19;color:#EFEBF9}}main{max-width:380px}h1{font-size:22px;margin:20px 0 8px}p{margin:0 0 20px;opacity:.8}
button{min-height:44px;padding:0 22px;border-radius:99px;border:0;background:#4A2BB0;color:#fff;font:700 15px system-ui,sans-serif;cursor:pointer}</style>
<main><svg width="72" height="72" viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="104" fill="#4A2BB0"/><path fill="#fff" d="M294 76 167 255h82l-31 139 127-184h-82z"/><rect x="199" y="420" width="114" height="19" rx="5" fill="#C42A42"/></svg>
<h1>Zola Corpus needs one online visit</h1><p>Connect to the internet and open it again. After that it works offline on this device.</p>
<button onclick="location.reload()">Try again</button></main><script>addEventListener('online',()=>location.reload())</script></html>`;

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // feed and external links go straight to the network

  if (req.mode === 'navigate') {
    const page = url.origin + url.pathname;
    if (page !== SCOPE && page !== INDEX) {
      // Any other address under the app (a mistyped or old link): real files load, everything else goes home.
      e.respondWith(fetch(req).then(res => res.ok ? res : Response.redirect(SCOPE, 302), () => Response.redirect(SCOPE, 302)));
      return;
    }
    e.respondWith((async () => {
      const cached = await caches.match(INDEX);
      if (cached) { e.waitUntil(refreshIndex()); return cached; }
      try {
        const res = await fetch(req);
        if (res.ok) { const c = await caches.open(VERSION); await c.put(INDEX, res.clone()); }
        return res;
      } catch (_) {
        return new Response(OFFLINE, {headers: {'Content-Type': 'text/html; charset=utf-8'}});
      }
    })());
    return;
  }

  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); e.waitUntil(caches.open(VERSION).then(c => c.put(req, copy))); }
    return res;
  })));
});
