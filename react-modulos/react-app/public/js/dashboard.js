/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

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

    // Cargar datos reales de estadísticas
    actualizarDatosEstadisticas().catch(error => {
        console.error('Error al cargar estadísticas:', error);
    });
    
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

// Constante para la API
const API_BASE = `${window.API_BASE_URL}/api`;

// Función para obtener el primer y último día del mes
function obtenerRangoMes(anio, mes) {
    const primerDia = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0);
    return {
        inicio: primerDia.toISOString().split('T')[0] + ' 00:00:00',
        fin: ultimoDia.toISOString().split('T')[0] + ' 23:59:59'
    };
}

// Función para calcular el porcentaje de cambio
function calcularTendencia(valorActual, valorAnterior) {
    if (valorAnterior === 0) {
        return valorActual > 0 ? 100 : 0;
    }
    const cambio = ((valorActual - valorAnterior) / valorAnterior) * 100;
    return Math.round(cambio);
}

// Función para obtener reparaciones activas
async function obtenerReparacionesActivas() {
    try {
        const response = await fetch(`${API_BASE}/reparaciones`);
        if (!response.ok) return 0;
        const reparaciones = await response.json();
        // Reparaciones que no estén completadas ni pagadas
        const activas = reparaciones.filter(rep => {
            const estado = (rep.estado || '').toLowerCase();
            return estado !== 'completada' && estado !== 'pagada';
        });
        return activas.length;
    } catch (error) {
        console.error('Error obteniendo reparaciones activas:', error);
        return 0;
    }
}

// Función para obtener reparaciones completadas en un mes
async function obtenerReparacionesCompletadas(anio, mes) {
    try {
        // Obtener todas las reparaciones y filtrar
        const response = await fetch(`${API_BASE}/reparaciones`);
        if (!response.ok) return [];
        const todasReparaciones = await response.json();
        const rango = obtenerRangoMes(anio, mes);
        
        // Filtrar por estado y fecha
        return todasReparaciones.filter(rep => {
            const estado = (rep.estado || '').toLowerCase();
            const esCompletada = estado === 'completada' || estado === 'pagada';
            
            if (!esCompletada) return false;
            
            // Filtrar por fecha del mes
            const fechaReparacion = new Date(rep.fecha_registro || rep.fecha || '');
            if (isNaN(fechaReparacion.getTime())) return false;
            
            const fechaInicio = new Date(rango.inicio);
            const fechaFin = new Date(rango.fin);
            
            return fechaReparacion >= fechaInicio && fechaReparacion <= fechaFin;
        });
    } catch (error) {
        console.error('Error obteniendo reparaciones completadas:', error);
        return [];
    }
}

// Función para obtener clientes nuevos en un mes
async function obtenerClientesNuevos(anio, mes) {
    try {
        const response = await fetch(`${API_BASE}/clientes`);
        if (!response.ok) return [];
        const clientes = await response.json();
        const rango = obtenerRangoMes(anio, mes);
        
        return clientes.filter(cliente => {
            if (!cliente.fecha_registro) return false;
            const fechaRegistro = new Date(cliente.fecha_registro);
            const fechaInicio = new Date(rango.inicio);
            const fechaFin = new Date(rango.fin);
            return fechaRegistro >= fechaInicio && fechaRegistro <= fechaFin;
        });
    } catch (error) {
        console.error('Error obteniendo clientes nuevos:', error);
        return [];
    }
}

// Función para obtener ingresos del mes
async function obtenerIngresosMes(anio, mes) {
    try {
        const response = await fetch(`${API_BASE}/facturas`);
        if (!response.ok) return 0;
        const facturas = await response.json();
        const rango = obtenerRangoMes(anio, mes);
        
        const ingresos = facturas
            .filter(factura => {
                if (!factura.fecha_emision && !factura.fecha_registro) return false;
                const fechaFactura = new Date(factura.fecha_emision || factura.fecha_registro);
                const fechaInicio = new Date(rango.inicio);
                const fechaFin = new Date(rango.fin);
                return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
            })
            .reduce((suma, factura) => {
                const total = parseFloat(factura.total || 0);
                return suma + (isNaN(total) ? 0 : total);
            }, 0);
        
        return ingresos;
    } catch (error) {
        console.error('Error obteniendo ingresos:', error);
        return 0;
    }
}

