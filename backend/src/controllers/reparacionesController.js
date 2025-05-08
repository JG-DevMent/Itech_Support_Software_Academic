const reparacionesModel = require('../models/reparacionesModel');

exports.listarReparaciones = async (req, res) => {
  try {
    const reparaciones = await reparacionesModel.obtenerTodas();
    res.json(reparaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reparaciones' });
  }
};

exports.obtenerReparacionPorId = async (req, res) => {
  try {
    const reparacion = await reparacionesModel.obtenerPorId(req.params.id);
    if (!reparacion) return res.status(404).json({ error: 'Reparación no encontrada' });
    res.json(reparacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reparación' });
  }
};

exports.crearReparacion = async (req, res) => {
  try {
    const nuevaReparacion = await reparacionesModel.crear(req.body);
    res.status(201).json(nuevaReparacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizarReparacion = async (req, res) => {
  try {
    const actualizado = await reparacionesModel.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Reparación no encontrada' });
    res.json({ mensaje: 'Reparación actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarReparacion = async (req, res) => {
  try {
    const eliminado = await reparacionesModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Reparación no encontrada' });
    res.json({ mensaje: 'Reparación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reparación' });
  }
};

// Materiales de reparación
exports.listarMateriales = async (req, res) => {
  try {
    const materiales = await reparacionesModel.obtenerMateriales(req.params.id);
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
};

exports.agregarMateriales = async (req, res) => {
  try {
    const materiales = await reparacionesModel.agregarMateriales(req.params.id, req.body.materiales);
    res.status(201).json(materiales);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarMaterial = async (req, res) => {
  try {
    const eliminado = await reparacionesModel.eliminarMaterial(req.params.materialId);
    if (!eliminado) return res.status(404).json({ error: 'Material no encontrado' });
    res.json({ mensaje: 'Material eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar material' });
  }
}; 