const express = require('express');
const router = express.Router();
const detalleFacturaController = require('../controllers/detalleFacturaController');

router.get('/', detalleFacturaController.getAllDetalles);
router.get('/:id_factura', detalleFacturaController.getDetallesPorFactura);
router.post('/', detalleFacturaController.crearDetalle);
router.delete('/:id_factura/:id_plato', detalleFacturaController.eliminarDetalle);

module.exports = router;
