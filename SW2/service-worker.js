//nombre de la cache
const cacheName = 'mi.cache-v2';

//archivos que se guardaran en cache
const cacheAssets = [
    'index.html',
    'pagina1.html',
    'pagina2.html', // Corregido: estaba duplicado pagina1.html
    'offline.html',
    'styles.css',
    'main.js',
    'icono.png'
];

//instalacion del service worker
self.addEventListener('install', (event) => { // Corregido: "Event" -> "event"
    console.log('SW: Instalado');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('SW: cacheando archivos...');
            return cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
        .catch((err) => console.log('Error al cachear archivos:', err))
    );
});

//activacion del service worker
self.addEventListener('activate', (event) => {
    console.log('SW: activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log(`SW: Eliminando cache antiguo: ${cache}`); // Corregido: template string
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

//Escucha mensajes desde la pagina
self.addEventListener('message', (event) => {
    console.log('SW: recibio:', event.data);
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('Notificacion local.', {
            body: 'Esta es una prueba de notificacion sin servidor push.', // Corregido: typo
            icon: 'icono.png'
        });
    }
});

//manejar peticiones de red con fallback offline
self.addEventListener('fetch', (event) => {
    //ignorar peticiones innecesarias como extensiones o favicon
    if (
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('favicon.ico')
    ) {
        return;
    }
    
    event.respondWith( // Corregido: "respondWidth" -> "respondWith"
        fetch(event.request)
        .then((response) => {
            //si la respuesta es valida la devuelve en el cache dinamico
            const clone = response.clone(); // Corregido: "responde" -> "response"
            caches.open(cacheName).then((cache) => cache.put(event.request, clone));
            return response;
        })
        .catch(() => {
            //si no hay red buscar en cache
            return caches.match(event.request).then((response) => {
                if (response) {
                    console.log('SW: recurso desde cache', event.request.url);
                    return response;
                } else {
                    console.warn('SW: mostrando pagina offline.');
                    return caches.match('offline.html');
                }
            });
        })
    );
});