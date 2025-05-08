const pool = require('../db');

module.exports = {
  async obtener() {
    const [rows] = await pool.query('SELECT * FROM config_recibos LIMIT 1');
    return rows[0];
  },

  async actualizar(id, data) {
    const [result] = await pool.query(
      `UPDATE config_recibos SET
        nombre_empresa = ?,
        direccion = ?,
        telefono = ?,
        email = ?,
        nit = ?,
        logo_mostrar = ?,
        encabezado = ?,
        footer = ?,
        color_tema = ?,
        moneda = ?,
        mostrar_qr = ?,
        mensaje_agradecimiento = ?
      WHERE id = ?`,
      [
        data.nombre_empresa,
        data.direccion,
        data.telefono,
        data.email,
        data.nit,
        data.logo_mostrar,
        data.encabezado,
        data.footer,
        data.color_tema,
        data.moneda,
        data.mostrar_qr,
        data.mensaje_agradecimiento,
        id
      ]
    );
    return result.affectedRows > 0;
  }
}; 