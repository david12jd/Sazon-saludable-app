class Factura {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    const [rows] = await this.db.query(
      `SELECT f.*, c.nombres, c.apellidos
       FROM factura f 
       JOIN cliente c ON f.id_cliente = c.id_cliente`
    );
    return rows;
  }

  async getById(id) {
    const [rows] = await this.db.query(
      `SELECT * FROM factura WHERE id_factura = ?`,
      [id]
    );
    return rows[0];
  }

  // Método original 
  async create(data) {
    const { id_cliente, subtotal, descuento, total } = data;
    const [result] = await this.db.query(
      `INSERT INTO factura (id_cliente, subtotal, descuento, total) 
       VALUES (?, ?, ?, ?)`,
      [id_cliente, subtotal, descuento, total]
    );
    return result.insertId;
  }

  // para usar con transacción manual
  async createWithConnection(connection, data) {
    const { id_cliente, subtotal, descuento, total } = data;
    const [result] = await connection.execute(
      `INSERT INTO factura (id_cliente, subtotal, descuento, total) 
       VALUES (?, ?, ?, ?)`,
      [id_cliente, subtotal, descuento, total]
    );
    return result.insertId;
  }

  async delete(id) {
    await this.db.query(`DELETE FROM factura WHERE id_factura = ?`, [id]);
    return true;
  }
}

module.exports = Factura;
