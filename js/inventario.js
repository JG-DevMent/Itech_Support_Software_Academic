document.addEventListener('DOMContentLoaded', () => {
  const inventarioKey = 'inventarioITECH';
  const tablaBody = document.getElementById('inventarioBody');
  const buscarInput = document.getElementById('inventariobusqueda');
  const btnBuscar = document.getElementById('btnInventario');
  const btnExportar = document.getElementById('exportarInventario');
  const btnRecontar = document.getElementById('btnRecontar');
  const btnGuardar = document.querySelector('#formInventario button.btn-primary');

  let indexEditar = null;

  function cargarInventario(filtro = '') {
      tablaBody.innerHTML = '';
      const inventario = JSON.parse(localStorage.getItem(inventarioKey)) || [];

      inventario
          .filter(item => item.nombre.toLowerCase().includes(filtro.toLowerCase()))
          .forEach((item, index) => {
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
                          <button class="btn btn-warning btn-sm editar" data-index="${index}">
                              <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-danger btn-sm eliminar" data-index="${index}">
                              <i class="fas fa-trash"></i>
                          </button>
                      </div>
                  </td>
              `;
              tablaBody.appendChild(fila);
          });
  }

  btnGuardar.addEventListener('click', () => {
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
      const inventario = JSON.parse(localStorage.getItem(inventarioKey)) || [];

      if (indexEditar !== null) {
          inventario[indexEditar] = nuevoArticulo;
          indexEditar = null;
      } else {
          inventario.push(nuevoArticulo);
      }

      localStorage.setItem(inventarioKey, JSON.stringify(inventario));
      cargarInventario();

      $('#agregarArticuloModal').modal('hide');
      document.getElementById('formInventario').reset();
  });

  btnBuscar.addEventListener('click', () => {
      cargarInventario(buscarInput.value.trim());
  });

  buscarInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') btnBuscar.click();
  });

  tablaBody.addEventListener('click', (e) => {
    const index = e.target.closest('button')?.getAttribute('data-index');
    const inventario = JSON.parse(localStorage.getItem(inventarioKey)) || [];

    if (e.target.closest('.eliminar')) {
        if (confirm('¿Seguro que deseas eliminar este artículo del inventario?')) {
            inventario.splice(index, 1);
            localStorage.setItem(inventarioKey, JSON.stringify(inventario));
            cargarInventario();
        }
    }

    if (e.target.closest('.editar')) {
        const item = inventario[index];

        document.getElementById('nombreArticulo').value = item.nombre;
        document.getElementById('precioVenta').value = item.precio;
        document.getElementById('costoTienda').value = item.costo;
        document.getElementById('sku').value = item.sku;
        document.getElementById('imeiosn').value = item.imei;
        document.getElementById('garantia').value = item.garantia;
        document.getElementById('existencias').value = item.existencias;

        indexEditar = index;
        $('#agregarArticuloModal').modal('show');
    }
});

  btnRecontar.addEventListener('click', () => {
      const inventario = JSON.parse(localStorage.getItem(inventarioKey)) || [];
      const total = inventario.reduce((sum, item) => sum + (parseInt(item.existencias) || 0), 0);
      alert(`Total productos registrados: ${inventario.length} \nTotal unidades en inventario: ${total}`);
  });

  btnExportar.addEventListener('click', () => {
      const inventario = JSON.parse(localStorage.getItem(inventarioKey)) || [];
      if (inventario.length === 0) return alert('No hay productos para exportar.');

      const ws_data = [
          ['Producto', 'Precio', 'Costo', 'SKU', 'IMEI', 'Garantía', 'Existencias'],
          ...inventario.map(i => [i.nombre, i.precio, i.costo, i.sku, i.imei, i.garantia, i.existencias])
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
      XLSX.writeFile(wb, 'Inventario_ITECHSUPPORT.xlsx');
  });

  cargarInventario();
});
