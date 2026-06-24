// Tank-U PWA — Service Worker
// Caches the app shell for offline access.
const CACHE = 'tank-u-v7';
const SHELL = ['./index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for WebSocket upgrade requests; cache-first for everything else.
  if (e.request.url.startsWith('ws://') || e.request.url.startsWith('wss://')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
