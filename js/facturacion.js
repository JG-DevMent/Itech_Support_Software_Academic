/**
 * Script para el módulo de pago y facturación POS
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Facturación: Módulo cargado correctamente');
    
    // Verificar datos en localStorage
    const reparaciones = JSON.parse(localStorage.getItem('reparaciones') || '[]');
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    console.log('Reparaciones disponibles:', reparaciones.length);
    console.log('Clientes disponibles:', clientes.length);
    
    // Cargar configuración de recibos desde localStorage
    const receiptConfig = JSON.parse(localStorage.getItem('receiptConfig')) || {};
    
    // Elementos de la pantalla 1
    const screen1 = document.getElementById('screen1');
    const clientIdInput = document.getElementById('clientId');
    const repairIdInput = document.getElementById('repairId');
    const searchButton = document.getElementById('searchButton');
    const clientSearchBtn = document.getElementById('clientSearchBtn');
    const repairSearchBtn = document.getElementById('repairSearchBtn');
    const searchHistory = document.getElementById('searchHistory');
    const btnLimpiarHistorial = document.getElementById('btnLimpiarHistorial');
    const btnLimpiarCliente = document.getElementById('btnLimpiarCliente');
    const btnLimpiarReparacion = document.getElementById('btnLimpiarReparacion');
    
    // Elementos de la pantalla 2
    const screen2 = document.getElementById('screen2');
    const billingButton = document.getElementById('billingButton');
    const backToScreen1Button = document.getElementById('backToScreen1Button');
    
    // Elementos de la pantalla 3
    const screen3 = document.getElementById('screen3');
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const generateInvoiceButton = document.getElementById('generateInvoiceButton');
    const backToScreen2Button = document.getElementById('backToScreen2Button');
    const invoiceSection = document.getElementById('invoiceSection');
    const printButton = document.getElementById('printButton');
    const emailButton = document.getElementById('emailButton');
    const downloadButton = document.getElementById('downloadButton');
    const newTransactionButton = document.getElementById('newTransactionButton');
    const paymentInstruction = document.querySelector('.payment-instruction');
    
    // Elementos de resumen de pago
    const summaryClientName = document.getElementById('summaryClientName');
    const summaryService = document.getElementById('summaryService');
    const summaryDevice = document.getElementById('summaryDevice');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // Aplicar configuración de moneda si existe
    if (receiptConfig.currency) {
        const currencySymbol = receiptConfig.currency;
        const currencyElements = document.querySelectorAll('.currency-symbol');
        currencyElements.forEach(el => {
            el.textContent = currencySymbol;
        });
    }
    
    // Función para mostrar una animación de carga
    function showLoading(message = 'Procesando...') {
        // Crear overlay de carga
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.id = 'loadingOverlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        const loadingText = document.createElement('div');
        loadingText.textContent = message;
        loadingText.style.marginLeft = '15px';
        loadingText.style.color = '#333';
        loadingText.style.fontWeight = 'bold';
        
        const spinnerContainer = document.createElement('div');
        spinnerContainer.style.display = 'flex';
        spinnerContainer.style.alignItems = 'center';
        spinnerContainer.appendChild(spinner);
        spinnerContainer.appendChild(loadingText);
        
        loadingOverlay.appendChild(spinnerContainer);
        document.body.appendChild(loadingOverlay);
    }
    
    // Función para ocultar la animación de carga
    function hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
    
    // Función para cambiar suavemente entre pantallas
    function transitionToScreen(fromScreen, toScreen) {
        if (fromScreen) {
            fromScreen.classList.add('hidden');
        }
        
        // Pequeño retraso para el efecto visual
        setTimeout(() => {
            if (fromScreen) {
                fromScreen.style.display = 'none';
            }
            toScreen.style.display = 'block';
            
            // Pequeño retraso para el efecto visual
            setTimeout(() => {
                toScreen.classList.remove('hidden');
            }, 50);
        }, 300);
    }
    
    // Función para agregar a historial de búsquedas
    function addToSearchHistory(id, name) {
        // Evitar duplicados
        const existingItems = document.querySelectorAll('.pos-history-id');
        for (let item of existingItems) {
            if (item.textContent.includes(id)) return;
        }
        
        const historyItem = document.createElement('div');
        historyItem.className = 'pos-history-item';
        historyItem.innerHTML = `
            <div class="pos-history-details">
                <span class="pos-history-id">ID: ${id}</span>
                <span class="pos-history-name">${name}</span>
            </div>
            <button class="pos-history-select"><i class="fas fa-arrow-right"></i></button>
        `;
        
        // Agregar evento de clic
        historyItem.querySelector('.pos-history-select').addEventListener('click', function() {
            repairIdInput.value = id;
            
            // Obtener la cédula del cliente desde el historial de reparaciones
            const repairs = getRepairsFromStorage();
            const repair = repairs[parseInt(id) - 1]; // Ajustar el índice
            if (repair) {
                clientIdInput.value = repair.cliente || '';
            }
            
            searchButton.click();
        });
        
        // Agregar al principio del historial
        if (searchHistory.firstChild) {
            searchHistory.insertBefore(historyItem, searchHistory.firstChild);
        } else {
            searchHistory.appendChild(historyItem);
        }
        
        // Limitar a 5 items
        const items = searchHistory.querySelectorAll('.pos-history-item');
        if (items.length > 5) {
            searchHistory.removeChild(items[items.length - 1]);
        }
        
        // Guardar en localStorage para persistencia
        try {
            const searchHistoryData = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const newItem = { id, name, timestamp: new Date().getTime() };
            
            // Verificar duplicados
            const index = searchHistoryData.findIndex(item => item.id === id);
            if (index !== -1) {
                searchHistoryData.splice(index, 1);
            }
            
            // Agregar nuevo item al inicio
            searchHistoryData.unshift(newItem);
            
            // Limitar a 10 items
            if (searchHistoryData.length > 10) {
                searchHistoryData.pop();
            }
            
            localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
        } catch (error) {
            console.error('Error guardando historial de búsquedas:', error);
        }
    }
    
    // Cargar historial de búsquedas desde localStorage al inicio
    function loadSearchHistory() {
        try {
            const searchHistoryData = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            
            // Limpiar historial actual
            searchHistory.innerHTML = '';
            
            // Mostrar solo los 5 más recientes
            searchHistoryData.slice(0, 5).forEach(item => {
                addToSearchHistory(item.id, item.name);
            });
        } catch (error) {
            console.error('Error cargando historial de búsquedas:', error);
        }
    }
    
    // Mostrar lista de reparaciones disponibles
    function popularHistorialDesdeReparaciones() {
        try {
            const repairs = getRepairsFromStorage();
            if (repairs.length === 0) {
                console.log('No hay reparaciones disponibles en el localStorage');
                return;
            }
            
            // Limpiar historial actual
            searchHistory.innerHTML = '';
            
            // Mostrar las últimas 5 reparaciones en el historial para facilitar acceso
            repairs.slice(-5).reverse().forEach((repair, index) => {
                const id = repairs.length - index; // El ID mostrado corresponde al índice + 1 (empezando desde el final)
                const clientName = repair.nombreCliente || 'Cliente';
                addToSearchHistory(id.toString(), clientName);
            });
            
            console.log('Historial de búsquedas cargado con las últimas reparaciones');
        } catch (error) {
            console.error('Error cargando reparaciones para el historial:', error);
        }
    }
    
    // Obtener reparaciones desde localStorage
    function getRepairsFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('reparaciones') || '[]');
        } catch (error) {
            console.error('Error obteniendo reparaciones:', error);
            return [];
        }
    }
    
    // Obtener clientes desde localStorage
    function getClientsFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('clientes') || '[]');
        } catch (error) {
            console.error('Error obteniendo clientes:', error);
            return [];
        }
    }
    
    // Buscar reparación por ID
    function findRepairById(repairId) {
        const repairs = getRepairsFromStorage();
        // En la lista de reparaciones, buscamos por índice ya que no hay un ID explícito
        return repairs[parseInt(repairId) - 1]; // Ajustamos el índice ya que los usuarios ven índices desde 1
    }
    
    // Buscar cliente por cédula
    function findClientById(clientId) {
        const clients = getClientsFromStorage();
        return clients.find(client => client.cedula === clientId);
    }
    
    // Cargar historial de búsquedas desde localStorage al inicio
    loadSearchHistory();
    
    // Cargar el historial con reparaciones disponibles si no hay historial
    if (searchHistory.children.length === 0) {
        popularHistorialDesdeReparaciones();
    }
    
    // Validar campos de entrada
    function validateInputs() {
        // Validar cédula/NIT
        if (!clientIdInput.value.trim()) {
            showError(clientIdInput, 'Ingrese la cédula o NIT del cliente');
            return false;
        } else {
            removeError(clientIdInput);
        }
        
        // Validar ID de reparación
        if (!repairIdInput.value.trim()) {
            showError(repairIdInput, 'Ingrese el ID de reparación');
            return false;
        } else {
            removeError(repairIdInput);
        }
        
        return true;
    }
    
    // Mostrar error en un campo
    function showError(inputElement, message) {
        // Eliminar cualquier mensaje de error previo
        removeError(inputElement);
        
        // Agregar clase de error
        inputElement.classList.add('is-invalid');
        
        // Crear y mostrar mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        // Insertar después del input
        if (inputElement.parentNode) {
            // Si está dentro de un input-group, agregar después del grupo
            const inputGroup = inputElement.closest('.input-group');
            if (inputGroup) {
                inputGroup.after(errorDiv);
            } else {
                inputElement.after(errorDiv);
            }
        }
    }
    
    // Eliminar error de un campo
    function removeError(inputElement) {
        inputElement.classList.remove('is-invalid');
        
        // Eliminar mensajes de error existentes
        const parentEl = inputElement.parentNode;
        if (parentEl) {
            const inputGroup = inputElement.closest('.input-group');
            const container = inputGroup || parentEl;
            
            const nextSibling = container.nextElementSibling;
            if (nextSibling && nextSibling.classList.contains('invalid-feedback')) {
                nextSibling.remove();
            }
        }
    }
    
    // Eventos para cambiar entre pantallas
    searchButton.addEventListener('click', function() {
        // Validar entradas
        if (!validateInputs()) {
            return;
        }
        
        // Mostrar cargando
        showLoading('Buscando reparación...');
        
        // Buscar datos reales en localStorage
        setTimeout(function() {
            // Obtener los datos de reparación y cliente
            const repairId = repairIdInput.value;
            const clientId = clientIdInput.value;
            
            // Buscar la reparación por ID (índice)
            const repairs = getRepairsFromStorage();
            const repair = repairs[parseInt(repairId) - 1]; // Ajustar el índice
            
            // Buscar el cliente por cédula
            const client = findClientById(clientId);
            
            if (!repair) {
                hideLoading();
                alert('No se encontró ninguna reparación con el ID: ' + repairId);
                return;
            }
            
            if (!client) {
                hideLoading();
                alert('No se encontró ningún cliente con la cédula: ' + clientId);
                return;
            }
            
            // Mostrar datos del cliente
            document.getElementById('displayClientId').textContent = client.cedula || '';
            document.getElementById('displayClientName').textContent = client.nombre || '';
            document.getElementById('displayClientPhone').textContent = client.telefono || '';
            document.getElementById('displayClientEmail').textContent = client.correo || '';
            document.getElementById('displayClientAddress').textContent = client.direccion || '';
            
            // Verificar si la reparación tiene materiales
            const tieneMateriales = repair.materiales && repair.materiales.length > 0;
            const costoMateriales = tieneMateriales ? repair.costoMateriales : 0;
            const infoMateriales = tieneMateriales ? 
                `<br><small class="text-info">Materiales: ${repair.materiales.length} items ($${costoMateriales.toFixed(2)})</small>` : 
                '';
            
            // Mostrar datos de la reparación
            document.getElementById('displayRepairId').textContent = repairId;
            document.getElementById('displayDevice').textContent = repair.dispositivo || '';
            document.getElementById('displayBrandModel').textContent = repair.marcaModelo || '';
            document.getElementById('displayImei').textContent = repair.imei || '';
            document.getElementById('displayIssue').textContent = repair.problema || '';
            document.getElementById('displayDescription').innerHTML = (repair.descripcion || '') + infoMateriales;
            document.getElementById('displayCost').textContent = repair.costo || '0';
            document.getElementById('displayDate').textContent = repair.fecha || new Date().toLocaleDateString();
            document.getElementById('displayStatus').textContent = repair.estado || 'Completado';
            
            // Mostrar botón de materiales si existen
            const materialsButton = document.getElementById('viewMaterialsButton');
            if (materialsButton) {
                if (tieneMateriales) {
                    materialsButton.style.display = 'inline-block';
                    materialsButton.onclick = function() {
                        mostrarMateriales(repair);
                    };
                } else {
                    materialsButton.style.display = 'none';
                }
            }
            
            // Agregar al historial
            addToSearchHistory(repairId, client.nombre || 'Cliente');
            
            // Ocultar cargando
            hideLoading();
            
            // Cambiar a pantalla 2 con transición
            transitionToScreen(screen1, screen2);
        }, 1000);
    });
    
    // También añadir eventos a los botones de búsqueda individuales
    clientSearchBtn.addEventListener('click', function() {
        if (!clientIdInput.value) {
            showError(clientIdInput, 'Por favor, ingrese la cédula del cliente');
            return;
        } else {
            removeError(clientIdInput);
        }
        
        showLoading('Buscando cliente...');
        
        setTimeout(function() {
            const clientId = clientIdInput.value;
            const client = findClientById(clientId);
            
            hideLoading();
            
            if (client) {
                alert('Cliente encontrado: ' + client.nombre);
                repairIdInput.focus();
            } else {
                alert('No se encontró ningún cliente con la cédula: ' + clientId);
            }
        }, 800);
    });
    
    repairSearchBtn.addEventListener('click', function() {
        if (!repairIdInput.value) {
            showError(repairIdInput, 'Por favor, ingrese el ID de reparación');
            return;
        } else {
            removeError(repairIdInput);
        }
        
        // Si hay ID de reparación pero no hay cédula, buscar la reparación
        // y auto-completar la cédula del cliente
        if (!clientIdInput.value) {
            const repairId = repairIdInput.value;
            const repairs = getRepairsFromStorage();
            const repair = repairs[parseInt(repairId) - 1]; // Ajustar el índice
            
            if (repair && repair.cliente) {
                clientIdInput.value = repair.cliente;
            }
        }
        
        searchButton.click();
    });
    
    backToScreen1Button.addEventListener('click', function() {
        transitionToScreen(screen2, screen1);
    });
    
    billingButton.addEventListener('click', function() {
        transitionToScreen(screen2, screen3);
        
        // Ocultar sección de factura si estaba visible
        invoiceSection.classList.add('hidden');
        invoiceSection.style.display = 'none';
        
        // Rellenar el resumen
        summaryClientName.textContent = document.getElementById('displayClientName').textContent;
        summaryService.textContent = document.getElementById('displayIssue').textContent;
        summaryDevice.textContent = document.getElementById('displayBrandModel').textContent;
        
        const cost = parseFloat(document.getElementById('displayCost').textContent.replace(/,/g, '').replace(/\$/g, '').trim());
        const taxRate = parseFloat(receiptConfig.taxRate || 19);
        const tax = cost * (taxRate / 100);
        const total = cost + tax;
        
        summaryTotal.textContent = total.toLocaleString('es-CO');
        
        // Resetear selección de método de pago
        paymentMethodRadios.forEach(radio => {
            radio.checked = false;
        });
        
        // Ocultar instrucciones
        hidePaymentInstructions();
    });
    
    backToScreen2Button.addEventListener('click', function() {
        transitionToScreen(screen3, screen2);
    });
    
    // Función para manejar el cambio en método de pago (radios)
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const selectedValue = this.value;
                showPaymentInstructions(selectedValue);
            }
        });
    });
    
    // Función para mostrar instrucciones según el método de pago
    function showPaymentInstructions(paymentMethod) {
        if (!paymentInstruction) return;
        
        let instructions = '';
        
        switch(paymentMethod) {
            case 'Efectivo':
                instructions = 'El pago en efectivo se recibirá en el momento de la entrega del dispositivo reparado.';
                break;
            case 'Tarjeta Débito':
            case 'Tarjeta Crédito':
                instructions = 'Aceptamos tarjetas Visa, MasterCard y American Express. El pago se procesará al finalizar.';
                break;
            case 'Transferencia Bancaria':
                instructions = 'Realice la transferencia a la cuenta Bancolombia #123-456789-00 a nombre de ITECH SUPPORT SAS, NIT 900.123.456-7. Por favor envíe el comprobante al correo pagos@itechsupport.com';
                break;
            case 'Nequi':
                instructions = 'Realice el pago al número Nequi 300-123-4567. Envíe el comprobante al WhatsApp 300-123-4567.';
                break;
            case 'Daviplata':
                instructions = 'Realice el pago al número Daviplata 300-123-4567. Envíe el comprobante al WhatsApp 300-123-4567.';
                break;
            default:
                instructions = '';
        }
        
        if (instructions) {
            paymentInstruction.textContent = instructions;
            paymentInstruction.style.display = 'block';
            
            // Efecto de entrada suave
            paymentInstruction.style.opacity = '0';
            paymentInstruction.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                paymentInstruction.style.transition = 'all 0.3s ease';
                paymentInstruction.style.opacity = '1';
                paymentInstruction.style.transform = 'translateY(0)';
            }, 10);
        } else {
            paymentInstruction.style.display = 'none';
        }
    }
    
    // Función para ocultar instrucciones de pago
    function hidePaymentInstructions() {
        if (paymentInstruction) {
            paymentInstruction.style.display = 'none';
        }
    }
    
    generateInvoiceButton.addEventListener('click', function() {
        // Verificar si se ha seleccionado un método de pago válido
        let selectedMethod = null;
        paymentMethodRadios.forEach(radio => {
            if (radio.checked) {
                selectedMethod = radio.value;
            }
        });
        
        if (!selectedMethod) {
            alert('Por favor, seleccione un método de pago');
            return;
        }
        
        // Mostrar indicación de procesamiento
        showLoading('Generando factura...');
        
        // Simular procesamiento
        setTimeout(function() {
            // Obtener datos para la factura
            const clientName = document.getElementById('displayClientName').textContent;
            const clientId = document.getElementById('displayClientId').textContent;
            const clientPhone = document.getElementById('displayClientPhone').textContent;
            const clientEmail = document.getElementById('displayClientEmail').textContent;
            const clientAddress = document.getElementById('displayClientAddress').textContent;
            
            const repairId = document.getElementById('displayRepairId').textContent;
            const device = document.getElementById('displayDevice').textContent;
            const brandModel = document.getElementById('displayBrandModel').textContent;
            const imei = document.getElementById('displayImei').textContent;
            const issue = document.getElementById('displayIssue').textContent;
            const description = document.getElementById('displayDescription').textContent;
            const cost = parseFloat(document.getElementById('displayCost').textContent.replace(/,/g, '').replace(/\$/g, '').trim());
            
            const paymentMethod = selectedMethod;
            const date = new Date().toLocaleDateString();
            
            // Aplicar la configuración del recibo a la factura
            if (receiptConfig.logoURL) {
                document.getElementById('invoiceLogo').innerHTML = `<img src="${receiptConfig.logoURL}" alt="Logo" class="invoice-logo">`;
            }
            
            document.getElementById('invoiceTitle').textContent = receiptConfig.receiptTitle || 'Factura de Servicio';
            document.getElementById('invoiceCompany').textContent = receiptConfig.companyName || 'ITECH SUPPORT';
            document.getElementById('invoiceTagline').textContent = receiptConfig.companyTagline || 'Soluciones tecnológicas a tu alcance';
            document.getElementById('invoiceHeaderNotes').textContent = receiptConfig.headerNotes || '';
            
            // Impuesto configurado o valor predeterminado (19% para Colombia)
            const taxRate = parseFloat(receiptConfig.taxRate || 19);
            document.getElementById('invoiceTaxRate').textContent = taxRate;
            
            // Calcular subtotal, impuesto y total
            const subtotal = cost;
            const tax = subtotal * (taxRate / 100);
            const total = subtotal + tax;
            
            // Llenar datos en la factura
            document.getElementById('invoiceClientName').textContent = clientName;
            document.getElementById('invoiceClientId').textContent = clientId;
            document.getElementById('invoiceClientPhone').textContent = clientPhone;
            document.getElementById('invoiceClientEmail').textContent = clientEmail;
            document.getElementById('invoiceClientAddress').textContent = clientAddress;
            
            // Generar número de factura con prefijo si existe
            const prefix = receiptConfig.receiptPrefix || 'ITECH-';
            const invoiceNumber = prefix + new Date().getTime().toString().slice(-6);
            document.getElementById('invoiceNumber').textContent = invoiceNumber;
            
            document.getElementById('invoiceDate').textContent = date;
            document.getElementById('invoicePaymentMethod').textContent = paymentMethod;
            
            // Llenar tabla de factura
            const tableBody = document.getElementById('invoiceTableBody');
            tableBody.innerHTML = '';
            
            const currencySymbol = receiptConfig.currency || '$';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${issue}: ${description}</td>
                <td>${device} ${brandModel}</td>
                <td>${imei}</td>
                <td>${currencySymbol} ${subtotal.toLocaleString('es-CO')}</td>
            `;
            tableBody.appendChild(row);
            
            // Mostrar totales con formato de moneda colombiana
            document.getElementById('invoiceSubtotal').textContent = subtotal.toLocaleString('es-CO');
            document.getElementById('invoiceTax').textContent = tax.toLocaleString('es-CO');
            document.getElementById('invoiceTotal').textContent = total.toLocaleString('es-CO');
            
            // Actualizar símbolos de moneda
            const currencyElements = document.querySelectorAll('.currency-symbol');
            currencyElements.forEach(el => {
                el.textContent = currencySymbol;
            });
            
            // Pie de página del recibo
            document.getElementById('invoiceFooterText').textContent = receiptConfig.footerText || 'Gracias por su preferencia';
            document.getElementById('invoiceTerms').textContent = receiptConfig.termsAndConditions || '';
            document.getElementById('invoiceContact').textContent = receiptConfig.contactInfo || '';
            
            // Redes sociales si están configuradas
            const socialDiv = document.getElementById('invoiceSocial');
            socialDiv.innerHTML = '';
            
            if (receiptConfig.showSocialMedia === 'true') {
                const facebook = receiptConfig.facebook;
                const instagram = receiptConfig.instagram;
                const twitter = receiptConfig.twitter;
                
                let socialHTML = '';
                if (facebook) socialHTML += `<i class="fab fa-facebook"></i> ${facebook} `;
                if (instagram) socialHTML += `<i class="fab fa-instagram"></i> ${instagram} `;
                if (twitter) socialHTML += `<i class="fab fa-twitter"></i> ${twitter}`;
                
                socialDiv.innerHTML = socialHTML;
            }
            
            // Generar QR code si está habilitado
            const qrContainer = document.getElementById('invoiceQrcode');
            qrContainer.innerHTML = '';
            
            if (receiptConfig.showQRCode === 'true' || true) { // Siempre generar QR
                const qrData = `Factura: ${invoiceNumber}\nCliente: ${clientName}\nCédula: ${clientId}\nTotal: ${currencySymbol} ${total.toLocaleString('es-CO')}\nFecha: ${date}`;
                createQRCode(qrContainer, qrData);
            }
            
            // Ocultar carga
            hideLoading();
            
            // Mostrar la factura con transición suave
            invoiceSection.style.display = 'block';
            setTimeout(() => {
                invoiceSection.classList.remove('hidden');
            }, 50);
            
            // Desplazarse a la factura con animación suave
            invoiceSection.scrollIntoView({ behavior: 'smooth' });
            
        }, 1500);
    });
    
    // Manejo de botones adicionales
    emailButton.addEventListener('click', function() {
        showLoading('Enviando por correo...');
        
        setTimeout(() => {
            hideLoading();
            alert('Factura enviada por correo electrónico a ' + document.getElementById('invoiceClientEmail').textContent);
        }, 1000);
    });
    
    downloadButton.addEventListener('click', function() {
        showLoading('Generando PDF...');
        
        setTimeout(() => {
            hideLoading();
            alert('Factura guardada como PDF. Nombre del archivo: ' + document.getElementById('invoiceNumber').textContent + '.pdf');
        }, 1000);
    });
    
    newTransactionButton.addEventListener('click', function() {
        // Volver a la pantalla 1 con transición suave
        transitionToScreen(screen3, screen1);
        
        // Limpiar campos
        clientIdInput.value = '';
        repairIdInput.value = '';
        clientIdInput.focus();
        
        // Ocultar factura
        invoiceSection.classList.add('hidden');
        setTimeout(() => {
            invoiceSection.style.display = 'none';
        }, 300);
    });
    
    printButton.addEventListener('click', function() {
        showLoading('Preparando impresión...');
        
        setTimeout(() => {
            hideLoading();
            window.print();
        }, 500);
    });
    
    // Función mejorada para crear código QR usando QRCode.js
    function createQRCode(container, data) {
        if (!container) return;
        container.innerHTML = '';
        
        try {
            // Verificar si la biblioteca QRCode está disponible
            if (typeof QRCode === 'undefined') {
                throw new Error('Biblioteca QRCode no disponible');
            }
            
            // Limpiar el contenedor por seguridad
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            
            // Crear un nuevo elemento para el QR dentro del contenedor
            const qrElement = document.createElement('div');
            container.appendChild(qrElement);
            
            // Crear el código QR con opciones adecuadas
            new QRCode(qrElement, {
                text: data,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('Error al generar QR:', error);
            
            // Intentar una alternativa usando API externa en caso de error
            try {
                const img = document.createElement('img');
                img.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(data);
                img.alt = "QR Code";
                img.style.marginTop = "10px";
                container.appendChild(img);
            } catch (e) {
                console.error('Error al generar QR alternativo:', e);
                container.innerHTML = '<p style="color: red;">No se pudo generar el código QR</p>';
            }
        }
    }

    // Función para mostrar los materiales de una reparación
    function mostrarMateriales(repair) {
        if (!repair.materiales || repair.materiales.length === 0) {
            alert('Esta reparación no tiene materiales registrados.');
            return;
        }
        
        // Crear una tabla HTML con los materiales
        let tablaMateriales = '<table class="table table-sm table-bordered">';
        tablaMateriales += '<thead class="thead-light"><tr><th>Producto</th><th>SKU</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr></thead><tbody>';
        
        repair.materiales.forEach(material => {
            tablaMateriales += `<tr>
                <td>${material.nombre}</td>
                <td>${material.sku}</td>
                <td>${material.cantidad}</td>
                <td>$${typeof material.precioUnitario === 'number' ? material.precioUnitario.toFixed(2) : material.precioUnitario}</td>
                <td>$${typeof material.subtotal === 'number' ? material.subtotal.toFixed(2) : material.subtotal}</td>
            </tr>`;
        });
        
        tablaMateriales += `<tr class="table-info">
            <td colspan="4" class="text-right"><strong>Total Materiales:</strong></td>
            <td><strong>$${typeof repair.costoMateriales === 'number' ? repair.costoMateriales.toFixed(2) : repair.costoMateriales}</strong></td>
        </tr>`;
        tablaMateriales += '</tbody></table>';
        
        // Generar un ID único para la ventana para evitar conflictos
        const ventanaId = `materiales_${Date.now()}`;
        
        // Mostrar en una ventana emergente con estilos mejorados
        const ventana = window.open('', ventanaId, 'width=700,height=500');
        ventana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Materiales de Reparación</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <style>
                    body { 
                        padding: 20px; 
                        font-family: Arial, sans-serif;
                    }
                    .header {
                        border-bottom: 2px solid #f0f0f0;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                    }
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h3>Materiales utilizados en reparación</h3>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Cliente:</strong> ${document.getElementById('displayClientName').textContent}</p>
                                <p><strong>Fecha:</strong> ${document.getElementById('displayDate').textContent}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Dispositivo:</strong> ${document.getElementById('displayDevice').textContent} ${document.getElementById('displayBrandModel').textContent}</p>
                                <p><strong>Estado:</strong> ${document.getElementById('displayStatus').textContent}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content">
                        ${tablaMateriales}
                    </div>
                    
                    <div class="footer">
                        <button onclick="window.print()" class="btn btn-primary no-print">
                            <i class="fas fa-print"></i> Imprimir
                        </button>
                        <button onclick="window.close()" class="btn btn-secondary ml-2 no-print">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
                
                <script>
                    // Cerrar automáticamente la ventana después de imprimir
                    window.addEventListener('afterprint', function() {
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    });
                </script>
            </body>
            </html>
        `);
        ventana.document.close();
    }

    // Función para limpiar el historial de búsquedas
    function limpiarHistorial() {
        // Limpiar el historial visual
        searchHistory.innerHTML = '';
        
        // Limpiar el historial en localStorage
        localStorage.removeItem('searchHistory');
        
        // Mostrar mensaje temporal
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'alert alert-success mt-2';
        mensajeDiv.innerHTML = 'Historial de búsquedas limpiado';
        mensajeDiv.style.textAlign = 'center';
        searchHistory.appendChild(mensajeDiv);
        
        // Eliminar el mensaje después de 2 segundos
        setTimeout(() => {
            if (mensajeDiv.parentNode === searchHistory) {
                searchHistory.removeChild(mensajeDiv);
            }
        }, 2000);
    }
    
    // Evento para el botón de limpiar historial
    if (btnLimpiarHistorial) {
        btnLimpiarHistorial.addEventListener('click', limpiarHistorial);
    }

    // Función para limpiar el campo de cliente
    function limpiarCampoCliente() {
        clientIdInput.value = '';
        removeError(clientIdInput);
    }
    
    // Función para limpiar el campo de reparación
    function limpiarCampoReparacion() {
        repairIdInput.value = '';
        removeError(repairIdInput);
    }
    
    // Eventos para los botones de limpiar campos
    if (btnLimpiarCliente) {
        btnLimpiarCliente.addEventListener('click', limpiarCampoCliente);
    }
    
    if (btnLimpiarReparacion) {
        btnLimpiarReparacion.addEventListener('click', limpiarCampoReparacion);
    }
});