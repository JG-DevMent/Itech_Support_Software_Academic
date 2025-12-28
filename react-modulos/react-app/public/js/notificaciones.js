/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-12-28
  Versión: 1.0.0
*/

class Notificaciones {
    constructor() {
        this.contenedor = null;
        this.notificaciones = [];
        this.init();
    }

    init() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('notificaciones-container')) {
            const contenedor = document.createElement('div');
            contenedor.id = 'notificaciones-container';
            contenedor.className = 'notificaciones-container';
            document.body.appendChild(contenedor);
            this.contenedor = contenedor;
        } else {
            this.contenedor = document.getElementById('notificaciones-container');
        }
    }

    mostrar(mensaje, tipo = 'info', duracion = 4000) {
        const id = Date.now() + Math.random();
        const notificacion = this.crearNotificacion(id, mensaje, tipo);
        
        this.contenedor.appendChild(notificacion);
        this.notificaciones.push({ id, elemento: notificacion });

        // Agregar event listener al botón de cerrar
        const btnCerrar = notificacion.querySelector('.notificacion-cerrar');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => {
                this.cerrar(id);
            });
        }

        // Animación de entrada
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);

        // Auto-eliminar después de la duración
        setTimeout(() => {
            this.cerrar(id);
        }, duracion);

        return id;
    }

    crearNotificacion(id, mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.setAttribute('data-id', id);

        // Iconos según el tipo
        const iconos = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const icono = iconos[tipo] || iconos.info;

        notificacion.innerHTML = `
            <div class="notificacion-icono">
                <i class="fas ${icono}"></i>
            </div>
            <div class="notificacion-contenido">
                <div class="notificacion-mensaje">${mensaje}</div>
            </div>
            <button class="notificacion-cerrar" data-id="${id}">
                <i class="fas fa-times"></i>
            </button>
        `;

        return notificacion;
    }

    cerrar(id) {
        const index = this.notificaciones.findIndex(n => n.id === id);
        if (index === -1) return;

        const { elemento } = this.notificaciones[index];
        elemento.classList.remove('mostrar');
        elemento.classList.add('ocultar');

        setTimeout(() => {
            if (elemento.parentNode) {
                elemento.parentNode.removeChild(elemento);
            }
            this.notificaciones.splice(index, 1);
        }, 300);
    }

    // Métodos de conveniencia
    exito(mensaje, duracion = 4000) {
        return this.mostrar(mensaje, 'success', duracion);
    }

    error(mensaje, duracion = 5000) {
        return this.mostrar(mensaje, 'error', duracion);
    }

    advertencia(mensaje, duracion = 4500) {
        return this.mostrar(mensaje, 'warning', duracion);
    }

    informacion(mensaje, duracion = 4000) {
        return this.mostrar(mensaje, 'info', duracion);
    }

    /**
     * Notificación especial de bienvenida - más grande y destacada
     */
    bienvenida(mensaje, duracion = 5000) {
        const id = Date.now() + Math.random();
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-especial notificacion-bienvenida';
        notificacion.setAttribute('data-id', id);

        notificacion.innerHTML = `
            <div class="notificacion-especial-overlay"></div>
            <div class="notificacion-especial-contenido">
                <div class="notificacion-especial-icono">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="notificacion-especial-mensaje">
                    <h3>¡Bienvenido!</h3>
                    <p>${mensaje}</p>
                </div>
                <div class="notificacion-especial-efecto"></div>
            </div>
        `;

        document.body.appendChild(notificacion);
        this.notificaciones.push({ id, elemento: notificacion });

        // Animación de entrada
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);

        // Auto-eliminar después de la duración
        setTimeout(() => {
            this.cerrarEspecial(id);
        }, duracion);

        return id;
    }

    /**
     * Notificación especial de cambio de contraseña exitoso
     */
    cambioClave(mensaje, duracion = 5000) {
        const id = Date.now() + Math.random();
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-especial notificacion-cambio-clave';
        notificacion.setAttribute('data-id', id);

        notificacion.innerHTML = `
            <div class="notificacion-especial-overlay"></div>
            <div class="notificacion-especial-contenido">
                <div class="notificacion-especial-icono">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="notificacion-especial-mensaje">
                    <h3>¡Contraseña Actualizada!</h3>
                    <p>${mensaje}</p>
                </div>
                <div class="notificacion-especial-efecto"></div>
            </div>
        `;

        document.body.appendChild(notificacion);
        this.notificaciones.push({ id, elemento: notificacion });

        // Animación de entrada
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);

        // Auto-eliminar después de la duración
        setTimeout(() => {
            this.cerrarEspecial(id);
        }, duracion);

        return id;
    }

    cerrarEspecial(id) {
        const index = this.notificaciones.findIndex(n => n.id === id);
        if (index === -1) return;

        const { elemento } = this.notificaciones[index];
        elemento.classList.remove('mostrar');
        elemento.classList.add('ocultar');

        setTimeout(() => {
            if (elemento.parentNode) {
                elemento.parentNode.removeChild(elemento);
            }
            this.notificaciones.splice(index, 1);
        }, 500);
    }
}

