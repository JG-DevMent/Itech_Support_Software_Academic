/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

document.addEventListener("DOMContentLoaded", () => {
    const inputBusqueda = document.getElementById("inputBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    const resultadoDiv = document.getElementById("resultadoReparacion");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const contenedorPaginacion = document.getElementById("contenedorPaginacionVerificar");

    let paginacionVerificar = null;
    let tablaVerificar = null;
    let tbodyVerificar = null;

    // Función para renderizar una fila de resultado
    function renderizarFilaResultado(rep, index, tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-title="ID">${rep.id}</td>
            <td data-title="Cliente">${rep.cliente}</td>
            <td data-title="Dispositivo">${rep.dispositivo}</td>
            <td data-title="Marca/Modelo">${rep.marcaModelo}</td>
            <td data-title="IMEI/Serial">${rep.imei}</td>
            <td data-title="Problema">${rep.problema}</td>
            <td data-title="Estado">${rep.estado}</td>
        `;
        tbody.appendChild(tr);
    }

    async function realizarBusqueda() {
        const valor = inputBusqueda.value.trim().toLowerCase();
        if (valor === "") {
            resultadoDiv.innerHTML = "<p class=parafjs>⚠️ Por favor ingresa un IMEI o cédula para buscar.</p>";
            if (contenedorPaginacion) contenedorPaginacion.innerHTML = '';
            return;
        }
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/reparaciones/buscar?valor=${encodeURIComponent(valor)}`);
            const resultados = await res.json();
            if (Array.isArray(resultados) && resultados.length > 0) {
                // Crear la tabla si no existe
                if (!tablaVerificar) {
                    resultadoDiv.innerHTML = `
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped mt-2" id="tablaVerificar">
                                <thead class="table-color">
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Dispositivo</th>
                                        <th>Marca/Modelo</th>
                                        <th>IMEI/Serial</th>
                                        <th>Problema</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody id="tbodyVerificar"></tbody>
                            </table>
                        </div>
                    `;
                    tablaVerificar = document.getElementById('tablaVerificar');
                    tbodyVerificar = document.getElementById('tbodyVerificar');
                } else {
                    tbodyVerificar.innerHTML = '';
                }

                // Inicializar o actualizar paginación
                if (!paginacionVerificar) {
                    paginacionVerificar = new Paginacion({
                        datos: resultados,
                        elementoTabla: tbodyVerificar,
                        elementoControles: contenedorPaginacion,
                        filasPorPagina: 6,
                        funcionRenderizar: renderizarFilaResultado
                    });
                } else {
                    paginacionVerificar.setDatos(resultados);
                }
            } else {
                resultadoDiv.innerHTML = "<p class=parafjs>❌ No se encontró ninguna reparación con ese dato.</p>";
                if (contenedorPaginacion) contenedorPaginacion.innerHTML = '';
                tablaVerificar = null;
                tbodyVerificar = null;
            }
        } catch (err) {
            resultadoDiv.innerHTML = `<p class=parafjs>Error al buscar: ${err.message}</p>`;
            if (contenedorPaginacion) contenedorPaginacion.innerHTML = '';
            tablaVerificar = null;
            tbodyVerificar = null;
        }
    }

    if (btnBuscar && inputBusqueda && resultadoDiv) {
        btnBuscar.addEventListener("click", realizarBusqueda);
        inputBusqueda.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                realizarBusqueda();
            }
        });
    }
    
    // Función para limpiar el campo de búsqueda y el resultado
    function limpiarBusqueda() {
        inputBusqueda.value = "";
        resultadoDiv.innerHTML = "";
        if (contenedorPaginacion) contenedorPaginacion.innerHTML = '';
        tablaVerificar = null;
        tbodyVerificar = null;
        paginacionVerificar = null;
    }
    
    // Evento para botón limpiar
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarBusqueda);
    }
});