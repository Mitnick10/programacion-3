# 🏃‍♂️ API REST - Tienda de Productos Deportivos

API completa para una tienda de productos deportivos (ropa, calzado, accesorios) construida con Node.js, Express y MongoDB.

## 📋 Características

- ✅ Autenticación de usuarios con JWT
- ✅ Roles de usuario (admin/usuario)
- ✅ CRUD de productos deportivos (solo administradores)
- ✅ Carrito de compras con cálculo automático de total
- ✅ Sistema de checkout con simulación de pagos
- ✅ Historial de órdenes
- ✅ Validaciones de datos (precio > 0, código único)
- ✅ Seguridad con bcryptjs
- ✅ CORS habilitado

## 🗂️ Estructura del Proyecto

```
tienda-deportes-api/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   ├── authController.js    # Registro y login
│   ├── productController.js # CRUD de productos
│   ├── cartController.js    # Gestión del carrito
│   └── checkoutController.js # Procesamiento de pagos
├── middlewares/
│   └── auth.js              # Verificación JWT y admin
├── models/
│   ├── User.js              # Modelo de usuario
│   ├── Product.js           # Modelo de producto
│   ├── Cart.js              # Modelo de carrito
│   └── Order.js             # Modelo de orden
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   ├── productRoutes.js     # Rutas de productos
│   ├── cartRoutes.js        # Rutas del carrito
│   └── checkoutRoutes.js    # Rutas de checkout
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── server.js                # Punto de entrada
└── README.md
```

## 🚀 Instalación Local

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd tienda-deportes-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tienda_deportes?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_super_segura_cambia_esto
PORT=3000
```

4. **Iniciar el servidor**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## ☁️ Despliegue en Render

### Pasos para Desplegar:

1. **Crear cuenta en Render**
   - Ve a [render.com](https://render.com) y crea una cuenta

2. **Crear nuevo Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub/GitLab

3. **Configurar el servicio**
   - **Name**: `tienda-deportes-api` (o el nombre que prefieras)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (o el que prefieras)

4. **Configurar Variables de Entorno**

En el Dashboard de Render, ve a "Environment" y agrega las siguientes variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `MONGO_URI` | `mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/tienda_deportes?retryWrites=true&w=majority` | URL de conexión a MongoDB Atlas |
| `JWT_SECRET` | `tu_clave_secreta_muy_larga_y_segura_12345` | Clave para firmar tokens JWT (cámbiala por algo seguro) |
| `NODE_ENV` | `production` | Entorno de ejecución |

5. **Deploy**
   - Click en "Create Web Service"
   - Render automáticamente instalará las dependencias y desplegará tu API

### Obtener MongoDB URI (MongoDB Atlas):

1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster (Free Tier)
4. En "Database Access", crea un usuario con contraseña
5. En "Network Access", agrega `0.0.0.0/0` (permitir todas las IPs)
6. Click en "Connect" → "Connect your application"
7. Copia la URI y reemplaza `<password>` con tu contraseña

## 📡 Endpoints de la API

### Autenticación

#### Registro
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "123456",
  "nivel": "usuario"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "nivel": "usuario"
  }
}
```

### Productos

#### Crear producto (solo admin)
```http
POST /api/productos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Balón de Fútbol Nike",
  "codigo": "NIKE-BAL-001",
  "precio": 89.99,
  "descripcion": "Balón oficial de fútbol profesional",
  "categoria": "Futbol"
}
```

#### Obtener todos los productos
```http
GET /api/productos
```

#### Obtener producto por ID
```http
GET /api/productos/:id
```

#### Actualizar producto (solo admin)
```http
PUT /api/productos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "precio": 79.99
}
```

#### Eliminar producto (solo admin)
```http
DELETE /api/productos/:id
Authorization: Bearer <token>
```

### Carrito

#### Obtener carrito
```http
GET /api/carrito
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "productos": [
    {
      "producto": {
        "_id": "65f...",
        "nombre": "Balón de Fútbol Nike",
        "precio": 89.99
      },
      "cantidad": 2
    }
  ],
  "total": 179.98
}
```

#### Agregar producto al carrito
```http
POST /api/carrito/agregar
Authorization: Bearer <token>
Content-Type: application/json

{
  "productoId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "cantidad": 2
}
```

#### Eliminar producto del carrito
```http
DELETE /api/carrito/producto/:productoId
Authorization: Bearer <token>
```

#### Vaciar carrito
```http
DELETE /api/carrito/vaciar
Authorization: Bearer <token>
```

### Checkout

#### Procesar pago
```http
POST /api/checkout
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "mensaje": "¡Pago procesado exitosamente! Gracias por su compra.",
  "orden": {
    "_id": "65f...",
    "usuario": "65f...",
    "productos": [...],
    "total": 179.98,
    "estado": "completado"
  },
  "resumen": {
    "ordenId": "65f...",
    "total": 179.98,
    "cantidadProductos": 2,
    "fecha": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Obtener historial de órdenes
```http
GET /api/checkout/ordenes
Authorization: Bearer <token>
```

#### Obtener orden por ID
```http
GET /api/checkout/ordenes/:ordenId
Authorization: Bearer <token>
```

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:

```http
Authorization: Bearer <tu_token_jwt>
```

## 🛡️ Niveles de Usuario

- **usuario**: Puede ver productos, agregar al carrito y realizar compras
- **admin**: Puede crear, actualizar y eliminar productos (además de todas las funciones de usuario)

## 📦 Categorías de Productos

- Futbol
- Running
- Gym
- Basketball
- Tennis
- Natacion
- Ciclismo
- Otros

## ✅ Validaciones Implementadas

- ✅ Precio debe ser mayor a 0
- ✅ Código de producto debe ser único
- ✅ Email debe ser único
- ✅ Contraseña mínimo 6 caracteres
- ✅ Campos obligatorios validados
- ✅ Token JWT válido para rutas protegidas
- ✅ Verificación de rol admin para operaciones CRUD de productos

## 🧪 Ejemplo de Uso Completo

```javascript
// 1. Registrar usuario
const registro = await fetch('https://tu-api.onrender.com/api/auth/registro', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'María García',
    email: 'maria@ejemplo.com',
    password: '123456'
  })
});

// 2. Login
const login = await fetch('https://tu-api.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'maria@ejemplo.com',
    password: '123456'
  })
});

const { token } = await login.json();

// 3. Ver productos
const productos = await fetch('https://tu-api.onrender.com/api/productos');

// 4. Agregar al carrito
await fetch('https://tu-api.onrender.com/api/carrito/agregar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productoId: '65f1a2b...',
    cantidad: 1
  })
});

// 5. Ver carrito
const carrito = await fetch('https://tu-api.onrender.com/api/carrito', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 6. Procesar pago
const checkout = await fetch('https://tu-api.onrender.com/api/checkout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **dotenv** - Gestión de variables de entorno
- **cors** - Habilitación de CORS

## 📝 Notas Importantes

- El carrito calcula automáticamente el total usando Mongoose virtuals
- Los productos solo pueden ser creados por administradores
- El checkout simula el pago y crea un registro en Orders
- El carrito se vacía automáticamente después de un checkout exitoso
- Los códigos de producto se convierten automáticamente a mayúsculas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📄 Licencia

ISC

---

**Desarrollado para evaluaciones académicas 2, 3, 4 y 5** 🎓
