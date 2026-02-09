const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar nuevo usuario
const registro = async (req, res) => {
    try {
        const { nombre, email, password, nivel } = req.body;

        // Validar campos obligatorios
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({
                error: 'El correo electrónico ya está registrado'
            });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const nuevoUsuario = new User({
            nombre,
            email,
            password: passwordHash,
            nivel: nivel || 'usuario'
        });

        await nuevoUsuario.save();

        // Generar token JWT
        const token = jwt.sign(
            { id: nuevoUsuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                nivel: nuevoUsuario.nivel
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al registrar usuario',
            detalle: error.message
        });
    }
};

// Login de usuario
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son obligatorios'
            });
        }

        // Buscar usuario
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                nivel: usuario.nivel
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al iniciar sesión',
            detalle: error.message
        });
    }
};

module.exports = { registro, login };
