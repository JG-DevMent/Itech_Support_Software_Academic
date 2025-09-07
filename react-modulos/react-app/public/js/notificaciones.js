/**
 * Sistema de notificaciones para ITECH Support
 * Maneja envío de notificaciones por email y otras funcionalidades relacionadas
 */

class NotificationManager {
    constructor() {
        this.baseUrl = 'http://localhost:4000/api/notificaciones';
        this.token = sessionStorage.getItem('jwtToken');
        this.initializeEventListeners();
    }

    // Obtener headers de autenticación
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Inicializar event listeners
    initializeEventListeners() {
        // Event listener para botón de notificar en gestión de reparaciones
        document.addEventListener('click', (e) => {
            if (e.target.id === 'btnNotificar') {
                this.handleNotificarCliente();
            }
        });

        // Event listener para notificaciones automáticas en cambios de estado
        this.setupStateChangeNotifications();
    }

    // Configurar notificaciones automáticas para cambios de estado
    setupStateChangeNotifications() {
        // Interceptar cambios en selects de estado
        document.addEventListener('change', (e) => {
            if (e.target.id === 'estado' || e.target.classList.contains('estado-reparacion')) {
                const reparacionId = this.extractReparacionId(e.target);
                if (reparacionId) {
                    this.scheduleStateChangeNotification(reparacionId, e.target.value);
                }
            }
        });
    }

    // Extraer ID de reparación del contexto del elemento
    extractReparacionId(element) {
        // Buscar el ID en diferentes lugares posibles
        const row = element.closest('tr');
        if (row) {
            const idCell = row.querySelector('td:first-child');
            if (idCell) {
                return idCell.textContent.trim();
            }
        }
        
        // Buscar en formularios
        const form = element.closest('form');
        if (form) {
            const idInput = form.querySelector('input[name="id"], #reparacionId, [data-reparacion-id]');
            if (idInput) {
                return idInput.value || idInput.getAttribute('data-reparacion-id');
            }
        }
        
        return null;
    }

    // Programar notificación de cambio de estado (con delay para evitar spam)
    scheduleStateChangeNotification(reparacionId, nuevoEstado) {
        // Cancelar notificación anterior si existe
        if (this.stateChangeTimeout) {
            clearTimeout(this.stateChangeTimeout);
        }

        // Programar notificación después de 2 segundos
        this.stateChangeTimeout = setTimeout(() => {
            this.notificarCambioEstado(reparacionId, nuevoEstado);
        }, 2000);
    }

