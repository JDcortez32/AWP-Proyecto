// main.js - registra SW y maneja permisos y envío de notificaciones

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(reg) {
        console.log('Service Worker registrado con scope:', reg.scope);
      })
      .catch(function(err) {
        console.error('Error al registrar SW:', err);
      });
  });
}

// Solicitar permiso para notificaciones
async function askPermission() {
  console.log('Solicitando permiso...');
  if (!('Notification' in window)) {
    alert('Este navegador no soporta Notificaciones.');
    return;
  }
  
  try {
    const result = await Notification.requestPermission();
    console.log('Resultado del permiso:', result);
    
    // Traducir el resultado al español
    let resultadoTraducido;
    switch(result) {
      case 'granted':
        resultadoTraducido = 'PERMITIDO';
        break;
      case 'denied':
        resultadoTraducido = 'DENEGADO';
        break;
      case 'default':
        resultadoTraducido = 'NO DECIDIDO';
        break;
      default:
        resultadoTraducido = result;
    }
    
    alert('Estado del permiso: ' + resultadoTraducido + '\n\n');
    
  } catch (error) {
    console.error('Error al solicitar permiso:', error);
    alert('Error al solicitar permiso: ' + error.message);
  }
}

// Enviar una notificación de prueba
async function sendTestNotification() {
  console.log('Enviando notificación...');
  if (!('serviceWorker' in navigator)) {
    alert('Service Worker no disponible.');
    return;
  }

  // Verificar permiso de notificación
  const permission = Notification.permission;
  console.log('Permiso actual:', permission);
  
  if (permission !== 'granted') {
    alert('Por favor, primero permite notificaciones usando el botón "Solicitar permiso de notificación".');
    return;
  }

  try {
    // Obtener la inscripción del Service Worker activo
    const reg = await navigator.serviceWorker.ready;
    console.log('Service Worker listo:', reg);
    
    const options = {
      body: '¡Bienvenido al universo de Halo! Explora la historia, personajes y armas de esta épica saga.',
      icon: 'logo.png',
      badge: 'logo.png',
      vibrate: [100, 50, 100],
      tag: 'halo-notification',
      data: { url: window.location.href },
      actions: [
        {
          action: 'open',
          title: 'Abrir Halo'
        }
      ]
    };

    // Mostrar la notificación desde el Service Worker
    if (reg && reg.showNotification) {
      await reg.showNotification('Halo - Notificación', options);
      console.log('Notificación enviada exitosamente');
    } else {
      // fallback
      const notification = new Notification('Halo - Notificación', options);
      console.log('Notificación mostrada (fallback)');
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    alert('❌ Error al enviar notificación: ' + error.message);
  }
}

// Borrar caches dinámicos
async function clearDynamicCache() {
  console.log('Limpiando caché...');
  if (!('caches' in window)) { 
    alert('Cache API no disponible en este navegador'); 
    return; 
  }
  
  try {
    const keys = await caches.keys();
    let deletedCount = 0;
    
    for(const k of keys){
      if(k.includes('sw4-dynamic')) {
        await caches.delete(k);
        deletedCount++;
        console.log('Cache eliminado:', k);
      }
    }
    
    if (deletedCount > 0) {
      alert('✅ Caches dinámicos borrados: ' + deletedCount);
    } else {
      alert('ℹ️ No se encontraron caches dinámicos para borrar');
    }
  } catch (error) {
    console.error('Error al limpiar caché:', error);
    alert('❌ Error al limpiar caché: ' + error.message);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, inicializando botones...');
  
  // Elementos del DOM
  const askBtn = document.getElementById('askPermission');
  const sendBtn = document.getElementById('sendNotification');
  const clearBtn = document.getElementById('clearCache');

  // Verificar que los elementos existen y agregar event listeners
  if (askBtn) {
    askBtn.addEventListener('click', askPermission);
    console.log('Botón askPermission encontrado');
  } else {
    console.error('Botón askPermission no encontrado');
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', sendTestNotification);
    console.log('Botón sendNotification encontrado');
  } else {
    console.error('Botón sendNotification no encontrado');
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', clearDynamicCache);
    console.log('Botón clearCache encontrado');
  } else {
    console.error('Botón clearCache no encontrado');
  }
  
  console.log('Inicialización completada');
});

// Manejar errores no capturados
window.addEventListener('error', function(e) {
  console.error('Error global:', e.error);
});