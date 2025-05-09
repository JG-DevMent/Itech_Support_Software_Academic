const pool = require('../db');
const inventarioModel = require('./inventarioModel');

module.exports = {
  async obtenerTodas() {
    const [rows] = await pool.query('SELECT *, fecha_registro FROM reparaciones');
    // Para cada reparación, obtener sus materiales asociados
    for (const rep of rows) {
      const [materiales] = await pool.query('SELECT * FROM materiales_reparacion WHERE reparacion_id = ?', [rep.id]);
      rep.materiales = materiales;
    }
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT *, fecha_registro FROM reparaciones WHERE id = ?', [id]);
    return rows[0];
  },

  async crear(reparacion, connection = pool) {
    if (!reparacion.cliente || !reparacion.nombreCliente || !reparacion.dispositivo || !reparacion.marcaModelo || !reparacion.imei || !reparacion.problema || !reparacion.descripcion || !reparacion.costo || !reparacion.estado) {
      throw new Error('Faltan campos obligatorios');
    }
    const costoMaterialesNum = Number(reparacion.costoMateriales) || 0;
    const [result] = await connection.query(
      'INSERT INTO reparaciones (cliente, nombreCliente, emailCliente, telefonoCliente, dispositivo, marcaModelo, imei, problema, descripcion, costo, estado, costoMateriales, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
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
        reparacion.estado,
        costoMaterialesNum
      ]
    );
    return { id: result.insertId, ...reparacion, costoMateriales: costoMaterialesNum };
  },

  async actualizar(id, reparacion) {
    const costoMaterialesNum = Number(reparacion.costoMateriales) || 0;
    const [result] = await pool.query(
      'UPDATE reparaciones SET cliente = ?, nombreCliente = ?, emailCliente = ?, telefonoCliente = ?, dispositivo = ?, marcaModelo = ?, imei = ?, problema = ?, descripcion = ?, costo = ?, estado = ?, costoMateriales = ? WHERE id = ?',
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
        reparacion.estado,
        costoMaterialesNum,
        id
      ]
    );
    return result.affectedRows > 0;
  },

  async eliminar(id) {
    // Obtener materiales asociados a la reparación antes de eliminar
    const [materiales] = await pool.query('SELECT * FROM materiales_reparacion WHERE reparacion_id = ?', [id]);
    // Sumar existencias de nuevo al inventario por cada material
    for (const mat of materiales) {
      if (mat.sku && mat.cantidad) {
        await inventarioModel.sumarExistenciasPorSKU(mat.sku, mat.cantidad, pool);
      }
    }
    // Eliminar materiales asociados
    await pool.query('DELETE FROM materiales_reparacion WHERE reparacion_id = ?', [id]);
    // Eliminar la reparación
    const [result] = await pool.query('DELETE FROM reparaciones WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Materiales de reparación
  async obtenerMateriales(reparacionId) {
    const [rows] = await pool.query('SELECT * FROM materiales_reparacion WHERE reparacion_id = ?', [reparacionId]);
    return rows;
  },

  async agregarMateriales(reparacionId, materiales, connection = pool) {
    if (!Array.isArray(materiales) || materiales.length === 0) {
      throw new Error('No se enviaron materiales');
    }
    // Descontar inventario por cada material (por SKU) antes de insertar
    for (const mat of materiales) {
      if (mat.sku && mat.cantidad) {
        await inventarioModel.descontarExistenciasPorSKU(mat.sku, mat.cantidad, connection);
      }
    }
    const inserts = materiales.map(mat => [
      reparacionId,
      mat.nombre,
      mat.sku || '',
      mat.precio,
      mat.cantidad,
      mat.subtotal
    ]);
    await connection.query(
      'INSERT INTO materiales_reparacion (reparacion_id, nombre, sku, precio, cantidad, subtotal) VALUES ?',
      [inserts]
    );
    return this.obtenerMateriales(reparacionId);
  },

  async eliminarMaterial(materialId) {
    const [result] = await pool.query('DELETE FROM materiales_reparacion WHERE id = ?', [materialId]);
    return result.affectedRows > 0;
  },

  async buscarPorCedulaOImei(valor) {
    const [rows] = await pool.query('SELECT * FROM reparaciones WHERE LOWER(cliente) = ? OR LOWER(imei) = ?', [valor.toLowerCase(), valor.toLowerCase()]);
    for (const rep of rows) {
      const [materiales] = await pool.query('SELECT * FROM materiales_reparacion WHERE reparacion_id = ?', [rep.id]);
      rep.materiales = materiales;
    }
    return rows;
  },

  async actualizarEstado(id, nuevoEstado, connection = pool) {
    const [result] = await connection.query(
      'UPDATE reparaciones SET estado = ? WHERE id = ?',
      [nuevoEstado, id]
    );
    return result.affectedRows > 0;
  }
}; 