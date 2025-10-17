//registrar el service worker
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js")
    .then((reg) => console.log("SW registrado.", reg))
    .catch((err) => console.log("Error al registar el SW", err));
}

//Boton para verificar el estado del SW
document.getElementById("check").addEventListener("click", () => {
    if(navigator.serviceWorker.controller){
        alert("El Service Wolrker esta activo y controlando la pagina.");
    }
});

//pedir permiso de notoficacion
if(Notification.permission === 'default'){
    Notification.requestPermission().then((perm) => {
        if(perm === 'granted'){
            console.log("Permiso de notofocacion concedido.");
        } else{
            console.log("Permitido de Notificacion denegada.");
        }

    });
}

//Boton para lanzar notificacion local
document.getElementById("btnNotificacion").addEventListener("click",() => {
    if(navigator.serviceWorker.controller){
        navigator.serviceWorker.controller.postMessage("mostrar-notificacion");
    } else {
        console.log("El service Worker no esta activo aun.");
    }
});

 