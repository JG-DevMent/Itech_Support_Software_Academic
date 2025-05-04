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
});

// Función para simular datos dinámicos
function actualizarDatosEstadisticas() {
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
    
    // Actualizar DOM con los valores
    document.getElementById('reparacionesActivas').textContent = datos.reparacionesActivas.valor;
    document.getElementById('reparacionesCompletadas').textContent = datos.reparacionesCompletadas.valor;
    document.getElementById('clientesNuevos').textContent = datos.clientesNuevos.valor;
    document.getElementById('ingresosMes').textContent = '$' + datos.ingresosMes.valor.toLocaleString();
    
    // Añadir tooltips descriptivos a las tarjetas
    tippy('#card-reparaciones', {
        content: `Tienes ${datos.reparacionesActivas.valor} reparaciones activas actualmente. ${datos.reparacionesActivas.positiva ? 'Aumento' : 'Disminución'} del ${datos.reparacionesActivas.tendencia}% respecto al mes anterior.`,
        placement: 'bottom'
    });
    
    tippy('#card-completadas', {
        content: `Has completado ${datos.reparacionesCompletadas.valor} reparaciones este mes. ${datos.reparacionesCompletadas.positiva ? 'Aumento' : 'Disminución'} del ${datos.reparacionesCompletadas.tendencia}% respecto al mes anterior.`,
        placement: 'bottom'
    });
    
    tippy('#card-clientes', {
        content: `Has registrado ${datos.clientesNuevos.valor} clientes nuevos este mes. ${datos.clientesNuevos.positiva ? 'Aumento' : 'Disminución'} del ${datos.clientesNuevos.tendencia}% respecto al mes anterior.`,
        placement: 'bottom'
    });
    
    tippy('#card-ingresos', {
        content: `Tus ingresos este mes suman $${datos.ingresosMes.valor.toLocaleString()}. ${datos.ingresosMes.positiva ? 'Aumento' : 'Disminución'} del ${datos.ingresosMes.tendencia}% respecto al mes anterior.`,
        placement: 'bottom'
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