// Función para obtener datos reales de estadísticas
async function obtenerDatosEstadisticas() {
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    
    // Mes anterior
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
    const anioAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
    
    try {
        // Obtener datos del mes actual
        const [reparacionesActivas, completadasActual, clientesActual, ingresosActual] = await Promise.all([
            obtenerReparacionesActivas(),
            obtenerReparacionesCompletadas(anioActual, mesActual),
            obtenerClientesNuevos(anioActual, mesActual),
            obtenerIngresosMes(anioActual, mesActual)
        ]);
        
        // Obtener datos del mes anterior para comparar
        const [completadasAnterior, clientesAnterior, ingresosAnterior] = await Promise.all([
            obtenerReparacionesCompletadas(anioAnterior, mesAnterior),
            obtenerClientesNuevos(anioAnterior, mesAnterior),
            obtenerIngresosMes(anioAnterior, mesAnterior)
        ]);
        
        // Calcular tendencias
        const tendenciaCompletadas = calcularTendencia(completadasActual.length, completadasAnterior.length);
        const tendenciaClientes = calcularTendencia(clientesActual.length, clientesAnterior.length);
        const tendenciaIngresos = calcularTendencia(ingresosActual, ingresosAnterior);
        
        return {
            reparacionesActivas: {
                valor: reparacionesActivas,
                tendencia: 0, // No comparamos reparaciones activas con mes anterior
                positiva: true
            },
            reparacionesCompletadas: {
                valor: completadasActual.length,
                tendencia: Math.abs(tendenciaCompletadas),
                positiva: tendenciaCompletadas >= 0
            },
            clientesNuevos: {
                valor: clientesActual.length,
                tendencia: Math.abs(tendenciaClientes),
                positiva: tendenciaClientes >= 0
            },
            ingresosMes: {
                valor: ingresosActual,
                tendencia: Math.abs(tendenciaIngresos),
                positiva: tendenciaIngresos >= 0
            }
        };
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        // Retornar valores por defecto en caso de error
        return {
            reparacionesActivas: { valor: 0, tendencia: 0, positiva: true },
            reparacionesCompletadas: { valor: 0, tendencia: 0, positiva: true },
            clientesNuevos: { valor: 0, tendencia: 0, positiva: true },
            ingresosMes: { valor: 0, tendencia: 0, positiva: true }
        };
    }
}

