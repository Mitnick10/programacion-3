const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    codigo: {
        type: String,
        required: [true, 'El código del producto es obligatorio'],
        unique: true,
        trim: true,
        uppercase: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0.01, 'El precio debe ser mayor a 0']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Futbol', 'Running', 'Gym', 'Basketball', 'Tennis', 'Natacion', 'Ciclismo', 'Otros'],
        default: 'Otros'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
