// Inicialización del dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    tippy('[data-tippy-content]', {
        placement: 'top',
        animation: 'scale',
        theme: 'light-border',
        arrow: true
    });
    
    const fechaActual = document.getElementById('fechaActual');
    if (fechaActual) {
        const hoy = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        fechaActual.textContent = hoy.toLocaleDateString('es-ES', opciones);
    }

    // Simulamos datos dinámicos
    actualizarDatosEstadisticas();
    
    // Añadir efectos a las tarjetas
    animarTarjetas();
    
    // Función para gestionar visibilidad de botones por rol
    gestionarBotonesSegunRol();
    
    // Actualizar consejos según rol
    actualizarConsejosSegunRol();
    
    // Personalizar mensaje de bienvenida
    personalizarMensajeBienvenida();
});

// Función para personalizar el mensaje de bienvenida según el rol (actualizada)
function personalizarMensajeBienvenida() {
    // Obtener usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.rol) return;
    
    const welcomeContent = document.querySelector('.welcome-content');
    if (!welcomeContent) return;
    
    const h1 = welcomeContent.querySelector('h1');
    const p = welcomeContent.querySelector('p');
    
    if (!h1 || !p) return;
    
    // Mensaje personalizado según rol
    let welcomeMessage = '';
    
    switch (currentUser.rol) {
        case 'Administrador':
            h1.textContent = `Bienvenido, Administrador`;
            welcomeMessage = 'Tienes acceso completo al sistema. Gestiona usuarios, reparaciones, inventario y más.';
            break;
        case 'Técnico':
            h1.textContent = `Bienvenido, Técnico`;
            welcomeMessage = 'Gestiona reparaciones y consulta inventario. Recuerda actualizar el estado de los equipos.';
            break;
        case 'Vendedor':
            h1.textContent = `Bienvenido, Vendedor`;
            welcomeMessage = 'Administra clientes, genera facturas y consulta el estado de los equipos.';
            break;
        case 'Usuario':
            h1.textContent = `Bienvenido, Usuario`;
            welcomeMessage = 'Consulta el estado de tus reparaciones y gestiona tu información.';
            break;
        default:
            return; // No modificar si no es ninguno de los roles anteriores
    }
    
    // Actualizar mensaje de bienvenida
    p.textContent = welcomeMessage;
    
    // Añadir nombre de usuario si está disponible
    if (currentUser.username) {
        const userName = currentUser.username.split(' ')[0]; // Tomar solo el primer nombre
        h1.textContent = `Bienvenido, ${userName}`;
    }
}

// Función para gestionar la visibilidad de botones según el rol (actualizada)
function gestionarBotonesSegunRol() {
    // Usar el RoleManager para verificar permisos
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const actionButtons = document.querySelectorAll('.quick-actions-grid .action-btn');
    
    // Mapear botones a módulos requeridos
    const buttonModuleMap = {
        'gestion-reparacion.html': 'reparaciones',
        'clientes.html': 'clientes', 
        'inventario.html': 'inventario',
        'pago-facturacion.html': 'facturas',
        'verificar.html': 'reparaciones', // Verificar también requiere acceso a reparaciones
        'ventas-informes.html': 'ventas'
    };
    
    // Iterar por cada botón y mostrar/ocultar según permisos
    actionButtons.forEach(button => {
        const href = button.getAttribute('href');
        const requiredModule = buttonModuleMap[href];
        
        if (requiredModule) {
            const hasAccess = currentUser.accessibleModules && currentUser.accessibleModules.includes(requiredModule);
            if (!hasAccess) {
                button.style.display = 'none';
            } else {
                button.style.display = 'flex';
            }
        }
    });
    
    // Reorganizar la cuadrícula después de ocultar botones
    reorganizarCuadricula();
}

