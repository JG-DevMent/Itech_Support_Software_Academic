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

// Obtener productos por categoría
exports.obtenerPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    
    if (!['servicio', 'venta', 'ambos'].includes(categoria)) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }
    
    const productos = await inventarioModel.obtenerPorCategoria(categoria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
};

// Obtener productos para servicios
exports.obtenerParaServicios = async (req, res) => {
  try {
    const productos = await inventarioModel.obtenerParaServicios();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos para servicios' });
  }
};

// Obtener productos para ventas
exports.obtenerParaVentas = async (req, res) => {
  try {
    const productos = await inventarioModel.obtenerParaVentas();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos para ventas' });
  }
};

// Obtener estadísticas por categoría
exports.obtenerEstadisticasCategorias = async (req, res) => {
  try {
    const estadisticas = await inventarioModel.obtenerEstadisticasCategorias();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas por categoría' });
  }
};

// Buscar productos con filtro de categoría
exports.buscarProductos = async (req, res) => {
  try {
    const { termino, categoria } = req.query;
    
    if (!termino) {
      return res.status(400).json({ error: 'Término de búsqueda requerido' });
    }
    
    const productos = await inventarioModel.buscarPorTermino(termino, categoria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar productos' });
  }
}; 