/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReparacion");
    const tablaCuerpo = document.getElementById("tablaBody");
    const tabla = document.getElementById("tablaReparaciones").getElementsByTagName("tbody")[0];
    const filtroCliente = document.getElementById("filtroCliente");
    const filtroDispositivo = document.getElementById("filtroDispositivo");
    const filtroEstado = document.getElementById("filtroEstado");
    const buscarInput = document.getElementById("buscarInput");
    const toggleBtn = document.getElementById("toggleFiltrosBtn");
    const contenedorFiltros = document.getElementById("contenedorFiltros");
    const btnNotificar = document.getElementById("btnNotificar");
    const btnLimpiarForm = document.getElementById("btnLimpiarForm");
    const btnEnviarNotificacion = document.getElementById("btnEnviarNotificacion");
    const btnBuscarCliente = document.getElementById("btnBuscarCliente");
    const inputCliente = document.getElementById("cliente");
    const infoCliente = document.getElementById("infoCliente");

    // Variables globales
    let listaReparaciones = [];
    let modoEdicion = false;
    let idEdicion = null;
    let clienteActual = { nombre: '', email: '', telefono: '' };
    let paginacionReparaciones = null;
    const API_BASE = `${window.API_BASE_URL}/api`;
    const contenedorPaginacion = document.getElementById('contenedorPaginacion');

    // ===================== FUNCIONES FETCH =====================
    async function cargarReparaciones() {
        const res = await fetch(`${API_BASE}/reparaciones`);
        return await res.json();
    }
    async function buscarClientePorCedula(cedula) {
        const res = await fetch(`${API_BASE}/clientes?cedula=${encodeURIComponent(cedula)}`);
        const data = await res.json();
        return data.length > 0 ? data[0] : null;
    }
    async function guardarReparacion(datos, id = null) {
        const res = await fetch(id ? `${API_BASE}/reparaciones/${id}` : `${API_BASE}/reparaciones`, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        return await res.json();
    }
    async function eliminarReparacionBackend(id) {
        await fetch(`${API_BASE}/reparaciones/${id}`, { method: 'DELETE' });
    }

    // ===================== UI Y LÓGICA =====================
    toggleBtn.addEventListener("click", () => {
        const visible = contenedorFiltros.style.display === "flex";
        contenedorFiltros.style.display = visible ? "none" : "flex";
        toggleBtn.textContent = visible ? " Mostrar Filtros" : " ❌ Ocultar Filtros";
    });
    
    btnLimpiarForm.addEventListener("click", function() {
        if (modoEdicion) {
            if (confirm("¿Está seguro que desea cancelar la edición? Los cambios no guardados se perderán.")) {
                modoEdicion = false;
                idEdicion = null;
                document.querySelector('button[type="submit"]').textContent = 'Registrar Reparación';
            } else {
                return;
            }
        }
        form.reset();
        infoCliente.innerHTML = "";
        clienteActual = { nombre: "", email: "", telefono: "" };
        localStorage.removeItem("materialesReparacionTemp");
        if (typeof actualizarTablaMateriales === 'function') {
            actualizarTablaMateriales();
        }
    });
    
    btnBuscarCliente.addEventListener('click', async function() {
        const cedula = inputCliente.value.trim();
        if (!cedula) {
            alert('Por favor, ingrese la cédula del cliente');
            return;
        }
        const cliente = await buscarClientePorCedula(cedula);
        if (cliente) {
            clienteActual = {
                nombre: cliente.nombre,
                email: cliente.correo,
                telefono: cliente.telefono
            };
            infoCliente.innerHTML = `<strong>Cliente encontrado:</strong> ${cliente.nombre} | Email: ${cliente.correo} | Tel: ${cliente.telefono}`;
            infoCliente.style.color = '#28a745';
        } else {
            clienteActual = { nombre: '', email: '', telefono: '' };
            infoCliente.innerHTML = 'Cliente no encontrado. Por favor, verifique la cédula o registre al cliente en el módulo de Clientes.';
            infoCliente.style.color = '#dc3545';
        }
    });

    inputCliente.addEventListener('blur', async function() {
        const cedula = inputCliente.value.trim();
        if (cedula) {
            const cliente = await buscarClientePorCedula(cedula);
            if (cliente) {
                clienteActual = {
                    nombre: cliente.nombre,
                    email: cliente.correo,
                    telefono: cliente.telefono
                };
                infoCliente.innerHTML = `<strong>Cliente encontrado:</strong> ${cliente.nombre} | Email: ${cliente.correo} | Tel: ${cliente.telefono}`;
                infoCliente.style.color = '#28a745';
            } else {
                clienteActual = { nombre: '', email: '', telefono: '' };
                infoCliente.innerHTML = 'Cliente no encontrado';
                infoCliente.style.color = '#dc3545';
            }
        }
    });

    form.addEventListener('submit', async function(e) {
        if (window._soloCambioEstado) {
            e.preventDefault();
            const estadoSeleccionado = document.getElementById('estado').value;
            if (!estadoSeleccionado || estadoSeleccionado === 'Seleccione un estado') {
                alert('Por favor, seleccione un estado válido para la reparación.');
                return;
            }
            try {
                const resp = await actualizarEstadoReparacion(idEdicion, estadoSeleccionado);
                if (resp.mensaje) {
                    alert('Estado actualizado correctamente.');
                    form.reset();
                    infoCliente.innerHTML = '';
                    clienteActual = { nombre: '', email: '', telefono: '' };
                    localStorage.removeItem('materialesReparacionTemp');
                    await renderTabla();
                    document.querySelector('button[type="submit"]').textContent = 'Registrar Reparación';
                    window._soloCambioEstado = false;
                    modoEdicion = false;
                    idEdicion = null;
            } else {
                    alert('Error al actualizar estado: ' + (resp.error || 'Error desconocido'));
                }
            } catch (err) {
                alert('Error al actualizar estado: ' + (err.message || err));
            }
            return;
        }
        e.preventDefault();
        let materialesSeleccionados = JSON.parse(localStorage.getItem('materialesReparacionTemp')) || [];
        // Asegurar que cada material tenga sku y cantidad
        materialesSeleccionados = materialesSeleccionados.map(mat => ({
            sku: mat.sku,
            cantidad: mat.cantidad,
            nombre: mat.nombre,
            precio: mat.precioUnitario || mat.precio, // compatibilidad
            subtotal: mat.subtotal
        }));
        const costoMateriales = materialesSeleccionados.reduce((suma, producto) => suma + producto.subtotal, 0);
        const estadoSeleccionado = document.getElementById('estado').value;
        if (!estadoSeleccionado || estadoSeleccionado === 'Seleccione un estado') {
            alert('Por favor, seleccione un estado válido para la reparación.');
            return;
        }
        const datosReparacion = {
            cliente: document.getElementById('cliente').value,
            nombreCliente: clienteActual.nombre,
            emailCliente: clienteActual.email,
            telefonoCliente: clienteActual.telefono,
            dispositivo: document.getElementById('dispositivo').value,
            marcaModelo: document.getElementById('marcaModelo').value,
            imei: document.getElementById('imei').value,
            problema: document.getElementById('problema').value,
            descripcion: document.getElementById('descripcion').value,
            costo: document.getElementById('costo').value,
            estado: estadoSeleccionado,
            costoMateriales: costoMateriales,
            materiales: materialesSeleccionados
        };
        try {
            if (modoEdicion && idEdicion) {
                await guardarReparacion(datosReparacion, idEdicion);
            modoEdicion = false;
                idEdicion = null;
                alert('Reparación actualizada exitosamente.');
        } else {
                const resp = await guardarReparacion(datosReparacion);
                if (resp.error) {
                    alert('Error al registrar reparación: ' + resp.error);
                    return;
                }
                alert('Reparación registrada exitosamente.');
            }
            form.reset();
            infoCliente.innerHTML = '';
            clienteActual = { nombre: '', email: '', telefono: '' };
            localStorage.removeItem('materialesReparacionTemp');
            await renderTabla();
            document.querySelector('button[type="submit"]').textContent = 'Registrar Reparación';
        } catch (err) {
            alert('Error al registrar reparación: ' + (err.message || err));
        }
    });

    window.editarReparacion = async function(index) {
        // Usar las reparaciones filtradas si existen, sino usar las completas
        const reparacionesActuales = window._reparacionesFiltradas || listaReparaciones;
        const rep = reparacionesActuales[index];
        modoEdicion = true;
        idEdicion = rep.id;
        document.getElementById('cliente').value = rep.cliente;
        clienteActual = {
            nombre: rep.nombreCliente || '',
            email: rep.emailCliente || '',
            telefono: rep.telefonoCliente || ''
        };
        if (clienteActual.nombre) {
            infoCliente.innerHTML = `<strong>Cliente:</strong> ${clienteActual.nombre} | Email: ${clienteActual.email} | Tel: ${clienteActual.telefono}`;
            infoCliente.style.color = '#69b4fa';
        }
        document.getElementById('dispositivo').value = rep.dispositivo;
        document.getElementById('marcaModelo').value = rep.marcaModelo;
        document.getElementById('imei').value = rep.imei;
        document.getElementById('problema').value = rep.problema;
        document.getElementById('descripcion').value = rep.descripcion;
        document.getElementById('costo').value = rep.costo;
        document.getElementById('estado').value = rep.estado;
        if (Array.isArray(rep.materiales)) {
            const materialesTemp = rep.materiales.map(mat => ({
                sku: mat.sku,
                cantidad: mat.cantidad,
                nombre: mat.nombre,
                precio: mat.precioUnitario || mat.precio,
                subtotal: mat.subtotal
            }));
            localStorage.setItem('materialesReparacionTemp', JSON.stringify(materialesTemp));
            document.dispatchEvent(new Event('materialesReparacionCargados'));
        } else {
            localStorage.removeItem('materialesReparacionTemp');
            document.dispatchEvent(new Event('materialesReparacionCargados'));
        }
        document.querySelector('button[type="submit"]').textContent = 'Actualizar Reparación';
        document.querySelector('#formReparacion').scrollIntoView({ behavior: 'smooth' });
        // Deshabilitar edición si está completada
        const disabled = rep.estado === 'Completada';
        [
            'cliente', 'dispositivo', 'marcaModelo', 'imei', 'problema', 'descripcion', 'costo', 'estado'
        ].forEach(id => {
            document.getElementById(id).disabled = disabled;
        });
        document.getElementById('btnMaterialesModal').disabled = disabled;
        document.getElementById('btnLimpiarForm').disabled = disabled;
        document.getElementById('btnNotificar').disabled = disabled;
        if (disabled) {
            infoCliente.innerHTML += '<br><span style="color:#c00;font-weight:bold;">Esta reparación está completada y no puede ser editada.</span>';
        }
    };

    window.eliminarReparacion = async function(index) {
        // Usar las reparaciones filtradas si existen, sino usar las completas
        const reparacionesActuales = window._reparacionesFiltradas || listaReparaciones;
        const rep = reparacionesActuales[index];
        if (confirm('¿Seguro que deseas eliminar esta reparación?')) {
            await eliminarReparacionBackend(rep.id);
            renderTabla();
            alert('Reparación eliminada correctamente.');
        }
    };

    // Filtros de la tabla
    function aplicarFiltros() {
        let filtradas = listaReparaciones;
        const cliente = filtroCliente.value.trim().toLowerCase();
        const dispositivo = filtroDispositivo.value.trim().toLowerCase();
        const estado = filtroEstado.value;
        const busqueda = buscarInput.value.trim().toLowerCase();
        if (cliente) {
            filtradas = filtradas.filter(rep => (rep.nombreCliente || '').toLowerCase().includes(cliente) || (rep.cliente || '').toLowerCase().includes(cliente));
        }
        if (dispositivo) {
            filtradas = filtradas.filter(rep => (rep.dispositivo || '').toLowerCase().includes(dispositivo));
        }
        if (estado) {
            filtradas = filtradas.filter(rep => (rep.estado || '').toLowerCase() === estado.toLowerCase());
        }
        if (busqueda) {
            filtradas = filtradas.filter(rep =>
                (rep.nombreCliente || '').toLowerCase().includes(busqueda) ||
                (rep.cliente || '').toLowerCase().includes(busqueda) ||
                (rep.dispositivo || '').toLowerCase().includes(busqueda) ||
                (rep.marcaModelo || '').toLowerCase().includes(busqueda) ||
                (rep.imei || '').toLowerCase().includes(busqueda) ||
                (rep.problema || '').toLowerCase().includes(busqueda) ||
                (rep.descripcion || '').toLowerCase().includes(busqueda) ||
                (rep.estado || '').toLowerCase().includes(busqueda)
            );
        }
        renderTablaFiltrada(filtradas);
    }

    // Función para renderizar una fila de reparación
    function renderizarFilaReparacion(rep, index, tbody) {
        let costoMaterialesNum = Number(rep.costoMateriales);
        if (isNaN(costoMaterialesNum)) costoMaterialesNum = 0;
        const tieneMateriales = costoMaterialesNum > 0;
        const infoMateriales = tieneMateriales ? `<br><small class="text-info">Materiales: $${costoMaterialesNum.toFixed(2)}</small>` : '';
        let fechaMostrar = '';
        if (rep.fecha_registro) {
            const fecha = new Date(rep.fecha_registro);
            const opciones = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'America/Bogota'
            };
            fechaMostrar = fecha.toLocaleString('es-CO', opciones).replace(',', '');
        }
        const bloqueado = rep.estado === 'Completada' || rep.estado === 'Pagada';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-title="#">${rep.id}</td>
            <td data-title="Cliente">${rep.nombreCliente ? rep.nombreCliente : rep.cliente} (${rep.cliente})</td>
            <td data-title="Dispositivo">${rep.dispositivo}</td>
            <td data-title="Marca/Modelo">${rep.marcaModelo}</td>
            <td data-title="IMEI/Serial">${rep.imei}</td>
            <td data-title="Problema">${rep.problema}</td>
            <td data-title="Descripción">${rep.descripcion}${infoMateriales}</td>
            <td data-title="Costo">${rep.costo}</td>
            <td data-title="Fecha">${fechaMostrar}</td>
            <td data-title="Estado">${rep.estado}</td>
            <td data-title="Acciones">
                <div class="btn-group-actions">
                    <button class="btn btn-sm btn-warning" onclick="editarReparacion(${index})" ${bloqueado ? 'disabled' : ''}>
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarReparacion(${index})" ${bloqueado ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="notificarCliente(${index})">
                        <i class="fas fa-bell"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="imprimirMateriales(${index})" title="Imprimir Materiales">
                        <i class="fas fa-print"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    }

    function renderTablaFiltrada(reparaciones) {
        // Guardar las reparaciones filtradas para que las funciones puedan encontrarlas por índice
        // Necesitamos mantener una referencia temporal para los índices
        window._reparacionesFiltradas = reparaciones;
        
        // Inicializar o actualizar paginación
        if (!paginacionReparaciones) {
            paginacionReparaciones = new Paginacion({
                datos: reparaciones,
                elementoTabla: tablaCuerpo,
                elementoControles: contenedorPaginacion,
                filasPorPagina: 6,
                funcionRenderizar: renderizarFilaReparacion
            });
        } else {
            paginacionReparaciones.setDatos(reparaciones);
        }
    }

