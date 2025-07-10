const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para firmar el token
const {SECRET_KEY} = require('../configs');

exports.register = async (req, res) => {
  const { nombres, apellidos, correo, telefono, identificacion, ciudad, departamento, direccion, rol= 'cliente' } = req.body;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO cliente (nombres, apellidos, correo, telefono, identificacion, ciudad, departamento, direccion, password, rol) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombres, apellidos, correo, telefono, identificacion, ciudad, departamento, direccion, hashedPassword, rol]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario: ' + error.message });
  }
};

exports.login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const [rows] = await db.execute(`SELECT * FROM cliente WHERE correo = ?`, [correo]);

    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuario = rows[0];

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id_cliente: usuario.id_cliente, correo: usuario.correo, rol: usuario.rol }, SECRET_KEY, { expiresIn: '2h' });

    res.json({ message: 'Login exitoso', token,
      cliente: {
        id_cliente: usuario.id_cliente,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
        identificacion: usuario.identificacion,
        ciudad: usuario.ciudad,
        departamento: usuario.departamento,
        direccion: usuario.direccion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        imagen: usuario.imagen,
        rol: usuario.rol
      }
     });
  } catch (error) {
    res.status(500).json({ error: 'Error en login: ' + error.message });
  }
};
