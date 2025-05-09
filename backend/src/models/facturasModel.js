const pool = require('../db');

module.exports = {
  async obtenerTodas() {
    const [rows] = await pool.query('SELECT * FROM facturas');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM facturas WHERE id = ?', [id]);
    return rows[0];
  },

  async crear(factura, connection = pool) {
    if (!factura.numero_factura || !factura.cliente || !factura.nombre_cliente || !factura.fecha_emision || !factura.subtotal || !factura.impuesto || !factura.total || !factura.metodo_pago) {
      throw new Error('Faltan campos obligatorios');
    }
    // Verificar si el número de factura ya existe
    const [existe] = await connection.query('SELECT id FROM facturas WHERE numero_factura = ?', [factura.numero_factura]);
    if (existe.length > 0) {
      throw new Error('El número de factura ya existe');
    }
    const [result] = await connection.query(
      'INSERT INTO facturas (numero_factura, cliente, nombre_cliente, email_cliente, telefono_cliente, reparacion_id, fecha_emision, subtotal, impuesto, total, metodo_pago, estado, notas, usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        factura.numero_factura,
        factura.cliente,
        factura.nombre_cliente,
        factura.email_cliente || '',
        factura.telefono_cliente || '',
        factura.reparacion_id || null,
        factura.fecha_emision,
        factura.subtotal,
        factura.impuesto,
        factura.total,
        factura.metodo_pago,
        factura.estado || 'Pendiente',
        factura.notas || '',
        factura.usuario || ''
      ]
    );
    return { id: result.insertId, ...factura };
  },

  async actualizar(id, factura) {
    const [result] = await pool.query(
      'UPDATE facturas SET numero_factura = ?, cliente = ?, nombre_cliente = ?, email_cliente = ?, telefono_cliente = ?, reparacion_id = ?, fecha_emision = ?, subtotal = ?, impuesto = ?, total = ?, metodo_pago = ?, estado = ?, notas = ?, usuario = ? WHERE id = ?',
      [
        factura.numero_factura,
        factura.cliente,
        factura.nombre_cliente,
        factura.email_cliente || '',
        factura.telefono_cliente || '',
        factura.reparacion_id || null,
        factura.fecha_emision,
        factura.subtotal,
        factura.impuesto,
        factura.total,
        factura.metodo_pago,
        factura.estado || 'Pendiente',
        factura.notas || '',
        factura.usuario || '',
        id
      ]
    );
    return result.affectedRows > 0;
  },

  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM facturas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Ventas
  async obtenerVentas(facturaId) {
    const [rows] = await pool.query('SELECT * FROM ventas WHERE factura_id = ?', [facturaId]);
    return rows;
  },

  async agregarVentas(facturaId, ventas) {
    if (!Array.isArray(ventas) || ventas.length === 0) {
      throw new Error('No se enviaron ventas');
    }
    const inserts = ventas.map(v => [
      facturaId,
      v.producto_nombre,
      v.producto_sku || '',
      v.cantidad,
      v.precio_unitario,
      v.subtotal
    ]);
    await pool.query(
      'INSERT INTO ventas (factura_id, producto_nombre, producto_sku, cantidad, precio_unitario, subtotal) VALUES ?',
      [inserts]
    );
    return this.obtenerVentas(facturaId);
  },

  async eliminarVenta(ventaId) {
    const [result] = await pool.query('DELETE FROM ventas WHERE id = ?', [ventaId]);
    return result.affectedRows > 0;
  }
}; 