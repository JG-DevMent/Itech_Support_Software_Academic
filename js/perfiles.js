// Cargar datos del perfil desde LocalStorage (si existen)
document.addEventListener('DOMContentLoaded', function() {
    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {};
    document.getElementById('username').value = profileData.username || '';
    document.getElementById('email').value = profileData.email || '';
    document.getElementById('phone').value = profileData.phone || '';
    document.getElementById('role').value = profileData.role || '';
  });

  // Guardar datos del perfil en LocalStorage
  document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const profileData = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      role: document.getElementById('role').value
    };
    // Solo actualizar la contraseña si se proporciona una nueva
    const password = document.getElementById('password').value;
    if (password) {
      profileData.password = password; // En un sistema real, esto debería hashearse
    }
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    alert('Perfil actualizado correctamente.');
    window.location.href = 'configuracion.html';
  });