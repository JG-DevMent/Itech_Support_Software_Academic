// Estado global para las reparaciones, clientes y la reparación actual
let globalClients = [];
let globalRepairs = [];
let currentRepair = null;
let currentClient = null;
let currentRepairIndex = null;

// Inicializar datos desde LocalStorage al cargar la página
window.onload = function() {
  try {
    const storedClients = localStorage.getItem('clientes');
    globalClients = storedClients ? JSON.parse(storedClients) : [];
    const storedRepairs = localStorage.getItem('reparaciones');
    globalRepairs = storedRepairs ? JSON.parse(storedRepairs) : [];
  } catch (e) {
    console.error('Error al cargar datos de LocalStorage:', e);
    globalClients = [];
    globalRepairs = [];
  }

  // Vincular eventos a los botones
  document.getElementById('searchButton').addEventListener('click', searchRepair);
  document.getElementById('billingButton').addEventListener('click', goToBilling);
  document.getElementById('backToScreen1Button').addEventListener('click', goBackToScreen1);
  document.getElementById('backToScreen2Button').addEventListener('click', goBackToScreen2);
  document.getElementById('generateInvoiceButton').addEventListener('click', generateInvoice);
  document.getElementById('printButton').addEventListener('click', printInvoice);
};

// Pantalla 1: Buscar reparación
function searchRepair() {
  const clientId = document.getElementById('clientId').value;
  const repairId = parseInt(document.getElementById('repairId').value);

  if (!clientId || !repairId) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // El ID de reparación en greparaciones.js es index + 1, así que ajustamos
  currentRepairIndex = repairId - 1;
  if (currentRepairIndex < 0 || currentRepairIndex >= globalRepairs.length) {
    alert('ID de reparación no válido.');
    return;
  }

  currentRepair = globalRepairs[currentRepairIndex];
  if (currentRepair.cliente !== clientId) {
    alert('No se encontró una reparación con esa cédula e ID.');
    return;
  }

  // Buscar el cliente asociado
  currentClient = globalClients.find(client => client.cedula === clientId);

  if (!currentClient) {
    alert('No se encontró un cliente con esa cédula.');
    return;
  }

  // Mostrar información en la pantalla 2
  // Datos del cliente
  document.getElementById('displayClientId').textContent = currentClient.cedula;
  document.getElementById('displayClientName').textContent = currentClient.nombre || 'No especificado';
  document.getElementById('displayClientPhone').textContent = currentClient.telefono || 'No especificado';
  document.getElementById('displayClientEmail').textContent = currentClient.correo || 'No especificado';
  document.getElementById('displayClientAddress').textContent = currentClient.direccion || 'No especificado';

  // Datos de la reparación
  document.getElementById('displayRepairId').textContent = currentRepairIndex + 1;
  document.getElementById('displayDevice').textContent = currentRepair.dispositivo;
  document.getElementById('displayBrandModel').textContent = currentRepair.marcaModelo;
  document.getElementById('displayImei').textContent = currentRepair.imei;
  document.getElementById('displayIssue').textContent = currentRepair.problema;
  document.getElementById('displayDescription').textContent = currentRepair.descripcion;
  document.getElementById('displayCost').textContent = parseFloat(currentRepair.costo).toFixed(2);
  document.getElementById('displayDate').textContent = currentRepair.fecha || 'No especificada';
  document.getElementById('displayStatus').textContent = currentRepair.estado;

  // Cambiar a la pantalla 2
  document.getElementById('screen1').classList.add('hidden');
  document.getElementById('screen2').classList.remove('hidden');
}

// Volver a la pantalla 1
function goBackToScreen1() {
  document.getElementById('screen2').classList.add('hidden');
  document.getElementById('screen1').classList.remove('hidden');
  document.getElementById('clientId').value = '';
  document.getElementById('repairId').value = '';
  currentRepair = null;
  currentClient = null;
  currentRepairIndex = null;
}

// Ir a la pantalla 3 (Facturación)
function goToBilling() {
  document.getElementById('screen2').classList.add('hidden');
  document.getElementById('screen3').classList.remove('hidden');
}

// Volver a la pantalla 2
function goBackToScreen2() {
  document.getElementById('screen3').classList.add('hidden');
  document.getElementById('screen2').classList.remove('hidden');
  document.getElementById('invoiceSection').classList.add('hidden');
  document.getElementById('paymentMethod').value = 'Seleccione un método';
}

// Generar factura
function generateInvoice() {
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (paymentMethod === 'Seleccione un método') {
    alert('Por favor, selecciona un método de pago.');
    return;
  }

  const date = new Date().toLocaleDateString();
  const invoiceTable = document.getElementById('invoiceTable');
  invoiceTable.innerHTML = '';

  // Llenar la tabla de la factura con la reparación actual
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="border p-2">${currentRepairIndex + 1}</td>
    <td class="border p-2">${currentRepair.dispositivo}</td>
    <td class="border p-2">${currentRepair.marcaModelo}</td>
    <td class="border p-2">${currentRepair.imei}</td>
    <td class="border p-2">${currentRepair.problema}</td>
    <td class="border p-2">${currentRepair.descripcion}</td>
    <td class="border p-2">$${parseFloat(currentRepair.costo).toFixed(2)}</td>
    <td class="border p-2">${currentRepair.fecha || 'No especificada'}</td>
    <td class="border p-2">${currentRepair.estado}</td>
  `;
  invoiceTable.appendChild(row);

  document.getElementById('invoiceClientName').textContent = currentClient.nombre || 'No especificado';
  document.getElementById('invoiceClientId').textContent = currentClient.cedula;
  document.getElementById('invoiceClientPhone').textContent = currentClient.telefono || 'No especificado';
  document.getElementById('invoiceClientEmail').textContent = currentClient.correo || 'No especificado';
  document.getElementById('invoiceClientAddress').textContent = currentClient.direccion || 'No especificado';
  document.getElementById('invoiceDate').textContent = date;
  document.getElementById('invoicePaymentMethod').textContent = paymentMethod;
  document.getElementById('invoiceTotal').textContent = parseFloat(currentRepair.costo).toFixed(2);
  document.getElementById('invoiceSection').classList.remove('hidden');

  // Generar código QR con la información de la factura
  const qrText = `Factura\nCliente: ${currentClient.nombre || 'No especificado'} (Cédula: ${currentClient.cedula})\nFecha: ${date}\nTotal: $${parseFloat(currentRepair.costo).toFixed(2)}\nMétodo de Pago: ${paymentMethod}`;
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = ''; // Limpiar cualquier contenido previo
  const qrCanvas = document.createElement('canvas');
  qrContainer.appendChild(qrCanvas);
  QRCode.toCanvas(qrCanvas, qrText, { width: 150, margin: 1 }, (err) => {
    if (err) {
      console.error('Error al generar el QR:', err);
      qrContainer.innerHTML = '<p>Error al generar el código QR.</p>';
    }
  });
}

// Imprimir factura
function printInvoice() {
  const invoiceSection = document.getElementById('invoiceSection').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Factura</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          #printButton { display: none; }
        </style>
      </head>
      <body class="p-4">
        ${invoiceSection}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}