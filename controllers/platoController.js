const Plato = require('../models/plato');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const platoModel = new Plato(db);

// Obtener todos los platos
exports.obtenerPlatos = async (req, res) => {
  try {
    const platos = await platoModel.getAll();
    res.json(platos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un plato por ID
exports.obtenerPlatoPorId = async (req, res) => {
  try {
    const plato = await platoModel.getById(req.params.id);
    if (!plato) return res.status(404).json({ error: 'Plato no encontrado' });
    res.json(plato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo plato
exports.crearPlato = async (req, res) => {
  try {
    const { nombre, tipo_comida, precio } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const nuevoPlato = {
      nombre,
      tipo_comida,
      precio,
      imagen
    };

    const id = await platoModel.create(nuevoPlato);
    res.status(201).json({ message: 'Plato creado correctamente', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un plato
exports.actualizarPlato = async (req, res) => {
  try {
    const id = req.params.id;
    const platoExistente = await platoModel.getById(id);
    if (!platoExistente) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }

    const { nombre, tipo_comida, precio } = req.body;
    let imagen = platoExistente.imagen;

    // Si se carga una nueva imagen, actualizarla
    if (req.file) {
      // Eliminar la imagen anterior del servidor si existía
      if (imagen) {
        const rutaAntigua = path.join(__dirname, '..', 'uploads', imagen);
        if (fs.existsSync(rutaAntigua)) fs.unlinkSync(rutaAntigua);
      }
      imagen = req.file.filename;
    }

    const datosActualizados = {
      nombre,
      tipo_comida,
      precio,
      imagen
    };

    await platoModel.update(id, datosActualizados);
    res.json({ message: 'Plato actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un plato
exports.eliminarPlato = async (req, res) => {
  try {
    const id = req.params.id;
    const plato = await platoModel.getById(id);

    if (!plato) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }

    // Eliminar la imagen del servidor si existe
    if (plato.imagen) {
      const ruta = path.join(__dirname, '..', 'uploads', plato.imagen);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    await platoModel.delete(id);
    res.json({ message: 'Plato eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
