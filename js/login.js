document.addEventListener('DOMContentLoaded', function() {
    // Creamos usuarios por defecto si no hay usuarios
    function createDefaultUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.length === 0) {
            console.log("No hay usuarios registrados, creando usuarios por defecto");
            
            // Crear varios usuarios por defecto para diferentes roles
            const defaultUsers = [
                {
                    id: Date.now(),
                    username: 'admin',
                    email: 'admin@itechsupport.com',
                    password: 'admin123',
                    phone: '123456789',
                    role: 'Administrador'
                },
                {
                    id: Date.now() + 1,
                    username: 'tecnico',
                    email: 'tecnico@itechsupport.com',
                    password: 'tecnico123',
                    phone: '987654321',
                    role: 'Técnico'
                },
                {
                    id: Date.now() + 2,
                    username: 'vendedor',
                    email: 'vendedor@itechsupport.com',
                    password: 'vendedor123',
                    phone: '456789123',
                    role: 'Vendedor'
                }
            ];
            
            // Guardar usuarios en localStorage
            localStorage.setItem('users', JSON.stringify(defaultUsers));
            console.log('Usuarios por defecto creados');
            alert('Se han creado usuarios por defecto:\n\n' + 
                  '1. Administrador\n' +
                  '   Usuario: admin\n' +
                  '   Contraseña: admin123\n\n' +
                  '2. Técnico\n' +
                  '   Usuario: tecnico\n' +
                  '   Contraseña: tecnico123\n\n' +
                  '3. Vendedor\n' +
                  '   Usuario: vendedor\n' +
                  '   Contraseña: vendedor123');
        } else {
            console.log("Usuarios existentes:", users.length);
            users.forEach(user => {
                console.log(`Usuario: ${user.username} / Rol: ${user.role} / Contraseña: ${user.password}`);
            });
        }
    }
    
    // Ejecutar creación de usuarios por defecto
    createDefaultUsers();
    
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