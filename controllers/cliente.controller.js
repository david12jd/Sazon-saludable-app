const db = require('../config/db');
const Cliente = require('../models/cliente.model');
const clienteModel = new Cliente(db);

exports.getPerfil = async (req, res) => {
  try {
    const id_cliente = req.user.id; // viene desde el token
    const cliente = await clienteModel.obtenerPorId(id_cliente);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil: ' + error.message });
  }
};

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.getAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await clienteModel.getById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear cliente (registro)
exports.createCliente = async (req, res) => {
  try {
    const imagen = req.file ? req.file.filename : null;
    const nuevoCliente = { ...req.body, imagen };
    const id = await clienteModel.create(nuevoCliente);
    res.status(201).json({ message: 'Cliente creado', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
  try {
    const imagen = req.file ? req.file.filename : null;
    const datosActualizados = imagen ? { ...req.body, imagen } : req.body;
    await clienteModel.update(req.params.id, datosActualizados);
    res.json({ message: 'Cliente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    const id_cliente = req.user.id_cliente;
    const { telefono, ciudad, departamento, direccion } = req.body;

    await db.execute(
      `UPDATE cliente 
       SET telefono = ?, ciudad = ?, departamento = ?, direccion = ? 
       WHERE id_cliente = ?`,
      [telefono, ciudad, departamento, direccion, id_cliente]
    );

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil: " + error.message });
  }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
  try {
    await clienteModel.delete(req.params.id);
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bcrypt = require('bcrypt');

exports.cambiarPassword = async (req, res) => {
  const { password_actual, password_nueva } = req.body;
  const id_cliente = req.user.id; // Viene desde el token

  try {
    const [rows] = await db.query('SELECT password FROM cliente WHERE id_cliente = ?', [id_cliente]);
    const cliente = rows[0];
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    const match = await bcrypt.compare(password_actual, cliente.password);
    if (!match) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    const hashedPassword = await bcrypt.hash(password_nueva, 10);
    await db.query('UPDATE cliente SET password = ? WHERE id_cliente = ?', [hashedPassword, id_cliente]);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar contraseña: ' + error.message });
  }
};

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'tu_clave_secreta_super_segura';