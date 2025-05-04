/**
 * Script para la configuración de recibos
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cambio de pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Activar botón
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar contenido
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    // Toggle para redes sociales
    const showSocialMedia = document.getElementById('showSocialMedia');
    const socialMediaInputs = document.getElementById('socialMediaInputs');
    
    showSocialMedia.addEventListener('change', function() {
        socialMediaInputs.style.display = this.value === 'true' ? 'block' : 'none';
    });
    
    // Cargar configuración guardada
    const savedConfig = JSON.parse(localStorage.getItem('receiptConfig')) || {};
    
    // Llenar formulario con datos guardados
    Object.keys(savedConfig).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = savedConfig[key];
            } else {
                element.value = savedConfig[key];
            }
        }
    });
    
    // Actualizar vista previa en tiempo real
    const updatePreview = function() {
        document.getElementById('preview-title').textContent = document.getElementById('receiptTitle').value || 'Factura de Servicio';
        document.getElementById('preview-company').textContent = document.getElementById('companyName').value || 'ITECH SUPPORT';
        document.getElementById('preview-tagline').textContent = document.getElementById('companyTagline').value || 'Soluciones tecnológicas a tu alcance';
        document.getElementById('preview-header-notes').textContent = document.getElementById('headerNotes').value || '';
        document.getElementById('preview-footer-text').textContent = document.getElementById('footerText').value || 'Gracias por su preferencia';
        document.getElementById('preview-terms').textContent = document.getElementById('termsAndConditions').value || '';
        document.getElementById('preview-contact').textContent = document.getElementById('contactInfo').value || '';
        document.getElementById('preview-tax-rate').textContent = document.getElementById('taxRate').value || '16';
        document.getElementById('preview-invoice-number').textContent = (document.getElementById('receiptPrefix').value || 'ITECH-') + '001';
        
        // Actualizar moneda
        const currencySymbol = document.getElementById('currency').value || '$';
        const currencyElements = document.querySelectorAll('.preview-currency');
        currencyElements.forEach(el => {
            el.textContent = currencySymbol;
        });
        
        // Actualizar QR
        document.getElementById('preview-qrcode').style.display = document.getElementById('showQRCode').value === 'true' ? 'block' : 'none';
        
        // Actualizar redes sociales
        const socialDiv = document.getElementById('preview-social');
        socialDiv.innerHTML = '';
        
        if (document.getElementById('showSocialMedia').value === 'true') {
            const facebook = document.getElementById('facebook').value;
            const instagram = document.getElementById('instagram').value;
            const twitter = document.getElementById('twitter').value;
            
            let socialHTML = '';
            if (facebook) socialHTML += `<i class="fab fa-facebook"></i> ${facebook} `;
            if (instagram) socialHTML += `<i class="fab fa-instagram"></i> ${instagram} `;
            if (twitter) socialHTML += `<i class="fab fa-twitter"></i> ${twitter}`;
            
            socialDiv.innerHTML = socialHTML;
        }
        
        // Actualizar logo
        const logoURL = document.getElementById('logoURL').value;
        const logoContainer = document.getElementById('preview-logo');
        logoContainer.innerHTML = logoURL ? `<img src="${logoURL}" alt="Logo" style="max-width: 100px; max-height: 100px;">` : '';
    };
    
    // Actualizar vista previa al cambiar cualquier input
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    // Inicializar vista previa
    updatePreview();
    
    // Guardar configuración
    document.getElementById('receiptForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const config = {};
        
        // Recopilar todos los valores del formulario
        allInputs.forEach(input => {
            config[input.id] = input.type === 'checkbox' ? input.checked : input.value;
        });
        
        // Guardar en localStorage
        localStorage.setItem('receiptConfig', JSON.stringify(config));
        
        alert('Configuración de recibos guardada correctamente');
    });

    // Inicializar estado del toggle de redes sociales
    if (showSocialMedia) {
        socialMediaInputs.style.display = showSocialMedia.value === 'true' ? 'block' : 'none';
    }
}); 