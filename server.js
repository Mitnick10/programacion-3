const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./futbolstore.db', (err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        initDatabase();
    }
});

// Inicializar tabla de usuarios
function initDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'client'
        )
    `;

    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('❌ Error al crear tabla:', err.message);
        } else {
            console.log('✅ Tabla "users" inicializada correctamente');
            createAdminUser();
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
                function(err) {
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('========================================');
    console.log('📍 Endpoints disponibles:');
    console.log('   POST /api/register');
    console.log('   POST /api/login');
    console.log('   GET  /api/test');
    console.log('   GET  /api/users');
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
