# 🏪 FútbolStore - Sistema de Autenticación Local

Sistema de autenticación migrado de Supabase a Backend Local con Node.js, Express y SQLite.

## 📋 Características

- ✅ Registro de usuarios con rol por defecto 'client'
- ✅ Login con validación de credenciales
- ✅ Usuario admin creado automáticamente
- ✅ Redirección basada en roles (admin → admin.html, client → index.html)
- ✅ Hash de contraseñas con bcrypt
- ✅ Base de datos SQLite local

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará:
- `express` - Framework web
- `sqlite3` - Base de datos
- `bcrypt` - Hash de contraseñas
- `cors` - Cross-Origin Resource Sharing
- `nodemon` - Auto-restart en desarrollo (opcional)

### 2. Iniciar el servidor

```bash
npm start
```

O para desarrollo con auto-reload:

```bash
npm run dev
```

El servidor se iniciará en: **http://localhost:3000**

### 3. Usuario Admin

El usuario admin se crea automáticamente al iniciar el servidor por primera vez:

**Credenciales de Admin:**
- 📧 Email: `admin@futbolstore.com`
- 🔑 Password: `admin123`
- 👤 Role: `admin`

Si necesitas recrear el admin manualmente:

```bash
npm run init-admin
```

## 📁 Estructura de Archivos

```
Programacion-3/
├── server.js           # Servidor Express con API
├── crear_admin.js      # Script para crear admin manualmente
├── package.json        # Dependencias del proyecto
├── futbolstore.db      # Base de datos SQLite (se crea automáticamente)
├── login.html          # Página de login (actualizada)
├── registro.html       # Página de registro (actualizada)
├── index.html          # Página principal para clientes
└── admin.html          # Panel de administración
```

## 🔌 Endpoints API

### POST /api/register
Registra un nuevo usuario (siempre con rol 'client').

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "client"
  }
}
```

### POST /api/login
Valida credenciales y retorna el usuario sin la contraseña.

**Request:**
```json
{
  "email": "admin@futbolstore.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@futbolstore.com",
    "role": "admin"
  }
}
```

### GET /api/test
Verifica que el backend está funcionando.

**Response:**
```json
{
  "message": "Backend funcionando correctamente ✅"
}
```

### GET /api/users
Lista todos los usuarios (solo para debug).

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@futbolstore.com",
      "role": "admin"
    }
  ]
}
```

## 🗄️ Base de Datos

### Tabla `users`

| Campo    | Tipo    | Descripción                    |
|----------|---------|--------------------------------|
| id       | INTEGER | Primary Key, Auto Increment    |
| nombre   | TEXT    | Nombre completo del usuario    |
| email    | TEXT    | Email único                    |
| password | TEXT    | Contraseña hasheada con bcrypt |
| role     | TEXT    | 'client' o 'admin'             |

## 🔐 Flujo de Autenticación

### Registro:
1. Usuario completa formulario en `registro.html`
2. Frontend envía POST a `/api/register`
3. Backend hashea contraseña y crea usuario con rol 'client'
4. Usuario es redirigido a `login.html`

### Login:
1. Usuario ingresa credenciales en `login.html`
2. Frontend envía POST a `/api/login`
3. Backend valida credenciales con bcrypt
4. Si es válido, retorna usuario sin password
5. Frontend guarda usuario en localStorage
6. **Redirección según rol:**
   - Si `role === 'admin'` → `admin.html`
   - Si `role === 'client'` → `index.html`

## 🛠️ Cambios Realizados

### Backend:
- ✅ Creado `server.js` con Express y SQLite
- ✅ Endpoint `/api/register` que asigna rol 'client' por defecto
- ✅ Endpoint `/api/login` con validación de contraseñas
- ✅ Creación automática de usuario admin al iniciar servidor
- ✅ Script `crear_admin.js` para recrear admin manualmente

### Frontend:
- ✅ Eliminada dependencia de Supabase
- ✅ Implementado `fetch()` para llamadas API
- ✅ Uso de `localStorage` para mantener sesión
- ✅ Redirección basada en rol del usuario
- ✅ Mantenido diseño Tailwind CSS original

## 📝 Uso

### Para Clientes:
1. Ir a `registro.html`
2. Completar formulario
3. Hacer login en `login.html`
4. Serás redirigido a `index.html`

### Para Admin:
1. Ir a `login.html`
2. Usar credenciales de admin
3. Serás redirigido a `admin.html`

## ⚠️ Notas Importantes

- El servidor debe estar corriendo para que funcione la autenticación
- La base de datos se crea automáticamente en `futbolstore.db`
- Las contraseñas se hashean con bcrypt (10 rounds)
- Los datos de sesión se guardan en localStorage del navegador
- CORS está habilitado para desarrollo local

## 🐛 Troubleshooting

### El servidor no inicia
```bash
# Verificar que las dependencias están instaladas
npm install

# Verificar que el puerto 3000 no esté en uso
# Windows:
netstat -ano | findstr :3000
```

### Error de conexión a la API
- Asegúrate de que el servidor esté corriendo en `http://localhost:3000`
- Verifica la consola del navegador para errores de CORS

### No puedo hacer login como admin
```bash
# Recrear usuario admin
npm run init-admin
```

## 📞 Soporte

Si tienes problemas, verifica:
1. ✅ El servidor está corriendo (`npm start`)
2. ✅ No hay errores en la consola del servidor
3. ✅ La consola del navegador no muestra errores
4. ✅ Estás usando las URLs correctas (localhost:3000)

---

**¡Listo! Tu sistema de autenticación local está configurado y funcionando.** 🎉
