const express = require('express');
const cors = require('cors');
const path = require('path');

// Configuración de la Base de Datos
require('./config/database');

// Importar Rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Global
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`📡 Request: ${req.method} ${req.url}`);
    next();
});
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rutas de API
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', statsRoutes);

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente ✅ (Refactorizado)' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor Refactorizado corriendo en http://localhost:${PORT}`);
    console.log('========================================');
    console.log('📍 Endpoints cargados de /api/...');
});
