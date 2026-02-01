const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Conectar a la base de datos
const path = require('path');
const dbPath = path.join(__dirname, '../database/futbolstore.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
    }
});

// Crear usuario admin
async function crearAdmin() {
    const adminEmail = 'admin@futbolstore.com';
    const adminPassword = 'admin123';
    const adminNombre = 'Administrador';

    try {
        // Verificar si ya existe
        db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, row) => {
            if (err) {
                console.error('❌ Error al verificar admin:', err.message);
                db.close();
                return;
            }

            if (row) {
                console.log('⚠️  El usuario admin ya existe:');
                console.log('   Email:', adminEmail);
                console.log('   Role:', row.role);
                db.close();
                return;
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            // Insertar admin
            db.run(
                'INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)',
                [adminNombre, adminEmail, hashedPassword, 'admin'],
                function (err) {
                    if (err) {
                        console.error('❌ Error al crear admin:', err.message);
                    } else {
                        console.log('🎉 Usuario admin creado exitosamente!');
                        console.log('========================================');
                        console.log('📧 Email: admin@futbolstore.com');
                        console.log('🔑 Password: admin123');
                        console.log('👤 Role: admin');
                        console.log('========================================');
                    }
                    db.close();
                }
            );
        });

    } catch (error) {
        console.error('❌ Error:', error);
        db.close();
    }
}

// Ejecutar
crearAdmin();
