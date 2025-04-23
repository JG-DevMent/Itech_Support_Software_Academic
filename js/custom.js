 // Código para el cerrar menú de navegación(Desplegable)
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('sidebarToggleCustom');
    const sidebar = document.getElementById('accordionSidebar');
  
    toggleButton.addEventListener('click', function () {
      sidebar.classList.toggle('toggled');
      document.body.classList.toggle('sidebar-toggled');
  });
});

//Graficas Dashboard SIMULACION
// Gráfica 1: Refacciones más utilizadas
new Chart(document.getElementById("refaccionesutilizadas"), 
{ type: 'bar',
  data: {
      labels: ["Pantallas", "Baterias", "Cámaras", "Memoria", "U Almacenamiento", "Teclados"],
      datasets: [{
          label: "Refacciones",
          data: [10, 20, 15, 25, 30, 22],
          backgroundColor: 'rgba(149, 116, 29, 0.6)'
      }]
  },
  options: {
      responsive: true,
      plugins: {
          title: {
              display: true,
              text: 'Refacciones más utilizadas'
          }
      }
  }
});

// Gráfica 2: Progreso de Clientes
new Chart(document.getElementById("progresoClientes"), {
  type: 'line',
  data: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datasets: [{
          label: "Clientes Nuevos",
          data: [5, 10, 8, 12, 15, 14],
          borderColor: 'rgba(173, 139, 51, 0.9)',
          backgroundColor: 'rgba(173, 139, 51, 0.3)',
          fill: true,
          tension: 0.4
      }]
  },
  options: {
      responsive: true,
      plugins: {
          title: {
              display: true,
              text: 'Progreso de Clientes'
          }
      }
  }
});

// Gráfica 3: Servicios por Mes
new Chart(document.getElementById("serviciosMes"), {
  type: 'doughnut',
  data: {
      labels: ["Reparaciones", "Instalaciones", "Diagnósticos"],
      datasets: [{
          label: "Servicios",
          data: [12, 9, 14],
          backgroundColor: [
              'rgba(149, 116, 29, 0.6)',
              'rgba(173, 139, 51, 0.6)',
              'rgba(227, 196, 116, 0.6)'
          ]
      }]
  },
  options: {
      responsive: true,
      plugins: {
          title: {
              display: true,
              text: 'Servicios Realizados'
          }
      }
  }
});

// Código para el botón de chat(Ayuda y soporte)
function toggleChat() {
  const chatBox = document.getElementById('chatBox');
  chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
}

// Código para el botón de filtrar fechas
document.querySelector(".btn-filtrar").addEventListener("click", () => {
  alert("Aquí se aplicaría el filtro de fechas.");
});


