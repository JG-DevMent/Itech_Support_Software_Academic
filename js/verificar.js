document.addEventListener("DOMContentLoaded", () => {
    const inputBusqueda = document.getElementById("inputBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    const resultadoDiv = document.getElementById("resultadoReparacion");

    function realizarBusqueda() {
        const valor = inputBusqueda.value.trim().toLowerCase();

        if (valor === "") {
            resultadoDiv.innerHTML = "<p class=parafjs>⚠️ Por favor ingresa un IMEI o cédula para buscar.</p>";
            return;
        }

        const listaReparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];

        const resultados = listaReparaciones.filter(rep =>
            rep.imei?.toLowerCase() === valor ||
            rep.cliente?.toLowerCase() === valor
        );

        if (resultados.length > 0) {
            resultadoDiv.innerHTML = `
                <table class="tabla-resultados">
                    <thead>
                        <tr>
                            <th>Cédula</th>
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
                                <td>${rep.cliente}</td>
                                <td>${rep.dispositivo}</td>
                                <td>${rep.marcaModelo}</td>
                                <td>${rep.imei}</td>
                                <td>${rep.problema}</td>
                                <td>${rep.estado}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;
        } else {
            resultadoDiv.innerHTML = "<p class=parafjs>❌ No se encontró ninguna reparación con ese dato.</p>";
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
});