const configTiendaModel = require('../models/configTiendaModel');

exports.obtenerConfig = async (req, res) => {
  try {
    const config = await configTiendaModel.obtener();
    if (!config) return res.status(404).json({ error: 'Configuración no encontrada' });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

exports.actualizarConfig = async (req, res) => {
  try {
    const actualizado = await configTiendaModel.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Configuración no encontrada' });
    res.json({ mensaje: 'Configuración actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 