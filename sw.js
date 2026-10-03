// Zola Corpus service worker.
// The app shell is served from cache instantly (works offline), then refreshed in the background.
// When a newer index.html is published, open pages are told so they can offer a reload.
// Requests to other sites (the live feed on raw.githubusercontent.com, source links) are never touched.
'use strict';
const VERSION = 'zola-shell-2.4.0';           // bump when icons, manifest or this file change
const INDEX = new URL('./index.html', self.registration.scope).href;
const SHELL = [INDEX,
  './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/maskable-192.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'
].map(p => new URL(p, self.registration.scope).href);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('zola-shell-') && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const tagOf = r => r ? (r.headers.get('etag') || r.headers.get('last-modified') || '') : '';

async function refreshIndex() {
  const cache = await caches.open(VERSION);
  const old = await cache.match(INDEX);
  let fresh;
  try { fresh = await fetch(INDEX, {cache: 'no-cache'}); } catch (_) { return; }   // offline: keep what we have
  if (!fresh || !fresh.ok) return;
  const changed = old && tagOf(fresh) && tagOf(old) && tagOf(fresh) !== tagOf(old);
  await cache.put(INDEX, fresh.clone());
  if (changed) {
    const clients = await self.clients.matchAll({type: 'window'});
    clients.forEach(c => c.postMessage({type: 'zola-update'}));
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // feed and external links go straight to the network

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cached = await caches.match(INDEX);
      if (cached) { e.waitUntil(refreshIndex()); return cached; }
      try {
        const res = await fetch(req);
        if (res.ok && url.href.split('#')[0].split('?')[0].match(/\/(index\.html)?$/)) {
          const c = await caches.open(VERSION); await c.put(INDEX, res.clone());
        }
        return res;
      } catch (_) {
        return new Response('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zola Corpus</title><body style="font:16px/1.5 system-ui,sans-serif;padding:24px">Zola Corpus needs one online visit to save itself on this device. Connect and open it again.</body>',
          {headers: {'Content-Type': 'text/html; charset=utf-8'}});
      }
    })());
    return;
  }

  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
