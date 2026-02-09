const fetch = require('node-fetch');
// const FormData = require('form-data'); // Would be needed for file upload, but let's test without file first as it's optional in DB schema

async function testCreateProduct() {
    try {
        console.log('Testing create product...');
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Producto Test Render',
                precio: 199.99,
                categoria_id: 1,
                marca_id: 1,
                // No sending image file here implies req.file is undefined, logic handles it: const imagen_url = req.file ? ... : null;
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.ok) {
            // Verify it exists in list
            const listRes = await fetch('http://localhost:3000/api/products');
            const products = await listRes.json();
            const created = products.find(p => p.id === data.id);
            if (created) {
                console.log('✅ Product successfully retrieved from list:', created);
            } else {
                console.error('❌ Product created but NOT found in list!');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testCreateProduct();
