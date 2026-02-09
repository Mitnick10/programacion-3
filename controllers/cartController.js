const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Agregar producto al carrito
const agregarAlCarrito = async (req, res) => {
    try {
        const { productoId, cantidad } = req.body;
        const usuarioId = req.user._id;

        // Validar campos
        if (!productoId || !cantidad) {
            return res.status(400).json({
                error: 'El ID del producto y la cantidad son obligatorios'
            });
        }

        if (cantidad < 1) {
            return res.status(400).json({
                error: 'La cantidad debe ser al menos 1'
            });
        }

        // Verificar que el producto existe
        const producto = await Product.findById(productoId);
        if (!producto) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        // Buscar o crear carrito del usuario
        let carrito = await Cart.findOne({ usuario: usuarioId });

        if (!carrito) {
            carrito = new Cart({
                usuario: usuarioId,
                productos: []
            });
        }

        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = carrito.productos.find(
            item => item.producto.toString() === productoId
        );

        if (productoEnCarrito) {
            // Incrementar cantidad
            productoEnCarrito.cantidad += cantidad;
        } else {
            // Agregar nuevo producto
            carrito.productos.push({
                producto: productoId,
                cantidad
            });
        }

        await carrito.save();

        // Poblar el carrito con los productos
        await carrito.populate('productos.producto');

        res.json({
            mensaje: 'Producto agregado al carrito exitosamente',
            carrito,
            total: carrito.total
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al agregar producto al carrito',
            detalle: error.message
        });
    }
};

// Obtener carrito del usuario con total calculado
const obtenerCarrito = async (req, res) => {
    try {
        const usuarioId = req.user._id;

        let carrito = await Cart.findOne({ usuario: usuarioId })
            .populate('productos.producto');

        if (!carrito) {
            return res.json({
                mensaje: 'Carrito vacío',
                productos: [],
                total: 0
            });
        }

        res.json({
            productos: carrito.productos,
            total: carrito.total
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener carrito',
            detalle: error.message
        });
    }
};

// Eliminar producto del carrito
const eliminarDelCarrito = async (req, res) => {
    try {
        const { productoId } = req.params;
        const usuarioId = req.user._id;

        const carrito = await Cart.findOne({ usuario: usuarioId });

        if (!carrito) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        // Filtrar productos, eliminando el especificado
        carrito.productos = carrito.productos.filter(
            item => item.producto.toString() !== productoId
        );

        await carrito.save();
        await carrito.populate('productos.producto');

        res.json({
            mensaje: 'Producto eliminado del carrito',
            carrito,
            total: carrito.total
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar producto del carrito',
            detalle: error.message
        });
    }
};

// Vaciar carrito
const vaciarCarrito = async (req, res) => {
    try {
        const usuarioId = req.user._id;

        const carrito = await Cart.findOne({ usuario: usuarioId });

        if (!carrito) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        carrito.productos = [];
        await carrito.save();

        res.json({
            mensaje: 'Carrito vaciado exitosamente',
            productos: [],
            total: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al vaciar carrito',
            detalle: error.message
        });
    }
};

module.exports = {
    agregarAlCarrito,
    obtenerCarrito,
    eliminarDelCarrito,
    vaciarCarrito
};
