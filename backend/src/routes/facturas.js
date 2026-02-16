const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturasController');

// CRUD de facturas
router.get('/', facturasController.listarFacturas);
router.get('/reparacion/:reparacion_id', facturasController.obtenerFacturaPorReparacion);
router.patch('/:id/impresion', facturasController.registrarImpresion);
router.get('/:id', facturasController.obtenerFacturaPorId);
router.post('/', facturasController.crearFactura);
router.put('/:id', facturasController.actualizarFactura);
router.delete('/:id', facturasController.eliminarFactura);

// Ventas asociadas a una factura
router.get('/:id/ventas', facturasController.listarVentas);
router.post('/:id/ventas', facturasController.agregarVentas);
router.delete('/ventas/:ventaId', facturasController.eliminarVenta);

module.exports = router; 