const db = require('../config/database');

const getAllProducts = (req, res) => {
    const query = `
        SELECT p.*, c.nombre as categoria_nombre, c.icono as categoria_icono, b.nombre as marca_nombre
        FROM products p
        LEFT JOIN categories c ON p.categoria_id = c.id
        LEFT JOIN brands b ON p.marca_id = b.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("❌ Error querying products:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Fetched ${rows.length} products`);
        const products = rows.map(p => ({
            ...p,
            categorias: { nombre: p.categoria_nombre, icono: p.categoria_icono },
            marcas: { nombre: p.marca_nombre }
        }));
        res.json(products);
    });
};

const getCategories = (req, res) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const getBrands = (req, res) => {
    db.all('SELECT * FROM brands', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const createProduct = (req, res) => {
    console.log("📦 createProduct Body:", req.body);
    console.log("📂 createProduct File:", req.file);

    const { nombre, precio, categoria_id, marca_id } = req.body;
    // Fallback support for both urlImagen and imagen_url
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : (req.body.urlImagen || req.body.imagen_url || null);

    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    db.run(
        'INSERT INTO products (nombre, precio, imagen_url, categoria_id, marca_id) VALUES (?, ?, ?, ?, ?)',
        [nombre, precio, imagen_url, categoria_id, marca_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Producto creado' });
        }
    );
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM products WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto eliminado', changes: this.changes });
    });
};

const backupProducts = (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const jsonContent = JSON.stringify(rows, null, 4);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=products.json');
        res.send(jsonContent);
    });
};

module.exports = {
    getAllProducts,
    getCategories,
    getBrands,
    createProduct,
    deleteProduct,
    backupProducts
};
