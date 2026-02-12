const express = require('express');
const router = express.Router();
const { obtenerUsuarios, eliminarUsuario, cambiarRolUsuario } = require('../controllers/userController');
const { verificarToken } = require('../middlewares/auth');

// Middleware de autenticación para todas las rutas
router.use(verificarToken);

// Rutas (Solo Admin debería acceder a esto, se verificará en el frontend/middleware si fuera necesario más estricto)
router.get('/', obtenerUsuarios);
router.delete('/:id', eliminarUsuario);
router.put('/:id/rol', cambiarRolUsuario);

module.exports = router;
