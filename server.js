require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

// Inicializar app
const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: '🏃‍♂️ Bienvenido a la API de Tienda de Productos Deportivos',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth (registro, login)',
            productos: '/api/productos (CRUD)',
            carrito: '/api/carrito (agregar, obtener, vaciar)',
            checkout: '/api/checkout (procesar pago, historial)'
        }
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/carrito', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        ruta: req.originalUrl
    });
});

// Configurar puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
