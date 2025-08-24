require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas (se agregarán por módulos)
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/config-tienda', require('./routes/configTienda'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/inventario', require('./routes/inventario'));
app.use('/api/reparaciones', require('./routes/reparaciones'));
app.use('/api/facturas', require('./routes/facturas'));
app.use('/api/historial-busquedas', require('./routes/historialBusquedas'));
app.use('/api/ventas', require('./routes/ventas'));
console.log('Rutas de usuarios, configuración de tienda, clientes, inventario, reparaciones, facturas, historial de búsquedas y ventas cargadas');

// Ruta protegida de ejemplo para probar JWT
app.get('/api/protected', require('./middleware/auth').authenticateToken, (req, res) => {
  res.json({ mensaje: 'Ruta protegida accesible', usuario: req.user });
});

app.get('/', (req, res) => {
  res.send('API de Itech Support corriendo');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
}); 

/*
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend corriendo en http://0.0.0.0:${PORT}`);
});*/