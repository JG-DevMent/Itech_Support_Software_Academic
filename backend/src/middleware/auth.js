const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'itech-support-secret-key';

// Definición de permisos por módulos y roles
const rolePermissions = {
  'Administrador': {
    // Acceso completo a todos los módulos
    'reparaciones': ['create', 'read', 'update', 'delete'],
    'inventario': ['create', 'read', 'update', 'delete'],
    'clientes': ['create', 'read', 'update', 'delete'],
    'ventas': ['create', 'read', 'update', 'delete'],
    'facturas': ['create', 'read', 'update', 'delete'],
    'usuarios': ['create', 'read', 'update', 'delete'],
    'configuracion': ['create', 'read', 'update', 'delete'],
    'informes': ['read', 'export']
  },
  'Técnico': {
    // Enfoque en reparaciones y mantenimiento
    'reparaciones': ['create', 'read', 'update'],
    'inventario': ['read', 'update'], // Puede actualizar stock pero no crear/eliminar productos
    'clientes': ['read'], // Solo consulta
    'ventas': ['read'], // Solo consulta de ventas relacionadas con reparaciones
    'informes': ['read'] // Solo informes de reparaciones
    // Sin acceso a: facturas, usuarios, configuracion
  },
  'Vendedor': {
    // Enfoque en ventas y atención al cliente
    'clientes': ['create', 'read', 'update'],
    'ventas': ['create', 'read', 'update'],
    'facturas': ['create', 'read', 'update'],
    'inventario': ['read'], // Solo consulta para ventas
    'reparaciones': ['read'], // Solo consulta de estado
    'informes': ['read', 'export'] // Informes de ventas y clientes
    // Sin acceso a: usuarios, configuracion
  },
  'Usuario': {
    // Acceso muy limitado
    'reparaciones': ['read'], // Solo consultar sus propias reparaciones
    'clientes': [] // Sin acceso directo
  }
};

// Lista de módulos disponibles
const availableModules = [
  'reparaciones',
  'inventario', 
  'clientes',
  'ventas',
  'facturas',
  'usuarios',
  'configuracion',
  'informes'
];

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acceso requerido',
      code: 'NO_TOKEN'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Token inválido o expirado',
        code: 'INVALID_TOKEN'
      });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar roles específicos (backward compatibility)
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado',
        code: 'NO_AUTH'
      });
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Acceso denegado. Rol insuficiente',
        code: 'INSUFFICIENT_ROLE',
        required: roles,
        current: req.user.rol
      });
    }
    
    next();
  };
};

// Middleware mejorado para verificar permisos específicos por módulo
const requirePermission = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado',
        code: 'NO_AUTH'
      });
    }

    const userRole = req.user.rol;
    const userPermissions = rolePermissions[userRole];

    if (!userPermissions) {
      return res.status(403).json({ 
        error: 'Rol no válido',
        code: 'INVALID_ROLE',
        role: userRole
      });
    }

    const modulePermissions = userPermissions[module];

    if (!modulePermissions || !modulePermissions.includes(action)) {
      return res.status(403).json({ 
        error: `Acceso denegado. No tienes permisos para ${action} en ${module}`,
        code: 'INSUFFICIENT_PERMISSION',
        required: `${module}:${action}`,
        role: userRole
      });
    }

    next();
  };
};

// Función para verificar si un usuario tiene acceso a un módulo específico
const hasModuleAccess = (userRole, module) => {
  const permissions = rolePermissions[userRole];
  return permissions && permissions[module] && permissions[module].length > 0;
};

// Función para obtener todos los permisos de un rol
const getRolePermissions = (role) => {
  return rolePermissions[role] || {};
};

// Función para obtener módulos accesibles por rol
const getAccessibleModules = (role) => {
  const permissions = rolePermissions[role] || {};
  return Object.keys(permissions).filter(module => permissions[module].length > 0);
};

// Función para verificar permiso específico
const hasPermission = (role, module, action) => {
  const permissions = rolePermissions[role];
  return permissions && 
         permissions[module] && 
         permissions[module].includes(action);
};

// Middleware para inyectar información de permisos en las respuestas
const injectPermissions = (req, res, next) => {
  if (req.user) {
    req.user.permissions = getRolePermissions(req.user.rol);
    req.user.accessibleModules = getAccessibleModules(req.user.rol);
  }
  next();
};

// Función para generar token JWT con información extendida
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    rol: user.rol,
    permissions: getRolePermissions(user.rol),
    accessibleModules: getAccessibleModules(user.rol),
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

// Función para validar estructura de roles
const validateRole = (role) => {
  return Object.keys(rolePermissions).includes(role);
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission,
  hasModuleAccess,
  getRolePermissions,
  getAccessibleModules,
  hasPermission,
  injectPermissions,
  generateToken,
  validateRole,
  rolePermissions,
  availableModules
};