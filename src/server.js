const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const fs = require('fs');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads');
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Asegurar que el directorio de la base de datos exista
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('📂 Directorio de base de datos creado:', dbDir);
}

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(path.join(dbDir, 'futbolstore.db'), (err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        initDatabase();
    }
});

// Inicializar base de datos
function initDatabase() {
    db.serialize(() => {
        // Tabla Users
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'client'
            )
        `, (err) => {
            if (err) console.error('❌ Error tabla users:', err.message);
            else {
                console.log('✅ Tabla "users" lista');
                createAdminUser();
            }
        });

        // Tabla Categories
        db.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                nombre TEXT NOT NULL,
                icono TEXT
            )
        `, (err) => {
            if (!err) console.log('✅ Tabla "categories" lista');
        });

        // Tabla Brands
        db.run(`
            CREATE TABLE IF NOT EXISTS brands (
                id INTEGER PRIMARY KEY,
                nombre TEXT NOT NULL
            )
        `, (err) => {
            if (!err) console.log('✅ Tabla "brands" lista');
        });

        // Tabla Products
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                precio REAL NOT NULL,
                imagen_url TEXT,
                categoria_id INTEGER,
                marca_id INTEGER,
                FOREIGN KEY(categoria_id) REFERENCES categories(id),
                FOREIGN KEY(marca_id) REFERENCES brands(id)
            )
        `, (err) => {
            if (err) console.error('❌ Error tabla products:', err.message);
            else {
                console.log('✅ Tabla "products" lista');
                seedData(); // Intentar sembrar datos iniciales
            }
        });

        // Tabla Orders
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                total REAL NOT NULL,
                fecha TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `, (err) => {
            if (!err) console.log('✅ Tabla "orders" lista');
            else console.error('❌ Error tabla orders:', err.message);
        });

        // Tabla Order Items
        db.run(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER,
                product_nombre TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY(order_id) REFERENCES orders(id)
            )
        `, (err) => {
            if (!err) console.log('✅ Tabla "order_items" lista');
            else console.error('❌ Error tabla order_items:', err.message);
        });
    });
}

// Sembrar datos iniciales
function seedData() {
    // Verificar si hay categorías
    db.get("SELECT count(*) as count FROM categories", (err, row) => {
        if (row && row.count === 0) {
            console.log('🌱 Sembrando datos iniciales...');
            const categories = [
                { id: 1, nombre: 'Camisetas', icono: '👕' },
                { id: 2, nombre: 'Botines', icono: '👟' },
                { id: 3, nombre: 'Accesorios', icono: '⚽' }
            ];
            const stmt = db.prepare("INSERT INTO categories (id, nombre, icono) VALUES (?, ?, ?)");
            categories.forEach(c => stmt.run(c.id, c.nombre, c.icono));
            stmt.finalize();
        }
    });

    // Verificar si hay marcas
    db.get("SELECT count(*) as count FROM brands", (err, row) => {
        if (row && row.count === 0) {
            const brands = [
                { id: 1, nombre: 'Nike' },
                { id: 2, nombre: 'Adidas' },
                { id: 3, nombre: 'Puma' }
            ];
            const stmt = db.prepare("INSERT INTO brands (id, nombre) VALUES (?, ?)");
            brands.forEach(b => stmt.run(b.id, b.nombre));
            stmt.finalize();
        }
    });

    // Verificar si hay productos
    db.get("SELECT count(*) as count FROM products", (err, row) => {
        if (row && row.count === 0) {
            const products = [
                { nombre: 'Camiseta Local 2024', precio: 89.99, imagen_url: 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?q=80&w=2688&auto=format&fit=crop', categoria_id: 1, marca_id: 1 },
                { nombre: 'Speed Pro X', precio: 129.99, imagen_url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2564&auto=format&fit=crop', categoria_id: 2, marca_id: 2 },
                { nombre: 'Balón Oficial', precio: 39.99, imagen_url: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=2674&auto=format&fit=crop', categoria_id: 3, marca_id: 3 },
                { nombre: 'Camiseta Visitante', precio: 85.00, imagen_url: 'https://images.unsplash.com/photo-1577212017184-80cc0da11395?q=80&w=2548&auto=format&fit=crop', categoria_id: 1, marca_id: 2 },
                { nombre: 'Future Z', precio: 110.00, imagen_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2564&auto=format&fit=crop', categoria_id: 2, marca_id: 3 }
            ];
            const stmt = db.prepare("INSERT INTO products (nombre, precio, imagen_url, categoria_id, marca_id) VALUES (?, ?, ?, ?, ?)");
            products.forEach(p => stmt.run(p.nombre, p.precio, p.imagen_url, p.categoria_id, p.marca_id));
            stmt.finalize();
            console.log('✅ Datos de prueba sembrados correctamente');
        }
    });
}

// Crear usuario admin automáticamente si no existe
function createAdminUser() {
    const adminEmail = 'admin@futbolstore.com';

    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, row) => {
        if (err) {
            console.error('❌ Error al verificar admin:', err.message);
            return;
        }

        if (!row) {
            const hashedPassword = await bcrypt.hash('admin123', 10);

            db.run(
                'INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)',
                ['Administrador', adminEmail, hashedPassword, 'admin'],
                (err) => {
                    if (err) {
                        console.error('❌ Error al crear admin:', err.message);
                    } else {
                        console.log('🔑 Usuario admin creado:');
                        console.log('   Email: admin@futbolstore.com');
                        console.log('   Password: admin123');
                    }
                }
            );
        } else {
            console.log('ℹ️  Usuario admin ya existe');
        }
    });
}

// ========== ENDPOINTS ==========

// Endpoint de registro
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validación de datos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si el usuario ya existe
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                console.error('Error en DB:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (row) {
                return res.status(409).json({
                    error: 'El email ya está registrado'
                });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar usuario (siempre con rol 'client')
            const role = 'client';

            db.run(
                'INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)',
                [nombre, email, hashedPassword, role],
                function (err) {
                    if (err) {
                        console.error('Error al insertar:', err);
                        return res.status(500).json({ error: 'Error al crear usuario' });
                    }

                    console.log(`✅ Usuario registrado: ${email} (ID: ${this.lastID})`);

                    res.status(201).json({
                        message: 'Usuario registrado exitosamente',
                        user: {
                            id: this.lastID,
                            nombre,
                            email,
                            role
                        }
                    });
                }
            );
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son obligatorios'
            });
        }

        // Buscar usuario
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Error en DB:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (!user) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            console.log(`🔐 Login exitoso: ${user.email} - Rol: ${user.role}`);

            // Retornar usuario sin password
            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Login exitoso',
                user: userWithoutPassword
            });
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente ✅' });
});

// Endpoint para listar usuarios (solo para debug)
app.get('/api/users', (req, res) => {
    db.all('SELECT id, nombre, email, role FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

// ========== PRODUCTS API ==========

// GET Products
app.get('/api/products', (req, res) => {
    const query = `
        SELECT p.*, c.nombre as categoria_nombre, c.icono as categoria_icono, b.nombre as marca_nombre
        FROM products p
        LEFT JOIN categories c ON p.categoria_id = c.id
        LEFT JOIN brands b ON p.marca_id = b.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Transformar para que coincida con la estructura esperada por el frontend
        const products = rows.map(p => ({
            ...p,
            categorias: { nombre: p.categoria_nombre, icono: p.categoria_icono },
            marcas: { nombre: p.marca_nombre }
        }));
        res.json(products);
    });
});

