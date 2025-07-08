const db = require('../config/db');
const MovimientoInventario = require('../models/movimientoInventario');
const model = new MovimientoInventario(db);

exports.getAllMovimientos = async (req, res) => {
  try {
    const data = await model.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovimientoById = async (req, res) => {
  try {
    const data = await model.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMovimiento = async (req, res) => {
  try {
    const id = await model.create(req.body);
    res.status(201).json({ message: 'Movimiento creado', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMovimiento = async (req, res) => {
  try {
    await model.delete(req.params.id);
    res.json({ message: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
