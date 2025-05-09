const clientesModel = require('../models/clientesModel');

exports.listarClientes = async (req, res) => {
  try {
    if (req.query.cedula) {
      const clientes = await clientesModel.buscarPorCedula(req.query.cedula);
      return res.json(clientes);
    }
    const clientes = await clientesModel.obtenerTodos();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

exports.obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await clientesModel.obtenerPorId(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = await clientesModel.crear(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const actualizado = await clientesModel.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    const eliminado = await clientesModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
}; 