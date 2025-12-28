/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('#agregarClienteModal input');
    const tablaBody = document.querySelector('#tablaClientes tbody');
    const formCliente = document.getElementById('formCliente');
    const inputBusqueda = document.getElementById('clienteBusqueda');
    const btnBuscar = document.getElementById('btnCliente');
    const exportarBtn = document.getElementById('exportarClientes');
    const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusqueda');
    const contenedorPaginacion = document.getElementById('contenedorPaginacionClientes');

    let modoEdicion = false;
    let clienteEditandoId = null;
    let paginacionClientes = null;

    async function obtenerClientes() {
        const response = await fetch(`${window.API_BASE_URL}/api/clientes`);
        return await response.json();
    }

    function limpiarFormulario() {
        inputs.forEach(input => input.value = '');
        modoEdicion = false;
        clienteEditandoId = null;
    }

    // Función para renderizar una fila de cliente
    function renderizarFilaCliente(cliente, index, tbody) {
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
        tbody.appendChild(row);
    }

    async function renderizarTabla(clientes = null) {
        const lista = clientes || await obtenerClientes();
        
        // Inicializar o actualizar paginación
        if (!paginacionClientes) {
            paginacionClientes = new Paginacion({
                datos: lista,
                elementoTabla: tablaBody,
                elementoControles: contenedorPaginacion,
                filasPorPagina: 6,
                funcionRenderizar: renderizarFilaCliente
            });
        } else {
            paginacionClientes.setDatos(lista);
        }
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
                const response = await fetch(`${window.API_BASE_URL}/api/clientes/${clienteEditandoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente)
                });
                if (!response.ok) throw new Error('Error actualizando cliente');
                window.notificaciones.exito('Cliente actualizado correctamente.');
            } else {
                const response = await fetch(`${window.API_BASE_URL}/api/clientes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente)
                });
                if (!response.ok) {
                    const error = await response.json();
                    window.notificaciones.error(error.error || 'Error al crear el cliente. Por favor, verifique los datos e intente nuevamente.');
                    return;
                }
                window.notificaciones.exito('Cliente guardado correctamente.');
            }
            await renderizarTabla();
            $('#agregarClienteModal').modal('hide');
            limpiarFormulario();
        } catch (error) {
            window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión e intente nuevamente.');
        }
    });

    tablaBody.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('eliminar-btn')) {
            const confirmado = await window.confirmar(
                '¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.',
                'Confirmar eliminación'
            );
            if (confirmado) {
                try {
                    const response = await fetch(`${window.API_BASE_URL}/api/clientes/${id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) throw new Error('Error eliminando cliente');
                    window.notificaciones.exito('Cliente eliminado correctamente.');
                    await renderizarTabla();
                } catch (error) {
                    window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión e intente nuevamente.');
                }
            }
        }
        if (e.target.classList.contains('editar-btn')) {
            try {
                const response = await fetch(`${window.API_BASE_URL}/api/clientes/${id}`);
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
                window.notificaciones.error('Error al cargar el cliente para editar. Por favor, intente nuevamente.');
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
            // Obtener todos los clientes (no solo los de la página actual)
            const clientes = paginacionClientes ? paginacionClientes.getDatosCompletos() : await obtenerClientes();
            if (clientes.length === 0) {
                window.notificaciones.advertencia('No hay clientes para exportar.');
                return;
            }
            try {
                const worksheet = XLSX.utils.json_to_sheet(clientes);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
                XLSX.writeFile(workbook, 'clientes.xlsx');
                window.notificaciones.exito(`Se exportaron ${clientes.length} cliente(s) correctamente.`);
            } catch (error) {
                window.notificaciones.error('Error al exportar los clientes. Por favor, intente nuevamente.');
            }
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
