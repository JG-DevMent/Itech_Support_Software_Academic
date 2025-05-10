const express = require('express');
const router = express.Router();
const reparacionesController = require('../controllers/reparacionesController');

// Ruta de búsqueda debe ir antes de las rutas con parámetros
router.get('/buscar', reparacionesController.buscarPorCedulaOImei);

// CRUD de reparaciones
router.get('/', (req, res, next) => {
  if (req.query.mes && req.query.anio) {
    return reparacionesController.obtenerReparacionesPorMes(req, res);
  }
  if (req.query.desde && req.query.hasta) {
    return reparacionesController.obtenerReparacionesPorRangoFechas(req, res);
  }
  reparacionesController.listarReparaciones(req, res);
});
router.get('/:id', reparacionesController.obtenerReparacionPorId);
router.post('/', reparacionesController.crearReparacion);
router.put('/:id', reparacionesController.actualizarReparacion);
router.delete('/:id', reparacionesController.eliminarReparacion);

// Materiales de reparación
router.get('/:id/materiales', reparacionesController.listarMateriales);
router.post('/:id/materiales', reparacionesController.agregarMateriales);
router.delete('/materiales/:materialId', reparacionesController.eliminarMaterial);

router.put('/:id/estado', async (req, res) => {
  try {
    const actualizado = await require('../models/reparacionesModel').actualizarEstado(req.params.id, req.body.estado);
    if (!actualizado) return res.status(404).json({ error: 'Reparación no encontrada' });
    res.json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 