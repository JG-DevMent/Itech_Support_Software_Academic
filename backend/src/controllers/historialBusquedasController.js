const historialModel = require('../models/historialBusquedasModel');

exports.listarHistorial = async (req, res) => {
  try {
    const historial = await historialModel.obtenerTodos();
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

exports.agregarBusqueda = async (req, res) => {
  try {
    const nuevaBusqueda = await historialModel.crear(req.body);
    res.status(201).json(nuevaBusqueda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarBusqueda = async (req, res) => {
  try {
    const eliminado = await historialModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Búsqueda no encontrada' });
    res.json({ mensaje: 'Búsqueda eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar búsqueda' });
  }
}; 