const pool = require('../db');

const ventasModel = {
  async crearVenta(venta) {
    const [result] = await pool.query(
      'INSERT INTO ventas (factura_id, producto_id, producto_nombre, producto_sku, cantidad, precio_unitario, subtotal, metodo_pago, cliente, observaciones, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        venta.factura_id || null,
        venta.producto_id || null,
        venta.producto_nombre,
        venta.producto_sku,
        venta.cantidad,
        venta.precio_unitario,
        venta.subtotal,
        venta.metodo_pago || 'efectivo',
        venta.cliente || 'Cliente general',
        venta.observaciones || ''
      ]
    );
    return { id: result.insertId, ...venta };
  },

  async obtenerTodas() {
    const [rows] = await pool.query(
      'SELECT * FROM ventas ORDER BY fecha_registro DESC'
    );
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query(
      'SELECT * FROM ventas WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async eliminar(id) {
    const [result] = await pool.query(
      'DELETE FROM ventas WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async obtenerVentasPorFecha(fechaInicio, fechaFin) {
    const [rows] = await pool.query(
      'SELECT * FROM ventas WHERE fecha_registro BETWEEN ? AND ? ORDER BY fecha_registro DESC',
      [fechaInicio, fechaFin]
    );
    return rows;
  },

  async obtenerVentasHoy() {
    const [rows] = await pool.query(
      "SELECT * FROM ventas WHERE DATE(fecha_registro) = CURDATE() ORDER BY fecha_registro DESC"
    );
    return rows;
  },

  async totalVentasHoy() {
    // Sumar tanto facturas pagadas como ventas directas
    const [rowsFacturas] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) as total FROM facturas WHERE DATE(fecha_emision) = CURDATE() AND estado = 'Pagada'"
    );
    
    const [rowsVentas] = await pool.query(
      "SELECT COALESCE(SUM(subtotal), 0) as total FROM ventas WHERE DATE(fecha_registro) = CURDATE()"
    );
    
    return (rowsFacturas[0]?.total || 0) + (rowsVentas[0]?.total || 0);
  },

  async obtenerEstadisticasVentas() {
    // Ventas del día
    const [ventasHoy] = await pool.query(
      "SELECT COUNT(*) as count, COALESCE(SUM(subtotal), 0) as total, COALESCE(SUM(cantidad), 0) as productos FROM ventas WHERE DATE(fecha_registro) = CURDATE()"
    );

    // Ventas del mes
    const [ventasMes] = await pool.query(
      "SELECT COUNT(*) as count, COALESCE(SUM(subtotal), 0) as total FROM ventas WHERE MONTH(fecha_registro) = MONTH(CURDATE()) AND YEAR(fecha_registro) = YEAR(CURDATE())"
    );

    // Top productos más vendidos
    const [topProductos] = await pool.query(
      "SELECT producto_nombre, SUM(cantidad) as total_vendido, COALESCE(SUM(subtotal), 0) as total_ingresos FROM ventas WHERE DATE(fecha_registro) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) GROUP BY producto_nombre ORDER BY total_vendido DESC LIMIT 5"
    );

    return {
      hoy: ventasHoy[0],
      mes: ventasMes[0],
      topProductos: topProductos
    };
  }
};

module.exports = ventasModel; 