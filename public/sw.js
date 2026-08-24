// Minimal service worker for offline-first caching of static assets.
// Caches the page shell + all images for instant repeat loads even with no connection.
const CACHE_NAME = 'sunglasses-havana-v1';
const PRECACHE_URLS = [
  '/',
  '/sunglasses/logo.webp',
  '/sunglasses/logo-s.webp',
  '/sunglasses/cover.webp',
  '/sunglasses/cover-m.webp',
  '/sunglasses/cat-gafas-10-usd.webp',
  '/sunglasses/cat-gafas-deportivas-10-usd.webp',
  '/sunglasses/cat-gafas-12-usd.webp',
  '/sunglasses/cat-gafas-15-usd.webp',
  '/sunglasses/cat-articulos-varios.webp',
  '/sunglasses/cat-gafas-ver-cerca.webp',
  '/sunglasses/cat-gafas-miopia.webp',
  '/sunglasses/gafas-0-50-0-75.webp',
  '/sunglasses/gafas-0-50-0-75-s.webp',
  '/sunglasses/gafa-0-50-0-75-1-00.webp',
  '/sunglasses/gafa-0-50-0-75-1-00-s.webp',
  '/sunglasses/gafas-gaticos.webp',
  '/sunglasses/gafas-gaticos-s.webp',
  '/sunglasses/gafas-0-50-1-00-1-75.webp',
  '/sunglasses/gafas-0-50-1-00-1-75-s.webp',
  '/sunglasses/gafa-0-75.webp',
  '/sunglasses/gafa-0-75-s.webp',
  '/sunglasses/gafa-3-j.webp',
  '/sunglasses/gafa-3-j-s.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Don't fail install if some precache fetches fail
      Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML, cache-first for static assets
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/')))
    );
    return;
  }

  // Cache-first for images, fonts, css, js
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
