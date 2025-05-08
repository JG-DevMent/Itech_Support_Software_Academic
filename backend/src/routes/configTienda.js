const express = require('express');
const router = express.Router();
const configTiendaController = require('../controllers/configTiendaController');

// Obtener configuración de tienda
router.get('/', configTiendaController.obtenerConfig);
// Actualizar configuración de tienda
router.put('/:id', configTiendaController.actualizarConfig);

module.exports = router; 