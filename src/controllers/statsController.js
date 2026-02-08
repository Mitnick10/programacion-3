const db = require('../config/database');

const getDashboardStats = (req, res) => {
    const stats = {};

    db.get('SELECT SUM(total) as revenue, COUNT(*) as orders FROM orders', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        stats.revenue = row.revenue || 0;
        stats.totalOrders = row.orders || 0;
        stats.averageTicket = stats.totalOrders > 0 ? (stats.revenue / stats.totalOrders) : 0;

        db.all('SELECT orders.*, users.nombre as user_name FROM orders LEFT JOIN users ON orders.user_id = users.id ORDER BY fecha DESC LIMIT 5', (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.recentOrders = rows;
            res.json(stats);
        });
    });
};

module.exports = { getDashboardStats };
