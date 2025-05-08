const express = require('express');
const router = express.Router();
const reparacionesController = require('../controllers/reparacionesController');

// CRUD de reparaciones
router.get('/', reparacionesController.listarReparaciones);
router.get('/:id', reparacionesController.obtenerReparacionPorId);
router.post('/', reparacionesController.crearReparacion);
router.put('/:id', reparacionesController.actualizarReparacion);
router.delete('/:id', reparacionesController.eliminarReparacion);

// Materiales de reparación
router.get('/:id/materiales', reparacionesController.listarMateriales);
router.post('/:id/materiales', reparacionesController.agregarMateriales);
router.delete('/materiales/:materialId', reparacionesController.eliminarMaterial);

module.exports = router; 