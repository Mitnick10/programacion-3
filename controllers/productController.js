const Product = require('../models/Product');

// Crear producto (solo admin)
const crearProducto = async (req, res) => {
    try {
        const { nombre, codigo, precio, descripcion, categoria, imagen_url } = req.body;

        // Validaciones básicas
        if (!nombre || !codigo || !precio || !descripcion || !categoria) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        if (precio <= 0) {
            return res.status(400).json({ error: 'El precio debe ser mayor a 0.' });
        }

        // Verificar duplicidad de código (case-insensitive)
        const codigoUpper = codigo.toUpperCase();
        const productoExistente = await Product.findOne({ codigo: codigoUpper });

        if (productoExistente) {
            return res.status(400).json({ error: 'El código de producto ya está en uso.' });
        }

        const nuevoProducto = new Product({
            nombre,
            codigo: codigoUpper,
            precio,
            descripcion,
            categoria,
            imagen_url
        });

        await nuevoProducto.save();

        res.status(201).json({
            mensaje: 'Producto creado exitosamente.',
            producto: nuevoProducto
        });
    } catch (error) {
        console.error("Error creando producto:", error);
        res.status(500).json({ error: 'Error interno al crear el producto.' });
    }
};

// Obtener todos los productos con filtrado opcional
const obtenerProductos = async (req, res) => {
    try {
        const { categoria } = req.query;
        // Construir query object dinámicamente
        const filtro = categoria ? { categoria } : {};

        const productos = await Product.find(filtro).lean(); // .lean() para optimización de lectura

        res.json({
            total: productos.length,
            productos
        });
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id).lean();

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json({ producto });
    } catch (error) {
        console.error("Error obteniendo producto:", error);
        res.status(500).json({ error: 'Error intero al obtener detalle del producto.' });
    }
};

// Actualizar producto (solo admin)
const actualizarProducto = async (req, res) => {
    try {
        const { nombre, codigo, precio, descripcion, categoria } = req.body;

        // Validaciones condicionales
        if (precio !== undefined && precio <= 0) {
            return res.status(400).json({ error: 'El precio debe ser mayor a 0.' });
        }

        // Verificar código único si se está actualizando
        if (codigo) {
            const codigoUpper = codigo.toUpperCase();
            const duplicado = await Product.findOne({
                codigo: codigoUpper,
                _id: { $ne: req.params.id }
            });

            if (duplicado) {
                return res.status(400).json({ error: 'El código de producto ya está en uso.' });
            }
        }

        // Construir objeto de actualización solo con campos definidos
        // DRY: Mongoose maneja esto bien, pero ser explícito ayuda a la seguridad
        const datosActualizados = {};
        if (nombre) datosActualizados.nombre = nombre;
        if (codigo) datosActualizados.codigo = codigo.toUpperCase();
        if (precio) datosActualizados.precio = precio;
        if (descripcion) datosActualizados.descripcion = descripcion;
        if (categoria) datosActualizados.categoria = categoria;

        const producto = await Product.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { new: true, runValidators: true }
        );

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json({
            mensaje: 'Producto actualizado exitosamente.',
            producto
        });
    } catch (error) {
        console.error("Error actualizando producto:", error);
        res.status(500).json({ error: 'Error al actualizar producto.' });
    }
};

// Eliminar producto (solo admin)
const eliminarProducto = async (req, res) => {
    try {
        const producto = await Product.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json({
            mensaje: 'Producto eliminado exitosamente.',
            producto
        });
    } catch (error) {
        console.error("Error eliminando producto:", error);
        res.status(500).json({ error: 'Error al eliminar producto.' });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
