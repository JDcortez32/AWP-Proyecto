//Nombre del cache actual (identificador unico)
const CACHE_NAME = "mi-app-v1";

//Listar los archivos que se guardaran en cache
const urlsToCache = [
    "./", //ruta de la raiz
    "./index.html", //documento raiz
    "./styles.css", //hoja de estilos
    "./app.js", //scrip del cliente
    "./logo.png" //logotipo de canvas
];

//Evento de instalacion (se dispara cuando se instala el sw)
self.addEventListener("install", (event) => {
    console.log("SW: Instalado");

    //event.waitUntil() asegura que la instalacion espere hasta que se complete la promise() de cachear los archivos
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>{
            console,log("SW: Archivos cacheados");

            // cache.addAll() agrega todos los archivos de urltocache al cache final
            return cache.addAll(urlsToCache);
        })
    );
    //Mostrar notificacion en sistema
    self.ServiceWorkerRegistration.showNotificacion("Service Worker activo.",{
        body: "El cache inicial se configuro correctamente.",
        icon: "logo.png"
    });
});

//Evento de activacion (se dispara cuando el SW toma el control).
self.addEventListener("activate", (event) => {
    console.log("SW: Activado");

    event.waitUntil(
        //caches.keys() obtiene todos los nombres de caches almacenados.
        caches.keys().then((cacheNames) =>
            //Promises.all() espere a que se eliminen todo los caches viejos
            Promise.all(
                cacheNames.map((cache) => {
                    //Si el cache no coincide con el actual, se elimina
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado");
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

//Evento de interceptacion de peticiones (para cada vez que la app pida un recurso)
self.addEventListener("fetch", (event) => {
    event.responWith(
        //caches.matvh() busca un recurso ya en cache
        caches.match(event.request).then((response) => {
            //Si esta en cache se devuelve una copia guardada
            //Si no esta en cache se hace una peticion normal a la red con fetch()
            return reponse || fetch(event.request);
        })
    );
});