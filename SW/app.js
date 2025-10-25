if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => console.log("Service Worker registrado:", reg))
        .catch((error) => console.log("Error al registrar el SW:", error)); // error corregido
}

document.getElementById("check").addEventListener("click", () => {
    if (navigator.serviceWorker.controller) {
        alert("El service worker esta activo y controlando la pagina.")
    } else {
        alert("El service worker aun no esta activo.");
    }
});

if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) =>{
        if (perm === "granted"){
            console.log("Permiso de Notificacion concedido.");
        }
    });
}
