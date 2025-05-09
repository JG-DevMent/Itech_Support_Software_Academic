document.addEventListener("DOMContentLoaded", () => {
    const inputBusqueda = document.getElementById("inputBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    const resultadoDiv = document.getElementById("resultadoReparacion");
    const btnLimpiar = document.getElementById("btnLimpiar");

    async function realizarBusqueda() {
        const valor = inputBusqueda.value.trim().toLowerCase();
        if (valor === "") {
            resultadoDiv.innerHTML = "<p class=parafjs>⚠️ Por favor ingresa un IMEI o cédula para buscar.</p>";
            return;
        }
        try {
            const res = await fetch(`http://localhost:4000/api/reparaciones/buscar?valor=${encodeURIComponent(valor)}`);
            const resultados = await res.json();
            if (Array.isArray(resultados) && resultados.length > 0) {
                resultadoDiv.innerHTML = `
                    <table class=\"tabla-resultados\">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Dispositivo</th>
                                <th>Marca/Modelo</th>
                                <th>IMEI/Serial</th>
                                <th>Problema</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resultados.map(rep => `
                                <tr>
                                    <td data-title=\"Cliente\">${rep.cliente}</td>
                                    <td data-title=\"Dispositivo\">${rep.dispositivo}</td>
                                    <td data-title=\"Marca/Modelo\">${rep.marcaModelo}</td>
                                    <td data-title=\"IMEI/Serial\">${rep.imei}</td>
                                    <td data-title=\"Problema\">${rep.problema}</td>
                                    <td data-title=\"Estado\">${rep.estado}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                `;
            } else {
                resultadoDiv.innerHTML = "<p class=parafjs>❌ No se encontró ninguna reparación con ese dato.</p>";
            }
        } catch (err) {
            resultadoDiv.innerHTML = `<p class=parafjs>Error al buscar: ${err.message}</p>`;
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
    }
    
    // Evento para botón limpiar
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarBusqueda);
    }
});