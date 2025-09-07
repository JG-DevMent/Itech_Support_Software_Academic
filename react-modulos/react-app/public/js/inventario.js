document.addEventListener('DOMContentLoaded', () => {
  const tablaBody = document.getElementById('inventarioBody');
  const buscarInput = document.getElementById('inventariobusqueda');
  const filtroCategoria = document.getElementById('filtroCategoria');
  const btnBuscar = document.getElementById('btnInventario');
  const btnExportar = document.getElementById('exportarInventario');
  const btnRecontar = document.getElementById('btnRecontar');
  const btnGuardar = document.querySelector('#formInventario button.btn-primary');
  const btnLimpiarInventario = document.getElementById('btnLimpiarInventario');

  let idEditar = null;
  let inventarioCache = [];

  async function cargarInventario(filtro = '', categoria = '') {
    try {
      // Obtener token de autenticación
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.location.href = 'index.html';
        return;
      }

      // Construir URL con parámetros de filtro si es necesario
      let url = 'http://localhost:4000/api/inventario';
      if (filtro && categoria) {
        url = `http://localhost:4000/api/inventario/search/productos?termino=${encodeURIComponent(filtro)}&categoria=${categoria}`;
      } else if (filtro) {
        url = `http://localhost:4000/api/inventario/search/productos?termino=${encodeURIComponent(filtro)}`;
      } else if (categoria) {
        url = `http://localhost:4000/api/inventario/categoria/${categoria}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
          window.location.href = 'index.html';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const inventario = await response.json();
      inventarioCache = inventario;
      mostrarInventarioEnTabla(inventario);

    } catch (error) {
      console.error('Error cargando inventario:', error);
      alert('Error cargando inventario desde el servidor.');
    }
  }

  function mostrarInventarioEnTabla(inventario) {
    tablaBody.innerHTML = '';
    
    if (inventario.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="9" class="text-center">No se encontraron productos</td></tr>';
      return;
    }

    inventario.forEach((item) => {
      const fila = document.createElement('tr');
      const categoriaBadge = obtenerBadgeCategoria(item.categoria || 'ambos');
      
      fila.innerHTML = `
          <td data-title="Producto">${item.nombre}</td>
          <td data-title="Precio">$${parseFloat(item.precio || 0).toLocaleString('es-CO')}</td>
          <td data-title="Costo">$${parseFloat(item.costo || 0).toLocaleString('es-CO')}</td>
          <td data-title="SKU">${item.sku}</td>
          <td data-title="IMEI">${item.imei || 'N/A'}</td>
          <td data-title="Garantía">${item.garantia}</td>
          <td data-title="Categoría">${categoriaBadge}</td>
          <td data-title="Existencias">
              <span class="badge ${item.existencias <= 5 ? 'badge-danger' : 'badge-success'}">
                  ${item.existencias}
              </span>
          </td>
          <td data-title="Acciones">
              <div class="btn-group-actions">
                  <button class="btn btn-warning btn-sm editar" data-id="${item.id}" title="Editar producto">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-danger btn-sm eliminar" data-id="${item.id}" title="Eliminar producto">
                      <i class="fas fa-trash"></i>
                  </button>
              </div>
          </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  function obtenerBadgeCategoria(categoria) {
    const badges = {
      'servicio': '<span class="badge badge-info">Servicio</span>',
      'venta': '<span class="badge badge-success">Venta</span>',
      'ambos': '<span class="badge badge-primary">Ambos</span>'
    };
    return badges[categoria] || badges['ambos'];
  }

  btnGuardar.addEventListener('click', async () => {
    const nombre = document.getElementById('nombreArticulo').value.trim();
    const precio = document.getElementById('precioVenta').value.trim();
    const costo = document.getElementById('costoTienda').value.trim();
    const sku = document.getElementById('sku').value.trim();
    const imei = document.getElementById('imeiosn').value.trim();
    const garantia = document.getElementById('garantia').value.trim();
    const categoria = document.getElementById('categoria').value;
    const existencias = parseInt(document.getElementById('existencias').value.trim());

    if (!nombre || !precio || !costo || !sku || !imei || !garantia || !categoria || isNaN(existencias)) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevoArticulo = { nombre, precio, costo, sku, imei, garantia, categoria, existencias };
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = 'index.html';
      return;
    }

    try {
      if (idEditar) {
        const response = await fetch(`http://localhost:4000/api/inventario/${idEditar}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(nuevoArticulo)
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error actualizando producto');
        }
        alert('Producto actualizado correctamente');
        idEditar = null;
      } else {
        const response = await fetch('http://localhost:4000/api/inventario', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(nuevoArticulo)
        });
        if (!response.ok) {
          const error = await response.json();
          alert(error.error || 'Error creando producto');
          return;
        }
        alert('Producto guardado correctamente');
      }
      await cargarInventario();
      $('#agregarArticuloModal').modal('hide');
      document.getElementById('formInventario').reset();
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error: ' + error.message);
    }
  });

  btnBuscar.addEventListener('click', () => {
    cargarInventario(buscarInput.value.trim(), filtroCategoria.value);
  });

  buscarInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') btnBuscar.click();
  });

  // Event listener para el filtro de categoría
  filtroCategoria.addEventListener('change', () => {
    cargarInventario(buscarInput.value.trim(), filtroCategoria.value);
  });

  tablaBody.addEventListener('click', async (e) => {
    const id = e.target.closest('button')?.getAttribute('data-id');
    const token = sessionStorage.getItem('jwtToken');
    
    if (!token) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = 'index.html';
      return;
    }

    if (e.target.closest('.eliminar')) {
      if (confirm('¿Seguro que deseas eliminar este artículo del inventario?')) {
        try {
          const response = await fetch(`http://localhost:4000/api/inventario/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error eliminando producto');
          }
          
          alert('Producto eliminado correctamente');
          await cargarInventario();
        } catch (error) {
          console.error('Error eliminando producto:', error);
          alert('Error: ' + error.message);
        }
      }
    }
    
    if (e.target.closest('.editar')) {
      try {
        const response = await fetch(`http://localhost:4000/api/inventario/producto/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Producto no encontrado');
        }
        
        const item = await response.json();
        document.getElementById('nombreArticulo').value = item.nombre;
        document.getElementById('precioVenta').value = item.precio;
        document.getElementById('costoTienda').value = item.costo;
        document.getElementById('sku').value = item.sku;
        document.getElementById('imeiosn').value = item.imei || '';
        document.getElementById('garantia').value = item.garantia;
        document.getElementById('categoria').value = item.categoria || 'ambos';
        document.getElementById('existencias').value = item.existencias;
        
        // Cambiar título del modal
        document.getElementById('agregarArticuloModalLabel').textContent = 'Editar producto';
        
        idEditar = id;
        $('#agregarArticuloModal').modal('show');
      } catch (error) {
        console.error('Error cargando producto para editar:', error);
        alert('Error: ' + error.message);
      }
    }
  });

  btnRecontar.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:4000/api/inventario');
      const inventario = await response.json();
      const total = inventario.reduce((sum, item) => sum + (parseInt(item.existencias) || 0), 0);
      alert(`Total productos registrados: ${inventario.length} \nTotal unidades en inventario: ${total}`);
    } catch (error) {
      alert('Error al contar inventario.');
    }
  });

  btnExportar.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:4000/api/inventario');
      const inventario = await response.json();
      if (inventario.length === 0) return alert('No hay productos para exportar.');
      const ws_data = [
        ['Producto', 'Precio', 'Costo', 'SKU', 'IMEI', 'Garantía', 'Existencias'],
        ...inventario.map(i => [i.nombre, i.precio, i.costo, i.sku, i.imei, i.garantia, i.existencias])
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
      XLSX.writeFile(wb, 'Inventario_ITECHSUPPORT.xlsx');
    } catch (error) {
      alert('Error exportando inventario.');
    }
  });

  function limpiarBusqueda() {
    buscarInput.value = '';
    filtroCategoria.value = '';
    cargarInventario();
  }

  if (btnLimpiarInventario) {
    btnLimpiarInventario.addEventListener('click', limpiarBusqueda);
  }

  // Event listener para limpiar el modal cuando se abre para crear nuevo producto
  $('#agregarArticuloModal').on('hidden.bs.modal', function () {
    document.getElementById('formInventario').reset();
    document.getElementById('agregarArticuloModalLabel').textContent = 'Agregar dispositivo';
    idEditar = null;
  });

  // Event listener para cuando se abre el modal (para crear nuevo producto)
  $('.btn-addinventario').on('click', function() {
    document.getElementById('agregarArticuloModalLabel').textContent = 'Agregar dispositivo';
    document.getElementById('formInventario').reset();
    idEditar = null;
  });

  cargarInventario();
});
