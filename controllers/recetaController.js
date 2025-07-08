const db = require('../config/db');
const Receta = require('../models/receta');
const recetaModel = new Receta(db);

exports.getAllRecetas = async (req, res) => {
  try {
    const recetas = await recetaModel.getAll();
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecetaByPlatoId = async (req, res) => {
  try {
    const receta = await recetaModel.getByPlatoId(req.params.id_plato);
    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReceta = async (req, res) => {
  try {
    const data = await recetaModel.create(req.body);
    res.status(201).json({ message: 'Relación receta creada', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReceta = async (req, res) => {
  try {
    await recetaModel.updateCantidad(req.body);
    res.json({ message: 'Cantidad actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReceta = async (req, res) => {
  try {
    await recetaModel.delete(req.body);
    res.json({ message: 'Relación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
