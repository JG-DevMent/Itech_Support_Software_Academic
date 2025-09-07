// Sistema de ventas mejorado para ITECH Support
document.addEventListener("DOMContentLoaded", () => {
    let inventarioProducts = [];
    let ventasCache = [];
    
    const enlaces = document.querySelectorAll(".informe-link");
    const formNuevaVenta = document.getElementById('formNuevaVenta');
    const buscarProductoInput = document.getElementById('buscarProducto');
    const resultadosProducto = document.getElementById('resultadosProducto');
    const cantidadVentaInput = document.getElementById('cantidadVenta');
    
    // Inicializar funcionalidades
    inicializarEventListeners();
    cargarDatosIniciales();

    function inicializarEventListeners() {
        // Informes
        enlaces.forEach(link => {
            link.addEventListener("click", generarInforme);
        });

        // Modal de ventas
        if (formNuevaVenta) {
            formNuevaVenta.addEventListener('submit', procesarNuevaVenta);
        }

        if (buscarProductoInput) {
            buscarProductoInput.addEventListener('input', debounce(buscarProductos, 300));
            buscarProductoInput.addEventListener('focus', () => {
                if (buscarProductoInput.value.trim()) {
                    buscarProductos();
                }
            });
        }

        if (cantidadVentaInput) {
            cantidadVentaInput.addEventListener('input', calcularSubtotal);
        }

        // Modal events
        if (typeof $ !== 'undefined') {
            $('#nuevaVentaModal').on('shown.bs.modal', function () {
                cargarInventarioCompleto();
                if (buscarProductoInput) buscarProductoInput.focus();
            });

            $('#nuevaVentaModal').on('hidden.bs.modal', function () {
                limpiarFormularioVenta();
            });
        }
    }

    async function cargarDatosIniciales() {
        try {
            await mostrarVentasHoy();
            await cargarVentasRecientes();
            await cargarEstadisticasGenerales();
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
        }
    }

    async function mostrarVentasHoy() {
        try {
            const res = await fetch('http://localhost:4000/api/ventas/hoy/total');
            const data = await res.json();
            const ventasHoyElement = document.getElementById('ventasHoy');
            if (ventasHoyElement) {
                ventasHoyElement.textContent = `$${parseFloat(data.total || 0).toLocaleString('es-CO')}`;
            }
        } catch (error) {
            console.error('Error al obtener ventas de hoy:', error);
            const ventasHoyElement = document.getElementById('ventasHoy');
            if (ventasHoyElement) {
                ventasHoyElement.textContent = '$0';
            }
        }
    }

    async function cargarVentasRecientes() {
        try {
            const response = await fetch('http://localhost:4000/api/ventas');
            const ventas = await response.json();
            ventasCache = ventas;
            
            const tbody = document.getElementById('ventasRecientesBody');
            if (!tbody) return;

            tbody.innerHTML = '';
            
            const ventasRecientes = ventas.slice(0, 10);
            
            if (ventasRecientes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay ventas registradas</td></tr>';
                return;
            }

            ventasRecientes.forEach(venta => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${venta.id}</td>
                    <td>${venta.producto_nombre}</td>
                    <td>${venta.producto_sku || 'N/A'}</td>
                    <td>${venta.cantidad}</td>
                    <td>$${parseFloat(venta.precio_unitario || 0).toLocaleString('es-CO')}</td>
                    <td>$${parseFloat(venta.subtotal || 0).toLocaleString('es-CO')}</td>
                    <td>${formatearFecha(venta.fecha_registro)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarVenta(${venta.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(fila);
            });
        } catch (error) {
            console.error('Error cargando ventas recientes:', error);
        }
    }

    async function cargarEstadisticasGenerales() {
        try {
            const ventasResponse = await fetch('http://localhost:4000/api/ventas');
            const ventas = await ventasResponse.json();
            
            const hoy = new Date().toISOString().split('T')[0];
            const ventasHoy = ventas.filter(venta => 
                venta.fecha_registro && venta.fecha_registro.startsWith(hoy)
            );
            
            const totalProductosVendidos = ventasHoy.reduce((total, venta) => 
                total + parseInt(venta.cantidad || 0), 0
            );
            
            const totalProductosElement = document.getElementById('totalProductosVendidos');
            if (totalProductosElement) {
                totalProductosElement.textContent = totalProductosVendidos;
            }

            const inventarioResponse = await fetch('http://localhost:4000/api/inventario');
            const inventario = await inventarioResponse.json();
            
            const productosEnStock = inventario.reduce((total, producto) => 
                total + parseInt(producto.existencias || 0), 0
            );
            
            const stockElement = document.getElementById('productosEnStock');
            if (stockElement) {
                stockElement.textContent = productosEnStock;
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }

    async function cargarInventarioCompleto() {
        try {
            const response = await fetch('http://localhost:4000/api/inventario');
            inventarioProducts = await response.json();
        } catch (error) {
            console.error('Error cargando inventario:', error);
            inventarioProducts = [];
        }
    }

    function buscarProductos() {
        if (!resultadosProducto || !buscarProductoInput) return;
        
        const query = buscarProductoInput.value.trim().toLowerCase();
        
        if (!query) {
            resultadosProducto.classList.remove('show');
            return;
        }

        const productos = inventarioProducts.filter(producto => 
            producto.nombre.toLowerCase().includes(query) || 
            producto.sku.toLowerCase().includes(query)
        );

        mostrarResultadosProductos(productos);
    }

    function mostrarResultadosProductos(productos) {
        if (!resultadosProducto) return;
        
        resultadosProducto.innerHTML = '';
        
        if (productos.length === 0) {
            resultadosProducto.innerHTML = '<div class="dropdown-item-text text-muted">No se encontraron productos</div>';
        } else {
            productos.forEach(producto => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'dropdown-item';
                item.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>${producto.nombre}</strong><br>
                            <small class="text-muted">SKU: ${producto.sku}</small>
                        </div>
                        <div class="text-right">
                            <span class="badge badge-success">$${parseFloat(producto.precio).toLocaleString('es-CO')}</span><br>
                            <small class="text-muted">Stock: ${producto.existencias}</small>
                        </div>
                    </div>
                `;
                
                item.addEventListener('click', () => seleccionarProducto(producto));
                resultadosProducto.appendChild(item);
            });
        }
        
        resultadosProducto.classList.add('show');
    }

    function seleccionarProducto(producto) {
        document.getElementById('idProductoVenta').value = producto.id;
        document.getElementById('nombreProductoVenta').value = producto.nombre;
        document.getElementById('skuProductoVenta').value = producto.sku;
        document.getElementById('precioProductoVenta').value = producto.precio;
        document.getElementById('precioUnitarioVenta').value = producto.precio;
        document.getElementById('stockDisponible').value = producto.existencias;
        
        buscarProductoInput.value = producto.nombre;
        resultadosProducto.classList.remove('show');
        
        cantidadVentaInput.value = 1;
        calcularSubtotal();
        mostrarResumenVenta();
    }

    function calcularSubtotal() {
        const cantidad = parseInt(cantidadVentaInput.value) || 0;
        const precio = parseFloat(document.getElementById('precioUnitarioVenta').value) || 0;
        const stock = parseInt(document.getElementById('stockDisponible').value) || 0;
        
        if (cantidad > stock) {
            cantidadVentaInput.value = stock;
            alert(`La cantidad no puede ser mayor al stock disponible (${stock})`);
            return;
        }
        
        const subtotal = cantidad * precio;
        document.getElementById('subtotalVenta').value = subtotal.toFixed(2);
        
        mostrarResumenVenta();
    }

    function mostrarResumenVenta() {
        const producto = document.getElementById('nombreProductoVenta').value;
        const cantidad = document.getElementById('cantidadVenta').value;
        const precio = document.getElementById('precioUnitarioVenta').value;
        const subtotal = document.getElementById('subtotalVenta').value;
        
        if (producto && cantidad && precio) {
            const resumen = document.getElementById('resumenVenta');
            const detalle = document.getElementById('detalleResumenVenta');
            
            if (resumen && detalle) {
                detalle.innerHTML = `
                    <strong>${producto}</strong><br>
                    Cantidad: ${cantidad} × $${parseFloat(precio).toLocaleString('es-CO')} = <strong>$${parseFloat(subtotal).toLocaleString('es-CO')}</strong>
                `;
                
                resumen.classList.remove('d-none');
            }
        }
    }

    async function procesarNuevaVenta(e) {
        e.preventDefault();
        
        const idProducto = document.getElementById('idProductoVenta').value;
        const nombreProducto = document.getElementById('nombreProductoVenta').value;
        const sku = document.getElementById('skuProductoVenta').value;
        const cantidad = parseInt(document.getElementById('cantidadVenta').value);
        const precioUnitario = parseFloat(document.getElementById('precioUnitarioVenta').value);
        const subtotal = parseFloat(document.getElementById('subtotalVenta').value);
        const metodoPago = document.getElementById('metodoPagoVenta').value;
        const cliente = document.getElementById('clienteVenta').value;
        const observaciones = document.getElementById('observacionesVenta').value;
        
        if (!idProducto || !nombreProducto || !cantidad || !precioUnitario || !metodoPago) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        const ventaData = {
            producto_id: idProducto,
            producto_nombre: nombreProducto,
            producto_sku: sku,
            cantidad: cantidad,
            precio_unitario: precioUnitario,
            subtotal: subtotal,
            metodo_pago: metodoPago,
            cliente: cliente || 'Cliente general',
            observaciones: observaciones
        };
        
        try {
            const ventaResponse = await fetch('http://localhost:4000/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ventaData)
            });
            
            if (!ventaResponse.ok) {
                throw new Error('Error al registrar la venta');
            }
            
            const stockActual = parseInt(document.getElementById('stockDisponible').value);
            const nuevoStock = stockActual - cantidad;
            
            const productoCompleto = inventarioProducts.find(p => p.id == idProducto);
            
            const stockResponse = await fetch(`http://localhost:4000/api/inventario/${idProducto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombreProducto,
                    sku: sku,
                    precio: precioUnitario,
                    existencias: nuevoStock,
                    costo: productoCompleto ? productoCompleto.costo : precioUnitario,
                    imei: productoCompleto ? productoCompleto.imei : 'N/A',
                    garantia: productoCompleto ? productoCompleto.garantia : 'N/A'
                })
            });
            
            if (stockResponse.ok) {
                alert('Venta registrada exitosamente');
                if (typeof $ !== 'undefined') {
                    $('#nuevaVentaModal').modal('hide');
                }
                await cargarDatosIniciales();
            } else {
                alert('Venta registrada pero hubo un problema actualizando el stock');
            }
            
        } catch (error) {
            console.error('Error procesando venta:', error);
            alert('Error al procesar la venta: ' + error.message);
        }
    }

    function limpiarFormularioVenta() {
        if (formNuevaVenta) {
            formNuevaVenta.reset();
            document.getElementById('idProductoVenta').value = '';
            document.getElementById('skuProductoVenta').value = '';
            document.getElementById('precioProductoVenta').value = '';
            
            const resumen = document.getElementById('resumenVenta');
            if (resumen) resumen.classList.add('d-none');
            
            if (resultadosProducto) resultadosProducto.classList.remove('show');
        }
    }

    // Función global para eliminar venta
    window.eliminarVenta = async function(id) {
        if (!confirm('¿Estás seguro de eliminar esta venta?')) return;
        
        try {
            const response = await fetch(`http://localhost:4000/api/ventas/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Venta eliminada correctamente');
                await cargarDatosIniciales();
            } else {
                alert('Error al eliminar la venta');
            }
        } catch (error) {
            console.error('Error eliminando venta:', error);
            alert('Error al eliminar la venta');
        }
    };

    // Generar informes
    async function generarInforme(e) {
        e.preventDefault();
        
        const tipo = e.currentTarget.getAttribute("data-informe");
        let ws_data = [];
        let nombreArchivo = '';
        
        try {
            if (tipo === 'reparaciones') {
                const res = await fetch('http://localhost:4000/api/reparaciones');
                const reparaciones = await res.json();
                ws_data = [
                    ['ID', 'Cliente', 'Dispositivo', 'Marca/Modelo', 'IMEI/Serial', 'Problema', 'Descripción', 'Costo', 'Fecha', 'Estado']
                ];
                reparaciones.forEach(rep => {
                    ws_data.push([
                        rep.id,
                        rep.nombreCliente || rep.cliente,
                        rep.dispositivo,
                        rep.marcaModelo,
                        rep.imei,
                        rep.problema,
                        rep.descripcion,
                        rep.costo,
                        rep.fecha_registro || rep.fecha,
                        rep.estado
                    ]);
                });
                nombreArchivo = 'informe_reparaciones.xlsx';
            } else if (tipo === 'mensual-reparaciones') {
                const hoy = new Date();
                const mes = hoy.getMonth() + 1;
                const anio = hoy.getFullYear();
                const primerDia = new Date(anio, mes - 1, 1).toISOString().split('T')[0];
                const ultimoDia = new Date(anio, mes, 0).toISOString().split('T')[0];
                const res = await fetch(`http://localhost:4000/api/reparaciones?desde=${primerDia}&hasta=${ultimoDia}`);
                const reparaciones = await res.json();
                ws_data = [
                    ['ID', 'Cliente', 'Dispositivo', 'Marca/Modelo', 'IMEI/Serial', 'Problema', 'Descripción', 'Costo', 'Fecha', 'Estado']
                ];
                reparaciones.forEach(rep => {
                    ws_data.push([
                        rep.id,
                        rep.nombreCliente || rep.cliente,
                        rep.dispositivo,
                        rep.marcaModelo,
                        rep.imei,
                        rep.problema,
                        rep.descripcion,
                        rep.costo,
                        rep.fecha_registro || rep.fecha,
                        rep.estado
                    ]);
                });
                nombreArchivo = 'informe_reparaciones_mensual.xlsx';
            } else if (tipo === 'articulos') {
                const res = await fetch('http://localhost:4000/api/inventario');
                const inventario = await res.json();
                ws_data = [
                    ['Producto', 'Precio', 'Costo', 'SKU', 'IMEI', 'Garantía', 'Existencias']
                ];
                inventario.forEach(i => {
                    ws_data.push([
                        i.nombre,
                        i.precio,
                        i.costo,
                        i.sku,
                        i.imei,
                        i.garantia,
                        i.existencias
                    ]);
                });
                nombreArchivo = 'informe_articulos.xlsx';
            } else if (tipo === 'inventario') {
                const res = await fetch('http://localhost:4000/api/inventario');
                const inventario = await res.json();
                let total = 0;
                ws_data = [
                    ['Producto', 'SKU', 'Existencias', 'Costo Unitario', 'Costo Total']
                ];
                inventario.forEach(i => {
                    const costoTotal = (parseFloat(i.costo) || 0) * (parseInt(i.existencias) || 0);
                    total += costoTotal;
                    ws_data.push([
                        i.nombre,
                        i.sku,
                        i.existencias,
                        i.costo,
                        costoTotal
                    ]);
                });
                ws_data.push(['', '', '', 'TOTAL', total]);
                nombreArchivo = 'informe_costo_inventario.xlsx';
            }
            
            if (ws_data.length > 1 && typeof XLSX !== 'undefined') {
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(ws_data);
                XLSX.utils.book_append_sheet(wb, ws, 'Informe');
                XLSX.writeFile(wb, nombreArchivo);
            } else {
                alert('No hay datos para exportar o XLSX no está disponible.');
            }
        } catch (error) {
            console.error('Error generando informe:', error);
            alert('Error al generar el informe');
        }
    }

    // Utilidades
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function formatearFecha(fecha) {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO') + ' ' + date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    }
});