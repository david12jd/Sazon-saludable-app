const express = require('express');
const router = express.Router();
const ingredienteController = require('../controllers/ingredienteController');

// Obtener todos los ingredientes
router.get('/', ingredienteController.getAllIngredientes);

// Obtener un ingrediente por ID
router.get('/:id', ingredienteController.getIngredienteById);

// Crear un nuevo ingrediente
router.post('/', ingredienteController.createIngrediente);

// Actualizar un ingrediente por ID
router.put('/:id', ingredienteController.updateIngrediente);

// Eliminar un ingrediente por ID
router.delete('/:id', ingredienteController.deleteIngrediente);

module.exports = router;

