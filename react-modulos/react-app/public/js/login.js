/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${window.API_BASE_URL}/api/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                window.notificaciones.error('Usuario o contraseña incorrectos. Por favor, verifique sus credenciales e intente nuevamente.');
                return;
            }

            const user = await response.json();

            // Mapear 'rol' del backend a 'role' para el frontend
            const userData = {
                ...user,
                role: user.rol // Mapear rol del backend a role para el frontend
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            /*console.log('Usuario guardado en sessionStorage:', userData);*/            
            
            // Mostrar notificación de bienvenida especial
            window.notificaciones.bienvenida(`¡Hola ${user.username}! Has iniciado sesión correctamente.`);
            
            // Redirigir después de un breve delay para que se vea la notificación
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        } catch (error) {
            window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión a internet e intente nuevamente.');
        }
    });
}); 