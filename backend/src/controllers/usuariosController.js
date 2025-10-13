const usuariosModel = require('../models/usuariosModel'); 
const { enviarCorreo } = require('../services/emailService'); 
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
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
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

// Paso 1: solicitar restablecimiento (envío de correo)
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await usuariosModel.obtenerPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'No se encontró ninguna cuenta asociada a este correo electrónico.' });
    }

    // Generar token temporal (5 min de validez)
    const resetToken = jwt.sign(
      { email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '5m' } //
    );
    
    // URL del FRONTEND
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://192.168.1.7:3000";

    // Enlace de restablecimiento
    const resetLink = `${FRONTEND_URL}/reset-password-form.html?token=${resetToken}`;

    await enviarCorreo(
      email,
      "Restablecimiento de contraseña - Itech Support",
      `<p>Hola <b>${usuario.username}</b>,</p>
       <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
       <p>Puedes hacerlo en el siguiente enlace:</p>
       <a href="${resetLink}">${resetLink}</a>
       <p>Este enlace expirará en 5 minutos.</p>
       <p>Si no solicitaste este cambio, ignora este correo.</p>`
    );

    res.json({ mensaje: 'Correo de restablecimiento enviado correctamente.' });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ error: 'Error al procesar la solicitud de restablecimiento.' });
  }
};

// Paso 2: confirmar nueva contraseña
exports.confirmResetPassword = async (req, res) => {
  try {
    const { token, nuevaClave } = req.body;

    if (!token || !nuevaClave) {
      return res.status(400).json({ error: 'Faltan datos.' });
    }

    // Validar requisitos de la contraseña
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(nuevaClave)) {
      return res.status(400).json({
        error:
          'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial.'
      });
    }

    // Verificar token (JWT)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Pasar la contraseña en limpio al modelo
    const actualizado = await usuariosModel.actualizarClave(
      decoded.email,
      nuevaClave
    );

    if (!actualizado) {
      return res.status(404).json({
        error: 'No se pudo actualizar la contraseña.'
      });
    }

    res.json({ mensaje: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error en confirmResetPassword:', error);
    res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};