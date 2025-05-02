document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReparacion");
    const tablaCuerpo = document.getElementById("tablaBody");
    let listaReparaciones = JSON.parse(localStorage.getItem("reparaciones")) || [];
    
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
    const btnEnviarNotificacion = document.getElementById("btnEnviarNotificacion");
    const btnBuscarCliente = document.getElementById("btnBuscarCliente");
    const inputCliente = document.getElementById("cliente");
    const infoCliente = document.getElementById("infoCliente");

    toggleBtn.addEventListener("click", () => {
        const visible = contenedorFiltros.style.display === "flex";
        contenedorFiltros.style.display = visible ? "none" : "flex";
        toggleBtn.textContent = visible ? "👓 Mostrar Filtros" : "❌ Ocultar Filtros";
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

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nuevaReparacion = {
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
            estado: document.getElementById("estado").value
        };

        listaReparaciones.push(nuevaReparacion);
        localStorage.setItem("reparaciones", JSON.stringify(listaReparaciones));
        form.reset();
        infoCliente.innerHTML = "";
        clienteActual = { nombre: "", email: "", telefono: "" };
        renderTabla();
    });

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
                `Estimado ${clienteActual.nombre || "cliente"}, le informamos que su ${dispositivo} ${marcaModelo} se encuentra en estado: ${estado}. Por favor, visite nuestra web o contáctenos para más información.`;
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
            let row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${rep.nombreCliente ? rep.nombreCliente : rep.cliente} (${rep.cliente})</td>
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
                        <button class="btn btn-sm btn-info" onclick="notificarCliente(${index})">
                            <i class="fas fa-bell"></i>
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
            `Estimado ${rep.nombreCliente || "cliente"}, le informamos que su ${rep.dispositivo} ${rep.marcaModelo} se encuentra en estado: ${rep.estado}. Por favor, visite nuestra web o contáctenos para más información.`;
        
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

    // Exportar a Excel
    document.getElementById("btnExportar")?.addEventListener("click", function () {
        exportarAExcel(listaReparaciones);
    });

    function exportarAExcel(data) {
        const headers = ["Cliente", "Cédula", "Email", "Teléfono", "Dispositivo", "Marca/Modelo", "IMEI/Serial", "Problema", "Descripción", "Costo", "Fecha", "Estado"];
        const rows = data.map(obj => [
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
            obj.fecha, 
            obj.estado
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