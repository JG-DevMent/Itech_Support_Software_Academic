-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-05-2025 a las 05:10:36
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `itech_support`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `cedula`, `telefono`, `correo`, `direccion`, `fecha_registro`) VALUES
(1, 'Laura Gómez', '1025457896', '3104567821', 'laura.gomez@gmail.com', 'Calle 12 #45-67, Bogotá', '2025-05-11 03:03:59'),
(2, 'Andrés Martínez', '1002345678', '3113344566', 'andres.martinez@hotmail.com', 'Cra 7 #84-12, Medellín', '2025-05-11 03:03:59'),
(3, 'Camila Rodríguez', '1019087765', '3126678899', 'camila.rodriguez@yahoo.com', 'Av. 68 #30-20, Cali', '2025-05-11 03:03:59'),
(4, 'Juan Pablo Torres', '1100453278', '3001239876', 'juan.torres@gmail.com', 'Cl 56A #12-15, Bucaramanga', '2025-05-11 03:03:59'),
(5, 'Natalia Ríos', '1098765432', '3014567890', 'natalia.rios@gmail.com', 'Cra 10 #23-45, Cartagena', '2025-05-11 03:03:59'),
(6, 'Carlos Peña', '1032458890', '3102233445', 'carlos.pena@outlook.com', 'Cl 8 #25-50, Barranquilla', '2025-05-11 03:03:59'),
(7, 'Valentina Ruiz', '1011234567', '3145678920', 'valentina.ruiz@hotmail.com', 'Av. El Poblado #112, Medellín', '2025-05-11 03:03:59'),
(8, 'Santiago Vargas', '1009876543', '3161122334', 'santiago.vargas@gmail.com', 'Cl 20 #35-40, Pereira', '2025-05-11 03:03:59'),
(9, 'Isabella Castro', '1045567890', '3159988776', 'isabella.castro@yahoo.com', 'Cra 50 #100-10, Bogotá', '2025-05-11 03:03:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `config_recibos`
--

CREATE TABLE `config_recibos` (
  `id` int(11) NOT NULL,
  `nombre_empresa` varchar(100) NOT NULL,
  `direccion` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `encabezado` text DEFAULT NULL,
  `footer` text DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `config_tienda`
--

CREATE TABLE `config_tienda` (
  `id` int(11) NOT NULL,
  `nombre_empresa` varchar(100) NOT NULL,
  `direccion` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `impuesto` decimal(5,2) DEFAULT 19.00,
  `encabezado_recibo` text DEFAULT NULL,
  `pie_recibo` text DEFAULT NULL,
  `terminos_condiciones` text DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id` int(11) NOT NULL,
  `numero_factura` varchar(20) NOT NULL,
  `cliente` varchar(20) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `email_cliente` varchar(100) DEFAULT NULL,
  `telefono_cliente` varchar(20) DEFAULT NULL,
  `reparacion_id` int(11) DEFAULT NULL,
  `fecha_emision` date NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuesto` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `estado` enum('Pendiente','Pagada','Anulada') NOT NULL DEFAULT 'Pendiente',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_busquedas`
--

CREATE TABLE `historial_busquedas` (
  `id` int(11) NOT NULL,
  `tipo` enum('cliente','producto','reparacion','factura') NOT NULL,
  `item_id` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `imei` varchar(50) DEFAULT NULL,
  `garantia` varchar(100) DEFAULT NULL,
  `existencias` int(11) NOT NULL DEFAULT 0,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `nombre`, `precio`, `costo`, `sku`, `imei`, `garantia`, `existencias`, `fecha_registro`, `fecha_actualizacion`) VALUES
(1, 'Vidrio Cerámico Samsung A32', 25000.00, 12000.00, 'VDR-CER-SAM-A32', 'NO TIENE', '1 mes', 20, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(2, 'Vidrio Cerámico Xiaomi Redmi 10', 27000.00, 15000.00, 'VDR-CER-XIA-RD10', 'NO TIENE', '1 mes', 18, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(3, 'Protector Lente Cámara iPhone 13', 35000.00, 22000.00, 'PRT-LNT-IP13', 'NO TIENE', '1 mes', 12, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(4, 'Protector Lente Cámara Samsung S22', 40000.00, 28000.00, 'PRT-LNT-SAM-S22', 'NO TIENE', '1 mes', 10, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(5, 'Protector Lente Huawei P30', 30000.00, 18000.00, 'PRT-LNT-HW-P30', 'NO TIENE', '1 mes', 8, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(6, 'Memoria RAM DDR4 8GB 2666MHz Kingston', 95000.00, 75000.00, 'RAM-DDR4-8GB-KS', 'NO TIENE', '12 meses', 15, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(7, 'Memoria RAM DDR3 4GB 1600MHz', 60000.00, 45000.00, 'RAM-DDR3-4GB', 'NO TIENE', '6 meses', 10, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(8, 'Memoria RAM Laptop DDR4 8GB Crucial', 98000.00, 80000.00, 'RAM-LAP-DDR4-8G', 'NO TIENE', '12 meses', 7, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(9, 'Vidrio Cerámico iPhone 11 Pro Max', 30000.00, 17000.00, 'VDR-CER-IP11PM', 'NO TIENE', '1 mes', 22, '2025-05-11 03:05:36', '2025-05-11 03:05:36'),
(10, 'Vidrio Cerámico Motorola G60', 28000.00, 16000.00, 'VDR-CER-MOT-G60', 'NO TIENE', '1 mes', 14, '2025-05-11 03:05:36', '2025-05-11 03:05:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiales_reparacion`
--

CREATE TABLE `materiales_reparacion` (
  `id` int(11) NOT NULL,
  `reparacion_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `sku` varchar(100) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reparaciones`
--

CREATE TABLE `reparaciones` (
  `id` int(11) NOT NULL,
  `cliente` varchar(20) NOT NULL,
  `nombreCliente` varchar(100) NOT NULL,
  `emailCliente` varchar(100) DEFAULT NULL,
  `telefonoCliente` varchar(20) DEFAULT NULL,
  `dispositivo` varchar(100) NOT NULL,
  `marcaModelo` varchar(100) NOT NULL,
  `imei` varchar(50) NOT NULL,
  `problema` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `costoMateriales` decimal(10,2) DEFAULT 0.00,
  `estado` varchar(50) NOT NULL DEFAULT 'Inicio Reparación',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('Administrador','Técnico','Vendedor','Usuario') NOT NULL DEFAULT 'Usuario',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `email`, `password`, `telefono`, `rol`, `fecha_creacion`) VALUES
(1, 'admin', 'admin@itechsupport.com', 'admin123', NULL, 'Administrador', '2025-05-06 01:24:41'),
(7, 'Juan Ramirez', 'juan.ramirez@madecentro.co', 'Juan2022*', '31223214124', 'Técnico', '2025-05-09 00:39:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `factura_id` int(11) NOT NULL,
  `producto_nombre` varchar(100) NOT NULL,
  `producto_sku` varchar(50) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- Indices de la tabla `config_recibos`
--
ALTER TABLE `config_recibos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `config_tienda`
--
ALTER TABLE `config_tienda`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_factura` (`numero_factura`),
  ADD KEY `reparacion_id` (`reparacion_id`),
  ADD KEY `cliente` (`cliente`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `historial_busquedas`
--
ALTER TABLE `historial_busquedas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`);

--
-- Indices de la tabla `materiales_reparacion`
--
ALTER TABLE `materiales_reparacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reparacion_id` (`reparacion_id`);

--
-- Indices de la tabla `reparaciones`
--
ALTER TABLE `reparaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente` (`cliente`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `factura_id` (`factura_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `config_recibos`
--
ALTER TABLE `config_recibos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `config_tienda`
--
ALTER TABLE `config_tienda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_busquedas`
--
ALTER TABLE `historial_busquedas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `materiales_reparacion`
--
ALTER TABLE `materiales_reparacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reparaciones`
--
ALTER TABLE `reparaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`reparacion_id`) REFERENCES `reparaciones` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `materiales_reparacion`
--
ALTER TABLE `materiales_reparacion`
  ADD CONSTRAINT `materiales_reparacion_ibfk_1` FOREIGN KEY (`reparacion_id`) REFERENCES `reparaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
