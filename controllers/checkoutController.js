const Product = require('../models/Product');
const Order = require('../models/Order');

// Procesar checkout (crear orden)
const procesarCheckout = async (req, res) => {
    try {
        const usuarioId = req.user._id;
        const { productos } = req.body; // Array de { producto: ID, cantidad: N }

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: 'Lista de productos inválida o vacía.' });
        }

        // 1. Obtener IDs únicos para consulta optimizada (evita N+1 queries)
        const productIds = productos.map(p => p.producto);
        const productosDb = await Product.find({ _id: { $in: productIds } });

        if (productosDb.length !== productIds.length) {
            return res.status(404).json({ error: 'Uno o más productos no fueron encontrados.' });
        }

        // 2. Mapear productos para acceso rápido
        // Util un Map para búsqueda O(1)
        const productosMap = new Map(productosDb.map(p => [p._id.toString(), p]));

        // 3. Calcular totales y construir array de orden
        let total = 0;
        const productosOrden = productos.map(item => {
            const producto = productosMap.get(item.producto);
            const cantidad = item.cantidad || 1;
            const precioUnitario = producto.precio;

            total += precioUnitario * cantidad;

            return {
                producto: producto._id,
                cantidad,
                precioUnitario
            };
        });

        // 4. Crear y guardar orden
        const nuevaOrden = new Order({
            usuario: usuarioId,
            productos: productosOrden,
            total,
            estado: 'completado' // Simulación directa
        });

        await nuevaOrden.save();

        // 5. Poblar datos para respuesta
        // populate es eficiente aquí porque es un solo documento
        await nuevaOrden.populate([
            { path: 'productos.producto', select: 'nombre codigo imagen_url' },
            { path: 'usuario', select: 'nombre email' }
        ]);

        res.status(201).json({
            mensaje: 'Compra realizada con éxito.',
            orden: nuevaOrden
        });

    } catch (error) {
        console.error("Error en checkout:", error);
        res.status(500).json({
            error: 'Error interno al procesar la compra.',
            detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener historial de órdenes del usuario
const obtenerHistorialOrdenes = async (req, res) => {
    try {
        const ordenes = await Order.find({ usuario: req.user._id })
            .populate('productos.producto', 'nombre precio imagen_url')
            .sort({ createdAt: -1 })
            .lean(); // .lean() para mejor rendimiento si solo es lectura

        res.json({ total: ordenes.length, ordenes });
    } catch (error) {
        console.error("Error obteniendo historial:", error);
        res.status(500).json({ error: 'Error al obtener el historial.' });
    }
};

// Obtener orden por ID
const obtenerOrdenPorId = async (req, res) => {
    try {
        const { ordenId } = req.params;
        const orden = await Order.findOne({ _id: ordenId, usuario: req.user._id })
            .populate('productos.producto')
            .populate('usuario', 'nombre email')
            .lean();

        if (!orden) return res.status(404).json({ error: 'Orden no encontrada.' });

        res.json({ orden });
    } catch (error) {
        console.error("Error obteniendo orden:", error);
        res.status(500).json({ error: 'Error al obtener la orden.' });
    }
};

// --- ADMIN METHODS ---

// Obtener todas las órdenes
const obtenerTodasLasOrdenes = async (req, res) => {
    try {
        const ordenes = await Order.find()
            .populate('usuario', 'nombre email')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ ordenes });
    } catch (error) {
        console.error("Error admin ordenes:", error);
        res.status(500).json({ error: 'Error al obtener las órdenes.' });
    }
};

// Actualizar estado de orden
const actualizarEstadoOrden = async (req, res) => {
    try {
        const { ordenId } = req.params;
        const { estado } = req.body;

        const orden = await Order.findByIdAndUpdate(
            ordenId,
            { estado },
            { new: true, runValidators: true }
        );

        if (!orden) return res.status(404).json({ error: 'Orden no encontrada.' });

        res.json({ mensaje: 'Estado actualizado.', orden });
    } catch (error) {
        console.error("Error actualizando estado:", error);
        res.status(500).json({ error: 'Error al actualizar el estado.' });
    }
};

module.exports = {
    procesarCheckout,
    obtenerHistorialOrdenes,
    obtenerOrdenPorId,
    obtenerTodasLasOrdenes,
    actualizarEstadoOrden
};
