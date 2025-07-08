const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/authMiddleware');

// Obtener todos los clientes
router.get('/', clienteController.getAllClientes);

// Obtener un cliente por su ID
router.get('/:id', clienteController.getClienteById);

// Crear un nuevo cliente
router.post('/', upload.single('imagen'), clienteController.createCliente);

// Actualizar un cliente existente
router.put('/:id', upload.single('imagen'), clienteController.updateCliente);

// Eliminar un cliente
router.delete('/:id', clienteController.deleteCliente);

// Actualizar contraseña
router.put('/cambiar-password', auth, clienteController.cambiarPassword);

// Endpoint protegido
//router.get('/perfil', verifyToken, clienteController.getPerfil);//
//router.put('/perfil', verifyToken, clienteController.actualizarPerfil);//

router.get('/perfil', clienteController.getPerfil);
router.get('/perfil', clienteController.actualizarPerfil);

module.exports = router;

