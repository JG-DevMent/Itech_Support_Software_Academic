/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

// Código para el cerrar menú de navegación(Desplegable)
document.addEventListener('DOMContentLoaded', function() {
    // Función para verificar si el usuario está en una página protegida
    function checkProtectedPage() {
        // Lista de páginas que no requieren autenticación
        const publicPages = ['index.html', 'reset-password.html'];
        
        // Obtener nombre de la página actual
        const currentPage = window.location.pathname.split('/').pop();
        
        if (!publicPages.includes(currentPage)) {
            // Si no es página pública, verificar autenticación
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            /*console.log('Usuario cargado desde sessionStorage:', currentUser);*/

            if (!currentUser) {
                window.notificaciones.error('Debes iniciar sesión para acceder a esta página.');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                return false;
            }
            
            // Verificar acceso según rol
            checkRoleAccess(currentUser);
        }
        return true;
    }
    
    // Función para verificar y aplicar restricciones según rol
    function checkRoleAccess(user) {
        //Verificar y compatibilidad de role y rol
        const userRole = user.role || user.rol;

        if (!userRole) {
            console.log('No hay rol definido para el usuario');
            console.log('Usuario completo:', user);
            return; // Si no hay rol definido, no aplicar restricciones
        }
        
        // Normalizar el rol para que funcione con el resto del código
        user.role = userRole;
        
        // Obtener la página actual
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        console.log('Verificando acceso:', {
            user: user.username,
            role: user.role,
            originalRol: user.rol,
            currentPage: currentPage,
            userData: user
        });
        
        // Páginas públicas que todos los roles pueden acceder
        const publicForAllRoles = [];
        
        // Si la página es accesible para todos los roles, permitir acceso
        if (publicForAllRoles.includes(currentPage)) {
            /*console.log('Página pública, permitiendo acceso');*/
            return true;
        }
        
        // Definir accesos por rol
        const roleAccess = {
            'Administrador': {
                // Acceso completo a todas las páginas
                restricted: []
            },
            'Técnico': {
                // Páginas a las que NO tiene acceso
                restricted: ['configuracion.html', 'config_perfil.html', 'config_recibos.html', 'config_tienda.html', 'ventas-informes.html', 'pago-facturacion.html'],
                // Páginas en las que solo tiene acceso de lectura
                readOnly: ['clientes.html']
            },
            'Vendedor': {
                // Páginas a las que NO tiene acceso
                restricted: ['configuracion.html', 'config_perfil.html', 'config_recibos.html', 'config_tienda.html', 'gestion-reparacion.html']
            }
        };
        
        // Verificar restricciones de acceso
        const restrictions = roleAccess[user.role];

        console.log('Restricciones para el rol:', {
            userRole: user.role,
            restrictions: restrictions,
            isRestricted: restrictions && restrictions.restricted.includes(currentPage),
        });
        
        if (restrictions && restrictions.restricted.includes(currentPage)) {
            // Si la página actual está restringida para este rol
            /*console.log('ACCESO DENEGADO: Página restringida para este rol');*/
            window.notificaciones.error('No tienes permiso para acceder a esta página.');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
            return false;
        }
        
        // Aplicar restricciones de solo lectura si corresponde
        if (restrictions && restrictions.readOnly && restrictions.readOnly.includes(currentPage)) {
            // Si la página es de solo lectura para este rol
            /*console.log('Aplicando restricciones de solo lectura');*/
            applyReadOnlyRestrictions();
        }
        
        // Actualizar el menú lateral según permisos del rol
        updateSidebarMenu(user.role, roleAccess, publicForAllRoles);
        
        // Mostrar información del usuario actual
        displayUserInfo(user);
        
        // Restricciones específicas por rol y página
        applySpecificRoleRestrictions(user.role, currentPage);

        console.log('Acceso permitido');
        return true;
    }
    
    // Función para aplicar restricciones específicas por rol y página
    function applySpecificRoleRestrictions(userRole, currentPage) {
        // Restricciones para el rol de Vendedor
        if (userRole === 'Vendedor') {
            // Ocultar botón de nueva reparación en home.html
            if (currentPage === 'home.html' || currentPage === '') {
                const nuevaReparacionBtn = document.querySelector('a[href="gestion-reparacion.html"].boton-accion');
                if (nuevaReparacionBtn) {
                    nuevaReparacionBtn.style.display = 'none';
                }
            }
        }
        
        // Restricciones para el rol de Técnico
        if (userRole === 'Técnico') {
            // Restricciones para la página de clientes
            if (currentPage === 'clientes.html') {
                // 1. Ocultar botón de agregar cliente
                const addClienteBtn = document.querySelector('.btn-addcliente');
                if (addClienteBtn) {
                    addClienteBtn.style.display = 'none';
                }
                
                // 2. Deshabilitar botones de editar y eliminar en la tabla
                const actionButtons = document.querySelectorAll('.editar-btn, .eliminar-btn, .edit-btn, .delete-btn');
                actionButtons.forEach(button => {
                    button.disabled = true;
                    button.classList.add('disabled');
                    button.title = 'No tienes permisos para realizar esta acción';
                });
                
                // 3. Prevenir apertura del modal de agregar/editar cliente
                const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
                modalTriggers.forEach(trigger => {
                    if (trigger.getAttribute('data-target') === '#agregarClienteModal') {
                        // Remover atributo data-toggle para prevenir apertura del modal
                        trigger.removeAttribute('data-toggle');
                        trigger.removeAttribute('data-target');
                        trigger.addEventListener('click', (e) => {
                            e.preventDefault();
                            window.notificaciones.error('No tienes permisos para agregar o modificar clientes.');
                        });
                    }
                });
                
                // 4. Prevenir envío del formulario de cliente
                const formCliente = document.getElementById('formCliente');
                if (formCliente) {
                    const originalSubmit = formCliente.onsubmit;
                    formCliente.onsubmit = function(e) {
                        e.preventDefault();
                        window.notificaciones.error('No tienes permisos para agregar o modificar clientes.');
                        return false;
                    };
                }
                
                // 5. Interceptar clic en botones de editar y eliminar mediante delegación de eventos
                document.addEventListener('click', function(e) {
                    if (e.target.classList.contains('editar-btn') || 
                        e.target.classList.contains('eliminar-btn') ||
                        e.target.closest('.editar-btn') ||
                        e.target.closest('.eliminar-btn')) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.notificaciones.error('No tienes permisos para realizar esta acción.');
                    }
                }, true); // Usar capturing para interceptar el evento antes
                
                // 6. Interceptar apertura de modal mediante evento bootstrap
                $(document).on('show.bs.modal', '#agregarClienteModal', function (e) {
                    if (userRole === 'Técnico') {
                        e.preventDefault();
                        window.notificaciones.error('No tienes permisos para agregar o modificar clientes.');
                    }
                });
                
                // 7. Asegurar que el campo de búsqueda y botón de búsqueda estén habilitados
                const clienteBusqueda = document.getElementById('clienteBusqueda');
                const btnBuscar = document.getElementById('btnCliente');
                
                if (clienteBusqueda) {
                    clienteBusqueda.disabled = false;
                    clienteBusqueda.readOnly = false;
                }
                
                if (btnBuscar) {
                    btnBuscar.disabled = false;
                    btnBuscar.classList.remove('disabled');
                }
            }
        }
    }
    
    // Función para aplicar restricciones de solo lectura
    function applyReadOnlyRestrictions() {
        // Deshabilitar botones de acción (guardar, crear, editar, eliminar)
        const actionButtons = document.querySelectorAll('button[type="submit"], .btn-primary:not(.btn-filter), .edit-btn, .delete-btn, .create-btn, .add-btn');
        
        actionButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
            if (!button.title) {
                button.title = 'No tienes permisos para realizar esta acción';
            }
        });
        
        // Deshabilitar formularios
        const forms = document.querySelectorAll('form:not(#loginForm):not(#resetPasswordForm)');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.readOnly = true;
                if (input.tagName === 'SELECT') {
                    input.disabled = true;
                }
            });
        });
    }
    
    // Función para actualizar el menú lateral según los permisos del rol
    function updateSidebarMenu(userRole, roleAccess, publicForAllRoles) {
        if (!userRole || !roleAccess[userRole]) return;
        
        const restrictedPages = roleAccess[userRole].restricted || [];
        
        // Actualizar visibilidad de las opciones del menú
        const menuItems = document.querySelectorAll('.sidebar .nav-item:not(:last-child)');
        
        menuItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // No ocultar enlaces a páginas públicas para todos los roles
            if (publicForAllRoles && publicForAllRoles.some(page => href.includes(page))) {
                return; // Mantener visible esta opción de menú
            }
            
            // Ocultar opciones restringidas
            if (restrictedPages.some(page => href.includes(page))) {
                item.style.display = 'none';
            }
        });
    }
    
    // Función para mostrar información del usuario actual
    function displayUserInfo(user) {
        // Verificar si ya existe el elemento
        const existingUserInfo = document.querySelector('.user-info');
        if (existingUserInfo) return;
        
        // Crear elemento para mostrar información del usuario
        const userInfoContainer = document.createElement('div');
        userInfoContainer.className = 'user-info';
        userInfoContainer.innerHTML = `
            <div class="user-info-name">${user.username}</div>
            <div class="user-info-role">${user.role}</div>
        `;
        
        // Agregar a la interfaz
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const logoContainer = sidebar.querySelector('.logo-container');
            if (logoContainer) {
                logoContainer.insertAdjacentElement('afterend', userInfoContainer);
            }
        }
    }
    
    // Verificar si está en una página protegida
    checkProtectedPage();
    
    // Código para controlar el toggle del sidebar de manera universal
    function setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggleCustom');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                console.log('Sidebar toggle clicked');
                
                // Alternar clase en el cuerpo para el estado del sidebar
                document.body.classList.toggle('sidebar-toggled');
                
                // Alternar clase en el sidebar
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('toggled');
                    
                    // Si está colapsado, cerrar cualquier menú desplegable
                    if (sidebar.classList.contains('toggled')) {
                        const collapseElements = sidebar.querySelectorAll('.collapse');
                        collapseElements.forEach(function(el) {
                            if ($(el).hasClass('show')) {
                                $(el).collapse('hide');
                            }
                        });
                    }
                }
                
                // Guardar el estado del sidebar en localStorage para mantenerlo entre páginas
                localStorage.setItem('sidebarToggled', document.body.classList.contains('sidebar-toggled'));
            });
        }
        
        // Restaurar el estado del sidebar al cargar la página
        const sidebarToggled = localStorage.getItem('sidebarToggled') === 'true';
        if (sidebarToggled) {
            document.body.classList.add('sidebar-toggled');
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.add('toggled');
            }
        }
    }

    // Ejecutar la configuración del sidebar
    setupSidebarToggle();
    
    // Código para el botón de chat (Ayuda y soporte)
    if (typeof toggleChat === 'function') {
        const chatButton = document.querySelector('.chat-button');
        if (chatButton) {
            chatButton.addEventListener('click', toggleChat);
        }
    }
    
    // Código para el botón de filtrar fechas
    const btnFiltrar = document.querySelector(".btn-filtrar");
    if (btnFiltrar) {
        btnFiltrar.addEventListener("click", () => {
            window.notificaciones.informacion("La funcionalidad de filtro de fechas estará disponible próximamente.");
        });
    }
});

// Código para el botón de chat(Ayuda y soporte)
function toggleChat() {
  const chatBox = document.getElementById('chatBox');
  chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
}

// Código para el botón de filtrar fechas
document.querySelector(".btn-filtrar")?.addEventListener("click", () => {
  window.notificaciones.informacion("La funcionalidad de filtro de fechas estará disponible próximamente.");
});

function cerrarSesion() {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "/";
}