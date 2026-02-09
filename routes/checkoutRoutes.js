const express = require('express');
const router = express.Router();
const {
    procesarCheckout,
    obtenerHistorialOrdenes,
    obtenerOrdenPorId
} = require('../controllers/checkoutController');
const { verificarToken } = require('../middlewares/auth');

// Todas las rutas de checkout requieren autenticación
router.use(verificarToken);

router.post('/', procesarCheckout);
router.get('/ordenes', obtenerHistorialOrdenes);
router.get('/ordenes/:ordenId', obtenerOrdenPorId);

module.exports = router;
