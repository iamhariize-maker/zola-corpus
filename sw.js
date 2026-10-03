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
  './icons/icon.svg', './icons/favicon.svg', './icons/icon-192.png', './icons/icon-512.png',
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
<main><svg width="88" height="88" viewBox="0 0 512 512" aria-hidden="true"><defs><mask id="cut" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="7000" height="5000"><rect x="-2000" y="-2000" width="7000" height="5000" fill="#fff"/><polygon points="1735,800 1465,206 1708,206 1681,-190 1951,404 1708,404" fill="#000" stroke="#000" stroke-width="58" stroke-linejoin="round"/></mask></defs><defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6B47EC"/><stop offset=".55" stop-color="#4A2BB0"/><stop offset="1" stop-color="#28156F"/></linearGradient>
<radialGradient id="sheen" cx=".22" cy=".12" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="bolt" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF7A1A"/><stop offset=".5" stop-color="#FFB22E"/><stop offset="1" stop-color="#FFE07A"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feFlood flood-color="#FFB22E" flood-opacity=".6"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="lift" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#14093F" flood-opacity=".45"/></filter>
</defs><rect width="512" height="512" rx="112" fill="url(#bg)"/><rect width="512" height="512" rx="112" fill="url(#sheen)"/><g filter="url(#lift)"><g transform="translate(51.00 293.02) scale(0.16728 -0.16728)"><g fill="#fff" mask="url(#cut)"><path transform="translate(0 0)" d="M140 0 12 528H180L245 126H265L346 528H537L621 126H642L704 528H869L741 0H519L446 398H427L359 0Z"/><path transform="translate(843 0)" d="M499 0V660H660V0ZM69 0V660H230V0ZM167 268V398H564V268Z"/><path transform="translate(1837 0)" d="M62 -169V258V528H194L196 378L214 376Q223 432 246.0 469.0Q269 506 305.5 524.0Q342 542 389 542Q459 542 509.5 508.0Q560 474 587.0 411.0Q614 348 614 260Q614 182 590.5 120.0Q567 58 519.5 22.0Q472 -14 399 -14Q350 -14 316.0 3.5Q282 21 258.5 55.0Q235 89 219 140H200Q206 113 211.0 85.0Q216 57 219.5 31.0Q223 5 223 -19V-169ZM340 113Q373 113 396.5 131.0Q420 149 433.0 182.0Q446 215 446 259Q446 306 432.5 339.5Q419 373 394.0 391.5Q369 410 336 410Q305 410 283.5 396.5Q262 383 248.5 361.5Q235 340 229.0 316.0Q223 292 223 271V249Q223 230 228.0 211.0Q233 192 243.0 174.5Q253 157 267.0 143.0Q281 129 299.5 121.0Q318 113 340 113Z"/></g></g></g><g filter="url(#glow)"><g transform="translate(51.00 293.02) scale(0.16728 -0.16728)"><polygon fill="url(#bolt)" points="1735,800 1465,206 1708,206 1681,-190 1951,404 1708,404"/></g></g><rect x="210" y="350.8" width="92" height="16" rx="8" fill="#FF4D6A"/></svg>
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
