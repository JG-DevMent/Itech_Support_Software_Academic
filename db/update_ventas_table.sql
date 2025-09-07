-- Script para actualizar la tabla de ventas para soportar ventas independientes de reparaciones

USE itech_support;

-- Hacer que factura_id sea nullable para ventas independientes
ALTER TABLE `ventas` MODIFY `factura_id` int(11) DEFAULT NULL;

-- Agregar nueva columna producto_id para referencia al inventario
ALTER TABLE `ventas` ADD COLUMN `producto_id` int(11) DEFAULT NULL AFTER `factura_id`;

-- Agregar nuevas columnas para información de ventas independientes
ALTER TABLE `ventas` ADD COLUMN `metodo_pago` varchar(50) DEFAULT 'efectivo' AFTER `subtotal`;
ALTER TABLE `ventas` ADD COLUMN `cliente` varchar(100) DEFAULT 'Cliente general' AFTER `metodo_pago`;
ALTER TABLE `ventas` ADD COLUMN `observaciones` text DEFAULT NULL AFTER `cliente`;

-- Agregar índices para mejorar el rendimiento
ALTER TABLE `ventas` ADD INDEX `idx_producto_id` (`producto_id`);
ALTER TABLE `ventas` ADD INDEX `idx_fecha_registro` (`fecha_registro`);
ALTER TABLE `ventas` ADD INDEX `idx_metodo_pago` (`metodo_pago`);

-- Agregar clave foránea para producto_id (opcional, para mantener integridad referencial)
-- ALTER TABLE `ventas` ADD CONSTRAINT `fk_ventas_inventario` FOREIGN KEY (`producto_id`) REFERENCES `inventario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Comentario explicativo de la estructura
-- Esta tabla ahora soporta:
-- 1. Ventas asociadas a reparaciones (con factura_id)
-- 2. Ventas independientes de productos (con producto_id y sin factura_id)
-- 3. Información adicional como método de pago, cliente y observaciones

SELECT 'Tabla ventas actualizada exitosamente' as resultado;