const express = require('express');
const router = express.Router();
const controller = require('../controllers/movimientoInventarioController');

router.get('/', controller.getAllMovimientos);
router.get('/:id', controller.getMovimientoById);
router.post('/', controller.createMovimiento);
router.delete('/:id', controller.deleteMovimiento);

module.exports = router;
