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
│   └── app.js          # Configuración principal de Express
├── .env                # Variables de entorno (credenciales DB)
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Configura el archivo `.env` con los datos de tu base de datos MySQL (XAMPP).
3. Ejecuta el servidor:
   ```bash
   npm start
   ```

## Notas
- El backend se desarrolla módulo por módulo.
- No incluye integración con APIs externas por ahora.