const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precioUnitario: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ['pendiente', 'procesando', 'completado', 'cancelado'],
        default: 'completado'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
