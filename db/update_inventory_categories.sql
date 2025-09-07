-- Script para actualizar la tabla de inventario con categorías de productos

USE itech_support;

-- Agregar campo de categoría a la tabla inventario
ALTER TABLE `inventario` 
ADD COLUMN `categoria` ENUM('servicio', 'venta', 'ambos') DEFAULT 'ambos' 
AFTER `garantia`;

-- Agregar índice para mejor rendimiento
ALTER TABLE `inventario` 
ADD INDEX `idx_categoria` (`categoria`);

-- Comentarios sobre las categorías:
-- 'servicio': Productos utilizados únicamente para reparaciones y servicios
-- 'venta': Productos destinados únicamente para venta directa al cliente
-- 'ambos': Productos que pueden ser utilizados tanto para servicios como para venta

SELECT 'Tabla inventario actualizada con categorías exitosamente' as resultado;