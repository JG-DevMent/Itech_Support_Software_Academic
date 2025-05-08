const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// CRUD de inventario
router.get('/', inventarioController.listarInventario);
router.get('/:id', inventarioController.obtenerProductoPorId);
router.post('/', inventarioController.crearProducto);
router.put('/:id', inventarioController.actualizarProducto);
router.delete('/:id', inventarioController.eliminarProducto);

module.exports = router; 