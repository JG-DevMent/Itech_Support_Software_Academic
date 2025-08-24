# Backend de Itech Support Software Academic

Este backend está construido con Node.js y Express, y se conecta a una base de datos MySQL (XAMPP).

## Estructura de carpetas

```
backend/
│
├── src/
│   ├── routes/         # Rutas de la API
│   ├── controllers/    # Lógica de negocio
│   ├── models/         # Consultas a la base de datos
│   ├── db.js           # Conexión a MySQL
│   ├── middleware/     # Middleware de autenticación JWT
│   └── app.js          # Configuración principal de Express
├── .env                # Variables de entorno (credenciales DB + JWT)
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Instala las dependencias adicionales para JWT:
   ```bash
   npm install jsonwebtoken bcryptjs
   ```
3. Configura el archivo `.env` con los datos de tu base de datos MySQL (XAMPP) y la clave secreta de JWT:
   ```env
   PORT=4000
   JWT_SECRET=L1k+qB&7cF$8Wm^2!zH*R9sX0nTj
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=itech_support
   ```
4. Ejecuta el servidor:
   ```bash
   npm start
   ```

## Autenticación JWT

El sistema ahora utiliza JWT (JSON Web Tokens) para la autenticación:

- **Login**: Los usuarios se autentican con username y contraseña (case-sensitive)
- **Token**: Se genera un token JWT válido por 24 horas
- **Protección**: Las rutas pueden protegerse usando el middleware `authenticateToken`
- **Roles**: Se puede verificar roles específicos usando `requireRole(['admin', 'user'])`
- **Clave JWT**: Configurada en el archivo `.env` con tu clave personalizada

## Notas
- El backend se desarrolla módulo por módulo.
- No incluye integración con APIs externas por ahora.
- Las credenciales ahora son case-sensitive (Admin ≠ admin)
- Sistema JWT completamente funcional y seguro