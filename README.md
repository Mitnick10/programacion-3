# 🏆 Tienda de Deportes - Proyecto Final

Este repositorio contiene el código fuente del Proyecto Final para la asignatura de **Programación 3**. El sistema es una plataforma de e-commerce completa desarrollada con **Node.js, Express y MongoDB**.

## 📌 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Evaluaciones (Entregas)](#evaluaciones-entregas)
  - [Evaluación 2: Autenticación](#evaluación-2-login-básico)
  - [Evaluación 3: Gestión de Productos](#evaluación-3-productos)
  - [Evaluación 4: Carrito y Checkout](#evaluación-4-carrito-simple)
- [Endpoints Principales](#endpoints-principales)

---

## 📖 Descripción

La aplicación permite a los usuarios registrarse, navegar por un catálogo de productos deportivos, agregar ítems a su carrito y realizar compras simuladas. Incluye un panel de administración para gestionar el inventario y visualizar las órdenes.

## 🛠 Tecnologías

- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB (Mongoose ODM)
- **Autenticación:** JWT (JSON Web Tokens), bcryptjs
- **Frontend:** HTML5, Tailwind CSS, JavaScript Vanilla

---

## 🚀 Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/tienda-deportes-api.git
    cd tienda-deportes-api
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno (`.env`):**
    Crea un archivo `.env` en la raíz con lo siguiente:
    ```env
    MONGO_URI=tu_string_de_conexion_mongodb
    JWT_SECRET=tu_clave_secreta
    PORT=3000
    ```

4.  **Iniciar el servidor:**
    ```bash
    npm run dev
    ```

---

## 🎓 Evaluaciones (Entregas)

Este proyecto ha sido desarrollado en etapas progresivas. A continuación se detallan las características implementadas para cada evaluación:

### Evaluación 2: Login Básico 🔐

**Estado:** ✅ Completado | **Tag git:** `v1.0-evaluacion2`

Características implementadas:
- **Registro de Usuarios:** Endpoint `/api/auth/registro`. Validación de email único.
- **Login Seguro:** Endpoint `/api/auth/login`. Emisión de **Token JWT**.
- **Seguridad:** Encriptación de contraseñas utilizando `bcryptjs`.

**Cómo probar:**
1.  Ir a `registro.html` y crear un usuario.
2.  Ir a `login.html` e ingresar con las credenciales.
3.  Verificar en MongoDB que la contraseña esté hasheada.

### Evaluación 3: Productos 👟

**Estado:** ✅ Completado | **Tag git:** `v2.0-evaluacion3`

Características implementadas:
- **CRUD Completo:** Crear, Leer, Actualizar y Eliminar productos.
- **Roles de Usuario:**
    - `admin`: Puede gestionar productos (acceso a `admin.html`).
    - `usuario`: Solo lectura de catálogo.
- **Validaciones:** Precio > 0, Código de producto único.
- **Filtrado:** Búsqueda por categoría (Fútbol, Running, etc.).

**Cómo probar:**
1.  Iniciar sesión como admin.
2.  Ir al Panel Admin y crear un producto nuevo.
3.  Intentar crear un producto con precio negativo (debe dar error).

### Evaluación 4: Carrito Simple 🛒

**Estado:** ✅ Completado | **Tag git:** `v3.0-evaluacion4` (Versión Actual)

Características implementadas:
- **Gestión de Carrito:** Agregar (`POST`), Eliminar (`DELETE`) y Vaciar.
- **Persistencia:** El carrito se guarda en base de datos (`Cart` model).
- **Cálculo de Total:** Suma automática del precio x cantidad.
- **Checkout:** Endpoint `/api/checkout` que genera una Orden y vacía el carrito.
- **Historial:** Visualización de "Mis Compras" en el perfil de usuario.

**Cómo probar:**
1.  Como usuario logueado, agrega productos al carrito.
2.  Verifica que el total se actualice en la navbar.
3.  Realiza la compra y confirma la alerta de éxito.
4.  Revisa la sección "Mis Compras" para ver la orden generada.

---

## 🔗 Endpoints Principales

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Iniciar sesión | Público |
| `GET` | `/api/productos` | Listar productos | Público |
| `POST` | `/api/productos` | Crear producto | **Admin** |
| `GET` | `/api/carrito` | Ver carrito | Usuario |
| `POST` | `/api/checkout` | Finalizar compra | Usuario |

---

**Desarrollado por [Tu Nombre]**
