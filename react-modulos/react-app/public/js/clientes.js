document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('#agregarClienteModal input');
    const tablaBody = document.querySelector('#tablaClientes tbody');
    const formCliente = document.getElementById('formCliente');
    const inputBusqueda = document.getElementById('clienteBusqueda');
    const btnBuscar = document.getElementById('btnCliente');
    const exportarBtn = document.getElementById('exportarClientes');
    const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusqueda');

    let modoEdicion = false;
    let clienteEditandoId = null;

    async function obtenerClientes() {
        const response = await fetch('http://localhost:4000/api/clientes');
        return await response.json();
    }

    function limpiarFormulario() {
        inputs.forEach(input => input.value = '');
        modoEdicion = false;
        clienteEditandoId = null;
    }

    async function renderizarTabla(clientes = null) {
        const lista = clientes || await obtenerClientes();
        tablaBody.innerHTML = '';

        lista.forEach((cliente) => {
            let correoFormateado = cliente.correo;
            if (correoFormateado.length > 20) {
                correoFormateado = `<span class="email-text">${correoFormateado}</span>`;
            }
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-title="Nombre">${cliente.nombre}</td>
                <td data-title="Cédula">${cliente.cedula}</td>
                <td data-title="Teléfono">${cliente.telefono}</td>
                <td data-title="Correo">${correoFormateado}</td>
                <td data-title="Dirección">${cliente.direccion}</td>
                <td data-title="Acciones">
                    <div class="btn-group-actions">
                        <button class="btn btn-sm btn-warning editar-btn" data-id="${cliente.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger eliminar-btn" data-id="${cliente.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tablaBody.appendChild(row);
        });
    }

    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cliente = {
            nombre: inputs[0].value,
            cedula: inputs[1].value,
            telefono: inputs[2].value,
            correo: inputs[3].value,
            direccion: inputs[4].value
        };
        try {
            if (modoEdicion && clienteEditandoId) {
                const response = await fetch(`http://localhost:4000/api/clientes/${clienteEditandoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente)
                });
                if (!response.ok) throw new Error('Error actualizando cliente');
                alert('Cliente actualizado correctamente');
            } else {
                const response = await fetch('http://localhost:4000/api/clientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente)
                });
                if (!response.ok) {
                    const error = await response.json();
                    alert(error.error || 'Error creando cliente');
                    return;
                }
                alert('Cliente guardado correctamente');
            }
            await renderizarTabla();
            $('#agregarClienteModal').modal('hide');
            limpiarFormulario();
        } catch (error) {
            alert('Error de conexión con el servidor.');
        }
    });

    tablaBody.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('eliminar-btn')) {
            if (confirm('¿Seguro que deseas eliminar este cliente?')) {
                try {
                    const response = await fetch(`http://localhost:4000/api/clientes/${id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) throw new Error('Error eliminando cliente');
                    await renderizarTabla();
                } catch (error) {
                    alert('Error de conexión con el servidor.');
                }
            }
        }
        if (e.target.classList.contains('editar-btn')) {
            try {
                const response = await fetch(`http://localhost:4000/api/clientes/${id}`);
                if (!response.ok) throw new Error('Cliente no encontrado');
                const cliente = await response.json();
                inputs[0].value = cliente.nombre;
                inputs[1].value = cliente.cedula;
                inputs[2].value = cliente.telefono;
                inputs[3].value = cliente.correo;
                inputs[4].value = cliente.direccion;
                modoEdicion = true;
                clienteEditandoId = id;
                $('#agregarClienteModal').modal('show');
            } catch (error) {
                alert('Error al cargar cliente para editar.');
            }
        }
    });

    // Búsqueda por cédula
    async function buscarCliente() {
        const termino = inputBusqueda.value.trim().toLowerCase();
        const clientes = await obtenerClientes();
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
        exportarBtn.addEventListener('click', async () => {
            const clientes = await obtenerClientes();
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

    // Función para limpiar campo de búsqueda
    function limpiarBusqueda() {
        clienteBusqueda.value = '';
        renderizarTabla();
    }
    if (btnLimpiarBusqueda) {
        btnLimpiarBusqueda.addEventListener('click', limpiarBusqueda);
    }

    renderizarTabla();
});
