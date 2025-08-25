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
    let usuarioEditandoId = null;
    
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usuario = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            telefono: document.getElementById('phone').value,
            rol: document.getElementById('role').value
        };
        try {
            if (editando && usuarioEditandoId) {
                // Actualizar usuario
                const response = await fetch(`http://localhost:4000/api/usuarios/${usuarioEditandoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                });
                if (!response.ok) throw new Error('Error actualizando usuario');
                alert('Usuario actualizado correctamente');
            } else {
                // Crear usuario
                const response = await fetch('http://localhost:4000/api/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                });
                if (!response.ok) {
                    const error = await response.json();
                    alert(error.error || 'Error creando usuario');
                    return;
                }
                alert('Usuario guardado correctamente');
            }
            resetForm();
            cargarUsuarios();
            userListContainer.style.display = 'block';
            profileForm.style.display = 'none';
        } catch (error) {
            alert('Error de conexión con el servidor.');
        }
    });
    
    // Función para resetear el formulario
    function resetForm() {
        profileForm.reset();
        editando = false;
        usuarioEditandoId = null;
        document.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Guardar Usuario';
    }
    
    // Función para cargar usuarios
    async function cargarUsuarios() {
        try {
            const response = await fetch('http://localhost:4000/api/usuarios');
            const usuarios = await response.json();
            const tbody = document.getElementById('userTableBody');
            tbody.innerHTML = '';
            if (!usuarios.length) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="5" class="text-center">No hay usuarios registrados</td>';
                tbody.appendChild(tr);
                return;
            }
            usuarios.forEach((usuario) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-title="Usuario">${usuario.username}</td>
                    <td data-title="Correo">${usuario.email}</td>
                    <td data-title="Teléfono">${usuario.telefono}</td>
                    <td data-title="Rol">${usuario.rol}</td>
                    <td data-title="Acciones">
                        <div class="btn-group-actions">
                            <button class="btn btn-sm btn-warning editar-btn" data-id="${usuario.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger eliminar-btn" data-id="${usuario.id}">
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
                    const id = this.getAttribute('data-id');
                    editarUsuario(id);
                });
            });
            // Configurar botones de eliminar
            document.querySelectorAll('.eliminar-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    eliminarUsuario(id);
                });
            });
        } catch (error) {
            alert('Error cargando usuarios desde el servidor.');
        }
    }
    
    // Función para editar usuario
    async function editarUsuario(id) {
        try {
            const response = await fetch(`http://localhost:4000/api/usuarios/${id}`);
            if (!response.ok) throw new Error('Usuario no encontrado');
            const usuario = await response.json();
            document.getElementById('username').value = usuario.username;
            document.getElementById('email').value = usuario.email;
            document.getElementById('password').value = usuario.password;
            document.getElementById('phone').value = usuario.telefono;
            document.getElementById('role').value = usuario.rol;
            editando = true;
            usuarioEditandoId = id;
            document.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Actualizar Usuario';
            userListContainer.style.display = 'none';
            profileForm.style.display = 'block';
            profileForm.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            alert('Error al cargar usuario para editar.');
        }
    }
    
    // Función para eliminar usuario
    async function eliminarUsuario(id) {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Error eliminando usuario');
                cargarUsuarios();
                alert('Usuario eliminado correctamente');
            } catch (error) {
                alert('Error de conexión con el servidor.');
            }
        }
    }
}); 