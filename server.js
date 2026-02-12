require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');


// Inicializar app
const app = express();

// Conectar a la base de datos
// Conectar a la base de datos
// Conectar a la base de datos e iniciar servidor
const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB conectado exitosamente');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

iniciarServidor();

// Middlewares
app.use(cors());

// Log básico de peticiones
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Debug middleware para ver errores de carga
app.use((err, req, res, next) => {
    console.error('❌ Error capturado en middleware:', err);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('❌ Error de JSON:', err.message);
        return res.status(400).send({ error: 'JSON inválido' });
    }
    if (err.type === 'entity.too.large') {
        console.error('❌ Error: Payload demasiado grande');
        return res.status(413).send({ error: 'Imagen demasiado grande' });
    }
    next();
});

// Serve static files from public directory
app.use(express.static('public'));

// RUTA TEMPORAL REPARACION
app.get('/fix-admin-force', async (req, res) => {
    try {
        const User = require('./models/User');
        const bcrypt = require('bcryptjs');
        const email = 'yonadavier@gmail.com';
        const password = 'admin';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.findOne({ email });
        if (user) {
            user.password = hashedPassword;
            user.nivel = 'admin';
            user.nombre = 'Admin Restaurado';
            await user.save();
            res.send('<h1>✅ Usuario actualizado: yonadavier@gmail.com / admin</h1>');
        } else {
            user = new User({ nombre: 'Admin Restaurado', email, password: hashedPassword, nivel: 'admin' });
            await user.save();
            res.send('<h1>✅ Usuario creado: yonadavier@gmail.com / admin</h1>');
        }
        console.log('✅ Admin restaurado vía /fix-admin-force');
    } catch (e) {
        console.error(e);
        res.status(500).send(e.toString());
    }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: '🏃‍♂️ Bienvenido a la API de Tienda de Productos Deportivos',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth (registro, login)',
            productos: '/api/productos (CRUD)',
            carrito: '/api/carrito (agregar, obtener, vaciar)',
            checkout: '/api/checkout (procesar pago, historial)',
            upload: '/api/upload (subir imágenes)'
        }
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/carrito', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/users', require('./routes/userRoutes'));


// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        ruta: req.originalUrl
    });
});

// Configurar puerto


module.exports = app;
