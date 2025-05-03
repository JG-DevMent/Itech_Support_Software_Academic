//Código para el modal de configuración







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
      alert('Configuración de la tienda actualizada correctamente.');
      window.location.href = 'configuracion.html';
    });
  }
  
  // Función para verificar si el usuario está logeado
  function checkUserAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
      alert('Debes iniciar sesión para acceder a esta página');
      window.location.href = 'index.html';
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
  
  // Toggle para el menú lateral
  const sidebarToggle = document.getElementById('sidebarToggleCustom');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.body.classList.toggle('sidebar-toggled');
      document.querySelector('.sidebar').classList.toggle('toggled');
    });
  }
  
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
});
