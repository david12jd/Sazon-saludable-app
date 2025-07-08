const pool = require('../config/db');
const DetalleFactura = require('../models/detalleFactura');
const detalleFacturaModel = new DetalleFactura(pool);

exports.getAllDetalles = async (req, res) => {
  try {
    const detalles = await detalleFacturaModel.getAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDetallesPorFactura = async (req, res) => {
  try {
    const detalles = await detalleFacturaModel.getByFacturaId(req.params.id_factura);
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearDetalle = async (req, res) => {
  try {
    await detalleFacturaModel.create(req.body);
    res.status(201).json({ message: 'Detalle de factura agregado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarDetalle = async (req, res) => {
  try {
    const { id_factura, id_plato } = req.params;
    await detalleFacturaModel.delete(id_factura, id_plato);
    res.json({ message: 'Detalle de factura eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
