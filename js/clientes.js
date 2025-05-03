document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('#agregarClienteModal input');
    const tablaBody = document.querySelector('#tablaClientes tbody');
    const formCliente = document.getElementById('formCliente');
    const inputBusqueda = document.getElementById('clienteBusqueda');
    const btnBuscar = document.getElementById('btnCliente');
    const exportarBtn = document.getElementById('exportarClientes');

    let modoEdicion = false;
    let clienteEditandoIndex = null;

    function obtenerClientes() {
        return JSON.parse(localStorage.getItem('clientes')) || [];
    }

    function guardarClientes(clientes) {
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }

    function limpiarFormulario() {
        inputs.forEach(input => input.value = '');
        modoEdicion = false;
        clienteEditandoIndex = null;
    }

    function renderizarTabla(clientes = null) {
        const lista = clientes || obtenerClientes();
        tablaBody.innerHTML = '';

        lista.forEach((cliente, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td data-title="Nombre">${cliente.nombre}</td>
                <td data-title="Cédula">${cliente.cedula}</td>
                <td data-title="Teléfono">${cliente.telefono}</td>
                <td data-title="Correo">${cliente.correo}</td>
                <td data-title="Dirección">${cliente.direccion}</td>
                <td data-title="Acciones">
                    <div class="btn-group-actions">
                        <button class="btn btn-sm btn-warning editar-btn" data-index="${index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger eliminar-btn" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tablaBody.appendChild(row);
        });
    }

    formCliente.addEventListener('submit', (e) => {
        e.preventDefault();

        const cliente = {
            nombre: inputs[0].value,
            cedula: inputs[1].value,
            telefono: inputs[2].value,
            correo: inputs[3].value,
            direccion: inputs[4].value
        };

        const clientes = obtenerClientes();

        if (modoEdicion && clienteEditandoIndex !== null) {
            clientes[clienteEditandoIndex] = cliente;
        } else {
            clientes.push(cliente);
        }

        guardarClientes(clientes);
        renderizarTabla();
        $('#agregarClienteModal').modal('hide');
        limpiarFormulario();
    });

    tablaBody.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        const clientes = obtenerClientes();

        if (e.target.classList.contains('eliminar-btn')) {
            if (confirm('¿Seguro que deseas eliminar este cliente?')) {
                clientes.splice(index, 1);
                guardarClientes(clientes);
                renderizarTabla();
            }
        }

        if (e.target.classList.contains('editar-btn')) {
            const cliente = clientes[index];

            inputs[0].value = cliente.nombre;
            inputs[1].value = cliente.cedula;
            inputs[2].value = cliente.telefono;
            inputs[3].value = cliente.correo;
            inputs[4].value = cliente.direccion;

            modoEdicion = true;
            clienteEditandoIndex = index;

            $('#agregarClienteModal').modal('show');
        }
    });

    // Búsqueda por cédula
    function buscarCliente() {
        const termino = inputBusqueda.value.trim().toLowerCase();
        const clientes = obtenerClientes();

        if (termino === '') {
            renderizarTabla();
            return;
        }

        const filtrados = clientes.filter(cliente =>
            cliente.cedula.toLowerCase().includes(termino)
        );

        renderizarTabla(filtrados);
    }

    btnBuscar.addEventListener('click', buscarCliente);
    inputBusqueda.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarCliente();
        }
    });

    // Exportar a XLSX
    if (exportarBtn) {
        exportarBtn.addEventListener('click', () => {
            const clientes = obtenerClientes();

            if (clientes.length === 0) {
                alert('No hay clientes para exportar.');
                return;
            }

            const worksheet = XLSX.utils.json_to_sheet(clientes);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

            XLSX.writeFile(workbook, 'clientes.xlsx');
        });
    }

    renderizarTabla();
});