// GET Categories
app.get('/api/categories', (req, res) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET Brands
app.get('/api/brands', (req, res) => {
    db.all('SELECT * FROM brands', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST Product (Crear producto)
app.post('/api/products', upload.single('imagen'), (req, res) => {
    const { nombre, precio, categoria_id, marca_id } = req.body;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    db.run(
        'INSERT INTO products (nombre, precio, imagen_url, categoria_id, marca_id) VALUES (?, ?, ?, ?, ?)',
        [nombre, precio, imagen_url, categoria_id, marca_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Producto creado' });
        }
    );
});

// DELETE Product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM products WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto eliminado', changes: this.changes });
    });
});

// ========== ORDERS API ==========

// POST Order (Crear orden)
app.post('/api/orders', (req, res) => {
    const { userId, items, total } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No hay items en la orden' });
    }

    const date = new Date().toISOString();

    // Función interna para crear la orden
    const createOrder = (finalUserId) => {
        // 1. Crear la orden
        db.run(
            'INSERT INTO orders (user_id, total, fecha) VALUES (?, ?, ?)',
            [finalUserId, total, date], // userId validado o null
            function (err) {
                if (err) {
                    console.error('Error al crear orden:', err);
                    return res.status(500).json({ error: 'Error al procesar la orden' });
                }

                const orderId = this.lastID;
                console.log(`🧾 Orden creada ID: ${orderId} - Total: ${total} (User: ${finalUserId || 'Guest'})`);

                // 2. Insertar items
                const stmt = db.prepare('INSERT INTO order_items (order_id, product_nombre, quantity, price) VALUES (?, ?, ?, ?)');

                items.forEach(item => {
                    const qty = item.quantity || 1;
                    stmt.run(orderId, item.nombre, qty, item.precio);
                });

                stmt.finalize((err) => {
                    if (err) {
                        console.error('Error al insertar items:', err);
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Orden creada exitosamente',
                        order: {
                            id: orderId,
                            date: date,
                            total: total,
                            items: items
                        }
                    });
                });
            }
        );
    };

    // Validar usuario si existe
    if (userId) {
        db.get('SELECT id FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                console.error('Error verificando usuario:', err);
                // Si hay error en DB, intentamos como invitado por seguridad
                createOrder(null);
            } else if (!row) {
                console.warn(`⚠️ Usuario ID ${userId} no encontrado (posible DB reset). Creando orden como invitado.`);
                createOrder(null);
            } else {
                createOrder(userId);
            }
        });
    } else {
        createOrder(null);
    }
});

// ========== STATS API ==========

app.get('/api/stats/dashboard', (req, res) => {
    const stats = {};

    // 1. Total Revenue
    db.get('SELECT SUM(total) as revenue, COUNT(*) as orders FROM orders', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        stats.revenue = row.revenue || 0;
        stats.totalOrders = row.orders || 0;
        stats.averageTicket = stats.totalOrders > 0 ? (stats.revenue / stats.totalOrders) : 0;

        // 2. Recent Orders
        db.all('SELECT orders.*, users.nombre as user_name FROM orders LEFT JOIN users ON orders.user_id = users.id ORDER BY fecha DESC LIMIT 5', (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            stats.recentOrders = rows;
            res.json(stats);
        });
    });
});



// Iniciar servidor
app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('========================================');
    console.log('📍 Endpoints disponibles:');
    console.log('   POST /api/register');
    console.log('   POST /api/login');
    console.log('   GET  /api/products  (GET, POST, DELETE)');
    console.log('   GET  /api/categories');
    console.log('   GET  /api/brands');
    console.log('========================================');
});

// Cerrar DB al terminar
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('\n👋 Conexión a DB cerrada');
        process.exit(0);
    });
});
