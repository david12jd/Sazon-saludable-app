class Receta {
  constructor(db) {
    this.db = db;
  }

  // Obtener todas las recetas con nombre de plato e ingrediente
  async getAll() {
    const [rows] = await this.db.query(`
      SELECT r.id_plato, p.nombre AS nombre_plato, r.id_ingrediente, i.nombre AS nombre_ingrediente, r.cantidad_por_plato
      FROM receta r
      JOIN plato p ON r.id_plato = p.id_plato
      JOIN ingrediente i ON r.id_ingrediente = i.id_ingrediente
    `);
    return rows;
  }

  // Obtener receta por ID de plato (fuera de transacción)
  async getByPlatoId(id_plato) {
    const [rows] = await this.db.query(`
      SELECT r.id_ingrediente, i.nombre AS nombre_ingrediente, r.cantidad_por_plato
      FROM receta r
      JOIN ingrediente i ON r.id_ingrediente = i.id_ingrediente
      WHERE r.id_plato = ?
    `, [id_plato]);
    return rows;
  }

  // Obtener receta por ID de plato con conexión activa (para transacciones)
  static async getByPlatoIdWithConnection(conn, id_plato) {
  try {
    const [rows] = await conn.execute(`
      SELECT r.id_ingrediente, r.cantidad_por_plato
      FROM receta r
      WHERE r.id_plato = ?
    `, [id_plato]);
    return rows;
  } catch (error) {
    throw new Error("Error en getByPlatoIdWithConnection: " + error.message);
  }
}

  // Crear nueva receta
  async create(data) {
    const { id_plato, id_ingrediente, cantidad_por_plato } = data;
    await this.db.query(`
      INSERT INTO receta (id_plato, id_ingrediente, cantidad_por_plato)
      VALUES (?, ?, ?)
    `, [id_plato, id_ingrediente, cantidad_por_plato]);
    return { id_plato, id_ingrediente };
  }

  // Actualizar cantidad de ingrediente por plato
  async updateCantidad(data) {
    const { id_plato, id_ingrediente, cantidad_por_plato } = data;
    await this.db.query(`
      UPDATE receta 
      SET cantidad_por_plato = ?
      WHERE id_plato = ? AND id_ingrediente = ?
    `, [cantidad_por_plato, id_plato, id_ingrediente]);
    return true;
  }

  // Eliminar receta (combinación de plato e ingrediente)
  async delete(data) {
    const { id_plato, id_ingrediente } = data;
    await this.db.query(`
      DELETE FROM receta
      WHERE id_plato = ? AND id_ingrediente = ?
    `, [id_plato, id_ingrediente]);
    return true;
  }
}

module.exports = Receta;
