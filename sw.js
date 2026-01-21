const CACHE_NAME = 'dks-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/global-styles.css',
  '/auth-facturacion.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Escuchar peticiones (Permite que la app cargue rápido)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});