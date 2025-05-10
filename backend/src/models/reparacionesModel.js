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
    if (!rows[0]) return null;
    const rep = rows[0];
    const [materiales] = await pool.query('SELECT * FROM materiales_reparacion WHERE reparacion_id = ?', [rep.id]);
    rep.materiales = materiales;
    return rep;
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
    // Obtener reparación y materiales actuales
    const reparacionActual = await this.obtenerPorId(id);
    if (reparacionActual.estado === 'Completada' || reparacionActual.estado === 'Pagada') {
      throw new Error('No se puede editar una reparación completada o pagada.');
    }
    const materialesNuevos = reparacion.materiales || [];
    const materialesActuales = await this.obtenerMateriales(id);
    // Mapear por SKU para comparar
    const mapActuales = new Map(materialesActuales.map(m => [m.sku, m]));
    const mapNuevos = new Map(materialesNuevos.map(m => [m.sku, m]));
    // 1. Reponer inventario de materiales eliminados o reducidos
    for (const mat of materialesActuales) {
      const nuevo = mapNuevos.get(mat.sku);
      if (!nuevo) {
        // Material eliminado
        await inventarioModel.sumarExistenciasPorSKU(mat.sku, mat.cantidad);
        await pool.query('DELETE FROM materiales_reparacion WHERE id = ?', [mat.id]);
      } else if (nuevo.cantidad < mat.cantidad) {
        // Cantidad reducida
        await inventarioModel.sumarExistenciasPorSKU(mat.sku, mat.cantidad - nuevo.cantidad);
        await pool.query('UPDATE materiales_reparacion SET cantidad = ?, subtotal = ? WHERE id = ?', [nuevo.cantidad, nuevo.subtotal, mat.id]);
      } else if (nuevo.cantidad > mat.cantidad) {
        // Cantidad aumentada
        await inventarioModel.descontarExistenciasPorSKU(mat.sku, nuevo.cantidad - mat.cantidad);
        await pool.query('UPDATE materiales_reparacion SET cantidad = ?, subtotal = ? WHERE id = ?', [nuevo.cantidad, nuevo.subtotal, mat.id]);
      } else {
        // Solo actualizar subtotal si cambió
        await pool.query('UPDATE materiales_reparacion SET subtotal = ? WHERE id = ?', [nuevo.subtotal, mat.id]);
      }
    }
    // 2. Insertar materiales nuevos
    for (const mat of materialesNuevos) {
      if (!mapActuales.has(mat.sku)) {
        await inventarioModel.descontarExistenciasPorSKU(mat.sku, mat.cantidad);
        await pool.query('INSERT INTO materiales_reparacion (reparacion_id, nombre, sku, precio, cantidad, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
          [id, mat.nombre, mat.sku, mat.precio, mat.cantidad, mat.subtotal]);
      }
    }
    // 3. Actualizar reparación (sin campo materiales)
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
    // Obtener reparación actual
    const reparacionActual = await this.obtenerPorId(id);
    if (reparacionActual.estado === 'Completada' || reparacionActual.estado === 'Pagada') {
      throw new Error('No se puede eliminar una reparación completada o pagada.');
    }
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