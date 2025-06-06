const pool = require('../db');

module.exports = {
  async obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM inventario');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM inventario WHERE id = ?', [id]);
    return rows[0];
  },

  async crear(producto) {
    if (!producto.nombre || !producto.precio || !producto.costo || !producto.sku || !producto.garantia || producto.existencias === undefined) {
      throw new Error('Faltan campos obligatorios');
    }
    // Verificar si el SKU ya existe
    const [existe] = await pool.query('SELECT id FROM inventario WHERE sku = ?', [producto.sku]);
    if (existe.length > 0) {
      throw new Error('El SKU ya existe');
    }
    const [result] = await pool.query(
      'INSERT INTO inventario (nombre, precio, costo, sku, imei, garantia, existencias) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [producto.nombre, producto.precio, producto.costo, producto.sku, producto.imei || '', producto.garantia, producto.existencias]
    );
    return { id: result.insertId, ...producto };
  },

  async actualizar(id, producto) {
    const [result] = await pool.query(
      'UPDATE inventario SET nombre = ?, precio = ?, costo = ?, sku = ?, imei = ?, garantia = ?, existencias = ? WHERE id = ?',
      [producto.nombre, producto.precio, producto.costo, producto.sku, producto.imei || '', producto.garantia, producto.existencias, id]
    );
    return result.affectedRows > 0;
  },

  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM inventario WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async descontarExistenciasPorSKU(sku, cantidad, connection = pool) {
    const [rows] = await connection.query('SELECT existencias FROM inventario WHERE sku = ?', [sku]);
    if (rows.length === 0) throw new Error('SKU no encontrado');
    const existenciasActuales = parseInt(rows[0].existencias, 10);
    if (existenciasActuales < cantidad) throw new Error('Stock insuficiente para SKU ' + sku);
    const nuevasExistencias = existenciasActuales - cantidad;
    await connection.query('UPDATE inventario SET existencias = ? WHERE sku = ?', [nuevasExistencias, sku]);
    return true;
  },

  async sumarExistenciasPorSKU(sku, cantidad, connection = pool) {
    const [rows] = await connection.query('SELECT existencias FROM inventario WHERE sku = ?', [sku]);
    if (rows.length === 0) throw new Error('SKU no encontrado');
    const existenciasActuales = parseInt(rows[0].existencias, 10);
    const nuevasExistencias = existenciasActuales + cantidad;
    await connection.query('UPDATE inventario SET existencias = ? WHERE sku = ?', [nuevasExistencias, sku]);
    return true;
  }
}; 