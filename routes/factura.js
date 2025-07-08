const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const facturaController = require('../controllers/facturaController');

router.get('/mis-pedidos', authMiddleware, facturaController.getPedidosCliente);
router.get('/', facturaController.getAllFacturas);
router.get('/:id', facturaController.getFacturaById);
router.post('/', facturaController.createFactura);
router.delete('/:id', facturaController.deleteFactura);

module.exports = router;