// Función para actualizar los consejos según el rol del usuario (actualizada)
function actualizarConsejosSegunRol() {
    // Obtener usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.rol) return;
    
    const userRole = currentUser.rol;
    const tipsList = document.querySelector('.tips-list');
    if (!tipsList) return;
    
    // Consejos específicos para cada rol
    const roleTips = {
        'Administrador': [
            {
                icon: 'fas fa-chart-line',
                text: 'Revisa los <strong>informes semanales</strong> para identificar tendencias en tu negocio.'
            },
            {
                icon: 'fas fa-user-cog',
                text: 'Gestiona los <strong>permisos de usuarios</strong> para mantener la seguridad del sistema.'
            },
            {
                icon: 'fas fa-database',
                text: 'Realiza <strong>copias de seguridad</strong> periódicamente para proteger la información.'
            }
        ],
        'Técnico': [
            {
                icon: 'fas fa-tools',
                text: 'Actualiza el <strong>estado de las reparaciones</strong> para mantener informados a los clientes.'
            },
            {
                icon: 'fas fa-clipboard-check',
                text: 'Registra detalladamente los <strong>diagnósticos realizados</strong> en cada equipo.'
            },
            {
                icon: 'fas fa-box-open',
                text: 'Verifica el <strong>inventario de repuestos</strong> antes de iniciar una reparación.'
            }
        ],
        'Vendedor': [
            {
                icon: 'fas fa-user-plus',
                text: 'Mantén actualizada la <strong>información de clientes</strong> para mejorar el servicio.'
            },
            {
                icon: 'fas fa-file-invoice-dollar',
                text: 'Genera <strong>facturas detalladas</strong> para facilitar el seguimiento de pagos.'
            },
            {
                icon: 'fas fa-tags',
                text: 'Ofrece <strong>promociones especiales</strong> a clientes frecuentes para fidelizarlos.'
            }
        ]
    };
    
    // Obtener consejos para el rol actual
    const tips = roleTips[userRole] || roleTips['Administrador'];
    
    // Limpiar contenedor de consejos
    tipsList.innerHTML = '';
    
    // Añadir nuevos consejos según el rol
    tips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'tip-item';
        tipItem.innerHTML = `
            <i class="${tip.icon}"></i>
            <p>${tip.text}</p>
        `;
        tipsList.appendChild(tipItem);
    });
    
    // Animar las tarjetas de consejos
    animarTarjetas();
}

// Función para reorganizar la cuadrícula después de ocultar botones
function reorganizarCuadricula() {
    const grid = document.querySelector('.quick-actions-grid');
    if (!grid) return;
    
    // Contar botones visibles
    const visibleButtons = Array.from(grid.querySelectorAll('.action-btn')).filter(btn => 
        btn.style.display !== 'none'
    );
    
    // Aplicar clases según la cantidad de botones visibles
    if (visibleButtons.length <= 3) {
        grid.style.gridTemplateColumns = '1fr';
    } else if (visibleButtons.length === 4) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        // Por defecto, mantenemos el diseño original
        grid.style.gridTemplateColumns = '';
    }
}

// Función para obtener datos reales del backend
async function actualizarDatosEstadisticas() {
    // Obtener usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.rol) return;
    
    const userRole = currentUser.rol;
    
    try {
        // Obtener token para autenticación
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
            console.error('No se encontró token de autenticación');
            return;
        }

        // Obtener estadísticas reales del backend
        const response = await fetch('http://localhost:4000/api/dashboard/estadisticas', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const datos = await response.json();
        
        // Actualizar también las gráficas
        await cargarGraficasDashboard();
        
    } catch (error) {
        console.error('Error obteniendo estadísticas del dashboard:', error);
        
        // Usar datos de respaldo si hay error
        const datos = {
            reparacionesActivas: { valor: 0, tendencia: 0, positiva: true },
            reparacionesCompletadas: { valor: 0, tendencia: 0, positiva: true },
            clientesNuevos: { valor: 0, tendencia: 0, positiva: true },
            ingresosMes: { valor: 0, tendencia: 0, positiva: true }
        };
        
        mostrarDatosEnCards(datos, userRole);
        return;
    }
    
    // Mostrar datos en las cards
    mostrarDatosEnCards(datos, userRole);
}

