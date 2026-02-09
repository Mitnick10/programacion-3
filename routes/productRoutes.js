const express = require('express');
const router = express.Router();
const {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

// Rutas públicas (no requieren autenticación)
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas (solo administradores)
router.post('/', verificarToken, verificarAdmin, crearProducto);
router.put('/:id', verificarToken, verificarAdmin, actualizarProducto);
router.delete('/:id', verificarToken, verificarAdmin, eliminarProducto);

module.exports = router;
