const STATIC_CACHE = 'moura-static-v1';
const DYNAMIC_CACHE = 'moura-dynamic-v1';

// Assets críticos para cachear inmediatamente (solo los que sabemos que existen)
const CORE_ASSETS = ['/', '/favicon.svg'];

// Install event - cachear assets críticos
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.log('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - estrategias de caching simples
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo cachear requests GET
  if (request.method !== 'GET') return;

  // Solo cachear requests del mismo origen
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Refresh cache in background
        fetch(request)
          .then((response) => {
            if (response.ok) {
              const cache = caches.open(isImageRequest(request) ? DYNAMIC_CACHE : STATIC_CACHE);
              cache.then((c) => c.put(request, response.clone()));
            }
          })
          .catch(() => {
            // Silent fail for background refresh
          });

        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request).then((response) => {
        if (response.ok && shouldCache(request)) {
          const cache = caches.open(isImageRequest(request) ? DYNAMIC_CACHE : STATIC_CACHE);
          cache.then((c) => c.put(request, response.clone()));
        }
        return response;
      });
    })
  );
});

// Helper functions
function shouldCache(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Cache CSS, JS, images, fonts
  return /\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$/i.test(pathname);
}

function isImageRequest(request) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(request.url);
}
