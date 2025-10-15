/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

document.addEventListener("DOMContentLoaded", () => {
    // Asegurarse de que no haya modales abiertos al iniciar
    $('.modal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    
    // Referencias a elementos DOM
    const btnBuscarProducto = document.getElementById("btnBuscarProducto");
    const inputBuscarProducto = document.getElementById("buscarProducto");
    const tablaProductosInventario = document.getElementById("tablaProductosInventario").getElementsByTagName("tbody")[0];
    const tablaProductosSeleccionados = document.getElementById("tablaProductosSeleccionados").getElementsByTagName("tbody")[0];
    const totalMaterialesElement = document.getElementById("totalMateriales");
    const costoEstimadoInput = document.getElementById("costo");
    const btnMaterialesModal = document.getElementById("btnMaterialesModal");
    
    // Elementos de resumen para el formulario principal
    const cantidadMaterialesElement = document.getElementById("cantidadMateriales");
    const costoMaterialesResumenElement = document.getElementById("costoMaterialesResumen");
    
    // Clave para almacenar/recuperar productos seleccionados en localStorage
    const materialesReparacionKey = "materialesReparacionTemp";
    
    // Variables globales
    let productoSeleccionado = null;
    let productosSeleccionados = [];
    
    // Inicializar valores
    cargarProductosSeleccionados();
    actualizarTotalMateriales();
    actualizarResumenMateriales();
    
    // Evento para el botón de materiales en el formulario principal
    btnMaterialesModal.addEventListener("click", function() {
        $('#materialesModal').modal('show');
    });
    
    // Evento para buscar productos en el inventario cuando se hace clic en el botón de búsqueda
    btnBuscarProducto.addEventListener("click", () => {
        const termino = inputBuscarProducto.value.trim().toLowerCase();
        cargarProductosInventario(termino);
        
        // Ocultar modal actual antes de mostrar el siguiente
        $('#materialesModal').modal('hide');
        
        // Usar un pequeño retraso para asegurar transición suave entre modales
        setTimeout(() => {
            $('#seleccionProductoModal').modal('show');
        }, 500);
    });
    
    // También permitir buscar con Enter
    inputBuscarProducto.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            btnBuscarProducto.click();
        }
    });
    
    // Cuando se cierra el modal de selección de productos, volver a mostrar el modal de materiales
    $('#seleccionProductoModal').on('hidden.bs.modal', function(e) {
        // Solo si no se va a abrir el modal de cantidad, volver al modal de materiales
        if (!$(e.target).data('openingCantidadModal')) {
            setTimeout(() => {
                $('#materialesModal').modal('show');
            }, 500);
        }
    });
    
    // Cuando se cierra el modal de cantidad, volver a mostrar el modal de materiales
    $('#cantidadProductoModal').on('hidden.bs.modal', function() {
        setTimeout(() => {
            $('#materialesModal').modal('show');
        }, 500);
    });
    
    // Evento para la búsqueda dentro del modal
    document.getElementById("buscarProductoModal").addEventListener("keyup", function() {
        const termino = this.value.trim().toLowerCase();
        cargarProductosInventario(termino);
    });
    
    // Actualizar el resumen cuando el modal se cierra
    $('#materialesModal').on('hidden.bs.modal', function() {
        actualizarResumenMateriales();
    });
    
    // Función para actualizar el resumen de materiales en el formulario principal
    function actualizarResumenMateriales() {
        const cantidad = productosSeleccionados.length;
        const total = productosSeleccionados.reduce((suma, producto) => suma + producto.subtotal, 0);
        
        cantidadMaterialesElement.textContent = `${cantidad} material${cantidad !== 1 ? 'es' : ''} seleccionado${cantidad !== 1 ? 's' : ''}`;
        costoMaterialesResumenElement.textContent = `$${total.toFixed(2)}`;
        
        // Cambiar el color del badge según si hay materiales o no
        if (cantidad > 0) {
            cantidadMaterialesElement.classList.remove('badge-info');
            cantidadMaterialesElement.classList.add('badge-primary');
        } else {
            cantidadMaterialesElement.classList.remove('badge-primary');
            cantidadMaterialesElement.classList.add('badge-info');
        }
    }
    
    // Función para cargar productos del inventario que coincidan con el término de búsqueda
    async function cargarProductosInventario(termino = "") {
        tablaProductosInventario.innerHTML = "";
        let inventario = [];
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/inventario`);
            inventario = await response.json();
        } catch (error) {
            const row = tablaProductosInventario.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 6;
            cell.textContent = "Error al cargar inventario desde el servidor";
            cell.className = "text-center text-danger";
            return;
        }
        const productosFiltrados = inventario.filter(producto => 
            producto.nombre.toLowerCase().includes(termino) || 
            producto.sku.toLowerCase().includes(termino) || 
            producto.imei.toLowerCase().includes(termino)
        );
        if (productosFiltrados.length === 0) {
            const row = tablaProductosInventario.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 6;
            cell.textContent = "No se encontraron productos que coincidan con la búsqueda";
            cell.className = "text-center";
            return;
        }
        productosFiltrados.forEach((producto, index) => {
            const row = tablaProductosInventario.insertRow();
            const yaSeleccionado = productosSeleccionados.some(item => item.sku === producto.sku);
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.sku}</td>
                <td>${producto.imei}</td>
                <td>$${producto.precio}</td>
                <td>${producto.existencias}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-seleccionar" data-index="${index}" 
                            ${yaSeleccionado || parseInt(producto.existencias) === 0 ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                    </button>
                </td>
            `;
            if (yaSeleccionado) {
                row.classList.add("table-secondary");
            }
            if (parseInt(producto.existencias) === 0) {
                row.classList.add("table-danger");
            }
        });
        // Evento para seleccionar un producto
        const botonesSeleccionar = tablaProductosInventario.querySelectorAll(".btn-seleccionar");
        botonesSeleccionar.forEach(btn => {
            btn.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                productoSeleccionado = productosFiltrados[index];
                document.getElementById("nombreProductoSeleccionado").textContent = productoSeleccionado.nombre;
                document.getElementById("existenciasDisponibles").textContent = productoSeleccionado.existencias;
                document.getElementById("productoSeleccionadoId").value = index;
                document.getElementById("precioUnitarioSeleccionado").value = productoSeleccionado.precio;
                const cantidadInput = document.getElementById("cantidadProducto");
                cantidadInput.max = productoSeleccionado.existencias;
                cantidadInput.value = 1;
                actualizarSubtotalYProgreso(1, productoSeleccionado.existencias, productoSeleccionado.precio);
                $('#seleccionProductoModal').data('openingCantidadModal', true);
                $('#seleccionProductoModal').modal('hide');
                setTimeout(() => {
                    $('#cantidadProductoModal').modal('show');
                    $('#seleccionProductoModal').data('openingCantidadModal', false);
                }, 500);
            });
        });
    }
    
    // Función para actualizar el subtotal y la barra de progreso
    function actualizarSubtotalYProgreso(cantidad, existencias, precioUnitario) {
        // Calcular el subtotal
        const subtotal = cantidad * precioUnitario;
        document.getElementById("subtotalEstimado").textContent = `$${subtotal.toFixed(2)}`;
        
        // Calcular y actualizar la barra de progreso
        const porcentaje = Math.min(Math.round((cantidad / existencias) * 100), 100);
        const barraProgreso = document.getElementById("barraProgreso");
        barraProgreso.style.width = `${porcentaje}%`;
        barraProgreso.textContent = `${porcentaje}%`;
        
        // Resetear clases y aplicar las correctas según el porcentaje
        barraProgreso.className = "progress-bar progress-bar-striped progress-bar-animated";
        
        if (porcentaje < 40) {
            // Baja cantidad - color primario
            barraProgreso.classList.add("barra-progreso-cantidad");
        } else if (porcentaje < 80) {
            // Media cantidad - color highlight (dorado claro)
            barraProgreso.style.backgroundColor = 'var(--highlight)';
        } else {
            // Alta cantidad - color alerta
            barraProgreso.style.backgroundColor = '#c57e1d';
        }
    }
    
    // Evento para los botones de incrementar y decrementar cantidad
    document.getElementById("incrementarCantidad").addEventListener("click", function() {
        const cantidadInput = document.getElementById("cantidadProducto");
        const existencias = parseInt(document.getElementById("existenciasDisponibles").textContent);
        const precioUnitario = parseFloat(document.getElementById("precioUnitarioSeleccionado").value);
        
        // Verificar que no exceda las existencias disponibles
        if (parseInt(cantidadInput.value) < existencias) {
            cantidadInput.value = parseInt(cantidadInput.value) + 1;
            actualizarSubtotalYProgreso(parseInt(cantidadInput.value), existencias, precioUnitario);
        }
    });
    
    document.getElementById("decrementarCantidad").addEventListener("click", function() {
        const cantidadInput = document.getElementById("cantidadProducto");
        const existencias = parseInt(document.getElementById("existenciasDisponibles").textContent);
        const precioUnitario = parseFloat(document.getElementById("precioUnitarioSeleccionado").value);
        
        if (parseInt(cantidadInput.value) > 1) {
            cantidadInput.value = parseInt(cantidadInput.value) - 1;
            actualizarSubtotalYProgreso(parseInt(cantidadInput.value), existencias, precioUnitario);
        }
    });
    
    // Actualizar también cuando se cambia manualmente el valor
    document.getElementById("cantidadProducto").addEventListener("input", function() {
        const cantidadInput = document.getElementById("cantidadProducto");
        const existencias = parseInt(document.getElementById("existenciasDisponibles").textContent);
        const precioUnitario = parseFloat(document.getElementById("precioUnitarioSeleccionado").value);
        
        // Asegurar que el valor esté dentro de los límites
        let cantidad = parseInt(cantidadInput.value) || 1;
        if (cantidad < 1) cantidad = 1;
        if (cantidad > existencias) cantidad = existencias;
        
        // Si el valor ha sido ajustado, actualizar el campo
        if (cantidad !== parseInt(cantidadInput.value)) {
            cantidadInput.value = cantidad;
        }
        
        actualizarSubtotalYProgreso(cantidad, existencias, precioUnitario);
    });
    
    // Evento para confirmar la cantidad del producto seleccionado
    document.getElementById("btnConfirmarCantidad").addEventListener("click", function() {
        const cantidad = parseInt(document.getElementById("cantidadProducto").value);
        const existencias = parseInt(document.getElementById("existenciasDisponibles").textContent);
        
        if (isNaN(cantidad) || cantidad <= 0 || cantidad > existencias) {
            alert("Por favor, ingrese una cantidad válida");
            return;
        }
        
        // Agregar el producto con la cantidad especificada
        agregarProductoSeleccionado(productoSeleccionado, cantidad);
        
        // Mostrar confirmación visual antes de cerrar
        const btnConfirmar = document.getElementById("btnConfirmarCantidad");
        const textoOriginal = btnConfirmar.innerHTML;
        
        // Usar la clase CSS para estilizar el botón de confirmación
        btnConfirmar.innerHTML = '<i class="fas fa-check mr-1"></i>¡Agregado!';
        btnConfirmar.classList.remove('btn-primary');
        btnConfirmar.classList.add('btn-confirmado');
        btnConfirmar.disabled = true;
        
        // Cerrar el modal después de un breve retraso para mostrar la confirmación
        setTimeout(() => {
            // Restaurar el botón para la próxima vez
            btnConfirmar.innerHTML = textoOriginal;
            btnConfirmar.classList.remove('btn-confirmado');
            btnConfirmar.classList.add('btn-primary');
            btnConfirmar.disabled = false;
            
            // Cerrar el modal - el evento hidden.bs.modal se encargará de volver al modal de materiales
            $('#cantidadProductoModal').modal('hide');
        }, 800);
    });
    
    // Función para agregar un producto a la lista de seleccionados
    function agregarProductoSeleccionado(producto, cantidad) {
        // Calcular subtotal
        const precioUnitario = parseFloat(producto.precio);
        const subtotal = precioUnitario * cantidad;
        
        // Crear objeto con información del producto seleccionado
        const productoConCantidad = {
            nombre: producto.nombre,
            sku: producto.sku,
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            subtotal: subtotal
        };
        
        // Añadir a la lista
        productosSeleccionados.push(productoConCantidad);
        
        // Guardar en localStorage
        localStorage.setItem(materialesReparacionKey, JSON.stringify(productosSeleccionados));
        
        // Actualizar la tabla
        actualizarTablaProductosSeleccionados();
        
        // Actualizar el total
        actualizarTotalMateriales();
    }
    
    // Función para actualizar la tabla de productos seleccionados
    function actualizarTablaProductosSeleccionados() {
        tablaProductosSeleccionados.innerHTML = "";
        
        if (productosSeleccionados.length === 0) {
            const row = tablaProductosSeleccionados.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 6;
            cell.textContent = "No hay materiales seleccionados";
            cell.className = "text-center";
            return;
        }
        
        productosSeleccionados.forEach((producto, index) => {
            const row = tablaProductosSeleccionados.insertRow();
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.sku}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precioUnitario.toFixed(2)}</td>
                <td>$${producto.subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-eliminar-producto" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
        
        // Eventos para eliminar productos
        const botonesEliminar = tablaProductosSeleccionados.querySelectorAll(".btn-eliminar-producto");
        botonesEliminar.forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                eliminarProductoSeleccionado(index);
            });
        });
    }
    
    // Función global para actualizar la tabla de materiales (accesible desde otros archivos)
    window.actualizarTablaMateriales = function() {
        productosSeleccionados = [];
        actualizarTablaProductosSeleccionados();
        actualizarTotalMateriales();
    };
    
    // Función para eliminar un producto de la lista de seleccionados
    function eliminarProductoSeleccionado(index) {
        productosSeleccionados.splice(index, 1);
        localStorage.setItem(materialesReparacionKey, JSON.stringify(productosSeleccionados));
        actualizarTablaProductosSeleccionados();
        actualizarTotalMateriales();
    }
    
    // Función para calcular y actualizar el total de materiales
    function actualizarTotalMateriales() {
        const total = productosSeleccionados.reduce((suma, producto) => suma + producto.subtotal, 0);
        totalMaterialesElement.textContent = `$${total.toFixed(2)}`;
        
        // Actualizar automáticamente el costo estimado con el total de materiales
        if (costoEstimadoInput) {
            // Siempre actualizar el costo estimado con el total de materiales
            costoEstimadoInput.value = total.toFixed(2);
        }
        
        // Actualizar también el resumen en el formulario principal
        actualizarResumenMateriales();
    }
    
    // Función para cargar productos seleccionados desde localStorage
    function cargarProductosSeleccionados() {
        const guardados = localStorage.getItem(materialesReparacionKey);
        if (guardados) {
            productosSeleccionados = JSON.parse(guardados);
            actualizarTablaProductosSeleccionados();
            actualizarResumenMateriales();
        }
    }
    
    // Limpiar los materiales seleccionados cuando se envía el formulario
    document.getElementById("formReparacion").addEventListener("submit", function() {
        // Actualizar la reparación para incluir los materiales
        const costoMateriales = productosSeleccionados.reduce((suma, producto) => suma + producto.subtotal, 0);
        
        // Aquí se podría añadir lógica adicional para guardar los materiales con la reparación
        
        // Limpiar después de guardar
        localStorage.removeItem(materialesReparacionKey);
        productosSeleccionados = [];
        actualizarTablaProductosSeleccionados();
        actualizarTotalMateriales();
        actualizarResumenMateriales();
    });
    
    // También limpiar cuando se usa el botón de limpiar formulario
    document.getElementById("btnLimpiarForm").addEventListener("click", function() {
        localStorage.removeItem(materialesReparacionKey);
        productosSeleccionados = [];
        actualizarTablaProductosSeleccionados();
        actualizarTotalMateriales();
        actualizarResumenMateriales();
    });
    
    // Escuchar el evento personalizado para cargar materiales cuando se edita una reparación
    document.addEventListener('materialesReparacionCargados', function() {
        cargarProductosSeleccionados();
        actualizarTotalMateriales();
        actualizarResumenMateriales();
    });
});