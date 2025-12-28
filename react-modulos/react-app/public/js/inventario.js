/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('inventarioBody');
  const buscarInput = document.getElementById('inventariobusqueda');
  const btnBuscar = document.getElementById('btnInventario');
  const btnExportar = document.getElementById('exportarInventario');
  const btnRecontar = document.getElementById('btnRecontar');
  const btnGuardar = document.querySelector('#formInventario button.btn-primary');
  const btnLimpiarInventario = document.getElementById('btnLimpiarInventario');
  const contenedorPaginacion = document.getElementById('contenedorPaginacionInventario');

  let idEditar = null;
  let inventarioCache = [];
  let paginacionInventario = null;

  // Función para renderizar una fila de inventario
  function renderizarFilaInventario(item, index, tbody) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td data-title="Producto">${item.nombre}</td>
        <td data-title="Precio">${item.precio}</td>
        <td data-title="Costo">${item.costo}</td>
        <td data-title="SKU">${item.sku}</td>
        <td data-title="IMEI">${item.imei}</td>
        <td data-title="Garantía">${item.garantia}</td>
        <td data-title="Existencias">${item.existencias}</td>
        <td data-title="Acciones">
            <div class="btn-group-actions">
                <button class="btn btn-warning btn-sm editar" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm eliminar" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    tbody.appendChild(fila);
  }

  async function cargarInventario(filtro = '') {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/inventario`);
      const inventario = await response.json();
      inventarioCache = inventario;
      
      // Filtrar inventario según el término de búsqueda
      const inventarioFiltrado = filtro 
        ? inventario.filter(item => item.nombre.toLowerCase().includes(filtro.toLowerCase()))
        : inventario;
      
      // Inicializar o actualizar paginación
      if (!paginacionInventario) {
          paginacionInventario = new Paginacion({
              datos: inventarioFiltrado,
              elementoTabla: tablaBody,
              elementoControles: contenedorPaginacion,
              filasPorPagina: 6,
              funcionRenderizar: renderizarFilaInventario
          });
      } else {
          paginacionInventario.setDatos(inventarioFiltrado);
      }
    } catch (error) {
      window.notificaciones.error('Error al cargar el inventario desde el servidor. Por favor, intente nuevamente.');
    }
  }

  btnGuardar.addEventListener('click', async () => {
    const nombre = document.getElementById('nombreArticulo').value.trim();
    const precio = document.getElementById('precioVenta').value.trim();
    const costo = document.getElementById('costoTienda').value.trim();
    const sku = document.getElementById('sku').value.trim();
    const imei = document.getElementById('imeiosn').value.trim();
    const garantia = document.getElementById('garantia').value.trim();
    const existencias = parseInt(document.getElementById('existencias').value.trim());

    if (!nombre || !precio || !costo || !sku || !imei || !garantia || isNaN(existencias)) {
      return;
    }

    const nuevoArticulo = { nombre, precio, costo, sku, imei, garantia, existencias };
    try {
      if (idEditar) {
        const response = await fetch(`${window.API_BASE_URL}/api/inventario/${idEditar}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoArticulo)
        });
        if (!response.ok) throw new Error('Error actualizando producto');
        window.notificaciones.exito('Producto actualizado correctamente.');
        idEditar = null;
      } else {
        const response = await fetch(`${window.API_BASE_URL}/api/inventario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoArticulo)
        });
        if (!response.ok) {
          const error = await response.json();
          window.notificaciones.error(error.error || 'Error al crear el producto. Por favor, verifique los datos e intente nuevamente.');
          return;
        }
        window.notificaciones.exito('Producto guardado correctamente.');
      }
      await cargarInventario();
      $('#agregarArticuloModal').modal('hide');
      document.getElementById('formInventario').reset();
    } catch (error) {
      window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión e intente nuevamente.');
    }
  });

  btnBuscar.addEventListener('click', () => {
    cargarInventario(buscarInput.value.trim());
  });

  buscarInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') btnBuscar.click();
  });

  tablaBody.addEventListener('click', async (e) => {
    const id = e.target.closest('button')?.getAttribute('data-id');
    if (e.target.closest('.eliminar')) {
      const confirmado = await window.confirmar(
        '¿Está seguro de que desea eliminar este artículo del inventario? Esta acción no se puede deshacer.',
        'Confirmar eliminación'
      );
      if (confirmado) {
        try {
          const response = await fetch(`${window.API_BASE_URL}/api/inventario/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Error eliminando producto');
          window.notificaciones.exito('Producto eliminado correctamente del inventario.');
          await cargarInventario();
        } catch (error) {
          window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión e intente nuevamente.');
        }
      }
    }
    if (e.target.closest('.editar')) {
      try {
        const response = await fetch(`${window.API_BASE_URL}/api/inventario/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const item = await response.json();
        document.getElementById('nombreArticulo').value = item.nombre;
        document.getElementById('precioVenta').value = item.precio;
        document.getElementById('costoTienda').value = item.costo;
        document.getElementById('sku').value = item.sku;
        document.getElementById('imeiosn').value = item.imei;
        document.getElementById('garantia').value = item.garantia;
        document.getElementById('existencias').value = item.existencias;
        idEditar = id;
        $('#agregarArticuloModal').modal('show');
      } catch (error) {
        window.notificaciones.error('Error al cargar el producto para editar. Por favor, intente nuevamente.');
      }
    }
  });

  btnRecontar.addEventListener('click', async () => {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/inventario`);
      const inventario = await response.json();
      const total = inventario.reduce((sum, item) => sum + (parseInt(item.existencias) || 0), 0);
      window.notificaciones.informacion(`Total productos registrados: ${inventario.length}<br>Total unidades en inventario: ${total}`, 6000);
    } catch (error) {
      window.notificaciones.error('Error al contar el inventario. Por favor, intente nuevamente.');
    }
  });

  btnExportar.addEventListener('click', async () => {
    try {
      // Obtener todos los datos (filtrados o completos según corresponda)
      const inventarioExportar = paginacionInventario 
        ? paginacionInventario.getDatosCompletos() 
        : inventarioCache.length > 0 
          ? inventarioCache 
          : await (await fetch(`${window.API_BASE_URL}/api/inventario`)).json();
      
      if (inventarioExportar.length === 0) {
        window.notificaciones.advertencia('No hay productos para exportar.');
        return;
      }
      const ws_data = [
        ['Producto', 'Precio', 'Costo', 'SKU', 'IMEI', 'Garantía', 'Existencias'],
        ...inventarioExportar.map(i => [i.nombre, i.precio, i.costo, i.sku, i.imei, i.garantia, i.existencias])
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
      XLSX.writeFile(wb, 'Inventario_ITECHSUPPORT.xlsx');
      window.notificaciones.exito(`Se exportaron ${inventarioExportar.length} producto(s) correctamente.`);
    } catch (error) {
      window.notificaciones.error('Error al exportar el inventario. Por favor, intente nuevamente.');
    }
  });

  function limpiarBusqueda() {
    buscarInput.value = '';
    cargarInventario();
  }

  if (btnLimpiarInventario) {
    btnLimpiarInventario.addEventListener('click', limpiarBusqueda);
  }

  cargarInventario();
});