const express = require('express');
const router = express.Router();
const configRecibosController = require('../controllers/configRecibosController');

// Obtener configuración de recibos
router.get('/', configRecibosController.obtenerConfig);
// Actualizar configuración de recibos
router.put('/:id', configRecibosController.actualizarConfig);

module.exports = router; 