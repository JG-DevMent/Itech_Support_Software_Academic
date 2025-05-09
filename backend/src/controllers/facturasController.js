const facturasModel = require('../models/facturasModel');
const reparacionesModel = require('../models/reparacionesModel');
const pool = require('../db');

exports.listarFacturas = async (req, res) => {
  try {
    const facturas = await facturasModel.obtenerTodas();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener facturas' });
  }
};

exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await facturasModel.obtenerPorId(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener factura' });
  }
};

exports.crearFactura = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // 1. Validar reparación
    const reparacion = await reparacionesModel.obtenerPorId(req.body.reparacion_id, connection);
    if (!reparacion) throw new Error('Reparación no encontrada');
    if (reparacion.estado && reparacion.estado.toLowerCase().includes('pagad')) {
      throw new Error('La reparación ya está pagada/facturada');
    }
    // 2. Crear factura
    const nuevaFactura = await facturasModel.crear(req.body, connection);
    // 3. Actualizar estado de la reparación
    await reparacionesModel.actualizarEstado(req.body.reparacion_id, 'Pagada', connection);
    await connection.commit();
    res.status(201).json(nuevaFactura);
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.actualizarFactura = async (req, res) => {
  try {
    const actualizado = await facturasModel.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ mensaje: 'Factura actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarFactura = async (req, res) => {
  try {
    const eliminado = await facturasModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ mensaje: 'Factura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar factura' });
  }
};

// Ventas
exports.listarVentas = async (req, res) => {
  try {
    const ventas = await facturasModel.obtenerVentas(req.params.id);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

exports.agregarVentas = async (req, res) => {
  try {
    const ventas = await facturasModel.agregarVentas(req.params.id, req.body.ventas);
    res.status(201).json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarVenta = async (req, res) => {
  try {
    const eliminado = await facturasModel.eliminarVenta(req.params.ventaId);
    if (!eliminado) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json({ mensaje: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar venta' });
  }
}; 