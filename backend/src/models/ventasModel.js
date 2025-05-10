const pool = require('../db');

const ventasModel = {
  async crearVenta(venta) {
    const [result] = await pool.query(
      'INSERT INTO ventas (factura_id, producto_nombre, producto_sku, cantidad, precio_unitario, subtotal, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [
        venta.factura_id || null,
        venta.producto_nombre,
        venta.producto_sku,
        venta.cantidad,
        venta.precio_unitario,
        venta.subtotal
      ]
    );
    return { id: result.insertId, ...venta };
  },
  async obtenerVentasPorFecha(fechaInicio, fechaFin) {
    const [rows] = await pool.query(
      'SELECT * FROM ventas WHERE fecha_registro BETWEEN ? AND ?',
      [fechaInicio, fechaFin]
    );
    return rows;
  },
  async obtenerVentasHoy() {
    const [rows] = await pool.query(
      "SELECT * FROM ventas WHERE DATE(fecha_registro) = CURDATE()"
    );
    return rows;
  },
  async totalVentasHoy() {
    const [rows] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) as total FROM facturas WHERE DATE(fecha_emision) = CURDATE() AND estado = 'Pagada'"
    );
    return rows[0]?.total || 0;
  }
};

module.exports = ventasModel; 