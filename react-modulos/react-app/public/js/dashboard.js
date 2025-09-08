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

// Función para personalizar el mensaje de bienvenida según el rol
function personalizarMensajeBienvenida() {
    // Obtener usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    //Verificar y compatibilidad de role y rol
    const userRole = currentUser.role || currentUser.rol;
    if (!userRole) return;

    //Normalizar el rol
    currentUser.role = userRole;

    const welcomeContent = document.querySelector('.welcome-content');
    if (!welcomeContent) return;
    
    const h1 = welcomeContent.querySelector('h1');
    const p = welcomeContent.querySelector('p');
    
    if (!h1 || !p) return;
    
    // Mensaje personalizado según rol
    let welcomeMessage = '';
    
    switch (currentUser.role) {
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

// Función para gestionar la visibilidad de botones según el rol
function gestionarBotonesSegunRol() {
    // Obtener usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    //Verificar y compatibilidad de role y rol
    const userRole = currentUser.role || currentUser.rol;
    if (!userRole) return;

    //Normalizar el rol
    currentUser.role = userRole;
    const actionButtons = document.querySelectorAll('.quick-actions-grid .action-btn');
    
    // Definir los botones que cada rol puede ver
    const rolePermissions = {
        'Administrador': ['gestion-reparacion.html', 'clientes.html', 'inventario.html', 'pago-facturacion.html', 'verificar.html', 'ventas-informes.html'],
        'Técnico': ['gestion-reparacion.html', 'verificar.html', 'inventario.html', 'clientes.html'],
        'Vendedor': ['clientes.html', 'pago-facturacion.html', 'verificar.html', 'ventas-informes.html']
    };
    
    // Determinar permisos según el rol
    const allowedPages = rolePermissions[userRole] || [];
    
    // Iterar por cada botón y mostrar/ocultar según corresponda
    actionButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (!allowedPages.includes(href)) {
            // Si el botón no está en la lista de permitidos, ocultarlo
            button.style.display = 'none';
        } else {
            // Asegurarse de que esté visible
            button.style.display = 'flex';
        }
    });
    
    // Reorganizar la cuadrícula después de ocultar botones
    reorganizarCuadricula();
}

// Función para actualizar los consejos según el rol del usuario
function actualizarConsejosSegunRol() {
    // Obtener usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    //Verificar y compatibilidad de role y rol
    const userRole = currentUser.role || currentUser.rol;
    if (!userRole) return;

    //Normalizar el rol
    currentUser.role = userRole;    
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

// Función para simular datos dinámicos
function actualizarDatosEstadisticas() {
    // Obtener usuario actual de la sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.role) return;
    
    const userRole = currentUser.role;
    
    // Simulación de actualización de datos (en un caso real, estos vendrían de una API o base de datos)
    const datos = {
        reparacionesActivas: {
            valor: 12,
            tendencia: 8,
            positiva: true
        },
        reparacionesCompletadas: {
            valor: 28,
            tendencia: 12,
            positiva: true
        },
        clientesNuevos: {
            valor: 5,
            tendencia: 3,
            positiva: true
        },
        ingresosMes: {
            valor: 8540,
            tendencia: 15,
            positiva: true
        }
    };
    
    // Configuración de visibilidad de cards según rol
    const cardVisibility = {
        'Administrador': ['card-reparaciones', 'card-completadas', 'card-clientes', 'card-ingresos'],
        'Técnico': ['card-reparaciones', 'card-completadas', 'card-ingresos'],
        'Vendedor': ['card-clientes', 'card-ingresos']
    };
    
    // Obtener tarjetas visibles para este rol
    const visibleCards = cardVisibility[userRole] || cardVisibility['Administrador'];
    
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
        document.getElementById('reparacionesActivas').textContent = datos.reparacionesActivas.valor;
        
        tippy('#card-reparaciones', {
            content: `Tienes ${datos.reparacionesActivas.valor} reparaciones activas actualmente. ${datos.reparacionesActivas.positiva ? 'Aumento' : 'Disminución'} del ${datos.reparacionesActivas.tendencia}% respecto al mes anterior.`,
            placement: 'bottom'
        });
    }
    
    if (visibleCards.includes('card-completadas')) {
        document.getElementById('reparacionesCompletadas').textContent = datos.reparacionesCompletadas.valor;
        
        tippy('#card-completadas', {
            content: `Has completado ${datos.reparacionesCompletadas.valor} reparaciones este mes. ${datos.reparacionesCompletadas.positiva ? 'Aumento' : 'Disminución'} del ${datos.reparacionesCompletadas.tendencia}% respecto al mes anterior.`,
            placement: 'bottom'
        });
    }
    
    if (visibleCards.includes('card-clientes')) {
        document.getElementById('clientesNuevos').textContent = datos.clientesNuevos.valor;
        
        tippy('#card-clientes', {
            content: `Has registrado ${datos.clientesNuevos.valor} clientes nuevos este mes. ${datos.clientesNuevos.positiva ? 'Aumento' : 'Disminución'} del ${datos.clientesNuevos.tendencia}% respecto al mes anterior.`,
            placement: 'bottom'
        });
    }
    
    if (visibleCards.includes('card-ingresos')) {
        document.getElementById('ingresosMes').textContent = '$' + datos.ingresosMes.valor.toLocaleString();
        
        tippy('#card-ingresos', {
            content: `Tus ingresos este mes suman $${datos.ingresosMes.valor.toLocaleString()}. ${datos.ingresosMes.positiva ? 'Aumento' : 'Disminución'} del ${datos.ingresosMes.tendencia}% respecto al mes anterior.`,
            placement: 'bottom'
        });
    }
    
    // Ajustar grid de estadísticas según número de tarjetas visibles
    const dashboardSummary = document.querySelector('.dashboard-summary');
    if (dashboardSummary) {
        const visibleCardCount = visibleCards.length;
        
        // Usar atributos de datos para el CSS
        dashboardSummary.setAttribute('data-visible-cards', visibleCardCount.toString());
        
        if (visibleCardCount <= 2) {
            dashboardSummary.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (visibleCardCount === 3) {
            dashboardSummary.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
            dashboardSummary.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }
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