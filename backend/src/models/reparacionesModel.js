const pool = require('../db');

module.exports = {
  async obtenerTodas() {
    const [rows] = await pool.query('SELECT * FROM reparaciones');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM reparaciones WHERE id = ?', [id]);
    return rows[0];
  },

  async crear(reparacion) {
    if (!reparacion.cliente || !reparacion.nombreCliente || !reparacion.dispositivo || !reparacion.marcaModelo || !reparacion.imei || !reparacion.problema || !reparacion.descripcion || !reparacion.costo || !reparacion.fecha || !reparacion.estado) {
      throw new Error('Faltan campos obligatorios');
    }
    const [result] = await pool.query(
      'INSERT INTO reparaciones (cliente, nombreCliente, emailCliente, telefonoCliente, dispositivo, marcaModelo, imei, problema, descripcion, costo, fecha, estado, costoMateriales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        reparacion.cliente,
        reparacion.nombreCliente,
        reparacion.emailCliente || '',
        reparacion.telefonoCliente || '',
        reparacion.dispositivo,
        reparacion.marcaModelo,
        reparacion.imei,
        reparacion.problema,
        reparacion.descripcion,
        reparacion.costo,
        reparacion.fecha,
        reparacion.estado,
        reparacion.costoMateriales || 0
      ]
    );
    return { id: result.insertId, ...reparacion };
  },

  async actualizar(id, reparacion) {
    const [result] = await pool.query(
      'UPDATE reparaciones SET cliente = ?, nombreCliente = ?, emailCliente = ?, telefonoCliente = ?, dispositivo = ?, marcaModelo = ?, imei = ?, problema = ?, descripcion = ?, costo = ?, fecha = ?, estado = ?, costoMateriales = ? WHERE id = ?',
      [
        reparacion.cliente,
        reparacion.nombreCliente,
        reparacion.emailCliente || '',
        reparacion.telefonoCliente || '',
        reparacion.dispositivo,
        reparacion.marcaModelo,
        reparacion.imei,
        reparacion.problema,
        reparacion.descripcion,
        reparacion.costo,
        reparacion.fecha,
        reparacion.estado,
        reparacion.costoMateriales || 0,
        id
      ]
    );
    return result.affectedRows > 0;
  },

  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM reparaciones WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Materiales de reparación
  async obtenerMateriales(reparacionId) {
    const [rows] = await pool.query('SELECT * FROM materiales_reparacion WHERE reparacion_id = ?', [reparacionId]);
    return rows;
  },

  async agregarMateriales(reparacionId, materiales) {
    if (!Array.isArray(materiales) || materiales.length === 0) {
      throw new Error('No se enviaron materiales');
    }
    const inserts = materiales.map(mat => [
      reparacionId,
      mat.nombre,
      mat.precio,
      mat.cantidad,
      mat.subtotal
    ]);
    await pool.query(
      'INSERT INTO materiales_reparacion (reparacion_id, nombre, precio, cantidad, subtotal) VALUES ?',
      [inserts]
    );
    return this.obtenerMateriales(reparacionId);
  },

  async eliminarMaterial(materialId) {
    const [result] = await pool.query('DELETE FROM materiales_reparacion WHERE id = ?', [materialId]);
    return result.affectedRows > 0;
  }
}; 