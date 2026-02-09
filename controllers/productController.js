const Product = require('../models/Product');

// Crear producto (solo admin)
const crearProducto = async (req, res) => {
    try {
        const { nombre, codigo, precio, descripcion, categoria } = req.body;

        // Validar campos obligatorios
        if (!nombre || !codigo || !precio || !descripcion || !categoria) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        // Validar precio
        if (precio <= 0) {
            return res.status(400).json({
                error: 'El precio debe ser mayor a 0'
            });
        }

        // Verificar si el código ya existe
        const productoExistente = await Product.findOne({ codigo: codigo.toUpperCase() });
        if (productoExistente) {
            return res.status(400).json({
                error: 'El código de producto ya está en uso'
            });
        }

        const nuevoProducto = new Product({
            nombre,
            codigo: codigo.toUpperCase(),
            precio,
            descripcion,
            categoria
        });

        await nuevoProducto.save();

        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear producto',
            detalle: error.message
        });
    }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const { categoria } = req.query;
        const filtro = categoria ? { categoria } : {};

        const productos = await Product.find(filtro);

        res.json({
            total: productos.length,
            productos
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener productos',
            detalle: error.message
        });
    }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json({ producto });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener producto',
            detalle: error.message
        });
    }
};

// Actualizar producto (solo admin)
const actualizarProducto = async (req, res) => {
    try {
        const { nombre, codigo, precio, descripcion, categoria } = req.body;

        // Validar precio si se proporciona
        if (precio !== undefined && precio <= 0) {
            return res.status(400).json({
                error: 'El precio debe ser mayor a 0'
            });
        }

        // Si se actualiza el código, verificar que no exista
        if (codigo) {
            const productoExistente = await Product.findOne({
                codigo: codigo.toUpperCase(),
                _id: { $ne: req.params.id }
            });

            if (productoExistente) {
                return res.status(400).json({
                    error: 'El código de producto ya está en uso'
                });
            }
        }

        const datosActualizados = {
            ...(nombre && { nombre }),
            ...(codigo && { codigo: codigo.toUpperCase() }),
            ...(precio && { precio }),
            ...(descripcion && { descripcion }),
            ...(categoria && { categoria })
        };

        const producto = await Product.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { new: true, runValidators: true }
        );

        if (!producto) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto actualizado exitosamente',
            producto
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar producto',
            detalle: error.message
        });
    }
};

// Eliminar producto (solo admin)
const eliminarProducto = async (req, res) => {
    try {
        const producto = await Product.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto eliminado exitosamente',
            producto
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar producto',
            detalle: error.message
        });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
