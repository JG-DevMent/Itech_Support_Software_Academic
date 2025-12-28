/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

document.addEventListener('DOMContentLoaded', function () {
    // Obtener token guardado (SessionStorage o LocalStorage según tu implementación)
    const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
  
    // Si no hay token, no debe permitir cargar usuarios
    if (!token) {
      window.notificaciones.error('No tienes sesión activa. Por favor, inicia sesión para continuar.');
      setTimeout(() => {
        window.location.href = '/login.html'; // ajusta ruta según tu login
      }, 2000);
      return;
    }

    let paginacionUsuarios = null;
    const tbody = document.getElementById('userTableBody');
    const contenedorPaginacion = document.getElementById('contenedorPaginacionUsuarios');
  
    // Cargar usuarios al inicio
    cargarUsuarios();
  
    // Configuración de botones y formulario
    const showUserListBtn = document.getElementById('showUserList');
    const showUserFormBtn = document.getElementById('showUserForm');
    const userListContainer = document.getElementById('userListContainer');
    const profileForm = document.getElementById('profileForm');
    const cancelButton = document.getElementById('cancelButton');
  
    showUserListBtn.addEventListener('click', function () {
      userListContainer.style.display = 'block';
      profileForm.style.display = 'none';
      cargarUsuarios(); // Recargar usuarios al mostrar la lista
    });
  
    showUserFormBtn.addEventListener('click', function () {
      userListContainer.style.display = 'none';
      profileForm.style.display = 'block';
      resetForm();
    });
  
    cancelButton.addEventListener('click', function () {
      resetForm();
      userListContainer.style.display = 'block';
      profileForm.style.display = 'none';
    });
  
    // Manejo del formulario
    let editando = false;
    let usuarioEditandoId = null;
  
    profileForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const usuario = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        telefono: document.getElementById('phone').value,
        rol: document.getElementById('role').value
      };

    // Validar contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(usuario.password)) {
        window.notificaciones.error('La contraseña debe tener mínimo 8 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).');
        return;
    }

      try {
        if (editando && usuarioEditandoId) {
          // Actualizar usuario
          const response = await fetch(`${window.API_BASE_URL}/api/usuarios/${usuarioEditandoId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
          });
  
          if (!response.ok) throw new Error('Error actualizando usuario');
          window.notificaciones.exito('Usuario actualizado correctamente.');
        } else {
          // Crear usuario
          const response = await fetch(`${window.API_BASE_URL}/api/usuarios`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
          });
  
          if (!response.ok) {
            const error = await response.json();
            window.notificaciones.error(error.error || 'Error al crear el usuario. Por favor, verifique los datos e intente nuevamente.');
            return;
          }
  
          window.notificaciones.exito('Usuario guardado correctamente.');
        }
  
        resetForm();
        cargarUsuarios();
        userListContainer.style.display = 'block';
        profileForm.style.display = 'none';
  
      } catch (error) {
        window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión e intente nuevamente.');
      }
    });
  
    // Función para resetear el formulario
    function resetForm() {
      profileForm.reset();
      editando = false;
      usuarioEditandoId = null;
      document.querySelector('button[type="submit"]').innerHTML =
        '<i class="fas fa-save"></i> Guardar Usuario';
    }
  
    // Función para renderizar una fila de usuario
    function renderizarFilaUsuario(usuario, index, tbody) {
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

        // Configurar botones de editar y eliminar para esta fila
        tr.querySelector('.editar-btn').addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            editarUsuario(id);
        });

        tr.querySelector('.eliminar-btn').addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            eliminarUsuario(id);
        });
    }

    // Función para cargar usuarios
    async function cargarUsuarios() {
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/usuarios`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('No autorizado o error en el servidor');

        const usuarios = await response.json();

        // Inicializar o actualizar paginación
        if (!paginacionUsuarios) {
            paginacionUsuarios = new Paginacion({
                datos: usuarios,
                elementoTabla: tbody,
                elementoControles: contenedorPaginacion,
                filasPorPagina: 6,
                funcionRenderizar: renderizarFilaUsuario
            });
        } else {
            paginacionUsuarios.setDatos(usuarios);
        }

      } catch (error) {
        window.notificaciones.error('Error al cargar los usuarios desde el servidor. Por favor, intente nuevamente.');
      }
    }
  
    // Función para editar usuario
    async function editarUsuario(id) {
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/usuarios/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        if (!response.ok) throw new Error('Usuario no encontrado');
  
        const usuario = await response.json();
        document.getElementById('username').value = usuario.username;
        document.getElementById('email').value = usuario.email;
        document.getElementById('password').value = usuario.password;
        document.getElementById('phone').value = usuario.telefono;
        document.getElementById('role').value = usuario.rol;
  
        editando = true;
        usuarioEditandoId = id;
        document.querySelector('button[type="submit"]').innerHTML =
          '<i class="fas fa-save"></i> Actualizar Usuario';
  
        userListContainer.style.display = 'none';
        profileForm.style.display = 'block';
        profileForm.scrollIntoView({ behavior: 'smooth' });
  
      } catch (error) {
        window.notificaciones.error('Error al cargar el usuario para editar. Por favor, intente nuevamente.');
      }
    }
  
    // Función para eliminar usuario
    async function eliminarUsuario(id) {
      const confirmado = await window.confirmar(
        '¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer y el usuario perderá acceso al sistema.',
        'Confirmar eliminación de usuario'
      );
      if (confirmado) {
        try {
          const response = await fetch(`${window.API_BASE_URL}/api/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
  
          if (!response.ok) throw new Error('Error eliminando usuario');
  
          cargarUsuarios();
          window.notificaciones.exito('Usuario eliminado correctamente.');
  
        } catch (error) {
          window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión e intente nuevamente.');
        }
      }
    }
  });