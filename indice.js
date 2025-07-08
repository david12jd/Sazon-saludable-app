const express = require('express');
const cors = require('cors');
const app = express();
const clienteRoutes = require('./routes/cliente.routes');
const platoRoutes = require('./routes/plato');
const ingredienteRoutes = require('./routes/ingrediente');
const recetaRoutes = require('./routes/receta');
const facturaRoutes = require('./routes/factura');
const detalleFacturaRoutes = require('./routes/detalleFactura');
const movimientoInventarioRoutes = require('./routes/movimientoInventario');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clienteRoutes);
app.use('/api/platos', platoRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/detalles-factura', detalleFacturaRoutes);
app.use('/api/movimientos', movimientoInventarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
