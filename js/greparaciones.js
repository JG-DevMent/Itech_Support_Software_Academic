document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReparacion");
    const tablaCuerpo = document.getElementById("tablaBody");
    let listaReparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];

    //Funciones de filtro    
    const tabla = document.getElementById("tablaReparaciones").getElementsByTagName("tbody")[0];
    const filtroCliente = document.getElementById("filtroCliente");
    const filtroDispositivo = document.getElementById("filtroDispositivo");
    const filtroEstado = document.getElementById("filtroEstado");
    //Buscar
    const buscarInput = document.getElementById("buscarInput");

    const toggleBtn = document.getElementById("toggleFiltrosBtn");
    const contenedorFiltros = document.getElementById("contenedorFiltros");

    toggleBtn.addEventListener("click", () => {
        const visible = contenedorFiltros.style.display === "flex";
        contenedorFiltros.style.display = visible ? "none" : "flex";
        toggleBtn.textContent = visible ? "👓 Mostrar Filtros" : "❌ Ocultar Filtros";
    });

    // Mostrar al iniciar
    renderTabla();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nuevaReparacion = {
            cliente: document.getElementById("cliente").value,
            dispositivo: document.getElementById("dispositivo").value,
            marcaModelo: document.getElementById("marcaModelo").value,
            imei: document.getElementById("imei").value,
            problema: document.getElementById("problema").value,
            descripcion: document.getElementById("descripcion").value,
            costo: document.getElementById("costo").value,
            fecha: document.getElementById("fecha").value,
            estado: document.getElementById("estado").value
        };

        listaReparaciones.push(nuevaReparacion);
        localStorage.setItem("reparaciones", JSON.stringify(listaReparaciones));
        form.reset();
        renderTabla();
    });

    function renderTabla() {
        tablaCuerpo.innerHTML = "";
        listaReparaciones.forEach((rep, index) => {
            let row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${rep.cliente}</td>
                    <td>${rep.dispositivo}</td>
                    <td>${rep.marcaModelo}</td>
                    <td>${rep.imei}</td>
                    <td>${rep.problema}</td>
                    <td>${rep.descripcion}</td>
                    <td>${rep.costo}</td>
                    <td>${rep.fecha}</td>
                    <td>${rep.estado}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editarReparacion(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarReparacion(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tablaCuerpo.innerHTML += row;
        });
    }

    //Exponer funciones al global para poder usarlas en los botones de editar y eliminar
    window.editarReparacion = function (index) {
        const rep = listaReparaciones[index];
        document.getElementById("cliente").value = rep.cliente;
        document.getElementById("dispositivo").value = rep.dispositivo;
        document.getElementById("marcaModelo").value = rep.marcaModelo;
        document.getElementById("imei").value = rep.imei;
        document.getElementById("problema").value = rep.problema;
        document.getElementById("descripcion").value = rep.descripcion;
        document.getElementById("costo").value = rep.costo;
        document.getElementById("fecha").value = rep.fecha;
        document.getElementById("estado").value = rep.estado;

        listaReparaciones.splice(index, 1);
        localStorage.setItem("reparaciones", JSON.stringify(listaReparaciones));
        renderTabla();
    };

    window.eliminarReparacion = function (index) {
        console.log("Intentando eliminar la reparación con índice:", index);
        const confirmar = confirm("¿Seguro que deseas eliminar esta reparación?");
        
        if (confirmar) {
            listaReparaciones.splice(index, 1);
            localStorage.setItem("reparaciones", JSON.stringify(listaReparaciones));
            renderTabla();
            alert("Reparación eliminada correctamente.");
        }
    };
    

    // Exportar a Excel
    document.getElementById("btnExportar")?.addEventListener("click", function () {
        exportarAExcel(listaReparaciones);
    });

    function exportarAExcel(data) {
        const headers = ["Cliente", "Dispositivo", "Marca/Modelo", "IMEI/Serial", "Problema", "Descripción", "Costo", "Fecha", "Estado"];
        const rows = data.map(obj => [
            obj.cliente, obj.dispositivo, obj.marcaModelo, obj.imei, obj.problema, obj.descripcion, obj.costo, obj.fecha, obj.estado
        ]);
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reparaciones");
        XLSX.writeFile(workbook, "reparaciones.xlsx");
    }

    function aplicarFiltros() {
        const cliente = filtroCliente.value.toLowerCase();
        const dispositivo = filtroDispositivo.value.toLowerCase();
        const estado = filtroEstado.value;
        const busqueda = buscarInput.value.toLowerCase();

        for (let fila of tabla.rows) {
            const celdaCliente = fila.cells[1].textContent.toLowerCase();
            const celdaDispositivo = fila.cells[2].textContent.toLowerCase();
            const celdaDescripcion = fila.cells[4].textContent.toLowerCase();
            const celdaEstado = fila.cells[9].textContent.toLowerCase();

            const coincideCliente = celdaCliente.includes(cliente);
            const coincideDispositivo = celdaDispositivo.includes(dispositivo);
            const coincideEstado = estado === "" || celdaEstado === estado.toLowerCase();
            const celdamarcaModelo = fila.cells[3].textContent.toLowerCase();
            const celdaimei = fila.cells[4].textContent.toLowerCase();
            const celdaProblema = fila.cells[5].textContent.toLowerCase();

            const coincideBusquedaGeneral =
                celdaCliente.includes(busqueda) ||
                celdaDispositivo.includes(busqueda) ||
                celdamarcaModelo.includes(busqueda) ||
                celdaimei.includes(busqueda) ||
                celdaProblema.includes(busqueda) ||
                celdaDescripcion.includes(busqueda) ||
                celdaEstado.includes(busqueda);

            if (coincideCliente && coincideDispositivo && coincideEstado && coincideBusquedaGeneral) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    }

    filtroCliente.addEventListener("input", aplicarFiltros);
    filtroDispositivo.addEventListener("input", aplicarFiltros);
    filtroEstado.addEventListener("change", aplicarFiltros);
    buscarInput.addEventListener("input", aplicarFiltros);

});