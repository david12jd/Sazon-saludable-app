const db = require('../config/db');
const Factura = require('../models/factura');
const DetalleFactura = require('../models/detalleFactura');
const Receta = require('../models/receta');
const Ingrediente = require('../models/ingrediente');
const MovimientoInventario = require('../models/movimientoInventario');

const facturaModel = new Factura(db);

exports.getAllFacturas = async (req, res) => {
  try {
    const facturas = await facturaModel.getAll();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFacturaById = async (req, res) => {
  try {
    const factura = await facturaModel.getById(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFactura = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { id_cliente, subtotal, descuento, total, detalles } = req.body;

    // 1. Crear factura
    const id_factura = await facturaModel.createWithConnection(conn, {
      id_cliente,
      subtotal,
      descuento,
      total
    });

    // 2. Insertar cada línea del detalle
    for (const detalle of detalles) {
      const { id_plato, precio_unitario, subtotal_linea } = detalle;

      // Crear detalle_factura
      await DetalleFactura.createWithConnection(conn, {
        id_factura,
        id_plato,
        precio_unitario,
        subtotal_linea
      });

      // Calcular cantidad vendida
      const cantidad_vendida = subtotal_linea / precio_unitario;

      // Obtener ingredientes por receta
      const receta = await Receta.getByPlatoIdWithConnection(conn, id_plato);

      for (const item of receta) {
        const { id_ingrediente, cantidad_por_plato } = item;
        const cantidad_total = cantidad_vendida * cantidad_por_plato;

        // Registrar movimiento de inventario tipo USO
        await MovimientoInventario.createWithConnection(conn, {
          id_ingrediente,
          tipo_movimiento: 'USO',
          cantidad: cantidad_total,
          referencia: `Factura ${id_factura}`
        });

        // Actualizar stock del ingrediente
        await Ingrediente.updateStockWithConnection(conn, id_ingrediente, cantidad_total);
      }
    }

    await conn.commit();
    res.status(201).json({ message: 'Factura creada con lógica de inventario', id_factura });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};
exports.deleteFactura = async (req, res) => {
  try {
    await facturaModel.delete(req.params.id);
    res.json({ message: 'Factura eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPedidosCliente = async (req, res) => {
  try {
    const id_cliente = req.user.id_cliente;
    const [rows] = await db.query(
      "SELECT id_factura, fecha_hora, total, estado FROM factura WHERE id_cliente = ? ORDER BY fecha_hora DESC",
      [id_cliente]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pedidos: " + error.message });
  }
};
