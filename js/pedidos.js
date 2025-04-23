let pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
let editandoIndex = null;

    function renderPedidos() {
      const tbody = document.getElementById("bodyPedidos");
      tbody.innerHTML = "";

      if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No hay pedidos para mostrar</td></tr>';
        return;
      }

      pedidos.forEach((p, index) => {
        const row = `<tr>
          <td>${index + 1}</td>
          <td>${p.cliente}</td>
          <td>${p.distribuidor}</td>
          <td>${p.productos}</td>
          <td>${p.metodoPago}</td>
          <td>${p.fecha}</td>
          <td>${p.total}</td>
          <td>${p.estado}</td>
          <td>${p.responsable}</td>
          <td class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="editarPedido(${index})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${index})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    function guardarPedido() {
      const form = document.getElementById("formPedido");
    
      if (!form.checkValidity()) {
        form.reportValidity(); // Muestra los mensajes nativos de HTML5
        return; // Detiene el guardado
      }
    
      const pedido = {
        cliente: document.getElementById("cliente").value,
        distribuidor: document.getElementById("distribuidor").value,
        productos: document.getElementById("productos").value,
        metodoPago: document.getElementById("metodoPago").value,
        fecha: document.getElementById("fechaPedido").value,
        total: document.getElementById("total").value,
        estado: document.getElementById("estado").value,
        responsable: document.getElementById("responsable").value
      };
    
      if (editandoIndex !== null) {
        pedidos[editandoIndex] = pedido;
        editandoIndex = null;
      } else {
        pedidos.push(pedido);
      }
    
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      $('#modalPedido').modal('hide');
      limpiarFormulario();
      renderPedidos();
    }
    


    function eliminarPedido(index) {
      if (confirm("¿Eliminar este pedido?")) {
        pedidos.splice(index, 1);
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
        renderPedidos();
      }
    }

    function editarPedido(index) {
      const p = pedidos[index];
      document.getElementById("cliente").value = p.cliente;
      document.getElementById("distribuidor").value = p.distribuidor;
      document.getElementById("productos").value = p.productos;
      document.getElementById("metodoPago").value = p.metodoPago;
      document.getElementById("fechaPedido").value = p.fecha;
      document.getElementById("total").value = p.total;
      document.getElementById("estado").value = p.estado;
      document.getElementById("responsable").value = p.responsable;
    
      editandoIndex = index; // guardamos el índice que estamos editando
      $('#modalPedido').modal('show');
    }
    
    function limpiarFormulario() {
      document.getElementById("cliente").value = "";
      document.getElementById("distribuidor").value = "";
      document.getElementById("productos").value = "";
      document.getElementById("metodoPago").value = "";
      document.getElementById("fechaPedido").value = "";
      document.getElementById("total").value = "";
      document.getElementById("estado").value = "";
      document.getElementById("responsable").value = "";
    }

    function filtrarPedidos() {
      const inicio = document.getElementById("startDate").value;
      const fin = document.getElementById("endDate").value;

      const filtrados = pedidos.filter(p => {
        return (!inicio || p.fecha >= inicio) && (!fin || p.fecha <= fin);
      });

      const tbody = document.getElementById("bodyPedidos");
      tbody.innerHTML = "";

      if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No hay pedidos en este rango</td></tr>';
        return;
      }

      filtrados.forEach((p, index) => {
        const row = `<tr>
          <td>${index + 1}</td>
          <td>${p.cliente}</td>
          <td>${p.distribuidor}</td>
          <td>${p.productos}</td>
          <td>${p.metodoPago}</td>
          <td>${p.fecha}</td>
          <td>${p.total}</td>
          <td>${p.estado}</td>
          <td>${p.responsable}</td>
          <td class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="editarPedido(${index})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${index})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    document.getElementById("exportarPedidos").addEventListener("click", function () {
      if (pedidos.length === 0) {
        alert("No hay pedidos para exportar.");
        return;
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(pedidos);
      XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
      XLSX.writeFile(wb, "Pedidos.xlsx");
    });
    
    // Inicial
    renderPedidos();