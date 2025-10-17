//Verificar si el navegador web soporta service workers
if ("serviceWorker" in navigator) {

    //Lamar el metodo register para registrar un SW (Service Worker)
    //El parametro /sw.js es la ruta del archivo del SW
    navigator.serviceWorker
        .register("./sw.js")

        //then se ejecuta si el registro fue exitoso
        //reg es un objeto tipo serviceworkerregistration con informacion del sw
        .then((reg)=> console.log("Service Worker registrado:", reg))

        //catch se ejecuta si ocurre un error un error en el registro
        //err contiene el mensaje o detalle del error
        .catch((error) => console.log("Error al registrar el SW:", err));
}

//Agregamos un evento clic al boton check
document.getElementById("check").addEventListener("click", () => {

    //Verificar si el SW controla la pagina actual
    if (navigator.serviceWorker.controller) {
        alert("El service worker esta activo y controlando la pagina.")
    } else {
        alert("El service worker aun no esta activo.");
    }
});

//Area de notificacion
if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) =>{
        if (perm === "granted"){
            console.log("Permiso de Notificacion concedido.");
        }
    });
}