    // Notificar cambio de estado de reparación
    async notificarCambioEstado(reparacionId, nuevoEstado) {
        try {
            const response = await fetch(`${this.baseUrl}/estado-reparacion`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    reparacionId: reparacionId,
                    nuevoEstado: nuevoEstado
                })
            });

            const result = await response.json();

            if (response.ok) {
                this.mostrarNotificacionExito(
                    `📧 Notificación enviada`,
                    `Se notificó al cliente sobre el cambio de estado a: ${nuevoEstado}`
                );
                console.log('Notificación de estado enviada:', result);
            } else {
                console.warn('No se pudo enviar notificación:', result.error);
            }
        } catch (error) {
            console.error('Error enviando notificación de estado:', error);
        }
    }

    // Manejar click en botón "Notificar Cliente"
    async handleNotificarCliente() {
        const reparacionId = this.getReparacionIdFromForm();
        const estado = this.getCurrentEstado();

        if (!reparacionId) {
            this.mostrarNotificacionError('Error', 'No se pudo identificar la reparación');
            return;
        }

        const confirmacion = confirm(`¿Enviar notificación al cliente sobre el estado actual: ${estado}?`);
        if (!confirmacion) return;

        await this.notificarCambioEstado(reparacionId, estado);
    }

    // Obtener ID de reparación del formulario actual
    getReparacionIdFromForm() {
        // Buscar en diferentes lugares posibles
        const idInputs = [
            document.querySelector('#reparacionId'),
            document.querySelector('input[name="id"]'),
            document.querySelector('[data-reparacion-id]')
        ];

        for (const input of idInputs) {
            if (input && input.value) {
                return input.value;
            }
        }

        // Si estamos en una tabla, buscar ID seleccionado
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) {
            const idCell = selectedRow.querySelector('td:first-child');
            if (idCell) {
                return idCell.textContent.trim();
            }
        }

        return null;
    }

    // Obtener estado actual del formulario
    getCurrentEstado() {
        const estadoSelect = document.querySelector('#estado, .estado-reparacion');
        return estadoSelect ? estadoSelect.value : 'Sin estado';
    }

    // Notificar factura generada
    async notificarFactura(facturaId) {
        try {
            const response = await fetch(`${this.baseUrl}/factura-generada`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    facturaId: facturaId
                })
            });

            const result = await response.json();

            if (response.ok) {
                this.mostrarNotificacionExito(
                    `📧 Factura enviada por email`,
                    `Se envió la factura al cliente exitosamente`
                );
                console.log('Notificación de factura enviada:', result);
                return true;
            } else {
                this.mostrarNotificacionError('Error enviando factura', result.error);
                return false;
            }
        } catch (error) {
            console.error('Error enviando notificación de factura:', error);
            this.mostrarNotificacionError('Error', 'Error de conexión al enviar factura');
            return false;
        }
    }

    // Enviar recordatorio de reparación
    async enviarRecordatorio(reparacionId) {
        try {
            const response = await fetch(`${this.baseUrl}/recordatorio`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    reparacionId: reparacionId
                })
            });

            const result = await response.json();

            if (response.ok) {
                this.mostrarNotificacionExito(
                    `📧 Recordatorio enviado`,
                    `Se envió un recordatorio al cliente sobre la reparación #${reparacionId}`
                );
                return true;
            } else {
                this.mostrarNotificacionError('Error enviando recordatorio', result.error);
                return false;
            }
        } catch (error) {
            console.error('Error enviando recordatorio:', error);
            this.mostrarNotificacionError('Error', 'Error de conexión al enviar recordatorio');
            return false;
        }
    }

    // Verificar configuración de email
    async verificarConfiguracion() {
        try {
            const response = await fetch(`${this.baseUrl}/verificar-configuracion`, {
                headers: this.getAuthHeaders()
            });

            const result = await response.json();

            if (response.ok) {
                this.mostrarNotificacionExito('✅ Configuración de email', 'La configuración de email es válida');
                return true;
            } else {
                this.mostrarNotificacionError('❌ Configuración de email', result.error);
                return false;
            }
        } catch (error) {
            console.error('Error verificando configuración:', error);
            this.mostrarNotificacionError('Error', 'Error verificando configuración de email');
            return false;
        }
    }

    // Enviar notificación personalizada
    async enviarNotificacionPersonalizada(email, asunto, mensaje) {
        try {
            const response = await fetch(`${this.baseUrl}/personalizada`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    email: email,
                    asunto: asunto,
                    mensaje: mensaje
                })
            });

            const result = await response.json();

            if (response.ok) {
                this.mostrarNotificacionExito(
                    `📧 Mensaje enviado`,
                    `Se envió el mensaje personalizado a ${email}`
                );
                return true;
            } else {
                this.mostrarNotificacionError('Error enviando mensaje', result.error);
                return false;
            }
        } catch (error) {
            console.error('Error enviando notificación personalizada:', error);
            this.mostrarNotificacionError('Error', 'Error de conexión al enviar mensaje');
            return false;
        }
    }

    // Mostrar notificación de éxito
    mostrarNotificacionExito(titulo, mensaje) {
        this.mostrarNotificacion(titulo, mensaje, 'success');
    }

    // Mostrar notificación de error
    mostrarNotificacionError(titulo, mensaje) {
        this.mostrarNotificacion(titulo, mensaje, 'error');
    }

    // Mostrar notificación genérica
    mostrarNotificacion(titulo, mensaje, tipo) {
        // Usar SweetAlert si está disponible
        if (typeof Swal !== 'undefined') {
            const icon = tipo === 'success' ? 'success' : 'error';
            const color = tipo === 'success' ? '#28a745' : '#e74a3b';
            
            Swal.fire({
                icon: icon,
                title: titulo,
                text: mensaje,
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: color,
                showConfirmButton: false
            });
        } else {
            // Fallback a notificación HTML personalizada
            this.mostrarNotificacionHTML(titulo, mensaje, tipo);
        }
    }

    // Mostrar notificación HTML personalizada
    mostrarNotificacionHTML(titulo, mensaje, tipo) {
        // Remover notificaciones anteriores
        const notificacionesAnteriores = document.querySelectorAll('.notification-toast');
        notificacionesAnteriores.forEach(notif => notif.remove());

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 350px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 16px;
            border-left: 4px solid ${tipo === 'success' ? '#28a745' : '#e74a3b'};
            animation: slideIn 0.3s ease;
        `;

        const color = tipo === 'success' ? '#28a745' : '#e74a3b';
        const icon = tipo === 'success' ? 'check-circle' : 'exclamation-circle';

        toast.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <i class="fas fa-${icon}" style="color: ${color}; margin-right: 8px; font-size: 16px;"></i>
                <strong style="color: #333; font-size: 14px;">${titulo}</strong>
                <button onclick="this.closest('.notification-toast').remove()" style="background: none; border: none; margin-left: auto; color: #999; font-size: 18px; cursor: pointer;">&times;</button>
            </div>
            <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.4;">${mensaje}</p>
        `;

        document.body.appendChild(toast);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Agregar estilos de animación si no existen
    addAnimationStyles() {
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .notification-toast {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Métodos estáticos para uso global
    static async notificarFactura(facturaId) {
        const instance = new NotificationManager();
        return await instance.notificarFactura(facturaId);
    }

    static async enviarRecordatorio(reparacionId) {
        const instance = new NotificationManager();
        return await instance.enviarRecordatorio(reparacionId);
    }

    static async verificarConfiguracion() {
        const instance = new NotificationManager();
        return await instance.verificarConfiguracion();
    }
}

// Funciones globales para compatibilidad
window.notificarFactura = async function(facturaId) {
    return await NotificationManager.notificarFactura(facturaId);
};

window.enviarRecordatorio = async function(reparacionId) {
    return await NotificationManager.enviarRecordatorio(reparacionId);
};

window.verificarConfiguracionEmail = async function() {
    return await NotificationManager.verificarConfiguracion();
};

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no estamos en login
    if (!window.location.pathname.endsWith('index.html')) {
        window.notificationManager = new NotificationManager();
        window.notificationManager.addAnimationStyles();
    }
});

// Exportar para uso como módulo
window.NotificationManager = NotificationManager;