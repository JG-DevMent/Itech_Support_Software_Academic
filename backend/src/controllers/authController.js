const usuariosModel = require('../models/usuariosModel');
const { generateToken, validateRole, getRolePermissions, getAccessibleModules } = require('../middleware/auth');

const authController = {
  // Login con token JWT mejorado
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: 'Username y password son requeridos'
        });
      }

      // Buscar usuario en la base de datos
      const usuario = await usuariosModel.login(username, password);

      if (!usuario) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Validar que el rol sea válido
      if (!validateRole(usuario.rol)) {
        return res.status(500).json({
          error: 'Rol de usuario no válido en el sistema'
        });
      }

      // Generar token JWT con permisos
      const token = generateToken(usuario);

      // Información del usuario para el frontend
      const userInfo = {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        permissions: getRolePermissions(usuario.rol),
        accessibleModules: getAccessibleModules(usuario.rol)
      };

      res.json({
        message: 'Login exitoso',
        token,
        user: userInfo
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor durante el login'
      });
    }
  },

  // Verificar token y obtener información del usuario
  async verifyToken(req, res) {
    try {
      // El middleware authenticateToken ya validó el token
      const userInfo = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        rol: req.user.rol,
        permissions: req.user.permissions || getRolePermissions(req.user.rol),
        accessibleModules: req.user.accessibleModules || getAccessibleModules(req.user.rol)
      };

      res.json({
        valid: true,
        user: userInfo
      });

    } catch (error) {
      console.error('Error verificando token:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  // Obtener permisos específicos de un rol
  async getRolePermissions(req, res) {
    try {
      const { role } = req.params;

      if (!validateRole(role)) {
        return res.status(400).json({
          error: 'Rol no válido'
        });
      }

      const permissions = getRolePermissions(role);
      const accessibleModules = getAccessibleModules(role);

      res.json({
        role,
        permissions,
        accessibleModules
      });

    } catch (error) {
      console.error('Error obteniendo permisos del rol:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  // Logout (opcional, principalmente para limpiar tokens del lado cliente)
  async logout(req, res) {
    try {
      // En JWT stateless, el logout principalmente es responsabilidad del cliente
      // Pero podemos registrar el evento o invalidar tokens si mantenemos una lista negra
      
      res.json({
        message: 'Logout exitoso',
        instruction: 'Token debe ser eliminado del lado cliente'
      });

    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Contraseña actual y nueva contraseña son requeridas'
        });
      }

      if (newPassword.length < 3) {
        return res.status(400).json({
          error: 'La nueva contraseña debe tener al menos 3 caracteres'
        });
      }

      // Verificar contraseña actual
      const usuario = await usuariosModel.obtenerPorId(userId);
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // En un sistema real, las contraseñas deberían estar hasheadas
      // Por ahora mantenemos la lógica existente
      const usuarioCompleto = await usuariosModel.login(usuario.username, currentPassword);
      if (!usuarioCompleto) {
        return res.status(401).json({
          error: 'Contraseña actual incorrecta'
        });
      }

      // Actualizar contraseña
      const actualizado = await usuariosModel.actualizar(userId, {
        ...usuario,
        password: newPassword
      });

      if (actualizado) {
        res.json({
          message: 'Contraseña actualizada exitosamente'
        });
      } else {
        res.status(500).json({
          error: 'Error al actualizar la contraseña'
        });
      }

    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }
};

module.exports = authController;