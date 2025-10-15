/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
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
    
    // Cargar configuración guardada
    const savedConfig = JSON.parse(localStorage.getItem('storeConfig')) || {};
    
    // Llenar formulario con datos guardados
    Object.keys(savedConfig).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = savedConfig[key];
        }
    });
    
    // Guardar configuración
    document.getElementById('storeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const config = {};
        const formElements = this.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            config[element.id] = element.value;
        });
        
        localStorage.setItem('storeConfig', JSON.stringify(config));
        
        alert('Configuración de tienda guardada correctamente');
    });
}); 