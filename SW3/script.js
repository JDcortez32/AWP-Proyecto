let registartion = null;

function register_service_worker() {
    if ('serviceWorker' in navigator) {
        window.navigator.serviceWorker.register('./sw.js', { scope: './'})
            .then(res => {
                registartion = res;
                console.log("Service Worker successfully regsitered.");

            })
            .catch(err => {
                console.log("Could not register service worker.");
            });
    }
}

function unregister_service_worker() {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(registartion => {
                registartion.unregister();
                console.log("Service Worker ungregistered.");
            })
        })
        .catch(err => {
            console.log("Could not unregister service worker.");
        });
}

window.addEventListener('click', () => {
    fetch('./icono.png')
        .then(res => console.log('From script.js: ', res));
});
register_service_worker();
// unregister_service_worker();