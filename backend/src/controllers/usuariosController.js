const usuariosModel = require('../models/usuariosModel'); 
const { enviarCorreo } = require('../services/emailService'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const { validateRole, getRolePermissions, getAccessibleModules } = require('../middleware/auth');

// Listar todos los usuarios con información de permisos
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosModel.obtenerTodos();
    
    // Enriquecer cada usuario con información de permisos
    const usuariosConPermisos = usuarios.map(usuario => ({
      ...usuario,
      permissions: getRolePermissions(usuario.rol),
      accessibleModules: getAccessibleModules(usuario.rol),
      isValidRole: validateRole(usuario.rol)
    }));
    
    res.json(usuariosConPermisos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID con información de permisos
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuariosModel.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    // Enriquecer con información de permisos
    const usuarioConPermisos = {
      ...usuario,
      permissions: getRolePermissions(usuario.rol),
      accessibleModules: getAccessibleModules(usuario.rol),
      isValidRole: validateRole(usuario.rol)
    };
    
    res.json(usuarioConPermisos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear un nuevo usuario con validación de roles
exports.crearUsuario = async (req, res) => {
  try {
    const userData = req.body;
    
    // Validar rol antes de crear
    if (userData.rol && !validateRole(userData.rol)) {
      return res.status(400).json({ 
        error: 'Rol no válido',
        availableRoles: ['Administrador', 'Técnico', 'Vendedor', 'Usuario']
      });
    }
    
    const nuevoUsuario = await usuariosModel.crear(userData);
    
    // Enriquecer respuesta con permisos
    const usuarioConPermisos = {
      ...nuevoUsuario,
      permissions: getRolePermissions(nuevoUsuario.rol),
      accessibleModules: getAccessibleModules(nuevoUsuario.rol)
    };
    
    res.status(201).json(usuarioConPermisos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un usuario por ID con validación de roles
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    // Validar rol si se está actualizando
    if (userData.rol && !validateRole(userData.rol)) {
      return res.status(400).json({ 
        error: 'Rol no válido',
        availableRoles: ['Administrador', 'Técnico', 'Vendedor', 'Usuario']
      });
    }
    
    // Verificar que el usuario existe
    const usuarioExistente = await usuariosModel.obtenerPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Prevenir que un usuario se quite a sí mismo los permisos de administrador
    if (req.user && req.user.id == id && req.user.rol === 'Administrador' && userData.rol !== 'Administrador') {
      return res.status(400).json({ 
        error: 'No puedes remover tus propios permisos de administrador' 
      });
    }
    
    const actualizado = await usuariosModel.actualizar(id, userData);
    
    if (!actualizado) {
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
    
    // Obtener usuario actualizado para respuesta
    const usuarioActualizado = await usuariosModel.obtenerPorId(id);
    const usuarioConPermisos = {
      ...usuarioActualizado,
      permissions: getRolePermissions(usuarioActualizado.rol),
      accessibleModules: getAccessibleModules(usuarioActualizado.rol)
    };
    
    res.json({ 
      mensaje: 'Usuario actualizado correctamente',
      usuario: usuarioConPermisos
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un usuario por ID con validaciones de seguridad
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe
    const usuario = await usuariosModel.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Prevenir que un usuario se elimine a sí mismo
    if (req.user && req.user.id == id) {
      return res.status(400).json({ 
        error: 'No puedes eliminar tu propia cuenta' 
      });
    }
    
    // Verificar que no sea el último administrador
    if (usuario.rol === 'Administrador') {
      const administradores = await usuariosModel.obtenerTodos();
      const adminCount = administradores.filter(u => u.rol === 'Administrador').length;
      if (adminCount <= 1) {
        return res.status(400).json({ 
          error: 'No se puede eliminar el último administrador del sistema' 
        });
      }
    }
    
    const eliminado = await usuariosModel.eliminar(id);
    if (!eliminado) return res.status(500).json({ error: 'Error al eliminar usuario' });
    
    res.json({ 
      mensaje: 'Usuario eliminado correctamente',
      usuarioEliminado: {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Obtener roles disponibles y sus permisos
exports.obtenerRoles = async (req, res) => {
  try {
    const roles = ['Administrador', 'Técnico', 'Vendedor', 'Usuario'];
    
    const rolesConInfo = roles.map(rol => ({
      name: rol,
      permissions: getRolePermissions(rol),
      accessibleModules: getAccessibleModules(rol),
      description: getDescriptionForRole(rol)
    }));
    
    res.json({
      roles: rolesConInfo,
      availableRoles: roles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar rol de usuario (endpoint específico)
exports.cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoRol } = req.body;
    
    if (!validateRole(nuevoRol)) {
      return res.status(400).json({ 
        error: 'Rol no válido',
        availableRoles: ['Administrador', 'Técnico', 'Vendedor', 'Usuario']
      });
    }
    
    // Verificar que el usuario existe
    const usuario = await usuariosModel.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Prevenir que un admin se quite sus propios permisos
    if (req.user && req.user.id == id && req.user.rol === 'Administrador' && nuevoRol !== 'Administrador') {
      return res.status(400).json({ 
        error: 'No puedes remover tus propios permisos de administrador' 
      });
    }
    
    // Actualizar solo el rol
    const actualizado = await usuariosModel.actualizar(id, {
      ...usuario,
      rol: nuevoRol
    });
    
    if (actualizado) {
      const usuarioActualizado = await usuariosModel.obtenerPorId(id);
      res.json({
        mensaje: `Rol actualizado a ${nuevoRol} correctamente`,
        usuario: {
          ...usuarioActualizado,
          permissions: getRolePermissions(nuevoRol),
          accessibleModules: getAccessibleModules(nuevoRol)
        }
      });
    } else {
      res.status(500).json({ error: 'Error al actualizar rol' });
    }
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Iniciar sesión de usuario con JWT (mantenida para compatibilidad)
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
    
    // Generar token JWT con permisos
    const token = jwt.sign(
      { 
        id: usuario.id, 
        username: usuario.username, 
        email: usuario.email,
        rol: usuario.rol,
        permissions: getRolePermissions(usuario.rol),
        accessibleModules: getAccessibleModules(usuario.rol)
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    // Enviar respuesta con token y datos del usuario (sin contraseña)
    const { password: _, ...usuarioSinPassword } = usuario;
    res.json({
      ...usuarioSinPassword,
      token,
      permissions: getRolePermissions(usuario.rol),
      accessibleModules: getAccessibleModules(usuario.rol),
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

    const resetLink = `http://localhost:3000/reset-password-form.html?token=${resetToken}`;

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

// Función auxiliar para obtener descripciones de roles
function getDescriptionForRole(role) {
  const descriptions = {
    'Administrador': 'Acceso completo a todas las funcionalidades del sistema',
    'Técnico': 'Enfocado en reparaciones y gestión de inventario técnico',
    'Vendedor': 'Especializado en ventas, clientes y facturación',
    'Usuario': 'Acceso básico limitado a consultas propias'
  };
  return descriptions[role] || 'Sin descripción disponible';
}