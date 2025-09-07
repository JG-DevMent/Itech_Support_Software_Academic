const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificacionesController');
const { authenticateToken, requirePermission } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Notificar cambio de estado de reparación
router.post('/estado-reparacion', 
  requirePermission('reparaciones', 'update'),
  notificacionesController.notificarEstadoReparacion
);

// Notificar factura generada
router.post('/factura-generada', 
  requirePermission('facturas', 'create'),
  notificacionesController.notificarFactura
);

// Enviar recordatorio de reparación específica
router.post('/recordatorio', 
  requirePermission('reparaciones', 'read'),
  notificacionesController.enviarRecordatorio
);

// Enviar recordatorios automáticos (solo administradores)
router.post('/recordatorios-automaticos', 
  requirePermission('reparaciones', 'update'),
  notificacionesController.enviarRecordatoriosAutomaticos
);

// Verificar configuración de email
router.get('/verificar-configuracion', 
  requirePermission('configuracion', 'read'),
  notificacionesController.verificarConfiguracion
);

// Obtener historial de notificaciones
router.get('/historial', 
  requirePermission('reparaciones', 'read'),
  notificacionesController.obtenerHistorial
);

// Enviar notificación personalizada
router.post('/personalizada', 
  requirePermission('clientes', 'update'),
  notificacionesController.enviarNotificacionPersonalizada
);

module.exports = router;