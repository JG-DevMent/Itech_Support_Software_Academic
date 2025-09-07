const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// Crear nueva venta
router.post('/', ventasController.crearVenta);

// Obtener todas las ventas o por fecha
router.get('/', (req, res) => {
  if (req.query.fechaInicio && req.query.fechaFin) {
    ventasController.obtenerVentasPorFecha(req, res);
  } else {
    ventasController.obtenerTodasVentas(req, res);
  }
});

// Obtener venta por ID
router.get('/:id', ventasController.obtenerVentaPorId);

// Eliminar venta
router.delete('/:id', ventasController.eliminarVenta);

// Obtener total de ventas de hoy
router.get('/hoy/total', ventasController.totalVentasHoy);

// Obtener lista de ventas de hoy
router.get('/hoy/lista', ventasController.obtenerVentasHoy);

// Obtener estadísticas de ventas
router.get('/estadisticas/general', ventasController.obtenerEstadisticasVentas);

module.exports = router; 