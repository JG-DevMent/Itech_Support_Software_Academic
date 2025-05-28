const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// CRUD de usuarios
router.get('/', usuariosController.listarUsuarios);
router.get('/:id', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);

// Login
router.post('/login', usuariosController.loginUsuario);

// Reset password
router.post('/reset-password', usuariosController.resetPassword);

module.exports = router; 