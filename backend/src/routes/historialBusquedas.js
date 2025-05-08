const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialBusquedasController');

// CRUD de historial de búsquedas
router.get('/', historialController.listarHistorial);
router.post('/', historialController.agregarBusqueda);
router.delete('/:id', historialController.eliminarBusqueda);

module.exports = router; 