// Función para actualizar datos de estadísticas con información real
async function actualizarDatosEstadisticas() {
    try {
        // Obtener usuario actual de la sesión
        let currentUser = null;
        try {
            const userStr = sessionStorage.getItem('currentUser');
            if (userStr) {
                currentUser = JSON.parse(userStr);
            }
        } catch (e) {
            console.warn('No se pudo obtener usuario de sesión:', e);
        }
        
        // Obtener rol del usuario (compatibilidad con role y rol)
        const userRole = currentUser ? (currentUser.role || currentUser.rol || 'Administrador') : 'Administrador';
        
        // Obtener datos reales de la API
        const datos = await obtenerDatosEstadisticas();
        
        console.log('Datos obtenidos:', datos); // Debug
        
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
            const elemento = document.getElementById('reparacionesActivas');
            if (elemento) {
                elemento.textContent = datos.reparacionesActivas.valor;
                console.log('Actualizado reparacionesActivas:', datos.reparacionesActivas.valor); // Debug
            }
            
            // Actualizar tendencia (si existe el elemento)
            const card = document.getElementById('card-reparaciones');
            if (card) {
                const trendElement = card.querySelector('.summary-trend');
                if (trendElement) {
                    trendElement.innerHTML = `<i class="fas fa-info-circle"></i> Activas`;
                    trendElement.classList.remove('positive', 'negative');
                    trendElement.classList.add('positive');
                }
            }
            
            tippy('#card-reparaciones', {
                content: `Tienes ${datos.reparacionesActivas.valor} reparaciones activas actualmente.`,
                placement: 'bottom'
            });
        }
        
        if (visibleCards.includes('card-completadas')) {
            const elemento = document.getElementById('reparacionesCompletadas');
            if (elemento) {
                elemento.textContent = datos.reparacionesCompletadas.valor;
                console.log('Actualizado reparacionesCompletadas:', datos.reparacionesCompletadas.valor); // Debug
            }
            
            // Actualizar tendencia
            const card = document.getElementById('card-completadas');
            if (card) {
                const trendElement = card.querySelector('.summary-trend');
                if (trendElement) {
                    const icono = datos.reparacionesCompletadas.positiva ? 'fa-arrow-up' : 'fa-arrow-down';
                    trendElement.innerHTML = `<i class="fas ${icono}"></i> ${datos.reparacionesCompletadas.tendencia}%`;
                    trendElement.classList.remove('positive', 'negative');
                    trendElement.classList.add(datos.reparacionesCompletadas.positiva ? 'positive' : 'negative');
                }
            }
            
            tippy('#card-completadas', {
                content: `Has completado ${datos.reparacionesCompletadas.valor} reparaciones este mes. ${datos.reparacionesCompletadas.positiva ? 'Aumento' : 'Disminución'} del ${datos.reparacionesCompletadas.tendencia}% respecto al mes anterior.`,
                placement: 'bottom'
            });
        }
        
        if (visibleCards.includes('card-clientes')) {
            const elemento = document.getElementById('clientesNuevos');
            if (elemento) {
                elemento.textContent = datos.clientesNuevos.valor;
                console.log('Actualizado clientesNuevos:', datos.clientesNuevos.valor); // Debug
            }
            
            // Actualizar tendencia
            const card = document.getElementById('card-clientes');
            if (card) {
                const trendElement = card.querySelector('.summary-trend');
                if (trendElement) {
                    const icono = datos.clientesNuevos.positiva ? 'fa-arrow-up' : 'fa-arrow-down';
                    trendElement.innerHTML = `<i class="fas ${icono}"></i> ${datos.clientesNuevos.tendencia}%`;
                    trendElement.classList.remove('positive', 'negative');
                    trendElement.classList.add(datos.clientesNuevos.positiva ? 'positive' : 'negative');
                }
            }
            
            tippy('#card-clientes', {
                content: `Has registrado ${datos.clientesNuevos.valor} clientes nuevos este mes. ${datos.clientesNuevos.positiva ? 'Aumento' : 'Disminución'} del ${datos.clientesNuevos.tendencia}% respecto al mes anterior.`,
                placement: 'bottom'
            });
        }
        
        if (visibleCards.includes('card-ingresos')) {
            const elemento = document.getElementById('ingresosMes');
            if (elemento) {
                elemento.textContent = '$' + datos.ingresosMes.valor.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                console.log('Actualizado ingresosMes:', datos.ingresosMes.valor); // Debug
            }
            
            // Actualizar tendencia
            const card = document.getElementById('card-ingresos');
            if (card) {
                const trendElement = card.querySelector('.summary-trend');
                if (trendElement) {
                    const icono = datos.ingresosMes.positiva ? 'fa-arrow-up' : 'fa-arrow-down';
                    trendElement.innerHTML = `<i class="fas ${icono}"></i> ${datos.ingresosMes.tendencia}%`;
                    trendElement.classList.remove('positive', 'negative');
                    trendElement.classList.add(datos.ingresosMes.positiva ? 'positive' : 'negative');
                }
            }
            
            tippy('#card-ingresos', {
                content: `Tus ingresos este mes suman $${datos.ingresosMes.valor.toLocaleString('es-CO')}. ${datos.ingresosMes.positiva ? 'Aumento' : 'Disminución'} del ${datos.ingresosMes.tendencia}% respecto al mes anterior.`,
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
    } catch (error) {
        console.error('Error en actualizarDatosEstadisticas:', error);
        // Aún así intentar mostrar valores por defecto
        const elementos = {
            'reparacionesActivas': 0,
            'reparacionesCompletadas': 0,
            'clientesNuevos': 0,
            'ingresosMes': '$0'
        };
        
        Object.keys(elementos).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = elementos[id];
            }
        });
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