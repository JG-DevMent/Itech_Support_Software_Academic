document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:4000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                alert('Usuario o contraseña incorrectos. Intente nuevamente.');
                return;
            }

            const user = await response.json();
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            alert('¡Bienvenido ' + user.username + '!');
            window.location.href = 'home.html';
        } catch (error) {
            alert('Error de conexión con el servidor.');
        }
    });
}); 