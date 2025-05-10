const ventasModel = require('../models/ventasModel');

exports.crearVenta = async (req, res) => {
  try {
    const venta = req.body;
    const nuevaVenta = await ventasModel.crearVenta(venta);
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerVentasPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const ventas = await ventasModel.obtenerVentasPorFecha(fechaInicio, fechaFin);
    res.json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.totalVentasHoy = async (req, res) => {
  try {
    const total = await ventasModel.totalVentasHoy();
    res.json({ total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerVentasHoy = async (req, res) => {
  try {
    const ventas = await ventasModel.obtenerVentasHoy();
    res.json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 