const usuariosModel = require('../models/usuariosModel');

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosModel.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuariosModel.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await usuariosModel.crear(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const actualizado = await usuariosModel.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await usuariosModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;
    const usuario = await usuariosModel.login(username, password);
    if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await usuariosModel.obtenerPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'No se encontró ninguna cuenta asociada a este correo electrónico.' });
    }
    // Aquí deberías enviar el correo real de recuperación, pero por ahora solo responde OK
    res.json({ mensaje: 'Correo de restablecimiento enviado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud de restablecimiento.' });
  }
}; 