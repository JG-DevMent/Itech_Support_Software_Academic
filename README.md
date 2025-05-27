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

### Sistema de Roles y Permisos (PENDIENTE)
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

## Tecnologías utilizadas
- HTML5
- CSS3 (Bootstrap SB Admin 2)
- JavaScript
- Exportación a Excel (XLSX.js)

## Estructura del Proyecto

- `frontend/`: Contiene todos los archivos relacionados al frontend (HTML, JS, CSS, imágenes, vendor, etc).
- `backend/`: Código fuente del backend (Node.js, Express).
- `db/`: Archivos de base de datos y scripts SQL.
