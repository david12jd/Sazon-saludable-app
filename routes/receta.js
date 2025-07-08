const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');

router.get('/', recetaController.getAllRecetas);
router.get('/:id_plato', recetaController.getRecetaByPlatoId);
router.post('/', recetaController.createReceta);
router.put('/', recetaController.updateReceta);
router.delete('/', recetaController.deleteReceta);

module.exports = router;
