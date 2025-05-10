const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

router.post('/', ventasController.crearVenta);
router.get('/', ventasController.obtenerVentasPorFecha);
router.get('/hoy', ventasController.totalVentasHoy);
router.get('/hoy/lista', ventasController.obtenerVentasHoy);

module.exports = router; 