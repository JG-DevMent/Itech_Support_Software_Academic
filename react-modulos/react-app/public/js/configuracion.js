/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

// Cargar datos de la tienda desde LocalStorage (si existen)
document.addEventListener('DOMContentLoaded', function() {
  const storeForm = document.getElementById('storeForm');
  
  if (storeForm) {
    const storeData = JSON.parse(localStorage.getItem('storeConfig')) || {};
    
    if (document.getElementById('storeName')) {
      document.getElementById('storeName').value = storeData.storeName || '';
    }
    
    if (document.getElementById('address')) {
      document.getElementById('address').value = storeData.address || '';
    }
    
    if (document.getElementById('admin')) {
      document.getElementById('admin').value = storeData.admin || '';
    }
    
    // Guardar datos de la tienda en LocalStorage
    storeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const storeData = {
        storeName: document.getElementById('storeName').value,
        address: document.getElementById('address').value,
        admin: document.getElementById('admin').value
      };
      localStorage.setItem('storeConfig', JSON.stringify(storeData));
      window.notificaciones.exito('Configuración de la tienda actualizada correctamente.');
      setTimeout(() => {
        window.location.href = 'configuracion.html';
      }, 1500);
    });
  }
  
  // Función para verificar si el usuario está logeado
  function checkUserAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
      window.notificaciones.error('Debes iniciar sesión para acceder a esta página.');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      return false;
    }
    return true;
  }
  
  // Verificar autenticación
  checkUserAuth();
  
  // Botón para cerrar sesión
  const logoutButtons = document.querySelectorAll('a[href="index.html"]');
  
  logoutButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      sessionStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  });
  
  // Función para abrir modales si existieran
  window.abrirModal = function(contenido) {
    const modal = document.getElementById('modal');
    const contenidoModal = document.getElementById('contenido-modal');
    
    if (modal && contenidoModal) {
      contenidoModal.innerHTML = contenido;
      modal.style.display = 'block';
    }
  };
  
  window.cerrarModal = function() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  console.log('Configuración: Módulo cargado correctamente');
  
  // Gestionar opciones de configuración según el rol
  gestionarOpcionesPorRol();
  
  // Inicializar modales si existen
  inicializarModales();
});

// Función para gestionar las opciones de configuración según el rol del usuario
function gestionarOpcionesPorRol() {
    // Obtener el usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.role) {
        console.warn('No se encontró un usuario con rol válido en la sesión');
        return;
    }
    
    const userRole = currentUser.role;
    console.log('Rol del usuario actual:', userRole);
    
    // Obtener todas las opciones de configuración
    const configOptions = document.querySelectorAll('.config-option');
    
    configOptions.forEach(option => {
        const rolesPermitidos = option.getAttribute('data-role');
        
        // Si no tiene el atributo data-role, mostrar la opción siempre
        if (!rolesPermitidos) {
            option.style.display = 'block';
            return;
        }
        
        // Verificar si el rol del usuario actual está en la lista de roles permitidos
        const rolesArray = rolesPermitidos.split(' ');
        if (rolesArray.includes(userRole)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
    
    // Añadir clases CSS para mejorar el diseño según cuántas opciones quedan visibles
    ajustarDisenoPorOpciones();
}

// Función para ajustar el diseño según la cantidad de opciones visibles
function ajustarDisenoPorOpciones() {
    const container = document.querySelector('.config-options-container');
    if (!container) return;
    
    const opcionesVisibles = Array.from(container.querySelectorAll('.config-option')).filter(
        option => option.style.display !== 'none'
    );
    
    // Aplicar clases según el número de opciones visibles
    const numOpciones = opcionesVisibles.length;
    
    if (numOpciones <= 2) {
        container.classList.add('options-few');
    } else {
        container.classList.remove('options-few');
    }
    
    if (numOpciones === 1) {
        container.classList.add('option-single');
    } else {
        container.classList.remove('option-single');
    }
}

// Función para inicializar modales
function inicializarModales() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    
    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    };
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para abrir un modal con contenido
function abrirModal(contenido) {
    const modal = document.getElementById('modal');
    const contenidoModal = document.getElementById('contenido-modal');
    
    if (!modal || !contenidoModal) return;
    
    contenidoModal.innerHTML = contenido;
    modal.style.display = 'block';
}