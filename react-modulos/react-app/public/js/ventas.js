document.addEventListener("DOMContentLoaded", () => {
    const enlaces = document.querySelectorAll(".informe-link");
    const btnFiltrar = document.querySelector('.btn-filtrar');
    const fechaInputs = document.querySelectorAll('.filtros-fecha input[type="date"]');
    
    enlaces.forEach(link => {
        link.addEventListener("click", async (e) => {
        e.preventDefault(); // evitar que se recargue la página

        const tipo = link.getAttribute("data-informe");
        let ws_data = [];
        let nombreArchivo = '';
        if (tipo === 'reparaciones') {
            // Informe de todas las reparaciones
            const res = await fetch(`${window.API_BASE_URL}/api/reparaciones`);
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
            // Informe mensual de reparaciones
            const hoy = new Date();
            const mes = hoy.getMonth() + 1;
            const anio = hoy.getFullYear();
            // Obtener primer y último día del mes
            const primerDia = new Date(anio, mes - 1, 1).toISOString().split('T')[0];
            const ultimoDia = new Date(anio, mes, 0).toISOString().split('T')[0];
            const res = await fetch(`${window.API_BASE_URL}/api/reparaciones?desde=${primerDia}&hasta=${ultimoDia}`);
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
            // Informe de artículos/inventario
            const res = await fetch(`${window.API_BASE_URL}/api/inventario`);
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
            // Informe de costo total del inventario
            const res = await fetch(`${window.API_BASE_URL}/api/inventario`);
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
        if (ws_data.length > 1) {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, 'Informe');
            XLSX.writeFile(wb, nombreArchivo);
        } else {
            alert('No hay datos para exportar.');
        }
        });
    });

    async function mostrarVentasHoy() {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/ventas/hoy`);
            const data = await res.json();
            document.querySelector('.card-venta span').textContent = `$${parseFloat(data.total || 0).toLocaleString('es-CO')}`;
        } catch (error) {
            console.error('Error al obtener ventas de hoy:', error);
            document.querySelector('.card-venta span').textContent = '$0';
        }
    }

    // Inicializar
    mostrarVentasHoy();
});