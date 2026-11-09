// Service worker: soporte para uso sin conexión (PWA).
// Cache-first con actualización en segundo plano (stale-while-revalidate / cache-first fallback).
const VERSION = 'ep-estadistica-v2';
const CACHE = `${VERSION}-runtime`;

// Lista base de recursos esenciales que se pre-cachean durante la instalación.
// Las rutas relativas se resuelven contra la ubicación del propio service worker
// (funcionando correctamente tanto en raíz como en subrutas de GitHub Pages).
const PRECACHE_URLS = [
  './',
  './index.html',
  './lecciones/',
  './practica/',
  './laboratorio/',
  './simulacro/',
  './actividades/barras/',
  './actividades/arbol/',
  './manifest.webmanifest',
  './icon.svg',
  './sw-registro.js',
];

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
        // Si falló la red (offline) y es navegación HTML, intentar servir index
        if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
          const fallback = await cache.match('./') || await cache.match('./index.html');
          if (fallback) return fallback;
        }
        throw err;
      }
    }),
  );
});
