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
    
    // Validar categoría
    const categoria = producto.categoria || 'ambos';
    if (!['servicio', 'venta', 'ambos'].includes(categoria)) {
      throw new Error('Categoría no válida');
    }
    
    const [result] = await pool.query(
      'INSERT INTO inventario (nombre, precio, costo, sku, imei, garantia, categoria, existencias) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [producto.nombre, producto.precio, producto.costo, producto.sku, producto.imei || '', producto.garantia, categoria, producto.existencias]
    );
    return { id: result.insertId, ...producto, categoria };
  },

  async actualizar(id, producto) {
    // Validar categoría si se proporciona
    const categoria = producto.categoria || 'ambos';
    if (!['servicio', 'venta', 'ambos'].includes(categoria)) {
      throw new Error('Categoría no válida');
    }
    
    const [result] = await pool.query(
      'UPDATE inventario SET nombre = ?, precio = ?, costo = ?, sku = ?, imei = ?, garantia = ?, categoria = ?, existencias = ? WHERE id = ?',
      [producto.nombre, producto.precio, producto.costo, producto.sku, producto.imei || '', producto.garantia, categoria, producto.existencias, id]
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
  },

  // Obtener productos por categoría
  async obtenerPorCategoria(categoria) {
    const [rows] = await pool.query('SELECT * FROM inventario WHERE categoria = ? OR categoria = "ambos"', [categoria]);
    return rows;
  },

  // Obtener productos solo para servicios
  async obtenerParaServicios() {
    const [rows] = await pool.query('SELECT * FROM inventario WHERE categoria IN ("servicio", "ambos")');
    return rows;
  },

  // Obtener productos solo para ventas
  async obtenerParaVentas() {
    const [rows] = await pool.query('SELECT * FROM inventario WHERE categoria IN ("venta", "ambos")');
    return rows;
  },

  // Obtener estadísticas por categoría
  async obtenerEstadisticasCategorias() {
    const [rows] = await pool.query(`
      SELECT 
        categoria,
        COUNT(*) as total_productos,
        SUM(existencias) as total_existencias,
        ROUND(AVG(precio), 2) as precio_promedio,
        ROUND(SUM(precio * existencias), 2) as valor_total
      FROM inventario 
      GROUP BY categoria
    `);
    return rows;
  },

  // Buscar productos por nombre o SKU con filtro de categoría
  async buscarPorTermino(termino, categoria = null) {
    let query = 'SELECT * FROM inventario WHERE (nombre LIKE ? OR sku LIKE ?)';
    let params = [`%${termino}%`, `%${termino}%`];
    
    if (categoria) {
      query += ' AND (categoria = ? OR categoria = "ambos")';
      params.push(categoria);
    }
    
    const [rows] = await pool.query(query, params);
    return rows;
  }
}; 