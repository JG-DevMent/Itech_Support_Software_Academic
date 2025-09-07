const reparacionesModel = require('../models/reparacionesModel');
const clientesModel = require('../models/clientesModel');
const ventasModel = require('../models/ventasModel');
const inventarioModel = require('../models/inventarioModel');
const facturasModel = require('../models/facturasModel');

const dashboardController = {
  // Obtener estadísticas generales del dashboard
  async obtenerEstadisticasGenerales(req, res) {
    try {
      // Obtener datos en paralelo para mejor rendimiento
      const [
        reparaciones,
        clientes,
        inventario,
        ventas,
        facturas
      ] = await Promise.all([
        reparacionesModel.obtenerTodas ? reparacionesModel.obtenerTodas() : [],
        clientesModel.obtenerTodos ? clientesModel.obtenerTodos() : [],
        inventarioModel.obtenerTodos ? inventarioModel.obtenerTodos() : [],
        ventasModel.obtenerTodas ? ventasModel.obtenerTodas() : [],
        facturasModel.obtenerTodas ? facturasModel.obtenerTodas() : []
      ]);

      // Fechas para cálculos
      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

      // Filtrar datos por fechas
      const reparacionesActivas = reparaciones.filter(rep => 
        rep.estado && !['Reparación Completa', 'Entregado', 'Cancelado'].includes(rep.estado)
      );

      const reparacionesCompletadasMes = reparaciones.filter(rep => {
        const fecha = new Date(rep.fecha_actualizacion || rep.fecha_registro);
        return fecha >= inicioMes && ['Reparación Completa', 'Entregado'].includes(rep.estado);
      });

      const reparacionesCompletadasMesAnterior = reparaciones.filter(rep => {
        const fecha = new Date(rep.fecha_actualizacion || rep.fecha_registro);
        return fecha >= mesAnterior && fecha <= finMesAnterior && 
               ['Reparación Completa', 'Entregado'].includes(rep.estado);
      });

      const clientesNuevosMes = clientes.filter(cliente => {
        const fecha = new Date(cliente.fecha_registro);
        return fecha >= inicioMes;
      });

      const clientesNuevosMesAnterior = clientes.filter(cliente => {
        const fecha = new Date(cliente.fecha_registro);
        return fecha >= mesAnterior && fecha <= finMesAnterior;
      });

      // Calcular ingresos del mes (ventas directas + facturas pagadas)
      let ingresosMes = 0;
      let ingresosMesAnterior = 0;

      // Sumar ventas directas
      const ventasMes = ventas.filter(venta => {
        const fecha = new Date(venta.fecha_registro);
        return fecha >= inicioMes;
      });
      ingresosMes += ventasMes.reduce((sum, venta) => sum + parseFloat(venta.subtotal || 0), 0);

      const ventasMesAnterior = ventas.filter(venta => {
        const fecha = new Date(venta.fecha_registro);
        return fecha >= mesAnterior && fecha <= finMesAnterior;
      });
      ingresosMesAnterior += ventasMesAnterior.reduce((sum, venta) => sum + parseFloat(venta.subtotal || 0), 0);

      // Sumar facturas pagadas
      const facturasPagadasMes = facturas.filter(factura => {
        const fecha = new Date(factura.fecha_emision);
        return fecha >= inicioMes && factura.estado === 'Pagada';
      });
      ingresosMes += facturasPagadasMes.reduce((sum, factura) => sum + parseFloat(factura.total || 0), 0);

      const facturasPagadasMesAnterior = facturas.filter(factura => {
        const fecha = new Date(factura.fecha_emision);
        return fecha >= mesAnterior && fecha <= finMesAnterior && factura.estado === 'Pagada';
      });
      ingresosMesAnterior += facturasPagadasMesAnterior.reduce((sum, factura) => sum + parseFloat(factura.total || 0), 0);

      // Calcular tendencias
      const calcularTendencia = (actual, anterior) => {
        if (anterior === 0) return actual > 0 ? 100 : 0;
        return Math.round(((actual - anterior) / anterior) * 100);
      };

      const estadisticas = {
        reparacionesActivas: {
          valor: reparacionesActivas.length,
          tendencia: 0, // Las activas no tienen tendencia mensual
          positiva: true
        },
        reparacionesCompletadas: {
          valor: reparacionesCompletadasMes.length,
          tendencia: Math.abs(calcularTendencia(reparacionesCompletadasMes.length, reparacionesCompletadasMesAnterior.length)),
          positiva: reparacionesCompletadasMes.length >= reparacionesCompletadasMesAnterior.length
        },
        clientesNuevos: {
          valor: clientesNuevosMes.length,
          tendencia: Math.abs(calcularTendencia(clientesNuevosMes.length, clientesNuevosMesAnterior.length)),
          positiva: clientesNuevosMes.length >= clientesNuevosMesAnterior.length
        },
        ingresosMes: {
          valor: Math.round(ingresosMes),
          tendencia: Math.abs(calcularTendencia(ingresosMes, ingresosMesAnterior)),
          positiva: ingresosMes >= ingresosMesAnterior
        },
        totales: {
          totalReparaciones: reparaciones.length,
          totalClientes: clientes.length,
          totalProductosInventario: inventario.length,
          totalVentas: ventas.length,
          totalFacturas: facturas.length
        }
      };

      res.json(estadisticas);
    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener estadísticas',
        details: error.message
      });
    }
  },

  // Obtener datos para gráficas
  async obtenerDatosGraficas(req, res) {
    try {
      const { periodo = '30' } = req.query; // días hacia atrás
      const diasAtras = parseInt(periodo);
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasAtras);

      // Obtener datos para gráficas
      const [reparaciones, ventas, facturas] = await Promise.all([
        reparacionesModel.obtenerTodas ? reparacionesModel.obtenerTodas() : [],
        ventasModel.obtenerTodas ? ventasModel.obtenerTodas() : [],
        facturasModel.obtenerTodas ? facturasModel.obtenerTodas() : []
      ]);

      // Filtrar por período
      const reparacionesPeriodo = reparaciones.filter(rep => {
        const fecha = new Date(rep.fecha_registro);
        return fecha >= fechaLimite;
      });

      const ventasPeriodo = ventas.filter(venta => {
        const fecha = new Date(venta.fecha_registro);
        return fecha >= fechaLimite;
      });

      // Preparar datos para gráfica de reparaciones por estado
      const estadosReparacion = {};
      reparacionesPeriodo.forEach(rep => {
        const estado = rep.estado || 'Sin estado';
        estadosReparacion[estado] = (estadosReparacion[estado] || 0) + 1;
      });

      // Preparar datos para gráfica de ingresos diarios (últimos 7 días)
      const ingresosDiarios = {};
      for (let i = 6; i >= 0; i--) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);
        const fechaStr = fecha.toISOString().split('T')[0];
        ingresosDiarios[fechaStr] = 0;
      }

      ventasPeriodo.forEach(venta => {
        const fechaStr = new Date(venta.fecha_registro).toISOString().split('T')[0];
        if (ingresosDiarios.hasOwnProperty(fechaStr)) {
          ingresosDiarios[fechaStr] += parseFloat(venta.subtotal || 0);
        }
      });

      facturas.filter(factura => {
        const fecha = new Date(factura.fecha_emision);
        return fecha >= new Date(new Date().setDate(new Date().getDate() - 7)) && factura.estado === 'Pagada';
      }).forEach(factura => {
        const fechaStr = new Date(factura.fecha_emision).toISOString().split('T')[0];
        if (ingresosDiarios.hasOwnProperty(fechaStr)) {
          ingresosDiarios[fechaStr] += parseFloat(factura.total || 0);
        }
      });

      // Preparar datos para gráfica de productos más vendidos
      const productosVendidos = {};
      ventasPeriodo.forEach(venta => {
        const producto = venta.producto_nombre || 'Producto sin nombre';
        productosVendidos[producto] = (productosVendidos[producto] || 0) + parseInt(venta.cantidad || 0);
      });

      // Ordenar productos más vendidos (top 5)
      const topProductos = Object.entries(productosVendidos)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      const graficas = {
        estadosReparacion: {
          labels: Object.keys(estadosReparacion),
          data: Object.values(estadosReparacion)
        },
        ingresosDiarios: {
          labels: Object.keys(ingresosDiarios).map(fecha => {
            const date = new Date(fecha);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
          }),
          data: Object.values(ingresosDiarios)
        },
        topProductos: {
          labels: topProductos.map(([producto]) => producto),
          data: topProductos.map(([, cantidad]) => cantidad)
        }
      };

      res.json(graficas);
    } catch (error) {
      console.error('Error obteniendo datos de gráficas:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener datos de gráficas',
        details: error.message
      });
    }
  },

  // Obtener resumen rápido para roles específicos
  async obtenerResumenPorRol(req, res) {
    try {
      const userRole = req.user?.rol || 'Usuario';
      
      let resumen = {};

      if (userRole === 'Técnico') {
        // Resumen específico para técnicos
        const reparaciones = await reparacionesModel.obtenerTodas();
        const reparacionesAsignadas = reparaciones.filter(rep => 
          !['Reparación Completa', 'Entregado', 'Cancelado'].includes(rep.estado)
        );
        
        resumen = {
          reparacionesAsignadas: reparacionesAsignadas.length,
          reparacionesPendientes: reparaciones.filter(rep => rep.estado === 'Inicio Reparación').length,
          reparacionesEnProceso: reparaciones.filter(rep => rep.estado === 'En Proceso').length,
          reparacionesParaEntrega: reparaciones.filter(rep => rep.estado === 'Reparación Completa').length
        };

      } else if (userRole === 'Vendedor') {
        // Resumen específico para vendedores
        const [clientes, ventas, facturas] = await Promise.all([
          clientesModel.obtenerTodos(),
          ventasModel.obtenerTodas(),
          facturasModel.obtenerTodas ? facturasModel.obtenerTodas() : []
        ]);

        const hoy = new Date().toISOString().split('T')[0];
        const ventasHoy = ventas.filter(venta => 
          venta.fecha_registro.startsWith(hoy)
        );

        resumen = {
          totalClientes: clientes.length,
          ventasHoy: ventasHoy.length,
          ingresosDia: ventasHoy.reduce((sum, venta) => sum + parseFloat(venta.subtotal || 0), 0),
          facturasPendientes: facturas.filter(factura => factura.estado === 'Pendiente').length
        };

      } else if (userRole === 'Administrador') {
        // Resumen completo para administradores
        const estadisticasGenerales = await this.obtenerEstadisticasGenerales(req, res);
        return; // Ya envía la respuesta
      }

      res.json(resumen);
    } catch (error) {
      console.error('Error obteniendo resumen por rol:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor al obtener resumen',
        details: error.message
      });
    }
  }
};

module.exports = dashboardController;