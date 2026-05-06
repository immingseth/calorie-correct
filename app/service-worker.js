/* Calorie Correct — service worker
 *
 * Strategy:
 * - On install: pre-cache the app shell (HTML, CSS, JS, logo, Chart.js)
 *   so the app loads instantly and works offline.
 * - On fetch:
 *   - For API calls (caloriecorrect.workers.dev): always network, never cache.
 *     Coach responses must be live; we never want to serve a stale Claude reply.
 *   - For static assets: cache-first, falling back to network. Updates land
 *     when the cache version below changes.
 *
 * Bump CACHE_VERSION any time the app shell changes meaningfully so old caches
 * get cleaned up on the next install.
 */

const CACHE_VERSION = 'cc-shell-v3';
const APP_SHELL = [
  '/app/',
  '/app/index.html',
  '/app/app.js',
  '/app/styles.css',
  '/app/chart.umd.min.js',
  '/app/cc-logo.png',
  '/app/favicon.png',
  '/app/manifest.json',
];

self.addEventListener('install', (event) => {
  // Pre-cache the app shell so the app loads even with no network on first run
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL).catch(() => {
      // If individual files fail (e.g. 404 during dev), don't break the install.
      // We'll just cache what we can.
    }))
  );
  self.skipWaiting(); // activate immediately on first install
});

self.addEventListener('activate', (event) => {
  // Clean up any old cache versions
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache API calls — Coach responses must always be live
  if (url.hostname.includes('workers.dev') || url.pathname.startsWith('/api/')) {
    return; // let the browser handle normally
  }

  // Same-origin static assets: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          // Stash a copy in cache for next time, but only if it's a 200
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Offline + not in cache: try the app shell as a last resort
          return caches.match('/app/index.html');
        });
      })
    );
  }
});
