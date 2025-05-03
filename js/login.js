document.addEventListener('DOMContentLoaded', function() {
    // Crear usuario admin por defecto si no hay usuarios
    function createDefaultAdminUser() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.length === 0) {
            console.log("No hay usuarios registrados, creando usuario admin por defecto");
            
            // Crear solo el usuario admin
            const adminUser = {
                id: Date.now(),
                username: 'admin',
                email: 'admin@itechsupport.com',
                password: 'admin',
                phone: '123456789',
                role: 'Administrador'
            };
            
            // Guardar usuario en localStorage
            localStorage.setItem('users', JSON.stringify([adminUser]));
            console.log('Usuario admin por defecto creado');
        } else {
            console.log("Usuarios existentes:", users.length);
        }
    }
    
    // Ejecutar creación de usuario admin por defecto
    createDefaultAdminUser();
    
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log("Intentando login con:", username, password);
        
        // Obtener usuarios del localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        console.log("Usuarios disponibles:", users);
        
        // Buscar si existe un usuario con ese nombre y contraseña
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            console.log("Usuario encontrado:", user);
            // Guardar información del usuario actual en sesión
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            alert('¡Bienvenido ' + user.username + '!');
            
            // Redirigir a la página principal
            window.location.href = 'home.html';
        } else {
            console.log("Usuario no encontrado");
            alert('Usuario o contraseña incorrectos. Intente nuevamente.');
        }
    });
}); 