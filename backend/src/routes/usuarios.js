const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.post('/login', usuariosController.loginUsuario);
router.post('/reset-password', usuariosController.resetPassword);

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, requireRole(['admin']), usuariosController.listarUsuarios);
router.get('/:id', authenticateToken, usuariosController.obtenerUsuarioPorId);
router.post('/', authenticateToken, requireRole(['admin']), usuariosController.crearUsuario);
router.put('/:id', authenticateToken, requireRole(['admin']), usuariosController.actualizarUsuario);
router.delete('/:id', authenticateToken, requireRole(['admin']), usuariosController.eliminarUsuario);

module.exports = router; 