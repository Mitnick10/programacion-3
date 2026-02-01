// Test script para verificar la API
// Ejecutar después de iniciar el servidor con: node test_api.js

const API_URL = 'http://localhost:3000/api';

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

async function testAPI() {
    console.log('\n' + '='.repeat(50));
    console.log('🧪 INICIANDO TESTS DE LA API');
    console.log('='.repeat(50) + '\n');

    // Test 1: Verificar que el servidor está corriendo
    console.log(`${colors.blue}TEST 1: Verificar servidor${colors.reset}`);
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        console.log(`${colors.green}✅ Servidor funcionando:${colors.reset}`, data.message);
    } catch (error) {
        console.log(`${colors.red}❌ Error: El servidor no está corriendo${colors.reset}`);
        console.log(`${colors.yellow}   Ejecuta: npm start${colors.reset}\n`);
        return;
    }

    // Test 2: Registrar un usuario de prueba
    console.log(`\n${colors.blue}TEST 2: Registrar usuario de prueba${colors.reset}`);
    const testUser = {
        nombre: 'Usuario Test',
        email: `test${Date.now()}@example.com`,
        password: 'test123456'
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const data = await response.json();

        if (response.ok) {
            console.log(`${colors.green}✅ Usuario creado:${colors.reset}`);
            console.log(`   Nombre: ${data.user.nombre}`);
            console.log(`   Email: ${data.user.email}`);
            console.log(`   Role: ${data.user.role}`);
        } else {
            console.log(`${colors.red}❌ Error:${colors.reset}`, data.error);
        }
    } catch (error) {
        console.log(`${colors.red}❌ Error en registro:${colors.reset}`, error.message);
    }

    // Test 3: Login con usuario de prueba
    console.log(`\n${colors.blue}TEST 3: Login con usuario de prueba${colors.reset}`);
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const data = await response.json();

        if (response.ok) {
            console.log(`${colors.green}✅ Login exitoso:${colors.reset}`);
            console.log(`   Usuario: ${data.user.nombre}`);
            console.log(`   Role: ${data.user.role}`);
        } else {
            console.log(`${colors.red}❌ Error:${colors.reset}`, data.error);
        }
    } catch (error) {
        console.log(`${colors.red}❌ Error en login:${colors.reset}`, error.message);
    }

    // Test 4: Login con admin
    console.log(`\n${colors.blue}TEST 4: Login con usuario admin${colors.reset}`);
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@futbolstore.com',
                password: 'admin123'
            })
        });
        const data = await response.json();

        if (response.ok) {
            console.log(`${colors.green}✅ Admin login exitoso:${colors.reset}`);
            console.log(`   Usuario: ${data.user.nombre}`);
            console.log(`   Role: ${data.user.role}`);
            console.log(`   ${colors.yellow}→ Debería redirigir a: admin.html${colors.reset}`);
        } else {
            console.log(`${colors.red}❌ Error:${colors.reset}`, data.error);
        }
    } catch (error) {
        console.log(`${colors.red}❌ Error en admin login:${colors.reset}`, error.message);
    }

    // Test 5: Listar usuarios
    console.log(`\n${colors.blue}TEST 5: Listar usuarios (debug)${colors.reset}`);
    try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        console.log(`${colors.green}✅ Usuarios en la base de datos:${colors.reset}`, data.users.length);
        data.users.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.nombre} (${user.email}) - Role: ${user.role}`);
        });
    } catch (error) {
        console.log(`${colors.red}❌ Error al listar usuarios:${colors.reset}`, error.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ TESTS COMPLETADOS');
    console.log('='.repeat(50) + '\n');
}

// Ejecutar tests
testAPI();
