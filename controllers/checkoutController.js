const Cart = require('../models/Cart');
const Order = require('../models/Order');

// Procesar checkout (simulación de pago)
const procesarCheckout = async (req, res) => {
    try {
        const usuarioId = req.user._id;

        // Obtener carrito del usuario
        const carrito = await Cart.findOne({ usuario: usuarioId })
            .populate('productos.producto');

        if (!carrito || carrito.productos.length === 0) {
            return res.status(400).json({
                error: 'El carrito está vacío. No se puede procesar el pago.'
            });
        }

        // Preparar datos de la orden
        const productosOrden = carrito.productos.map(item => ({
            producto: item.producto._id,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio
        }));

        const total = carrito.total;

        // Crear orden
        const nuevaOrden = new Order({
            usuario: usuarioId,
            productos: productosOrden,
            total,
            estado: 'completado'
        });

        await nuevaOrden.save();

        // Vaciar carrito después de la compra
        carrito.productos = [];
        await carrito.save();

        // Poblar la orden con los detalles de productos
        await nuevaOrden.populate('productos.producto');
        await nuevaOrden.populate('usuario', 'nombre email');

        res.status(201).json({
            mensaje: '¡Pago procesado exitosamente! Gracias por su compra.',
            orden: nuevaOrden,
            resumen: {
                ordenId: nuevaOrden._id,
                total: nuevaOrden.total,
                cantidadProductos: nuevaOrden.productos.length,
                fecha: nuevaOrden.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al procesar el checkout',
            detalle: error.message
        });
    }
};

// Obtener historial de órdenes del usuario
const obtenerHistorialOrdenes = async (req, res) => {
    try {
        const usuarioId = req.user._id;

        const ordenes = await Order.find({ usuario: usuarioId })
            .populate('productos.producto')
            .sort({ createdAt: -1 });

        res.json({
            total: ordenes.length,
            ordenes
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener historial de órdenes',
            detalle: error.message
        });
    }
};

// Obtener orden por ID
const obtenerOrdenPorId = async (req, res) => {
    try {
        const { ordenId } = req.params;
        const usuarioId = req.user._id;

        const orden = await Order.findOne({
            _id: ordenId,
            usuario: usuarioId
        })
            .populate('productos.producto')
            .populate('usuario', 'nombre email');

        if (!orden) {
            return res.status(404).json({
                error: 'Orden no encontrada'
            });
        }

        res.json({ orden });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener orden',
            detalle: error.message
        });
    }
};

module.exports = {
    procesarCheckout,
    obtenerHistorialOrdenes,
    obtenerOrdenPorId
};
