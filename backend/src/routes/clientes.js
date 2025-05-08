const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// CRUD de clientes
router.get('/', clientesController.listarClientes);
router.get('/:id', clientesController.obtenerClientePorId);
router.post('/', clientesController.crearCliente);
router.put('/:id', clientesController.actualizarCliente);
router.delete('/:id', clientesController.eliminarCliente);

module.exports = router; 