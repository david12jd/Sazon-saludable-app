const db = require('../config/db');
const Ingrediente = require('../models/ingrediente');
const ingredienteModel = new Ingrediente(db);

exports.getAllIngredientes = async (req, res) => {
  try {
    const ingredientes = await ingredienteModel.getAll();
    res.json(ingredientes);
  } catch (error) {
    console.error('Error al obtener ingredientes:', error.message);
    res.status(500).json({ error: 'Error al obtener ingredientes' });
  }
};

exports.getIngredienteById = async (req, res) => {
  try {
    const ingrediente = await ingredienteModel.getById(req.params.id);
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }
    res.json(ingrediente);
  } catch (error) {
    console.error('Error al obtener ingrediente por ID:', error.message);
    res.status(500).json({ error: 'Error al obtener ingrediente' });
  }
};

exports.createIngrediente = async (req, res) => {
  try {
    const id = await ingredienteModel.create(req.body);
    res.status(201).json({ message: 'Ingrediente creado', id });
  } catch (error) {
    console.error('Error al crear ingrediente:', error.message);
    res.status(500).json({ error: 'Error al crear ingrediente' });
  }
};

exports.updateIngrediente = async (req, res) => {
  try {
    await ingredienteModel.update(req.params.id, req.body);
    res.json({ message: 'Ingrediente actualizado' });
  } catch (error) {
    console.error('Error al actualizar ingrediente:', error.message);
    res.status(500).json({ error: 'Error al actualizar ingrediente' });
  }
};

exports.deleteIngrediente = async (req, res) => {
  try {
    await ingredienteModel.delete(req.params.id);
    res.json({ message: 'Ingrediente eliminado' });
  } catch (error) {
    console.error('Error al eliminar ingrediente:', error.message);
    res.status(500).json({ error: 'Error al eliminar ingrediente' });
  }
};
