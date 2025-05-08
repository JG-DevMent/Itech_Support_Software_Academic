const pool = require('../db');

module.exports = {
  async obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM historial_busquedas ORDER BY timestamp DESC');
    return rows;
  },

  async crear(busqueda) {
    if (!busqueda.tipo || !busqueda.item_id || !busqueda.nombre) {
      throw new Error('Faltan campos obligatorios');
    }
    const [result] = await pool.query(
      'INSERT INTO historial_busquedas (tipo, item_id, nombre) VALUES (?, ?, ?)',
      [busqueda.tipo, busqueda.item_id, busqueda.nombre]
    );
    return { id: result.insertId, ...busqueda };
  },

  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM historial_busquedas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}; 