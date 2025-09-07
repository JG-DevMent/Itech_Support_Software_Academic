const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, requirePermission, injectPermissions } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Estadísticas generales del dashboard
router.get('/estadisticas', 
  injectPermissions,
  dashboardController.obtenerEstadisticasGenerales
);

// Datos para gráficas del dashboard
router.get('/graficas', 
  injectPermissions,
  dashboardController.obtenerDatosGraficas
);

// Resumen específico según el rol del usuario
router.get('/resumen-rol', 
  injectPermissions,
  dashboardController.obtenerResumenPorRol
);

module.exports = router;