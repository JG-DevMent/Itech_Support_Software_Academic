//Código para el modal de configuración







// Cargar datos de la tienda desde LocalStorage (si existen)
document.addEventListener('DOMContentLoaded', function() {
  const storeData = JSON.parse(localStorage.getItem('storeConfig')) || {};
  document.getElementById('storeName').value = storeData.storeName || '';
  document.getElementById('address').value = storeData.address || '';
  document.getElementById('admin').value = storeData.admin || '';
});

// Guardar datos de la tienda en LocalStorage
document.getElementById('storeForm').addEventListener('submit', function(e) {
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
