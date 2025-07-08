class Plato {
  constructor(db) {
    this.db = db;
  }

  // Obtener todos los platos
  async getAll() {
    const [rows] = await this.db.query("SELECT * FROM plato");
    return rows;
  }

  // Obtener plato por ID
  async getById(id) {
    const [rows] = await this.db.query("SELECT * FROM plato WHERE id_plato = ?", [id]);
    return rows[0];
  }

  // Crear un nuevo plato (con imagen incluida)
  async create(data) {
    const { nombre, tipo_comida, precio, imagen } = data;
    const [result] = await this.db.query(
      `INSERT INTO plato (nombre, tipo_comida, precio, imagen) 
       VALUES (?, ?, ?, ?)`,
      [nombre, tipo_comida, precio, imagen]
    );
    return result.insertId;
  }

  // Crear plato con conexión activa (transacción)
  static async createWithConnection(conn, data) {
    const { nombre, tipo_comida, precio, imagen } = data;
    const [result] = await conn.execute(
      `INSERT INTO plato (nombre, tipo_comida, precio, imagen) 
       VALUES (?, ?, ?, ?)`,
      [nombre, tipo_comida, precio, imagen]
    );
    return result.insertId;
  }

  // Actualizar un plato
  async update(id, data) {
    const { nombre, tipo_comida, precio, imagen } = data;
    await this.db.query(
      `UPDATE plato 
       SET nombre = ?, tipo_comida = ?, precio = ?, imagen = ? 
       WHERE id_plato = ?`,
      [nombre, tipo_comida, precio, imagen, id]
    );
    return true;
  }

  // Eliminar un plato
  async delete(id) {
    await this.db.query("DELETE FROM plato WHERE id_plato = ?", [id]);
    return true;
  }
}

module.exports = Plato;
