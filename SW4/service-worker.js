// service-worker.js
const STATIC_CACHE = 'sw4-static-v1';
const DYNAMIC_CACHE = 'sw4-dynamic-v1';
const cacheAssets = [
  './',
  'index.html',
  'pagina1.html',
  'pagina2.html',
  'pagina3.html',
  'styles.css',
  'main.js',
  'logo.png',
  'imagen1.png',
  'imagen2.png',
  'vehiculos-armas/Espada_de_Energia.png'
];

self.addEventListener('install', event => {
  console.log('Service Worker instalándose...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Cache abierto, agregando recursos...');
        return cache.addAll(cacheAssets);
      })
      .then(() => {
        console.log('Todos los recursos cacheados');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Error durante la instalación:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activándose...');
  event.waitUntil(
    (async () => {
      // Limpiar caches antiguos
      const keys = await caches.keys();
      await Promise.all(keys.map(k => {
        if (k !== STATIC_CACHE && k !== DYNAMIC_CACHE) {
          console.log('Eliminando cache antiguo:', k);
          return caches.delete(k);
        }
      }));
      console.log('Service Worker activado');
      await self.clients.claim();
    })()
  );
});

// Estrategia: Network first, fallback a cache
self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo estrategias para GET
  if (req.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        // Intentar obtener de la red primero
        const networkResponse = await fetch(req);
        
        // Guardar copia en cache dinámico
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(req, networkResponse.clone()).catch(err => {
            console.error('Error guardando en cache:', err);
          });
        }
        
        return networkResponse;
      } catch (err) {
        console.log('Fallando a cache para:', req.url);
        
        // Buscar en cache
        const cached = await caches.match(req);
        if (cached) {
          return cached;
        }

        // Fallback para navegación
        if (req.mode === 'navigate') {
          const fallback = await caches.match('index.html');
          if (fallback) return fallback;
        }
        
        return new Response('Recurso no disponible offline', { 
          status: 503, 
          statusText: 'Offline' 
        });
      }
    })()
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('Notificación clickeada:', event.notification.tag);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || './';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Buscar ventana existente
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // Abrir nueva ventana si no existe
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Manejar acciones de notificación
self.addEventListener('notificationclose', event => {
  console.log('Notificación cerrada:', event.notification.tag);
});