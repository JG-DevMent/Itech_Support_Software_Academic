/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

const params = new URLSearchParams(window.location.search);
const token = params.get('token');

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevaClave = document.getElementById('nuevaClave').value;
    const confirmarClave = document.getElementById('confirmarClave').value;

    if (nuevaClave !== confirmarClave) {
        window.notificaciones.error('Las contraseñas no coinciden. Por favor, asegúrese de escribir la misma contraseña en ambos campos.');
        return;
    }

    const res = await fetch(`${window.API_BASE_URL}/api/usuarios/confirm-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaClave })
    });

    const data = await res.json();

    if (res.ok) {
        // Mostrar notificación especial de cambio de clave exitoso
        window.notificaciones.cambioClave(data.mensaje || 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.');
        
        // Redirigir al login después de un delay
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    } else {
        window.notificaciones.error(data.error || 'Error al restablecer la contraseña. Por favor, intente nuevamente.');
    }
});