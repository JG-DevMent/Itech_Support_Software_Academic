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

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const profileForm = document.getElementById('profileForm');
    const showUserListBtn = document.getElementById('showUserList');
    const showUserFormBtn = document.getElementById('showUserForm');
    const userListContainer = document.getElementById('userListContainer');
    const cancelButton = document.getElementById('cancelButton');
    const userTableBody = document.getElementById('userTableBody');
    
    let editingUserId = null;
    
    // Mostrar lista de usuarios
    if (showUserListBtn) {
        showUserListBtn.addEventListener('click', function() {
            userListContainer.style.display = 'block';
            profileForm.style.display = 'none';
            loadUserTable();
        });
    }
    
    // Mostrar formulario de usuario
    if (showUserFormBtn) {
        showUserFormBtn.addEventListener('click', function() {
            userListContainer.style.display = 'none';
            profileForm.style.display = 'block';
            resetForm();
        });
    }
    
    // Botón cancelar
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            resetForm();
            if (userListContainer && userListContainer.style.display === 'block') {
                // Volver a la lista si estaba visible
            } else {
                window.location.href = 'configuracion.html';
            }
        });
    }
    
    // Guardar usuario
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phone = document.getElementById('phone').value;
            const role = document.getElementById('role').value;
            
            // Obtener usuarios existentes o crear array vacío
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (editingUserId !== null) {
                // Editar usuario existente
                const userIndex = users.findIndex(u => u.id === editingUserId);
                if (userIndex !== -1) {
                    users[userIndex] = {
                        id: editingUserId,
                        username,
                        email,
                        password,
                        phone,
                        role
                    };
                }
            } else {
                // Verificar si ya existe un usuario con ese nombre
                const userExists = users.some(u => u.username === username);
                
                if (userExists) {
                    alert('Ya existe un usuario con ese nombre. Por favor, utiliza otro nombre de usuario.');
                    return;
                }
                
                // Crear nuevo usuario
                const newUser = {
                    id: Date.now(), // ID único basado en timestamp
                    username,
                    email,
                    password,
                    phone,
                    role
                };
                
                users.push(newUser);
            }
            
            // Guardar en localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            alert(editingUserId !== null ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
            
            // Resetear formulario
            resetForm();
            
            // Si estamos viendo la lista, actualizar
            if (userListContainer && userListContainer.style.display === 'block') {
                loadUserTable();
            }
        });
    }
    
    // Cargar tabla de usuarios
    function loadUserTable() {
        if (!userTableBody) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Limpiar tabla
        userTableBody.innerHTML = '';
        
        if (users.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" class="text-center">No hay usuarios registrados</td>';
            userTableBody.appendChild(row);
            return;
        }
        
        // Añadir cada usuario a la tabla
        users.forEach(user => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-sm btn-info edit-user" data-id="${user.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            
            userTableBody.appendChild(row);
        });
        
        // Agregar event listeners a los botones de acción
        addTableActionListeners();
    }
    
    // Añadir listeners a botones de editar y eliminar
    function addTableActionListeners() {
        // Botones de editar
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                editUser(userId);
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                deleteUser(userId);
            });
        });
    }
    
    // Editar usuario
    function editUser(userId) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        
        if (user) {
            // Llenar formulario con datos del usuario
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('password').value = user.password;
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('role').value = user.role;
            
            // Guardar ID del usuario que estamos editando
            editingUserId = userId;
            
            // Mostrar formulario
            if (userListContainer) {
                userListContainer.style.display = 'none';
                profileForm.style.display = 'block';
            }
        }
    }
    
    // Eliminar usuario
    function deleteUser(userId) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Filtrar lista para eliminar el usuario
            users = users.filter(u => u.id !== userId);
            
            // Guardar en localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Actualizar tabla
            loadUserTable();
            
            alert('Usuario eliminado correctamente');
        }
    }
    
    // Resetear formulario
    function resetForm() {
        if (profileForm) {
            profileForm.reset();
            editingUserId = null;
        }
    }
    
    // Cargar tabla de usuarios al inicio
    if (userListContainer) {
        loadUserTable();
    }
    
    // Crear usuario administrador por defecto si no existe ninguno
    function createDefaultAdmin() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Si no hay usuarios, crear un administrador por defecto
        if (users.length === 0) {
            const defaultAdmin = {
                id: Date.now(),
                username: 'admin',
                email: 'admin@itechsupport.com',
                password: 'admin123',
                phone: '',
                role: 'Administrador'
            };
            
            users.push(defaultAdmin);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Usuario administrador por defecto creado');
        }
    }
    
    // Inicializar con un usuario administrador por defecto
    createDefaultAdmin();
});