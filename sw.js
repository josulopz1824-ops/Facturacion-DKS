const CACHE_NAME = 'dks-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/global-styles.css',
  '/auth-facturacion.js',
  '/caja-pro.html',           // IMPORTANTE: Agrega todas tus páginas
  '/inventario-ferretero.html',
  '/deudores-dks.html',
  '/config.html',
  '/dashboard.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// Instalación: Fuerza a que el SW tome el control de inmediato
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto, guardando recursos...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: Limpia versiones viejas de cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});

// Estrategia: "Cache First, then Network" (Vuela en el móvil)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna lo que está en cache, o busca en internet si no está
        return response || fetch(event.request).catch(() => {
          // Si falla internet y no está en cache, puedes retornar una página offline aquí
        });
      })
  );
});
