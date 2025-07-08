class Ingrediente {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    try {
      const [rows] = await this.db.query("SELECT * FROM ingrediente");
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los ingredientes: " + error.message);
    }
  }

  async getById(id) {
    try {
      const [rows] = await this.db.query("SELECT * FROM ingrediente WHERE id_ingrediente = ?", [id]);
      return rows[0];
    } catch (error) {
      throw new Error("Error al obtener el ingrediente: " + error.message);
    }
  }

  async create(data) {
    try {
      const { nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario } = data;
      const [result] = await this.db.query(
        `INSERT INTO ingrediente (nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario) 
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario]
      );
      return result.insertId;
    } catch (error) {
      throw new Error("Error al crear el ingrediente: " + error.message);
    }
  }

  async update(id, data) {
    try {
      const { nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario } = data;
      await this.db.query(
        `UPDATE ingrediente 
         SET nombre = ?, unidad_medida = ?, stock_actual = ?, stock_minimo = ?, costo_unitario = ? 
         WHERE id_ingrediente = ?`,
        [nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario, id]
      );
      return true;
    } catch (error) {
      throw new Error("Error al actualizar el ingrediente: " + error.message);
    }
  }

  //  Método adicional para actualizar stock dentro de una transacción
  static async updateStockWithConnection(connection, id_ingrediente, cantidadUsada) {
    try {
      await connection.execute(
        `UPDATE ingrediente 
         SET stock_actual = stock_actual - ? 
         WHERE id_ingrediente = ?`,
        [cantidadUsada, id_ingrediente]
      );
    } catch (error) {
      throw new Error("Error al actualizar el stock del ingrediente: " + error.message);
    }
  }

  async delete(id) {
    try {
      await this.db.query("DELETE FROM ingrediente WHERE id_ingrediente = ?", [id]);
      return true;
    } catch (error) {
      throw new Error("Error al eliminar el ingrediente: " + error.message);
    }
  }
}

module.exports = Ingrediente;
