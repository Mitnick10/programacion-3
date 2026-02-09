const db = require('../config/database');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' });
            if (row) return res.status(409).json({ error: 'El email ya está registrado' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const role = 'client';

            db.run(
                'INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)',
                [nombre, email, hashedPassword, role],
                function (err) {
                    if (err) return res.status(500).json({ error: 'Error al crear usuario' });

                    console.log(`✅ Usuario registrado: ${email} (ID: ${this.lastID})`);
                    res.status(201).json({
                        message: 'Usuario registrado exitosamente',
                        user: { id: this.lastID, nombre, email, role }
                    });
                }
            );
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) return res.status(500).json({ error: 'Error en el servidor' });
            if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

            console.log(`🔐 Login exitoso: ${user.email} - Rol: ${user.role}`);
            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json({ message: 'Login exitoso', user: userWithoutPassword });
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { register, login };
