const CACHE_NAME = 'sca-cache-v1.0.4';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/about',
  '/about.html',
  '/content',
  '/content.html',
  '/influencer',
  '/influencer.html',
  '/web',
  '/web.html',
  '/contact',
  '/contact.html',
  '/careers',
  '/careers.html',
  '/assets/sca.bundle.min.css',
  '/assets/sca.bundle.min.js',
  '/assets/fonts/league-spartan-normal-300-49.woff2',
  '/assets/fonts/eb-garamond-normal-400-20.woff2',
  '/assets/fonts/eb-garamond-italic-400-6.woff2',
  '/images/sca-logo-mark.webp',
  '/images/sca-mark.webp',
  '/images/sca-logo-full.webp'
];

// Install: Cache critical layout assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching critical assets...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Strategy for HTML/navigation requests: Network First, falling back to cache
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseCopy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy for static assets: Cache First, falling back to network
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache, and optionally revalidate in background
          fetch(request).then(response => {
            if (response.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(request, response));
            }
          }).catch(() => {}); // ignore network errors
          return cachedResponse;
        }

        return fetch(request).then(response => {
          if (response.status === 200 && url.origin === self.location.origin) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseCopy));
          }
          return response;
        });
      })
  );
});
