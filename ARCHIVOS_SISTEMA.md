# Archivos del Sistema - Deportes Store

## 📁 Estructura del Proyecto

### Archivos Esenciales del Sistema

```
Programacion-3/
├── 📄 server.js                    # Servidor principal
├── 📄 package.json                 # Dependencias
├── 📄 .env                         # Variables de entorno
│
├── 📂 models/                      # Modelos de datos
│   ├── User.js
│   ├── Product.js
│   └── Cart.js
│
├── 📂 routes/                      # Rutas de la API
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── checkoutRoutes.js
│   └── uploadRoutes.js
│
├── 📂 controllers/                 # Lógica de negocio
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── checkoutController.js
│
├── 📂 middlewares/                 # Middleware
│   └── auth.js
│
└── 📂 public/                      # Frontend
    ├── index.html                  # Tienda principal
    ├── admin.html                  # Panel de administración
    ├── login.html                  # Login
    ├── registro.html               # Registro
    └── uploads/                    # Imágenes de productos
```

## 🗑️ Archivos a Eliminar (Scripts de Prueba)

Estos archivos fueron creados solo para diagnóstico y NO son necesarios:

- ❌ checkProducts.js
- ❌ updateProductImage.js
- ❌ fixAllProducts.js
- ❌ fixNK005.js
- ❌ cleanAllPlaceholders.js
- ❌ forceCleanNK004.js
- ❌ updateToNull.js
- ❌ deleteNK004.js
- ❌ testCreateProduct.js
- ❌ createTestProduct2.js
- ❌ fullDiagnostic.js
- ❌ cleanAllBadURLs.js

## ✅ Archivos que Quedarán

Solo los archivos en la estructura de arriba + node_modules/ (generado automáticamente).
