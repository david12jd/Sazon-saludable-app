class MovimientoInventario {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    const [rows] = await this.db.query(`
      SELECT mi.*, i.nombre AS nombre_ingrediente
      FROM movimiento_inventario mi
      JOIN ingrediente i ON mi.id_ingrediente = i.id_ingrediente
    `);
    return rows;
  }

  async getById(id) {
    const [rows] = await this.db.query(
      `SELECT * FROM movimiento_inventario WHERE id_movimiento = ?`, [id]
    );
    return rows[0];
  }

  async create(data) {
    const { id_ingrediente, tipo_movimiento, cantidad, referencia } = data;
    const [result] = await this.db.query(
      `INSERT INTO movimiento_inventario (id_ingrediente, tipo_movimiento, cantidad, referencia)
       VALUES (?, ?, ?, ?)`,
      [id_ingrediente, tipo_movimiento, cantidad, referencia]
    );
    return result.insertId;
  }

  // método con transacción activa
  static async createWithConnection(connection, data) {
    const { id_ingrediente, tipo_movimiento, cantidad, referencia } = data;
    const [result] = await connection.execute(
      `INSERT INTO movimiento_inventario (id_ingrediente, tipo_movimiento, cantidad, referencia)
       VALUES (?, ?, ?, ?)`,
      [id_ingrediente, tipo_movimiento, cantidad, referencia]
    );
    return result.insertId;
  }

  async delete(id) {
    await this.db.query(`DELETE FROM movimiento_inventario WHERE id_movimiento = ?`, [id]);
    return true;
  }
}

module.exports = MovimientoInventario;
