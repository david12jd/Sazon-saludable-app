class Cliente {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    const [rows] = await this.db.query('SELECT * FROM cliente');
    return rows;
  }

  async getById(id) {
    const [rows] = await this.db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);
    return rows[0];
  }

  async create(cliente) {
    const { nombre, apellido, email, telefono, imagen } = cliente;
    const [result] = await this.db.query(
      'INSERT INTO cliente (nombres, apellidos, correo, telefono, imagen) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono, imagen]
    );
    return result.insertId;
  }

  async update(id, cliente) {
    const campos = [];
    const valores = [];

    if (cliente.nombre) {
      campos.push('nombres = ?');
      valores.push(cliente.nombre);
    }
    if (cliente.apellido) {
      campos.push('apellidos = ?');
      valores.push(cliente.apellido);
    }
    if (cliente.email) {
      campos.push('correo = ?');
      valores.push(cliente.email);
    }
    if (cliente.telefono) {
      campos.push('telefono = ?');
      valores.push(cliente.telefono);
    }
    if (cliente.imagen) {
      campos.push('imagen = ?');
      valores.push(cliente.imagen);
    }

    if (campos.length === 0) return false;

    const query = `UPDATE cliente SET ${campos.join(', ')} WHERE id_cliente = ?`;
    valores.push(id);

    await this.db.query(query, valores);
    return true;
  }

  async delete(id) {
    await this.db.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);
    return true;
  }
}

module.exports = Cliente;
