const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { 
  authenticateToken, 
  requirePermission, 
  requireRole, 
  injectPermissions 
} = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.post('/login', usuariosController.loginUsuario);
router.post('/reset-password', usuariosController.resetPassword);
router.post('/confirm-reset-password', usuariosController.confirmResetPassword);

// Rutas administrativas (solo administradores)
router.get('/', 
  authenticateToken, 
  requirePermission('usuarios', 'read'), 
  injectPermissions, 
  usuariosController.listarUsuarios
);

router.get('/roles', 
  authenticateToken, 
  requirePermission('usuarios', 'read'), 
  usuariosController.obtenerRoles
);

router.post('/', 
  authenticateToken, 
  requirePermission('usuarios', 'create'), 
  usuariosController.crearUsuario
);

router.get('/:id', 
  authenticateToken, 
  requirePermission('usuarios', 'read'), 
  injectPermissions, 
  usuariosController.obtenerUsuarioPorId
);

router.put('/:id', 
  authenticateToken, 
  requirePermission('usuarios', 'update'), 
  usuariosController.actualizarUsuario
);

router.patch('/:id/rol', 
  authenticateToken, 
  requirePermission('usuarios', 'update'), 
  usuariosController.cambiarRol
);

router.delete('/:id', 
  authenticateToken, 
  requirePermission('usuarios', 'delete'), 
  usuariosController.eliminarUsuario
);

module.exports = router;