// Función separada para mostrar datos en las cards
function mostrarDatosEnCards(datos, userRole) {
    
    // Configuración de visibilidad de cards según rol
    const cardVisibility = {
        'Administrador': ['card-reparaciones', 'card-completadas', 'card-clientes', 'card-ingresos'],
        'Técnico': ['card-reparaciones', 'card-completadas'],
        'Vendedor': ['card-clientes', 'card-ingresos'],
        'Usuario': ['card-reparaciones']
    };
    
    // Obtener tarjetas visibles para este rol
    const visibleCards = cardVisibility[userRole] || cardVisibility['Usuario'];
    
    // Mostrar/ocultar tarjetas según rol
    const allCards = ['card-reparaciones', 'card-completadas', 'card-clientes', 'card-ingresos'];
    allCards.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            if (visibleCards.includes(cardId)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    // Actualizar DOM con los valores para las tarjetas visibles
    if (visibleCards.includes('card-reparaciones')) {
        const element = document.getElementById('reparacionesActivas');
        if (element) {
            element.textContent = datos.reparacionesActivas.valor;
        }
    }
    
    if (visibleCards.includes('card-completadas')) {
        const element = document.getElementById('reparacionesCompletadas');
        if (element) {
            element.textContent = datos.reparacionesCompletadas.valor;
        }
        
        // Actualizar tendencia
        const trendElement = element?.closest('.summary-card')?.querySelector('.summary-trend');
        if (trendElement) {
            trendElement.className = `summary-trend ${datos.reparacionesCompletadas.positiva ? 'positive' : 'negative'}`;
            trendElement.innerHTML = `<i class="fas fa-arrow-${datos.reparacionesCompletadas.positiva ? 'up' : 'down'}"></i> ${datos.reparacionesCompletadas.tendencia}%`;
        }
    }
    
    if (visibleCards.includes('card-clientes')) {
        const element = document.getElementById('clientesNuevos');
        if (element) {
            element.textContent = datos.clientesNuevos.valor;
        }
        
        // Actualizar tendencia
        const trendElement = element?.closest('.summary-card')?.querySelector('.summary-trend');
        if (trendElement) {
            trendElement.className = `summary-trend ${datos.clientesNuevos.positiva ? 'positive' : 'negative'}`;
            trendElement.innerHTML = `<i class="fas fa-arrow-${datos.clientesNuevos.positiva ? 'up' : 'down'}"></i> ${datos.clientesNuevos.tendencia}%`;
        }
    }
    
    if (visibleCards.includes('card-ingresos')) {
        const element = document.getElementById('ingresosMes');
        if (element) {
            element.textContent = '$' + datos.ingresosMes.valor.toLocaleString('es-CO');
        }
        
        // Actualizar tendencia
        const trendElement = element?.closest('.summary-card')?.querySelector('.summary-trend');
        if (trendElement) {
            trendElement.className = `summary-trend ${datos.ingresosMes.positiva ? 'positive' : 'negative'}`;
            trendElement.innerHTML = `<i class="fas fa-arrow-${datos.ingresosMes.positiva ? 'up' : 'down'}"></i> ${datos.ingresosMes.tendencia}%`;
        }
    }
    
    // Ajustar grid de estadísticas según número de tarjetas visibles
    const dashboardSummary = document.querySelector('.dashboard-summary');
    if (dashboardSummary) {
        const visibleCardCount = visibleCards.length;
        
        if (visibleCardCount <= 2) {
            dashboardSummary.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (visibleCardCount === 3) {
            dashboardSummary.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
            dashboardSummary.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }
}

// Variables globales para las gráficas
let chartEstadosReparacion = null;
let chartIngresosDiarios = null;

// Función para cargar las gráficas del dashboard
async function cargarGraficasDashboard() {
    try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) return;

        const response = await fetch('http://localhost:4000/api/dashboard/graficas', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const datosGraficas = await response.json();
        
        // Crear gráfica de estados de reparación (solo para administradores y técnicos)
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && ['Administrador', 'Técnico'].includes(currentUser.rol)) {
            const container = document.getElementById('chartEstadosContainer');
            if (container) {
                container.style.display = 'block';
                crearGraficaEstados(datosGraficas.estadosReparacion);
            }
        }
        
        // Crear gráfica de ingresos diarios (para administradores y vendedores)
        if (currentUser && ['Administrador', 'Vendedor'].includes(currentUser.rol)) {
            const container = document.getElementById('chartIngresosContainer');
            if (container) {
                container.style.display = 'block';
                crearGraficaIngresos(datosGraficas.ingresosDiarios);
            }
        }

    } catch (error) {
        console.error('Error cargando gráficas del dashboard:', error);
    }
}

// Función para crear gráfica de estados de reparación
function crearGraficaEstados(datos) {
    const ctx = document.getElementById('chartEstadosReparacion');
    if (!ctx) return;

    // Destruir gráfica existente si existe
    if (chartEstadosReparacion) {
        chartEstadosReparacion.destroy();
    }

    chartEstadosReparacion = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: datos.labels,
            datasets: [{
                data: datos.data,
                backgroundColor: [
                    '#4e73df',
                    '#1cc88a', 
                    '#36b9cc',
                    '#f6c23e',
                    '#e74a3b',
                    '#858796'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Estados de Reparación',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

// Función para crear gráfica de ingresos diarios
function crearGraficaIngresos(datos) {
    const ctx = document.getElementById('chartIngresosDiarios');
    if (!ctx) return;

    // Destruir gráfica existente si existe
    if (chartIngresosDiarios) {
        chartIngresosDiarios.destroy();
    }

    chartIngresosDiarios = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.labels,
            datasets: [{
                label: 'Ingresos ($)',
                data: datos.data,
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#4e73df',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Ingresos Últimos 7 Días',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-CO');
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverRadius: 7
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Añadir efectos visuales a las tarjetas
function animarTarjetas() {
    const tarjetas = document.querySelectorAll('.summary-card, .action-btn, .tip-item');
    
    tarjetas.forEach((tarjeta, index) => {
        // Añadir delay para que aparezcan secuencialmente
        setTimeout(() => {
            tarjeta.style.opacity = '1';
            tarjeta.style.transform = 'translateY(0)';
        }, index * 100);
    });
} 