// NUEVA VERSIÓN MEJORADA DE IMPRESIÓN
    window.imprimirMateriales = function(index) {
    // Usar las reparaciones filtradas si existen, sino usar las completas
    const reparacionesActuales = window._reparacionesFiltradas || listaReparaciones;
    const rep = reparacionesActuales[index];
    /*let fechaMostrar = rep.fecha_registro || rep.fecha || '';*/
    let fechaMostrar = '';
    if (rep.fecha_registro) {
        const fecha = new Date(rep.fecha_registro);
        const opciones = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/Bogota'
        };
        fechaMostrar = fecha.toLocaleString('es-CO', opciones).replace(',', '');
    }

    let estilos = `
        <style>
            @page {
                size: A4;
                margin: 20mm;
            }
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #333;
                background: #fff;
                margin: 0;
                padding: 0;
            }
            .contenedor {
                max-width: 800px;
                margin: auto;
                padding: 20px 30px;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .cabecera {
                display: flex;
                align-items: center;
                border-bottom: 3px solid #69b4fa;
                margin-bottom: 20px;
                padding-bottom: 10px;
            }
            .cabecera img {
                height: 60px;
                margin-right: 20px;
            }
            .cabecera h1 {
                margin: 0;
                color: #69b4fa;
                font-size: 2em;
            }
            .subtitulo {
                font-size: 1.1em;
                color: #555;
            }
            .datos {
                font-size: 1.05em;
                margin-bottom: 20px;
                line-height: 1.5em;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                font-size: 1em;
                margin-bottom: 20px;
            }
            thead {
                background: #e7f1ff;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 8px;
            }
            th {
                color: #69b4fa;
                text-align: left;
            }
            td {
                color: #333;
            }
            .pie {
                text-align: center;
                font-size: 0.9em;
                color: #777;
                margin-top: 30px;
            }
            .pie b {
                color: #69b4fa;
            }
        </style>
    `;

    let html = `
        <div class="contenedor">
            <div class="cabecera">
                <img src="img/logo-itech-support.png" alt="ITECH SUPPORT">
                <div>
                    <h1>Itech Support</h1>
                    <div class="subtitulo">Materiales usados en la reparación</div>
                </div>
            </div>
            <div class="datos">
                <strong>ID Reparación:</strong> <span style="color:#69b4fa;">${rep.id}</span><br>
                <strong>Cliente:</strong> ${rep.nombreCliente ? rep.nombreCliente : rep.cliente} (${rep.cliente})<br>
                <strong>Dispositivo:</strong> ${rep.dispositivo}<br>
                <strong>IMEI/Serial:</strong> <span style="color:#555;">${rep.imei}</span><br>
                <strong>Fecha:</strong> ${fechaMostrar}<br>
                <strong>Estado:</strong> ${rep.estado}
            </div>
    `;

    if (rep.materiales && rep.materiales.length > 0) {
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th style="text-align:center;">Cantidad</th>
                        <th style="text-align:right;">Precio</th>
                        <th style="text-align:right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
        `;
        rep.materiales.forEach(mat => {
            html += `
                <tr>
                    <td>${mat.nombre}</td>
                    <td style="text-align:center;">${mat.cantidad}</td>
                    <td style="text-align:right;">${mat.precio}</td>
                    <td style="text-align:right;">${mat.subtotal}</td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
    } else {
        html += `<p style="color:#c00;">No hay materiales registrados para esta reparación.</p>`;
    }

    html += `
            <div class="pie">
                <hr style="border:0; border-top:1px solid #ccc; margin:18px 0;">
                <div>Gracias por confiar en <b>Itech Support</b></div>
                <div>www.itechsupport.com</div>
            </div>
        </div>
    `;

    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`<html><head><title>Impresión de Materiales</title>${estilos}</head><body>${html}</body></html>`);
    ventana.document.close();
    ventana.print();
};

    // Filtros
    filtroCliente.addEventListener('input', aplicarFiltros);
    filtroDispositivo.addEventListener('input', aplicarFiltros);
    filtroEstado.addEventListener('change', aplicarFiltros);
    buscarInput.addEventListener('input', aplicarFiltros);

    // Modifico renderTabla para que siempre aplique los filtros tras cargar
    async function renderTabla() {
        listaReparaciones = await cargarReparaciones();
        // Inicializar reparaciones filtradas con todas las reparaciones
        window._reparacionesFiltradas = listaReparaciones;
        aplicarFiltros();
    }

    // Función para exportar a Excel
    document.getElementById('btnExportar').addEventListener('click', function() {
        const wb = XLSX.utils.book_new();
        // Obtener todos los datos (filtrados o completos según corresponda)
        const datosExportar = paginacionReparaciones ? paginacionReparaciones.getDatosFiltrados() : listaReparaciones;
        // Extraer datos de la tabla
        const ws_data = [
            [
                '#', 'Cliente', 'Dispositivo', 'Marca/Modelo', 'IMEI/Serial', 'Problema', 'Descripción', 'Costo', 'Fecha', 'Estado'
            ]
        ];
        datosExportar.forEach((rep, index) => {
            ws_data.push([
                index + 1,
                (rep.nombreCliente ? rep.nombreCliente : rep.cliente) + ' (' + rep.cliente + ')',
                rep.dispositivo,
                rep.marcaModelo,
                rep.imei,
                rep.problema,
                rep.descripcion,
                rep.costo,
                rep.fecha,
                rep.estado
            ]);
        });
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, 'Reparaciones');
        XLSX.writeFile(wb, 'reparaciones.xlsx');
    });

    // ===================== NOTIFICACIÓN =====================
    window.notificarCliente = function(index) {
        // Usar las reparaciones filtradas si existen, sino usar las completas
        const reparacionesActuales = window._reparacionesFiltradas || listaReparaciones;
        const rep = reparacionesActuales[index];
        // Rellenar el modal de notificación con los datos del cliente y reparación
        document.getElementById('metodoNotificacion').value = 'email';
        document.getElementById('asuntoNotificacion').value = `Actualización de su reparación en ITECH SUPPORT`;
        document.getElementById('mensajeNotificacion').value = `Estimado ${rep.nombreCliente || ''},\n\nLe informamos que el estado de su reparación (${rep.dispositivo} - ${rep.marcaModelo}) es: ${rep.estado}.\n\nDescripción: ${rep.descripcion}\n\nGracias por confiar en nosotros.`;
        // Mostrar el modal
        $('#modalNotificacion').modal('show');
        // Guardar el índice de la reparación seleccionada para usarlo al enviar
        window._reparacionNotificarIndex = index;
    };

    btnNotificar.addEventListener('click', function() {
        // Si hay una reparación seleccionada en edición, notificar esa
        if (modoEdicion && idEdicion !== null) {
            const reparacionesActuales = window._reparacionesFiltradas || listaReparaciones;
            const index = reparacionesActuales.findIndex(r => r.id === idEdicion);
            if (index !== -1) {
                window.notificarCliente(index);
                } else {
                alert('No hay reparación seleccionada para notificar.');
            }
                } else {
            alert('Seleccione una reparación para notificar.');
                }
    });
            
    btnEnviarNotificacion.addEventListener('click', function() {
        // Aquí puedes implementar el envío real (correo, SMS, etc.)
        // Por ahora, solo simula el envío y cierra el modal
            $('#modalNotificacion').modal('hide');
        setTimeout(() => {
            alert('Notificación enviada correctamente al cliente.');
        }, 500);
    });

    // Nueva función global para cambio de estado
    window.cambiarEstadoReparacion = function(index) {
        // Usar las reparaciones filtradas si existen, sino usar las completas
        const reparacionesActuales = window._reparacionesFiltradas || listaReparaciones;
        const rep = reparacionesActuales[index];
        modoEdicion = true;
        idEdicion = rep.id;
        document.getElementById('cliente').value = rep.cliente;
        clienteActual = {
            nombre: rep.nombreCliente || '',
            email: rep.emailCliente || '',
            telefono: rep.telefonoCliente || ''
        };
        if (clienteActual.nombre) {
            infoCliente.innerHTML = `<strong>Cliente:</strong> ${clienteActual.nombre} | Email: ${clienteActual.email} | Tel: ${clienteActual.telefono}`;
            infoCliente.style.color = '#69b4fa';
        }
        document.getElementById('dispositivo').value = rep.dispositivo;
        document.getElementById('marcaModelo').value = rep.marcaModelo;
        document.getElementById('imei').value = rep.imei;
        document.getElementById('problema').value = rep.problema;
        document.getElementById('descripcion').value = rep.descripcion;
        document.getElementById('costo').value = rep.costo;
        document.getElementById('estado').value = rep.estado;
        document.querySelector('#formReparacion').scrollIntoView({ behavior: 'smooth' });
        // Deshabilitar todos los campos excepto estado
        [
            'cliente', 'dispositivo', 'marcaModelo', 'imei', 'problema', 'descripcion', 'costo'
        ].forEach(id => {
            document.getElementById(id).disabled = true;
        });
        document.getElementById('estado').disabled = false;
        document.getElementById('btnMaterialesModal').disabled = true;
        document.getElementById('btnLimpiarForm').disabled = false;
        document.getElementById('btnNotificar').disabled = true;
        document.querySelector('button[type="submit"]').textContent = 'Cambiar Estado';
        // Guardar modo especial para submit
        window._soloCambioEstado = true;
    }

    window.actualizarEstadoReparacion = async function(id, nuevoEstado) {
        const res = await fetch(`${API_BASE}/reparaciones/${id}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        return await res.json();
    };

    // Inicializar tabla al cargar
    renderTabla();
});
