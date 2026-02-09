const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Asegurar que el directorio de la base de datos exista
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('📂 Directorio de base de datos creado:', dbDir);
}

// Conexión a la base de datos SQLite
const dbPath = path.join(dbDir, 'futbolstore.db');
const db = new sqlite3.Database(dbPath, (err) => {
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
        `);

        // Tabla Brands
        db.run(`
            CREATE TABLE IF NOT EXISTS brands (
                id INTEGER PRIMARY KEY,
                nombre TEXT NOT NULL
            )
        `);

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
                seedData();
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
        `);

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
        `);
    });
}

// Sembrar datos iniciales
function seedData() {
    // Verificar si hay categorías
    db.get("SELECT count(*) as count FROM categories", (err, row) => {
        if (row && row.count === 0) {
            console.log('🌱 Sembrando categorías...');
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
            console.log('🌱 Sembrando marcas...');
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
            // Cargar productos desde archivo JSON (Persistencia basada en Git)
            try {
                const productsPath = path.join(__dirname, '../database/products.json');
                let products = [];

                if (fs.existsSync(productsPath)) {
                    const data = fs.readFileSync(productsPath, 'utf8');
                    products = JSON.parse(data);
                    console.log(`📂 Cargando ${products.length} productos desde products.json`);
                }

                if (products.length > 0) {
                    const stmt = db.prepare("INSERT INTO products (nombre, precio, imagen_url, categoria_id, marca_id) VALUES (?, ?, ?, ?, ?)");
                    products.forEach(p => stmt.run(p.nombre, p.precio, p.imagen_url, p.categoria_id, p.marca_id));
                    stmt.finalize();
                    console.log('✅ Datos de productos sembrados correctamente');
                }
            } catch (error) {
                console.error("❌ Error sembrando productos:", error);
            }
        }
    });
}

// Crear usuario admin automáticamente si no existe
function createAdminUser() {
    const adminEmail = 'admin@futbolstore.com';

    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, row) => {
        if (err) return;

        if (!row) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.run(
                'INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)',
                ['Administrador', adminEmail, hashedPassword, 'admin'],
                (err) => {
                    if (!err) {
                        console.log('🔑 Usuario admin creado: admin@futbolstore.com / admin123');
                    }
                }
            );
        }
    });
}

module.exports = db;