// Inicializar sistema de notificaciones
window.notificaciones = new Notificaciones();

// Función global para compatibilidad (reemplaza alert)
window.mostrarNotificacion = function(mensaje, tipo = 'info') {
    return window.notificaciones.mostrar(mensaje, tipo);
};

/**
 * Sistema de Confirmación Personalizado
 * Reemplaza los confirm() básicos con diálogos modernos
 */
class Confirmacion {
    constructor() {
        this.modal = null;
        this.init();
    }

    init() {
        // Crear modal de confirmación si no existe
        if (!document.getElementById('confirmacion-modal')) {
            const modal = document.createElement('div');
            modal.id = 'confirmacion-modal';
            modal.className = 'confirmacion-modal';
            modal.innerHTML = `
                <div class="confirmacion-overlay"></div>
                <div class="confirmacion-dialogo">
                    <div class="confirmacion-header">
                        <div class="confirmacion-icono-header">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <h4 class="confirmacion-titulo">Confirmar acción</h4>
                    </div>
                    <div class="confirmacion-body">
                        <p class="confirmacion-mensaje"></p>
                    </div>
                    <div class="confirmacion-footer">
                        <button class="btn-confirmar-cancelar confirmacion-btn-cancelar">
                            <i class="fas fa-times mr-1"></i> Cancelar
                        </button>
                        <button class="btn-confirmar-aceptar confirmacion-btn-aceptar">
                            <i class="fas fa-check mr-1"></i> Confirmar
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            this.modal = modal;
        } else {
            this.modal = document.getElementById('confirmacion-modal');
        }
    }

    mostrar(mensaje, titulo = 'Confirmar acción') {
        return new Promise((resolve) => {
            const mensajeEl = this.modal.querySelector('.confirmacion-mensaje');
            const tituloEl = this.modal.querySelector('.confirmacion-titulo');
            const btnAceptar = this.modal.querySelector('.confirmacion-btn-aceptar');
            const btnCancelar = this.modal.querySelector('.confirmacion-btn-cancelar');
            const overlay = this.modal.querySelector('.confirmacion-overlay');

            // Configurar contenido
            mensajeEl.textContent = mensaje;
            tituloEl.textContent = titulo;

            // Limpiar event listeners anteriores
            const nuevoBtnAceptar = btnAceptar.cloneNode(true);
            const nuevoBtnCancelar = btnCancelar.cloneNode(true);
            btnAceptar.parentNode.replaceChild(nuevoBtnAceptar, btnAceptar);
            btnCancelar.parentNode.replaceChild(nuevoBtnCancelar, btnCancelar);

            // Event listeners
            const aceptarHandler = () => {
                this.cerrar();
                resolve(true);
            };

            const cancelarHandler = () => {
                this.cerrar();
                resolve(false);
            };

            nuevoBtnAceptar.addEventListener('click', aceptarHandler);
            nuevoBtnCancelar.addEventListener('click', cancelarHandler);
            overlay.addEventListener('click', cancelarHandler);

            // Mostrar modal
            this.modal.classList.add('mostrar');
            document.body.style.overflow = 'hidden';
        });
    }

    cerrar() {
        this.modal.classList.remove('mostrar');
        document.body.style.overflow = '';
    }
}

// Inicializar sistema de confirmación
window.confirmacion = new Confirmacion();

// Función global para reemplazar confirm()
window.confirmar = function(mensaje, titulo) {
    return window.confirmacion.mostrar(mensaje, titulo);
};