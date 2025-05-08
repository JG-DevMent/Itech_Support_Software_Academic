document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReparacion");
    const tablaCuerpo = document.getElementById("tablaBody");
    let listaReparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];
    
    // Variable para controlar el modo del formulario (creación o edición)
    let modoEdicion = false;
    let indiceEdicion = -1;
    
    // Variables para almacenar los datos del cliente actual
    let clienteActual = {
        nombre: "",
        email: "",
        telefono: ""
    };

    //Funciones de filtro    
    const tabla = document.getElementById("tablaReparaciones").getElementsByTagName("tbody")[0];
    const filtroCliente = document.getElementById("filtroCliente");
    const filtroDispositivo = document.getElementById("filtroDispositivo");
    const filtroEstado = document.getElementById("filtroEstado");
    //Buscar
    const buscarInput = document.getElementById("buscarInput");

    const toggleBtn = document.getElementById("toggleFiltrosBtn");
    const contenedorFiltros = document.getElementById("contenedorFiltros");

    // Elementos para notificación
    const btnNotificar = document.getElementById("btnNotificar");
    const btnLimpiarForm = document.getElementById("btnLimpiarForm");
    const btnEnviarNotificacion = document.getElementById("btnEnviarNotificacion");
    const btnBuscarCliente = document.getElementById("btnBuscarCliente");
    const inputCliente = document.getElementById("cliente");
    const infoCliente = document.getElementById("infoCliente");

    toggleBtn.addEventListener("click", () => {
        const visible = contenedorFiltros.style.display === "flex";
        contenedorFiltros.style.display = visible ? "none" : "flex";
        toggleBtn.textContent = visible ? "👓 Mostrar Filtros" : "❌ Ocultar Filtros";
    });
    
    // Función para limpiar el formulario
    btnLimpiarForm.addEventListener("click", function() {
        // Si estamos en modo edición, confirmar antes de limpiar
        if (modoEdicion) {
            if (confirm("¿Está seguro que desea cancelar la edición? Los cambios no guardados se perderán.")) {
                resetearModoEdicion();
            } else {
                return; // No continuar con la limpieza si el usuario cancela
            }
        }
        
        // El resto del código de limpieza existente
        form.reset();
        infoCliente.innerHTML = "";
        clienteActual = { nombre: "", email: "", telefono: "" };
        localStorage.removeItem("materialesReparacionTemp");
        if (typeof actualizarTablaMateriales === 'function') {
            actualizarTablaMateriales();
        }
    });
    
    // Función para buscar cliente por cédula
    function buscarClientePorCedula(cedula) {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        return clientes.find(cliente => cliente.cedula === cedula);
    }
    
    // Manejar clic en botón de búsqueda
    btnBuscarCliente.addEventListener("click", function() {
        const cedula = inputCliente.value.trim();
        if (!cedula) {
            alert("Por favor, ingrese la cédula del cliente");
            return;
        }
        
        const cliente = buscarClientePorCedula(cedula);
        if (cliente) {
            clienteActual = {
                nombre: cliente.nombre,
                email: cliente.correo,
                telefono: cliente.telefono
            };
            
            infoCliente.innerHTML = `<strong>Cliente encontrado:</strong> ${cliente.nombre} | Email: ${cliente.correo} | Tel: ${cliente.telefono}`;
            infoCliente.style.color = "#28a745"; // Verde para éxito
        } else {
            clienteActual = { nombre: "", email: "", telefono: "" };
            infoCliente.innerHTML = "Cliente no encontrado. Por favor, verifique la cédula o registre al cliente en el módulo de Clientes.";
            infoCliente.style.color = "#dc3545"; // Rojo para error
        }
    });
    
    // También buscar al perder el foco
    inputCliente.addEventListener("blur", function() {
        const cedula = inputCliente.value.trim();
        if (cedula) {
            const cliente = buscarClientePorCedula(cedula);
            if (cliente) {
                clienteActual = {
                    nombre: cliente.nombre,
                    email: cliente.correo,
                    telefono: cliente.telefono
                };
                
                infoCliente.innerHTML = `<strong>Cliente encontrado:</strong> ${cliente.nombre} | Email: ${cliente.correo} | Tel: ${cliente.telefono}`;
                infoCliente.style.color = "#28a745"; // Verde para éxito
            } else {
                clienteActual = { nombre: "", email: "", telefono: "" };
                infoCliente.innerHTML = "Cliente no encontrado";
                infoCliente.style.color = "#dc3545"; // Rojo para error
            }
        }
    });

    // Mostrar al iniciar
    renderTabla();
    
    // Verificar si hay una reparación en modo edición al cargar la página
    function verificarModoEdicion() {
        const estadoEdicion = JSON.parse(localStorage.getItem("reparacionEnEdicion"));
        if (estadoEdicion && estadoEdicion.modoEdicion && estadoEdicion.indiceEdicion !== -1) {
            // Restaurar el modo edición
            modoEdicion = true;
            indiceEdicion = estadoEdicion.indiceEdicion;
            
            // Verificar que el índice siga siendo válido
            if (indiceEdicion < listaReparaciones.length) {
                // Cargar los datos en el formulario
                editarReparacion(indiceEdicion);
                
                // Mostrar notificación al usuario
                alert("Se ha restaurado una reparación que estaba en edición.");
            } else {
                // El índice ya no es válido (pudo haber sido eliminado por otro usuario o sesión)
                resetearModoEdicion();
            }
        }
    }
    
    // Función para resetear el modo edición
    function resetearModoEdicion() {
        modoEdicion = false;
        indiceEdicion = -1;
        localStorage.removeItem("reparacionEnEdicion");
        document.querySelector('button[type="submit"]').textContent = "Registrar Reparación";
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obtener los materiales seleccionados del localStorage
        const materialesSeleccionados = JSON.parse(localStorage.getItem("materialesReparacionTemp")) || [];
        const costoMateriales = materialesSeleccionados.reduce((suma, producto) => suma + producto.subtotal, 0);

        const datosReparacion = {
            cliente: document.getElementById("cliente").value,
            nombreCliente: clienteActual.nombre,
            emailCliente: clienteActual.email,
            telefonoCliente: clienteActual.telefono,
            dispositivo: document.getElementById("dispositivo").value,
            marcaModelo: document.getElementById("marcaModelo").value,
            imei: document.getElementById("imei").value,
            problema: document.getElementById("problema").value,
            descripcion: document.getElementById("descripcion").value,
            costo: document.getElementById("costo").value,
            fecha: document.getElementById("fecha").value,
            estado: document.getElementById("estado").value,
            materiales: materialesSeleccionados,
            costoMateriales: costoMateriales
        };

        if (modoEdicion && indiceEdicion !== -1) {
            // Modo edición: actualizar la reparación existente
            listaReparaciones[indiceEdicion] = datosReparacion;
            // Resetear el modo edición
            modoEdicion = false;
            indiceEdicion = -1;
            localStorage.removeItem("reparacionEnEdicion");
            alert("Reparación actualizada exitosamente.");
        } else {
            // Modo creación: añadir nueva reparación
            listaReparaciones.push(datosReparacion);
            alert("Reparación registrada exitosamente.");
        }
        
        // Guardar en localStorage
        localStorage.setItem("reparaciones", JSON.stringify(listaReparaciones));
        
        // Actualizar el inventario si se han seleccionado materiales
        if (materialesSeleccionados.length > 0) {
            actualizarInventarioDespuesDeReparacion(materialesSeleccionados);
        }
        
        // Limpiar el formulario y los materiales seleccionados
        form.reset();
        infoCliente.innerHTML = "";
        clienteActual = { nombre: "", email: "", telefono: "" };
        localStorage.removeItem("materialesReparacionTemp");
        renderTabla();
        
        // Cambiar el texto del botón de envío a su estado original
        document.querySelector('button[type="submit"]').textContent = "Registrar Reparación";
    });
    
    // Función para actualizar el inventario después de registrar una reparación
    function actualizarInventarioDespuesDeReparacion(materiales) {
        const inventario = JSON.parse(localStorage.getItem("inventarioITECH")) || [];
        
        // Restar la cantidad utilizada del inventario
        materiales.forEach(material => {
            const productoIndex = inventario.findIndex(item => item.sku === material.sku);
            if (productoIndex !== -1) {
                inventario[productoIndex].existencias = parseInt(inventario[productoIndex].existencias) - material.cantidad;
            }
        });
        
        // Guardar el inventario actualizado
        localStorage.setItem("inventarioITECH", JSON.stringify(inventario));
    }

    // Función para notificar al cliente
    btnNotificar.addEventListener("click", function() {
        if (!clienteActual.email && !clienteActual.telefono) {
            alert("No hay información de contacto para este cliente. Por favor, busque el cliente primero.");
            return;
        }
        
        // Pre-rellenar el mensaje con información del dispositivo
        const dispositivo = document.getElementById("dispositivo").value;
        const marcaModelo = document.getElementById("marcaModelo").value;
        const estado = document.getElementById("estado").value;
        
        if (dispositivo && marcaModelo && estado) {
            document.getElementById("mensajeNotificacion").value = 
                `Estimado ${clienteActual.nombre || "cliente"}, le informamos que su ${dispositivo} ${marcaModelo} se encuentra en estado: ${estado}. Por favor contáctenos para más información.`;
        }
        
        // Abrir el modal
        $('#modalNotificacion').modal('show');
    });
    
    // Enviar la notificación
    btnEnviarNotificacion.addEventListener("click", function() {
        const metodo = document.getElementById("metodoNotificacion").value;
        const asunto = document.getElementById("asuntoNotificacion").value;
        const mensaje = document.getElementById("mensajeNotificacion").value;
        
        // Simulación de envío - En un entorno real, aquí se conectaría con un servicio de envío
        let mensajeExito = "";
        
        if (metodo === "email" || metodo === "ambos") {
            if (clienteActual.email) {
                // Simular envío de email
                console.log(`Enviando email a ${clienteActual.email} con asunto: ${asunto}`);
                console.log(`Mensaje: ${mensaje}`);
                mensajeExito += "Email enviado correctamente. ";
            } else {
                alert("No hay email registrado para este cliente.");
                return;
            }
        }
        
        if (metodo === "sms" || metodo === "ambos") {
            if (clienteActual.telefono) {
                // Simular envío de SMS
                console.log(`Enviando SMS a ${clienteActual.telefono}`);
                console.log(`Mensaje: ${mensaje}`);
                mensajeExito += "SMS enviado correctamente.";
            } else {
                alert("No hay teléfono registrado para este cliente.");
                return;
            }
        }
        
        // Cerrar el modal y mostrar mensaje de éxito
        $('#modalNotificacion').modal('hide');
        alert(mensajeExito || "Notificación enviada correctamente.");
    });

    function renderTabla() {
        tablaCuerpo.innerHTML = "";
        listaReparaciones.forEach((rep, index) => {
            // Verificar si la reparación tiene materiales
            const tieneMateriales = rep.materiales && rep.materiales.length > 0;
            const costoMateriales = tieneMateriales ? rep.costoMateriales : 0;
            const infoMateriales = tieneMateriales ? 
                `<br><small class="text-info">Materiales: ${rep.materiales.length} items ($${costoMateriales.toFixed(2)})</small>` : 
                '';
            
            let row = `
                <tr>
                    <td data-title="#">${index + 1}</td>
                    <td data-title="Cliente">${rep.nombreCliente ? rep.nombreCliente : rep.cliente} (${rep.cliente})</td>
                    <td data-title="Dispositivo">${rep.dispositivo}</td>
                    <td data-title="Marca/Modelo">${rep.marcaModelo}</td>
                    <td data-title="IMEI/Serial">${rep.imei}</td>
                    <td data-title="Problema">${rep.problema}</td>
                    <td data-title="Descripción">${rep.descripcion}${infoMateriales}</td>
                    <td data-title="Costo">${rep.costo}</td>
                    <td data-title="Fecha">${rep.fecha}</td>
                    <td data-title="Estado">${rep.estado}</td>
                    <td data-title="Acciones">
                        <div class="btn-group-actions">
                            <button class="btn btn-sm btn-warning" onclick="editarReparacion(${index})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarReparacion(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-info" onclick="notificarCliente(${index})">
                                <i class="fas fa-bell"></i>
                            </button>
                            ${tieneMateriales ? `
                            <button class="btn btn-sm btn-success" onclick="verMateriales(${index})">
                                <i class="fas fa-boxes"></i>
                            </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
            tablaCuerpo.innerHTML += row;
        });
    }
    
    //Exponer funciones al global para poder usarlas en los botones de editar y eliminar
    window.editarReparacion = function (index) {
        // Activar modo edición
        modoEdicion = true;
        indiceEdicion = index;
        
        // Guardar el estado actual en localStorage para recuperarlo en caso de actualización de la página
        localStorage.setItem("reparacionEnEdicion", JSON.stringify({
            modoEdicion: true,
            indiceEdicion: index
        }));
        
        const rep = listaReparaciones[index];
        document.getElementById("cliente").value = rep.cliente;
        clienteActual = {
            nombre: rep.nombreCliente || "",
            email: rep.emailCliente || "",
            telefono: rep.telefonoCliente || ""
        };
        
        if (clienteActual.nombre) {
            infoCliente.innerHTML = `<strong>Cliente:</strong> ${clienteActual.nombre} | Email: ${clienteActual.email} | Tel: ${clienteActual.telefono}`;
            infoCliente.style.color = "#28a745"; // Verde para éxito
        }
        
        document.getElementById("dispositivo").value = rep.dispositivo;
        document.getElementById("marcaModelo").value = rep.marcaModelo;
        document.getElementById("imei").value = rep.imei;
        document.getElementById("problema").value = rep.problema;
        document.getElementById("descripcion").value = rep.descripcion;
        document.getElementById("costo").value = rep.costo;
        document.getElementById("fecha").value = rep.fecha;
        document.getElementById("estado").value = rep.estado;
        
        // Cargar los materiales en el formulario si existen
        if (rep.materiales && rep.materiales.length > 0) {
            localStorage.setItem("materialesReparacionTemp", JSON.stringify(rep.materiales));
            
            // Disparar un evento personalizado para avisar al módulo de materiales
            const event = new CustomEvent('materialesReparacionCargados');
            document.dispatchEvent(event);
        } else {
            // Limpiar cualquier material anterior
            localStorage.removeItem("materialesReparacionTemp");
        }

        // Cambiar texto del botón para indicar que está en modo edición
        document.querySelector('button[type="submit"]').textContent = "Actualizar Reparación";
        
        // Hacer scroll hasta el formulario para que el usuario pueda ver que está editando
        document.querySelector('#formReparacion').scrollIntoView({ behavior: 'smooth' });
        
        // No eliminar el registro original hasta que se confirme la edición
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
    
    window.notificarCliente = function (index) {
        const rep = listaReparaciones[index];
        
        // Verificar si hay información de contacto
        if (!rep.emailCliente && !rep.telefonoCliente) {
            alert("No hay información de contacto registrada para este cliente. Por favor, edite la reparación y añada un email o teléfono.");
            return;
        }
        
        // Pre-rellenar los campos del modal
        document.getElementById("asuntoNotificacion").value = `Actualización de su reparación en ITECH SUPPORT - ${rep.dispositivo} ${rep.marcaModelo}`;
        document.getElementById("mensajeNotificacion").value = 
            `Estimado ${rep.nombreCliente || "cliente"}, le informamos que su ${rep.dispositivo} ${rep.marcaModelo} se encuentra en estado: ${rep.estado}. Por favor contáctenos para más información.`;
        
        // Configurar manejadores de eventos para el modal
        const handleEnviarNotificacion = function() {
            const metodo = document.getElementById("metodoNotificacion").value;
            const asunto = document.getElementById("asuntoNotificacion").value;
            const mensaje = document.getElementById("mensajeNotificacion").value;
            
            // Simulación de envío - En un entorno real, aquí se conectaría con un servicio de envío
            let mensajeExito = "";
            
            if (metodo === "email" || metodo === "ambos") {
                if (rep.emailCliente) {
                    console.log(`Enviando email a ${rep.emailCliente} con asunto: ${asunto}`);
                    console.log(`Mensaje: ${mensaje}`);
                    mensajeExito += "Email enviado correctamente. ";
                } else {
                    alert("No hay email registrado para este cliente.");
                    return;
                }
            }
            
            if (metodo === "sms" || metodo === "ambos") {
                if (rep.telefonoCliente) {
                    console.log(`Enviando SMS a ${rep.telefonoCliente}`);
                    console.log(`Mensaje: ${mensaje}`);
                    mensajeExito += "SMS enviado correctamente.";
                } else {
                    alert("No hay teléfono registrado para este cliente.");
                    return;
                }
            }
            
            // Cerrar el modal y mostrar mensaje de éxito
            $('#modalNotificacion').modal('hide');
            alert(mensajeExito || "Notificación enviada correctamente.");
            
            // Remover el manejador de eventos para evitar duplicados
            document.getElementById("btnEnviarNotificacion").removeEventListener("click", handleEnviarNotificacion);
        };
        
        // Agregar el manejador de eventos
        document.getElementById("btnEnviarNotificacion").addEventListener("click", handleEnviarNotificacion);
        
        // Abrir el modal
        $('#modalNotificacion').modal('show');
        
        // Limpiar el manejador cuando se cierre el modal
        $('#modalNotificacion').on('hidden.bs.modal', function () {
            document.getElementById("btnEnviarNotificacion").removeEventListener("click", handleEnviarNotificacion);
        });
    };
    
    // Función para ver los materiales de una reparación
    window.verMateriales = function(index) {
        const rep = listaReparaciones[index];
        if (!rep.materiales || rep.materiales.length === 0) {
            alert("Esta reparación no tiene materiales registrados.");
            return;
        }
        
        // Crear una tabla HTML con los materiales
        let tablaMateriales = '<table class="table table-sm table-bordered">';
        tablaMateriales += '<thead class="thead-light"><tr><th>Producto</th><th>SKU</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr></thead><tbody>';
        
        rep.materiales.forEach(material => {
            tablaMateriales += `<tr>
                <td>${material.nombre}</td>
                <td>${material.sku}</td>
                <td>${material.cantidad}</td>
                <td>$${material.precioUnitario.toFixed(2)}</td>
                <td>$${material.subtotal.toFixed(2)}</td>
            </tr>`;
        });
        
        tablaMateriales += `<tr class="table-info">
            <td colspan="4" class="text-right"><strong>Total Materiales:</strong></td>
            <td><strong>$${rep.costoMateriales.toFixed(2)}</strong></td>
        </tr>`;
        tablaMateriales += '</tbody></table>';
        
        // Generar un ID único para la ventana para evitar conflictos
        const ventanaId = `materiales_${Date.now()}`;
        
        // Mostrar en una ventana emergente con estilos mejorados
        const ventana = window.open('', ventanaId, 'width=700,height=500');
        ventana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Materiales de Reparación #${index + 1}</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <style>
                    body { 
                        padding: 20px; 
                        font-family: Arial, sans-serif;
                    }
                    .header {
                        border-bottom: 2px solid #f0f0f0;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                    }
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h3>Materiales utilizados en reparación #${index + 1}</h3>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Cliente:</strong> ${rep.nombreCliente || rep.cliente}</p>
                                <p><strong>Fecha:</strong> ${rep.fecha}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Dispositivo:</strong> ${rep.dispositivo} ${rep.marcaModelo}</p>
                                <p><strong>Estado:</strong> ${rep.estado}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content">
                        ${tablaMateriales}
                    </div>
                    
                    <div class="footer">
                        <button onclick="window.print()" class="btn btn-primary no-print">
                            <i class="fas fa-print"></i> Imprimir
                        </button>
                        <button onclick="window.close()" class="btn btn-secondary ml-2 no-print">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
                
                <script>
                    // Cerrar automáticamente la ventana después de imprimir
                    window.addEventListener('afterprint', function() {
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    });
                </script>
            </body>
            </html>
        `);
        ventana.document.close();
    };

    // Exportar a Excel
    document.getElementById("btnExportar")?.addEventListener("click", function () {
        exportarAExcel(listaReparaciones);
    });

    function exportarAExcel(data) {
        const headers = ["Cliente", "Cédula", "Email", "Teléfono", "Dispositivo", "Marca/Modelo", "IMEI/Serial", "Problema", "Descripción", "Costo Reparación", "Costo Materiales", "Costo Total", "Fecha", "Estado", "Cant. Materiales"];
        const rows = data.map(obj => {
            const tieneMateriales = obj.materiales && obj.materiales.length > 0;
            const costoMateriales = tieneMateriales ? obj.costoMateriales : 0;
            const costoTotal = parseFloat(obj.costo) + costoMateriales;
            const cantMateriales = tieneMateriales ? obj.materiales.length : 0;
            
            return [
                obj.nombreCliente || "No especificado", 
                obj.cliente, 
                obj.emailCliente || "No especificado", 
                obj.telefonoCliente || "No especificado", 
                obj.dispositivo, 
                obj.marcaModelo, 
                obj.imei, 
                obj.problema, 
                obj.descripcion, 
                obj.costo,
                costoMateriales.toFixed(2),
                costoTotal.toFixed(2),
                obj.fecha, 
                obj.estado,
                cantMateriales
            ];
        });
        
        // Creamos la hoja principal con el resumen de reparaciones
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reparaciones");
        
        // Si hay reparaciones con materiales, creamos una segunda hoja con el detalle
        const reparacionesConMateriales = data.filter(rep => rep.materiales && rep.materiales.length > 0);
        if (reparacionesConMateriales.length > 0) {
            const headersDetalle = ["ID Reparación", "Cliente", "Dispositivo", "Nombre Material", "SKU", "Cantidad", "Precio Unitario", "Subtotal"];
            const rowsDetalle = [];
            
            reparacionesConMateriales.forEach((rep, index) => {
                rep.materiales.forEach(mat => {
                    rowsDetalle.push([
                        index + 1,
                        rep.nombreCliente || rep.cliente,
                        `${rep.dispositivo} ${rep.marcaModelo}`,
                        mat.nombre,
                        mat.sku,
                        mat.cantidad,
                        mat.precioUnitario,
                        mat.subtotal
                    ]);
                });
            });
            
            const worksheetDetalle = XLSX.utils.aoa_to_sheet([headersDetalle, ...rowsDetalle]);
            XLSX.utils.book_append_sheet(workbook, worksheetDetalle, "Detalle Materiales");
        }
        
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

    // Verificar al cargar la página
    verificarModoEdicion();
});