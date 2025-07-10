const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const facturaController = require('../controllers/facturaController');
const authAdmin = require('../middleware/authAdmin');

router.get('/mis-pedidos', authMiddleware, facturaController.getPedidosCliente);
router.put("/:id/estado", authMiddleware, authAdmin, facturaController.cambiarEstadoFactura);
router.get("/facturas", authMiddleware, authAdmin, facturaController.getTodasLasFacturas);
router.get('/', facturaController.getAllFacturas);
router.get('/:id', facturaController.getFacturaById);
router.post('/', facturaController.createFactura);
router.delete('/:id', facturaController.deleteFactura);

module.exports = router;
