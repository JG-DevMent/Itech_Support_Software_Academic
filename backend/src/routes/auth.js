const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requirePermission, injectPermissions } = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)
router.get('/verify', authenticateToken, injectPermissions, authController.verifyToken);
router.post('/logout', authenticateToken, authController.logout);
router.post('/change-password', authenticateToken, authController.changePassword);

// Rutas administrativas (requieren permisos específicos)
router.get('/roles/:role/permissions', 
  authenticateToken, 
  requirePermission('usuarios', 'read'), 
  authController.getRolePermissions
);

module.exports = router;