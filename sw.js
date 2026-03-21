const CACHE_NAME = 'dks-v2'; // Cambié a v2 para forzar actualización
const urlsToCache = [
  './',
  './index.html',
  './global-styles.css',
  './auth-facturacion.js',
  './ventas-dks.html',
  './inventario-ferretero.html',
  './deudores-dks.html',
  './configuracion.html',
  './dashboard.html',
  './historial.html',
  './diario-ventas.html',
  './reportes.html',
  './logo-dks.png',
  './logo-dks-512.png', // Asegúrate de que este nombre sea exacto
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// Instalación: Guarda todo en el cache
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('DKS: Guardando recursos en cache...');
        // Usamos addAll pero con un catch por si un archivo falta
        return cache.addAll(urlsToCache).catch(err => {
          console.error('DKS: Error al cachear archivos. Revisa si todos los nombres son correctos.', err);
        });
      })
  );
});

// Activación: Limpia caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('DKS: Borrando cache antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Cache First, fallback a Red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, lo devuelve. Si no, intenta internet.
        return response || fetch(event.request).then(fetchRes => {
          return fetchRes;
        }).catch(() => {
          // Si no hay internet y no está en cache, podrías mostrar un aviso
          console.log('DKS: Modo Offline - Recurso no encontrado.');
        });
      })
  );
});
