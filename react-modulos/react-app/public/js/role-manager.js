/**
 * Sistema de gestión de roles y permisos para ITECH Support
 * Maneja el control de acceso dinámico en el frontend
 */

class RoleManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.initializeRoleControl();
    }

    // Obtener usuario actual del sessionStorage
    getCurrentUser() {
        try {
            const userData = sessionStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    // Verificar si el usuario tiene acceso a un módulo específico
    hasModuleAccess(module) {
        if (!this.currentUser || !this.currentUser.accessibleModules) {
            return false;
        }
        return this.currentUser.accessibleModules.includes(module);
    }

    // Verificar si el usuario tiene un permiso específico
    hasPermission(module, action) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        
        const modulePermissions = this.currentUser.permissions[module];
        return modulePermissions && modulePermissions.includes(action);
    }

    // Verificar si el usuario tiene uno de los roles especificados
    hasRole(roles) {
        if (!this.currentUser) return false;
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        return rolesArray.includes(this.currentUser.rol);
    }

    // Inicializar control de roles en la página actual
    initializeRoleControl() {
        if (!this.currentUser) {
            this.redirectToLogin();
            return;
        }

        this.hideUnauthorizedElements();
        this.hideUnauthorizedNavItems();
        this.updateUIBasedOnRole();
        this.setupPermissionChecks();
    }

    // Ocultar elementos no autorizados
    hideUnauthorizedElements() {
        // Elementos con atributo data-require-module
        const moduleElements = document.querySelectorAll('[data-require-module]');
        moduleElements.forEach(element => {
            const requiredModule = element.getAttribute('data-require-module');
            if (!this.hasModuleAccess(requiredModule)) {
                element.style.display = 'none';
            }
        });

        // Elementos con atributo data-require-permission
        const permissionElements = document.querySelectorAll('[data-require-permission]');
        permissionElements.forEach(element => {
            const permission = element.getAttribute('data-require-permission');
            const [module, action] = permission.split(':');
            if (!this.hasPermission(module, action)) {
                element.style.display = 'none';
            }
        });

        // Elementos con atributo data-require-role
        const roleElements = document.querySelectorAll('[data-require-role]');
        roleElements.forEach(element => {
            const requiredRoles = element.getAttribute('data-require-role').split(' ');
            if (!this.hasRole(requiredRoles)) {
                element.style.display = 'none';
            }
        });
    }

    // Ocultar elementos de navegación no autorizados
    hideUnauthorizedNavItems() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;

            const href = link.getAttribute('href');
            let shouldHide = false;

            // Mapear páginas a módulos requeridos
            const pageModuleMap = {
                'gestion-reparacion.html': 'reparaciones',
                'inventario.html': 'inventario',
                'clientes.html': 'clientes',
                'ventas-informes.html': 'ventas',
                'pago-facturacion.html': 'facturas',
                'configuracion.html': 'configuracion',
                'config_perfil.html': 'usuarios'
            };

            if (href && pageModuleMap[href]) {
                const requiredModule = pageModuleMap[href];
                if (!this.hasModuleAccess(requiredModule)) {
                    shouldHide = true;
                }
            }

            // Ocultar configuración para no administradores
            if (href === 'configuracion.html' && !this.hasRole('Administrador')) {
                shouldHide = true;
            }

            if (shouldHide) {
                item.style.display = 'none';
            }
        });
    }

    // Actualizar UI basada en el rol
    updateUIBasedOnRole() {
        // Actualizar elementos con información del usuario
        const userRoleElements = document.querySelectorAll('.user-role');
        userRoleElements.forEach(element => {
            element.textContent = this.currentUser.rol;
        });

        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = this.currentUser.username;
        });

        // Agregar clase CSS basada en el rol para estilos específicos
        document.body.classList.add(`role-${this.currentUser.rol.toLowerCase()}`);

        // Mostrar/ocultar elementos según permisos específicos
        this.handleSpecificPermissions();
    }

    // Manejar permisos específicos para funcionalidades
    handleSpecificPermissions() {
        // Botones de crear/editar/eliminar
        const createButtons = document.querySelectorAll('[data-action="create"]');
        createButtons.forEach(button => {
            const module = button.getAttribute('data-module') || this.getCurrentModule();
            if (!this.hasPermission(module, 'create')) {
                button.style.display = 'none';
            }
        });

        const editButtons = document.querySelectorAll('[data-action="edit"], .editar');
        editButtons.forEach(button => {
            const module = button.getAttribute('data-module') || this.getCurrentModule();
            if (!this.hasPermission(module, 'update')) {
                button.style.display = 'none';
            }
        });

        const deleteButtons = document.querySelectorAll('[data-action="delete"], .eliminar');
        deleteButtons.forEach(button => {
            const module = button.getAttribute('data-module') || this.getCurrentModule();
            if (!this.hasPermission(module, 'delete')) {
                button.style.display = 'none';
            }
        });

        // Campos de solo lectura para usuarios sin permisos de edición
        this.handleReadOnlyFields();
    }

    // Manejar campos de solo lectura
    handleReadOnlyFields() {
        const currentModule = this.getCurrentModule();
        
        if (!this.hasPermission(currentModule, 'update')) {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (!input.hasAttribute('data-always-enabled')) {
                        input.disabled = true;
                    }
                });

                const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
                submitButtons.forEach(button => {
                    button.style.display = 'none';
                });
            });
        }
    }

    // Obtener módulo actual basado en la página
    getCurrentModule() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        
        const moduleMap = {
            'gestion-reparacion.html': 'reparaciones',
            'inventario.html': 'inventario',
            'clientes.html': 'clientes',
            'ventas-informes.html': 'ventas',
            'pago-facturacion.html': 'facturas',
            'configuracion.html': 'configuracion',
            'config_perfil.html': 'usuarios'
        };

        return moduleMap[fileName] || 'general';
    }

    // Configurar verificaciones de permisos para acciones dinámicas
    setupPermissionChecks() {
        // Interceptar clicks en elementos que requieren permisos
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-permission-check]');
            if (element) {
                const permission = element.getAttribute('data-permission-check');
                const [module, action] = permission.split(':');
                
                if (!this.hasPermission(module, action)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showPermissionError(module, action);
                    return false;
                }
            }
        });

        // Interceptar formularios que requieren permisos
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const permission = form.getAttribute('data-require-permission');
            
            if (permission) {
                const [module, action] = permission.split(':');
                if (!this.hasPermission(module, action)) {
                    e.preventDefault();
                    this.showPermissionError(module, action);
                    return false;
                }
            }
        });
    }

    // Mostrar error de permisos
    showPermissionError(module, action) {
        const message = `No tienes permisos para ${action} en ${module}. Tu rol actual: ${this.currentUser.rol}`;
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: message,
                confirmButtonColor: '#d33'
            });
        } else {
            alert(message);
        }
    }

    // Redireccionar al login si no hay usuario
    redirectToLogin() {
        if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('index.html')) {
            alert('Sesión no válida. Redirigiendo al login...');
            window.location.href = 'index.html';
        }
    }

    // Verificar si el token es válido
    isTokenValid() {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }

    // Refrescar información del usuario desde el servidor
    async refreshUserInfo() {
        try {
            const token = sessionStorage.getItem('jwtToken');
            if (!token) {
                this.redirectToLogin();
                return;
            }

            const response = await fetch('http://localhost:4000/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                this.redirectToLogin();
                return;
            }

            const data = await response.json();
            sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            this.currentUser = data.user;
            
            // Reinicializar controles
            this.initializeRoleControl();

        } catch (error) {
            console.error('Error refreshing user info:', error);
            this.redirectToLogin();
        }
    }

    // Método público para verificar permisos desde otros scripts
    static checkPermission(module, action) {
        const instance = new RoleManager();
        return instance.hasPermission(module, action);
    }

    // Método público para verificar acceso a módulos
    static checkModuleAccess(module) {
        const instance = new RoleManager();
        return instance.hasModuleAccess(module);
    }

    // Método público para verificar roles
    static checkRole(roles) {
        const instance = new RoleManager();
        return instance.hasRole(roles);
    }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no estamos en la página de login
    if (!window.location.pathname.endsWith('index.html')) {
        window.roleManager = new RoleManager();
    }
});

// Exportar para uso global
window.RoleManager = RoleManager;