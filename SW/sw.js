const CACHE_NAME = "mi-app-v1";

const urlsToCache = [
    "./",
    "./index.html", 
    "./styles.css", 
    "./app.js", 
    "./logo.png" 
];

self.addEventListener("install", (event) => {
    console.log("SW: Instalado");

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>{
            console.log("SW: Archivos cacheados"); // error corregido
            return cache.addAll(urlsToCache);
        })
    );
    
    // Notificación corregida
    self.registration.showNotification("Service Worker activo.",{ // error corregido
        body: "El cache inicial se configuro correctamente.",
        icon: "logo.png"
    });
});

self.addEventListener("activate", (event) => {
    console.log("SW: Activado");
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado");
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith( // error corregido
        caches.match(event.request).then((response) => {
            return response || fetch(event.request); // error corregido
        })
    );
});
