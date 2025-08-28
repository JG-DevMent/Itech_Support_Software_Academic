const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken } = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.post('/login', usuariosController.loginUsuario);
router.post('/reset-password', usuariosController.resetPassword);
router.post('/confirm-reset-password', usuariosController.confirmResetPassword);

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, usuariosController.listarUsuarios);
router.get('/:id', authenticateToken, usuariosController.obtenerUsuarioPorId);
router.post('/', authenticateToken, usuariosController.crearUsuario);
router.put('/:id', authenticateToken, usuariosController.actualizarUsuario);
router.delete('/:id', authenticateToken, usuariosController.eliminarUsuario);

module.exports = router;