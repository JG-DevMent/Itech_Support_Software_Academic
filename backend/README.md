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
├── .env                # Variables de entorno (credenciales DB, JWT y GMAIL)
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Instala las dependencias adicionales para JWT y GMAIL(nodemailer):
   ```bash
   npm install jsonwebtoken bcryptjs
   npm install nodemailer

   ```
3. Configura el archivo `.env` con los datos de tu base de datos MySQL (XAMPP), clave secreta de JWT y credenciales de correo para SMTP:
   ```env
   PORT=4000
   JWT_SECRET=L1k+qB&7cF$8Wm^2!zH*R9sX0nTj
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=itech_support
   EMAIL_USER=jgrc20042507@gmail.com
   EMAIL_PASS=volu mylq dnbs nzal
   ```
4. Ejecuta el servidor:
   ```bash
   npm start
   ```

## Autenticación JWT

El sistema ahora utiliza JWT (JSON Web Tokens) para la autenticación:

- **Login**: Los usuarios se autentican con username y contraseña (case-sensitive)
- **Token**: Se genera un token JWT válido por 2 horas
- **Protección**: Las rutas pueden protegerse usando el middleware `authenticateToken`
- **Roles**: Se puede verificar roles específicos usando `requireRole(['admin', 'user'])` esto se tiene pendiente
- **Clave JWT**: Configurada en el archivo `.env` con tu clave personalizada

## Notas
- El backend se desarrolla módulo por módulo.
- No incluye integración con APIs externas por ahora.
- Las credenciales ahora son case-sensitive (Admin ≠ admin)
- Sistema JWT completamente funcional y seguro
- Cuenta con conexion SMTP para envio de correos de restablecimiento(en prueba)