// Modelo para manejar la lógica de usuarios
const pool = require('../db');

module.exports = {
  // Obtener todos los usuarios
  async obtenerTodos() {
    const [rows] = await pool.query('SELECT id, username, email, telefono, rol, fecha_creacion FROM usuarios');
    return rows;
  },

  // Obtener un usuario por ID
  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT id, username, email, telefono, rol, fecha_creacion FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  },

  // Obtener un usuario por username
  async crear(usuario) {
    // Validar campos requeridos
    if (!usuario.username || !usuario.email || !usuario.password || !usuario.rol) {
      throw new Error('Faltan campos obligatorios');
    }
    // Verificar si el username ya existe
    const [existe] = await pool.query('SELECT id FROM usuarios WHERE username = ?', [usuario.username]);
    if (existe.length > 0) {
      throw new Error('El nombre de usuario ya existe');
    }
    // Verificar si el email ya existe
    const [result] = await pool.query(
      'INSERT INTO usuarios (username, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      [usuario.username, usuario.email, usuario.password, usuario.telefono || '', usuario.rol]
    );
    return { id: result.insertId, ...usuario };
  },

  // Actualizar un usuario por ID
  async actualizar(id, usuario) {
    const [result] = await pool.query(
      'UPDATE usuarios SET username = ?, email = ?, password = ?, telefono = ?, rol = ? WHERE id = ?',
      [usuario.username, usuario.email, usuario.password, usuario.telefono || '', usuario.rol, id]
    );
    return result.affectedRows > 0;
  },

  // Eliminar un usuario por ID
  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  //Login de usuario - Diferenciando mayúsculas y minúsculas
  async login(username, password) {
    // Usamos BINARY para hacer la comparación case-sensitive
    const [rows] = await pool.query(
      'SELECT id, username, email, telefono, rol, password FROM usuarios WHERE BINARY username = ? AND BINARY password = ?', 
      [username, password]
    );
    return rows[0];
  },

  // Obtener un usuario por username (case-sensitive)
  async obtenerPorUsername(username) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE BINARY username = ?', [username]);
    return rows;
  },

  // Obtener un usuario por email
  async obtenerPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  },

  // Nuevo método para actualizar contraseña por email
  async actualizarClave(email, nuevaClave) {
    const [result] = await pool.query(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [nuevaClave, email]
    );
    return result.affectedRows > 0;
  },

  // Contar usuarios por rol específico
  async contarPorRol(rol) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM usuarios WHERE rol = ?',
      [rol]
    );
    return rows[0].count;
  },

  // Obtener estadísticas de usuarios
  async obtenerEstadisticas() {
    const [rows] = await pool.query(`
      SELECT 
        rol,
        COUNT(*) as cantidad 
      FROM usuarios 
      GROUP BY rol
    `);
    return rows;
  },

  // Verificar si existe al menos un administrador
  async existeAdministrador() {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM usuarios WHERE rol = ?',
      ['Administrador']
    );
    return rows[0].count > 0;
  }
}; 