// Script de prueba para verificar la API de productos
const API_URL = '/api';

async function testAPI() {
    console.log('🔍 Probando endpoint de productos...\n');

    try {
        const response = await fetch(`${API_URL}/productos`);
        console.log('Status:', response.status);
        console.log('OK:', response.ok);

        const data = await response.json();
        console.log('\n📦 Respuesta completa:');
        console.log(JSON.stringify(data, null, 2));

        console.log('\n📊 Análisis:');
        console.log('- Tipo de data:', typeof data);
        console.log('- Es array?:', Array.isArray(data));
        console.log('- Tiene propiedad "productos"?:', 'productos' in data);

        if (data.productos) {
            console.log('- Número de productos:', data.productos.length);
            if (data.productos.length > 0) {
                console.log('\n✅ Primer producto:');
                console.log(JSON.stringify(data.productos[0], null, 2));
            }
        } else {
            console.log('⚠️ No se encontró la propiedad "productos"');
            console.log('Propiedades disponibles:', Object.keys(data));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Ejecutar solo en el navegador
if (typeof window !== 'undefined') {
    testAPI();
} else {
    console.log('Este script debe ejecutarse en la consola del navegador');
}
