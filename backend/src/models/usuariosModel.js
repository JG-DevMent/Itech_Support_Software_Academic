const pool = require('../db');

module.exports = {
  async obtenerTodos() {
    const [rows] = await pool.query('SELECT id, username, email, telefono, rol, fecha_creacion FROM usuarios');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT id, username, email, telefono, rol, fecha_creacion FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  },

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
    const [result] = await pool.query(
      'INSERT INTO usuarios (username, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      [usuario.username, usuario.email, usuario.password, usuario.telefono || '', usuario.rol]
    );
    return { id: result.insertId, ...usuario };
  },

  async actualizar(id, usuario) {
    const [result] = await pool.query(
      'UPDATE usuarios SET username = ?, email = ?, password = ?, telefono = ?, rol = ? WHERE id = ?',
      [usuario.username, usuario.email, usuario.password, usuario.telefono || '', usuario.rol, id]
    );
    return result.affectedRows > 0;
  },

  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async login(username, password) {
    const [rows] = await pool.query('SELECT id, username, email, telefono, rol FROM usuarios WHERE username = ? AND password = ?', [username, password]);
    return rows[0];
  }
}; 