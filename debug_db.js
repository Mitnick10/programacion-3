const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'src/database/futbolstore.db');
console.log(`Checking DB at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening DB:', err.message);
        return;
    }

    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            console.error('Error querying products:', err.message);
        } else {
            console.log(`Found ${rows.length} products.`);
            rows.forEach(r => console.log(`- ${r.nombre} (ID: ${r.id})`));
        }
    });

    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) console.error(err);
        else console.log(`Found ${rows.length} categories.`);
    });
});
