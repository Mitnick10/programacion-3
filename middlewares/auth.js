const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const verificarToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                error: 'Acceso denegado. No se proporcionó token de autenticación.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                error: 'Token inválido. Usuario no encontrado.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            error: 'Token inválido o expirado.'
        });
    }
};

// Middleware para verificar rol de administrador
const verificarAdmin = (req, res, next) => {
    if (req.user.nivel !== 'admin') {
        return res.status(403).json({
            error: 'Acceso denegado. Se requieren privilegios de administrador.'
        });
    }
    next();
};

module.exports = { verificarToken, verificarAdmin };
