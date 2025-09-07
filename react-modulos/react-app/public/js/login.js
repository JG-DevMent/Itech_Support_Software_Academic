document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    // Verificar si ya hay una sesión activa
    checkExistingSession();

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const submitBtn = document.querySelector('button[type="submit"]');

        if (!username || !password) {
            mostrarError('Por favor ingresa usuario y contraseña');
            return;
        }

        // Deshabilitar botón durante la petición
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                mostrarError(data.error || 'Usuario o contraseña incorrectos');
                return;
            }

            // Guardar token JWT
            sessionStorage.setItem('jwtToken', data.token);
            
            // Guardar información del usuario con permisos
            sessionStorage.setItem('currentUser', JSON.stringify({
                ...data.user,
                token: data.token,
                loginTime: new Date().toISOString()
            }));

            // Mensaje de bienvenida personalizado según el rol
            const welcomeMessage = getWelcomeMessage(data.user);
            mostrarExito(welcomeMessage);

            // Redireccionar después de un breve delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);

        } catch (error) {
            console.error('Error en login:', error);
            mostrarError('Error de conexión con el servidor. Verifique su conexión.');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Iniciar Sesión';
        }
    });

    // Funciones auxiliares
    function checkExistingSession() {
        const currentUser = sessionStorage.getItem('currentUser');
        const token = sessionStorage.getItem('jwtToken');
        
        if (currentUser && token) {
            try {
                const userData = JSON.parse(currentUser);
                if (isTokenValid(token)) {
                    mostrarInfo(`Ya tienes una sesión activa como ${userData.username}. Redirigiendo...`);
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 2000);
                } else {
                    // Token expirado, limpiar sesión
                    sessionStorage.clear();
                }
            } catch (error) {
                // Datos corruptos, limpiar sesión
                sessionStorage.clear();
            }
        }
    }

    function isTokenValid(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }

    function getWelcomeMessage(user) {
        const roleMessages = {
            'Administrador': `¡Bienvenido, ${user.username}! Tienes acceso completo al sistema.`,
            'Técnico': `¡Bienvenido, ${user.username}! Listo para gestionar reparaciones.`,
            'Vendedor': `¡Bienvenido, ${user.username}! Listo para gestionar ventas y clientes.`,
            'Usuario': `¡Bienvenido, ${user.username}! Acceso limitado habilitado.`
        };
        return roleMessages[user.rol] || `¡Bienvenido, ${user.username}!`;
    }

    function mostrarError(mensaje) {
        mostrarMensaje(mensaje, 'error');
    }

    function mostrarExito(mensaje) {
        mostrarMensaje(mensaje, 'success');
    }

    function mostrarInfo(mensaje) {
        mostrarMensaje(mensaje, 'info');
    }

    function mostrarMensaje(mensaje, tipo) {
        // Remover mensajes anteriores
        const mensajesAnteriores = document.querySelectorAll('.mensaje-auth');
        mensajesAnteriores.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `mensaje-auth alert`;
        messageDiv.style.margin = '15px 0';
        messageDiv.style.padding = '12px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.fontSize = '14px';

        switch (tipo) {
            case 'error':
                messageDiv.style.backgroundColor = '#f8d7da';
                messageDiv.style.color = '#721c24';
                messageDiv.style.border = '1px solid #f5c6cb';
                messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
                break;
            case 'success':
                messageDiv.style.backgroundColor = '#d4edda';
                messageDiv.style.color = '#155724';
                messageDiv.style.border = '1px solid #c3e6cb';
                messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
                break;
            case 'info':
                messageDiv.style.backgroundColor = '#d1ecf1';
                messageDiv.style.color = '#0c5460';
                messageDiv.style.border = '1px solid #bee5eb';
                messageDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${mensaje}`;
                break;
        }

        loginForm.insertAdjacentElement('afterend', messageDiv);

        // Auto-remover después de 5 segundos para mensajes de error
        if (tipo === 'error') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
}); 