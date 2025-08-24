const usuariosModel = require('../models/usuariosModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Listar todos los usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosModel.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuariosModel.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await usuariosModel.crear(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un usuario por ID
exports.actualizarUsuario = async (req, res) => {
  try {
    const actualizado = await usuariosModel.actualizar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un usuario por ID
exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await usuariosModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Iniciar sesión de usuario con JWT
exports.loginUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Buscar usuario por username (case-sensitive)
    const rows = await usuariosModel.obtenerPorUsername(username);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    const usuario = rows[0];
    
    // Verificar contraseña (case-sensitive)
    if (password !== usuario.password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        username: usuario.username, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET || 'L1k+qB&7cF$8Wm^2!zH*R9sX0nTj',
      { expiresIn: '2h' }
    );
    
    // Enviar respuesta con token y datos del usuario (sin contraseña)
    const { password: _, ...usuarioSinPassword } = usuario;
    res.json({
      ...usuarioSinPassword,
      token,
      mensaje: 'Login exitoso'
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Restablecer contraseña
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