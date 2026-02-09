const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
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
            min: 1,
            default: 1
        }
    }]
}, {
    timestamps: true
});

// Método virtual para calcular el total
cartSchema.virtual('total').get(function () {
    return this.productos.reduce((total, item) => {
        if (item.producto && item.producto.precio) {
            return total + (item.producto.precio * item.cantidad);
        }
        return total;
    }, 0);
});

// Asegurar que los virtuals se incluyan en JSON
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
