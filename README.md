# Itech Support Software Academic

Sistema de gestión para taller de mantenimiento y reparación de equipos tecnológicos.

## Características principales

### Gestión de Reparaciones
- Registro de reparaciones con datos completos del cliente y dispositivo
- Seguimiento de estado de reparaciones
- Notificaciones a clientes por email o SMS
- Exportación de datos a Excel

### Integración con Inventario
- Selección de materiales/refacciones del inventario durante una reparación
- Descuento automático del inventario al usar materiales
- Cálculo automático del costo de materiales
- Visualización de productos seleccionados en tabla detallada
- Exportación de detalles de materiales utilizados

### Clientes
- Registro de datos personales de clientes
- Histórico de reparaciones por cliente
- Búsqueda rápida por cédula

### Inventario
- Control de existencias
- Gestión de productos, precios y costos

### Sistema de Roles y Permisos 
El sistema implementa tres roles diferentes, cada uno con permisos específicos:

#### Administrador
- Acceso completo a todas las funcionalidades del sistema
- Gestión completa de usuarios
- Configuración del sistema
- Administración de inventario
- Gestión completa de reparaciones, clientes, ventas e informes
- Acceso a pago y facturación

#### Técnico
- Enfocado en operaciones de reparación y diagnóstico
- Acceso completo a gestión de reparaciones
- Acceso completo a verificación de equipos
- Acceso completo a inventario
- Acceso de solo lectura a clientes (puede buscar pero no modificar)
- Sin acceso a ventas e informes
- Sin acceso a pago y facturación
- Sin acceso a configuración
- Restricciones en la interfaz de usuario (ej. no puede ver el botón de "Nueva Reparación" en la página de inicio)

#### Vendedor
- Enfocado en atención al cliente y ventas
- Acceso completo a clientes
- Acceso completo a ventas e informes
- Acceso completo a pago y facturación
- Acceso completo a inventario
- Acceso a verificación de equipos
- Sin acceso a gestión de reparaciones
- Sin acceso a configuración
- Restricciones en la interfaz de usuario (ej. no puede ver el botón de "Nueva Reparación" en la página de inicio)

### Seguridad
- Autenticación mediante usuario y contraseña
- Redirección a login si no hay sesión activa
- Validación de permisos en todas las páginas
- Restricciones de interfaz según el rol del usuario

### Implementación del Sistema de Roles
#### Frontend (JavaScript)
- **Archivo principal**: `react-modulos/react-app/public/js/custom.js`
- **Función clave**: `checkRoleAccess(user)` - Verifica permisos de acceso a páginas
- **Compatibilidad**: Funciona con campos `rol` (backend) y `role` (frontend)
- **Restricciones por página**:
  - **Técnico**: Sin acceso a configuración, ventas, facturación
  - **Vendedor**: Sin acceso a gestión de reparaciones, configuración
  - **Administrador**: Acceso completo a todas las páginas

#### Backend (Node.js/Express)
- **Middleware**: `backend/src/middleware/auth.js` - Autenticación JWT
- **Controlador**: `backend/src/controllers/usuariosController.js` - Login con rol
- **Base de datos**: Campo `rol` en tabla usuarios

#### Páginas Restringidas por Rol
- **Técnico**: `configuracion.html`, `config_perfil.html`, `config_tienda.html`, `ventas-informes.html`, `pago-facturacion.html`
- **Vendedor**: `configuracion.html`, `config_perfil.html`, `config_tienda.html`, `gestion-reparacion.html`
- **Administrador**: Sin restricciones

#### Funcionalidades de Solo Lectura
- **Técnico en clientes**: Puede buscar pero no crear/editar/eliminar clientes

## Tecnologías utilizadas
- HTML5
- CSS3 (Bootstrap SB Admin 2)
- JavaScript
- Exportación a Excel (XLSX.js)

## Estructura del Proyecto
- `frontend/`: Contiene todos los archivos relacionados al frontend (HTML, JS, CSS, imágenes, vendor, etc).
- `backend/`: Código fuente del backend (Node.js, Express).
- `db/`: Archivos de base de datos y scripts SQL.