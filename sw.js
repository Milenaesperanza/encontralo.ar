/**
 * encontralo · sw.js
 * Service Worker — cache offline básico
 */

const CACHE_NAME = 'encontralo-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
];

// Instalar: cachear assets estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, cache fallback
self.addEventListener('fetch', (e) => {
  // Solo interceptar GET
  if (e.request.method !== 'GET') return;

  // No interceptar peticiones a APIs externas ni fuentes (respuestas opacas problemáticas)
  const url = new URL(e.request.url);
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('openstreetmap.org') ||
    url.hostname.includes('nominatim') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Guardar copia fresca en cache
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
