// Service worker: soporte para uso sin conexión (PWA).
// La lista de precache se genera en el build (scripts/generar-precache.mjs → sw-precache.js).
const VERSION = 'ep-estadistica-v3';
const CACHE = `${VERSION}-runtime`;

try {
  importScripts('sw-precache.js');
} catch (e) {
  // En desarrollo no existe sw-precache.js: se usa una base mínima.
}

const PRECACHE_URLS = self.__PRECACHE__ || ['./', './offline/', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch((err) => console.warn('Pre-cache parcial:', err)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('ep-estadistica-') && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req);
      if (hit) {
        // En segundo plano revalidar con la red para mantener actualizado
        fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type === 'basic') {
              cache.put(req, res.clone());
            }
          })
          .catch(() => {});
        return hit;
      }

      // Si no está en caché, buscar en red y guardar en caché
      try {
        const fetched = await fetch(req);
        if (fetched && fetched.status === 200 && fetched.type === 'basic') {
          cache.put(req, fetched.clone());
        }
        return fetched;
      } catch (err) {
        // Sin conexión: si es navegación, servir la página explícita de offline.
        if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
          const fallback = (await cache.match('./offline/')) || (await cache.match('./'));
          if (fallback) return fallback;
        }
        throw err;
      }
    }),
  );
});
