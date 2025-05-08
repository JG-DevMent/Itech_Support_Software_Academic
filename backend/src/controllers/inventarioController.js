const inventarioModel = require('../models/inventarioModel');

exports.listarInventario = async (req, res) => {
  try {
    const productos = await inventarioModel.obtenerTodos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await inventarioModel.obtenerPorId(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const nuevoProducto = await inventarioModel.crear(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const actualizado = await inventarioModel.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const eliminado = await inventarioModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
}; 