const pool = require('../db');

module.exports = {
  async obtener() {
    const [rows] = await pool.query('SELECT * FROM config_tienda LIMIT 1');
    return rows[0];
  },

  async actualizar(id, data) {
    const [result] = await pool.query(
      `UPDATE config_tienda SET
        nombre_empresa = ?,
        direccion = ?,
        telefono = ?,
        email = ?,
        nit = ?,
        logo_path = ?,
        moneda = ?,
        impuesto = ?,
        encabezado_recibo = ?,
        pie_recibo = ?,
        terminos_condiciones = ?,
        mostrar_logo = ?,
        mostrar_qr = ?,
        color_tema = ?
      WHERE id = ?`,
      [
        data.nombre_empresa,
        data.direccion,
        data.telefono,
        data.email,
        data.nit,
        data.logo_path,
        data.moneda,
        data.impuesto,
        data.encabezado_recibo,
        data.pie_recibo,
        data.terminos_condiciones,
        data.mostrar_logo,
        data.mostrar_qr,
        data.color_tema,
        id
      ]
    );
    return result.affectedRows > 0;
  }
}; 