const pool = require('../db');

module.exports = {
  async obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM clientes');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0];
  },

  async crear(cliente) {
    if (!cliente.nombre || !cliente.cedula || !cliente.telefono || !cliente.correo || !cliente.direccion) {
      throw new Error('Faltan campos obligatorios');
    }
    // Verificar si la cédula ya existe
    const [existe] = await pool.query('SELECT id FROM clientes WHERE cedula = ?', [cliente.cedula]);
    if (existe.length > 0) {
      throw new Error('La cédula ya existe');
    }
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, cedula, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)',
      [cliente.nombre, cliente.cedula, cliente.telefono, cliente.correo, cliente.direccion]
    );
    return { id: result.insertId, ...cliente };
  },

  async actualizar(id, cliente) {
    const [result] = await pool.query(
      'UPDATE clientes SET nombre = ?, cedula = ?, telefono = ?, correo = ?, direccion = ? WHERE id = ?',
      [cliente.nombre, cliente.cedula, cliente.telefono, cliente.correo, cliente.direccion, id]
    );
    return result.affectedRows > 0;
  },

  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}; 