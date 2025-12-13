/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-12-11
  Versión: 1.0.0
*/

class Paginacion {
    constructor(config) {
        this.datos = config.datos || [];
        this.elementoTabla = config.elementoTabla; // tbody de la tabla
        this.elementoControles = config.elementoControles; // contenedor para controles de paginación
        this.filasPorPagina = config.filasPorPagina || 6;
        this.paginaActual = 1;
        this.funcionRenderizar = config.funcionRenderizar; // función que renderiza cada fila
        this.datosCompletos = []; // Para mantener referencia a todos los datos (sin filtrar)
        
        this.init();
    }

    init() {
        this.datosCompletos = [...this.datos];
        this.renderizar();
    }

    setDatos(nuevosDatos) {
        this.datos = nuevosDatos;
        this.datosCompletos = [...nuevosDatos];
        this.paginaActual = 1; // Resetear a la primera página
        this.renderizar();
    }

    getTotalPaginas() {
        return Math.ceil(this.datos.length / this.filasPorPagina);
    }

    getDatosPaginaActual() {
        const inicio = (this.paginaActual - 1) * this.filasPorPagina;
        const fin = inicio + this.filasPorPagina;
        return this.datos.slice(inicio, fin);
    }

    renderizar() {
        // Limpiar tabla
        if (this.elementoTabla) {
            this.elementoTabla.innerHTML = '';
        }

        // Obtener datos de la página actual
        const datosPagina = this.getDatosPaginaActual();
        const totalPaginas = this.getTotalPaginas();

        // Renderizar filas usando la función proporcionada
        if (this.funcionRenderizar && datosPagina.length > 0) {
            datosPagina.forEach((item, index) => {
                // Calcular el índice real en el array completo (para mantener compatibilidad con funciones que usan index)
                const indiceReal = (this.paginaActual - 1) * this.filasPorPagina + index;
                this.funcionRenderizar(item, indiceReal, this.elementoTabla);
            });
        } else if (this.elementoTabla && datosPagina.length === 0) {
            // Mostrar mensaje cuando no hay datos
            const row = this.elementoTabla.insertRow();
            const cell = row.insertCell(0);
            // Obtener el número de columnas del thead si existe
            const thead = this.elementoTabla.closest('table')?.querySelector('thead');
            const numColumnas = thead ? thead.querySelectorAll('th').length : 11;
            cell.colSpan = numColumnas;
            cell.textContent = "No hay datos para mostrar";
            cell.className = "text-center";
        }

        // Renderizar controles de paginación
        this.renderizarControles(totalPaginas);
    }

    renderizarControles(totalPaginas) {
        if (!this.elementoControles) return;

        const totalRegistros = this.datos.length;
        const inicio = totalRegistros === 0 ? 0 : (this.paginaActual - 1) * this.filasPorPagina + 1;
        const fin = Math.min(this.paginaActual * this.filasPorPagina, totalRegistros);

        let html = `
            <div class="d-flex flex-column align-items-center mt-3">
                <div class="info-paginacion mb-2">
                    <span class="text-muted">
                        Mostrando ${inicio} a ${fin} de ${totalRegistros} registros
                    </span>
                </div>
                <nav aria-label="Navegación de páginas">
                    <ul class="pagination pagination-sm mb-0">
        `;

        // Botón Anterior
        html += `
            <li class="page-item ${this.paginaActual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${this.paginaActual - 1}" aria-label="Anterior">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;

        // Números de página - Lógica dinámica mejorada
        const maxBotones = 5; // Máximo de botones de página a mostrar en el centro
        let inicioPaginas, finPaginas;
        
        // Calcular el rango de páginas a mostrar alrededor de la página actual
        if (totalPaginas <= maxBotones) {
            // Si hay pocas páginas, mostrar todas
            inicioPaginas = 1;
            finPaginas = totalPaginas;
        } else {
            // Calcular el rango centrado en la página actual
            let mitad = Math.floor(maxBotones / 2);
            inicioPaginas = Math.max(1, this.paginaActual - mitad);
            finPaginas = Math.min(totalPaginas, inicioPaginas + maxBotones - 1);
            
            // Ajustar si estamos cerca del inicio o del final
            if (finPaginas - inicioPaginas < maxBotones - 1) {
                inicioPaginas = Math.max(1, finPaginas - maxBotones + 1);
            }
        }

        // Mostrar página 1 si no está en el rango visible
        if (inicioPaginas > 1) {
            html += `
                <li class="page-item">
                    <a class="page-link" href="#" data-pagina="1">1</a>
                </li>
            `;
            // Mostrar "..." solo si hay un salto de más de 1 página
            if (inicioPaginas > 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Mostrar el rango de páginas alrededor de la página actual
        for (let i = inicioPaginas; i <= finPaginas; i++) {
            html += `
                <li class="page-item ${i === this.paginaActual ? 'active' : ''}">
                    <a class="page-link" href="#" data-pagina="${i}">${i}</a>
                </li>
            `;
        }

        // Mostrar última página si no está en el rango visible
        if (finPaginas < totalPaginas) {
            // Mostrar "..." solo si hay un salto de más de 1 página
            if (finPaginas < totalPaginas - 1) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            html += `
                <li class="page-item">
                    <a class="page-link" href="#" data-pagina="${totalPaginas}">${totalPaginas}</a>
                </li>
            `;
        }

        // Botón Siguiente
        html += `
            <li class="page-item ${this.paginaActual === totalPaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${this.paginaActual + 1}" aria-label="Siguiente">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;

        html += `
                    </ul>
                </nav>
            </div>
        `;

        this.elementoControles.innerHTML = html;

        // Agregar event listeners a los botones de paginación
        const botonesPagina = this.elementoControles.querySelectorAll('a[data-pagina]');
        botonesPagina.forEach(boton => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                const pagina = parseInt(boton.getAttribute('data-pagina'));
                if (pagina >= 1 && pagina <= totalPaginas && pagina !== this.paginaActual) {
                    this.irAPagina(pagina);
                }
            });
        });
    }

    irAPagina(pagina) {
        const totalPaginas = this.getTotalPaginas();
        if (pagina >= 1 && pagina <= totalPaginas) {
            this.paginaActual = pagina;
            this.renderizar();
            // Scroll suave hacia la tabla
            if (this.elementoTabla) {
                this.elementoTabla.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    getPaginaActual() {
        return this.paginaActual;
    }

    getDatosCompletos() {
        return this.datosCompletos;
    }

    getDatosFiltrados() {
        return this.datos;
    }
}

// Exportar para uso global
window.Paginacion = Paginacion;

