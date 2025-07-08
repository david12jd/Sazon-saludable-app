const express = require('express');
const router = express.Router();
const platoController = require('../controllers/platoController');
const upload = require('../middleware/upload');

// Rutas CRUD con soporte para carga de imagen
router.get('/', platoController.obtenerPlatos);
router.get('/:id', platoController.obtenerPlatoPorId);

// ⬅️ Aquí se aplica el middleware upload
router.post('/', upload.single('imagen'), platoController.crearPlato);
router.put('/:id', upload.single('imagen'), platoController.actualizarPlato);

router.delete('/:id', platoController.eliminarPlato);

// Ruta opcional para pruebas directas de carga
router.post('/upload-imagen', upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
  res.json({ message: 'Imagen subida', filename: req.file.filename });
});

module.exports = router;


