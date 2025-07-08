const mysql = require('mysql2/promise');

// pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mz91827364$#',
  database: 'el_sazon_saludable',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificacion de la conexión al iniciar
async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a la base de datos MySQL correctamente.');
    connection.release(); // liberamos la conexión
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
}

verificarConexion(); // Ejecutar la verificación al cargar el módulo

module.exports = pool;
