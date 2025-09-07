const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { authenticateToken, requirePermission } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// CRUD básico de inventario
router.get('/', 
  requirePermission('inventario', 'read'),
  inventarioController.listarInventario
);

router.get('/producto/:id', 
  requirePermission('inventario', 'read'),
  inventarioController.obtenerProductoPorId
);

router.post('/', 
  requirePermission('inventario', 'create'),
  inventarioController.crearProducto
);

router.put('/:id', 
  requirePermission('inventario', 'update'),
  inventarioController.actualizarProducto
);

router.delete('/:id', 
  requirePermission('inventario', 'delete'),
  inventarioController.eliminarProducto
);

// Rutas específicas para categorías
router.get('/categoria/:categoria', 
  requirePermission('inventario', 'read'),
  inventarioController.obtenerPorCategoria
);

router.get('/filter/servicios', 
  requirePermission('inventario', 'read'),
  inventarioController.obtenerParaServicios
);

router.get('/filter/ventas', 
  requirePermission('inventario', 'read'),
  inventarioController.obtenerParaVentas
);

router.get('/stats/categorias', 
  requirePermission('inventario', 'read'),
  inventarioController.obtenerEstadisticasCategorias
);

router.get('/search/productos', 
  requirePermission('inventario', 'read'),
  inventarioController.buscarProductos
);

module.exports = router; 