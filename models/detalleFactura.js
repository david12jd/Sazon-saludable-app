class DetalleFactura {
  constructor(pool) {
    this.pool = pool;
  }

  // Obtener todos los detalles de factura
  async getAll() {
    const [rows] = await this.pool.query(`
      SELECT df.*, p.nombre AS nombre_plato
      FROM detalle_factura df
      JOIN plato p ON df.id_plato = p.id_plato
    `);
    return rows;
  }

  // Obtener los detalles de una factura específica
  async getByFacturaId(id_factura) {
    const [rows] = await this.pool.query(`
      SELECT df.*, p.nombre AS nombre_plato
      FROM detalle_factura df
      JOIN plato p ON df.id_plato = p.id_plato
      WHERE df.id_factura = ?
    `, [id_factura]);
    return rows;
  }

  // Crear un detalle de factura sin transacción
  async create(data) {
    const { id_factura, id_plato, precio_unitario, subtotal_linea } = data;
    await this.pool.query(
      `INSERT INTO detalle_factura (id_factura, id_plato, precio_unitario, subtotal_linea)
       VALUES (?, ?, ?, ?)`,
      [id_factura, id_plato, precio_unitario, subtotal_linea]
    );
    return true;
  }

  //  Crear detalle dentro de una transacción activa (estático)
  static async createWithConnection(connection, data) {
    const { id_factura, id_plato, precio_unitario, subtotal_linea } = data;
    await connection.execute(
      `INSERT INTO detalle_factura (id_factura, id_plato, precio_unitario, subtotal_linea)
       VALUES (?, ?, ?, ?)`,
      [id_factura, id_plato, precio_unitario, subtotal_linea]
    );
    return true;
  }

  // Eliminar un detalle específico
  async delete(id_factura, id_plato) {
    await this.pool.query(
      `DELETE FROM detalle_factura WHERE id_factura = ? AND id_plato = ?`,
      [id_factura, id_plato]
    );
    return true;
  }
}

module.exports = DetalleFactura;
