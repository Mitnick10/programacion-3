const express = require('express');
const router = express.Router();
const {
    agregarAlCarrito,
    obtenerCarrito,
    eliminarDelCarrito,
    vaciarCarrito
} = require('../controllers/cartController');
const { verificarToken } = require('../middlewares/auth');

// Todas las rutas de carrito requieren autenticación
router.use(verificarToken);

router.get('/', obtenerCarrito);
router.post('/agregar', agregarAlCarrito);
router.delete('/producto/:productoId', eliminarDelCarrito);
router.delete('/vaciar', vaciarCarrito);

module.exports = router;
