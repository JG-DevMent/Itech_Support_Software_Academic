document.addEventListener('DOMContentLoaded', function() {
    // Cargar usuarios al inicio
    cargarUsuarios();
    
    // Configuración de botones y formulario
    const showUserListBtn = document.getElementById('showUserList');
    const showUserFormBtn = document.getElementById('showUserForm');
    const userListContainer = document.getElementById('userListContainer');
    const profileForm = document.getElementById('profileForm');
    const cancelButton = document.getElementById('cancelButton');
    
    showUserListBtn.addEventListener('click', function() {
        userListContainer.style.display = 'block';
        profileForm.style.display = 'none';
        cargarUsuarios(); // Recargar usuarios al mostrar la lista
    });
    
    showUserFormBtn.addEventListener('click', function() {
        userListContainer.style.display = 'none';
        profileForm.style.display = 'block';
        resetForm();
    });
    
    cancelButton.addEventListener('click', function() {
        resetForm();
        userListContainer.style.display = 'block';
        profileForm.style.display = 'none';
    });
    
    // Manejo del formulario
    let editando = false;
    let indiceEditando = null;
    
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = {
            id: Date.now(),
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            role: document.getElementById('role').value
        };
        
        const usuarios = JSON.parse(localStorage.getItem('users')) || [];
        
        if (editando) {
            usuarios[indiceEditando] = { ...usuarios[indiceEditando], ...usuario };
            editando = false;
            indiceEditando = null;
        } else {
            usuarios.push(usuario);
        }
        
        localStorage.setItem('users', JSON.stringify(usuarios));
        resetForm();
        cargarUsuarios();
        
        userListContainer.style.display = 'block';
        profileForm.style.display = 'none';
        
        alert('Usuario guardado correctamente');
    });
    
    // Función para resetear el formulario
    function resetForm() {
        profileForm.reset();
        editando = false;
        indiceEditando = null;
        document.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Guardar Usuario';
    }
    
    // Función para cargar usuarios
    function cargarUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = document.getElementById('userTableBody');
        tbody.innerHTML = '';
        
        if (usuarios.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" class="text-center">No hay usuarios registrados</td>';
            tbody.appendChild(tr);
            return;
        }
        
        usuarios.forEach((usuario, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-title="Usuario">${usuario.username}</td>
                <td data-title="Correo">${usuario.email}</td>
                <td data-title="Teléfono">${usuario.phone}</td>
                <td data-title="Rol">${usuario.role}</td>
                <td data-title="Acciones">
                    <div class="btn-group-actions">
                        <button class="btn btn-sm btn-warning editar-btn" data-index="${index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger eliminar-btn" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Configurar botones de editar
        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editarUsuario(index);
            });
        });
        
        // Configurar botones de eliminar
        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                eliminarUsuario(index);
            });
        });
    }
    
    // Función para editar usuario
    function editarUsuario(index) {
        const usuarios = JSON.parse(localStorage.getItem('users')) || [];
        const usuario = usuarios[index];
        
        document.getElementById('username').value = usuario.username;
        document.getElementById('email').value = usuario.email;
        document.getElementById('password').value = usuario.password;
        document.getElementById('phone').value = usuario.phone;
        document.getElementById('role').value = usuario.role;
        
        editando = true;
        indiceEditando = index;
        
        document.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Actualizar Usuario';
        
        userListContainer.style.display = 'none';
        profileForm.style.display = 'block';
        
        // Desplazar hacia el formulario
        profileForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Función para eliminar usuario
    function eliminarUsuario(index) {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            const usuarios = JSON.parse(localStorage.getItem('users')) || [];
            usuarios.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(usuarios));
            cargarUsuarios();
            alert('Usuario eliminado correctamente');
        }
    }
}); 