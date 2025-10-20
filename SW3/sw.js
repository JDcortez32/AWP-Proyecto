self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('v3')
             .then(cache => {
                return cache.addAll([
                    './',
                    './script.js',
                    './icono.png'
                ]);
             })
             .then(() => {
                console.log("Assets cached.");
             })
             .catch(err => console.log("Could not cache.", err))
    );
});

self.addEventListener('fetch', event => {
    console.log("INTERCEPTED");

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                console.log("V2 The request: ", event.request);
                console.log("V2 Got the response...", response);

                // from cache or fetched if not
                return response || fetch(event.request);
            })
            .catch(err => {
                console.log("Could not find matching request.", err);
                return fetch(event.request); // Mejor intentar fetch en caso de error
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.map(key => {
                        // Eliminar cachés antiguas, mantener solo v3
                        if (key !== 'v3') {
                            return caches.delete(key);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});