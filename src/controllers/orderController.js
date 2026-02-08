const db = require('../config/database');

const createOrder = (req, res) => {
    const { userId, items, total } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No hay items en la orden' });
    }

    const date = new Date().toISOString();

    const insertOrder = (finalUserId) => {
        db.run(
            'INSERT INTO orders (user_id, total, fecha) VALUES (?, ?, ?)',
            [finalUserId, total, date],
            function (err) {
                if (err) {
                    console.error('Error al crear orden:', err);
                    return res.status(500).json({ error: 'Error al procesar la orden' });
                }

                const orderId = this.lastID;
                console.log(`🧾 Orden creada ID: ${orderId} - Total: ${total} (User: ${finalUserId || 'Guest'})`);

                const stmt = db.prepare('INSERT INTO order_items (order_id, product_nombre, quantity, price) VALUES (?, ?, ?, ?)');
                items.forEach(item => {
                    const qty = item.quantity || 1;
                    stmt.run(orderId, item.nombre, qty, item.precio);
                });

                stmt.finalize((err) => {
                    if (err) console.error('Error al insertar items:', err);
                    res.status(201).json({
                        success: true,
                        message: 'Orden creada exitosamente',
                        order: { id: orderId, date, total, items }
                    });
                });
            }
        );
    };

    if (userId) {
        db.get('SELECT id FROM users WHERE id = ?', [userId], (err, row) => {
            if (err || !row) {
                console.warn(`⚠️ Usuario ID ${userId} no encontrado. Creando como invitado.`);
                insertOrder(null);
            } else {
                insertOrder(userId);
            }
        });
    } else {
        insertOrder(null);
    }
};

module.exports = { createOrder };
