-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-05-2025 a las 02:16:16
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
(1, 'Laura Gómez', '1025457896', '3104567821', 'laura.gomez@gmail.com', 'Calle 12 #45-67, Bogotá', '2025-05-29 23:56:27'),
(2, 'Andrés Martínez', '1002345678', '3113344566', 'andres.martinez@hotmail.com', 'Cra 7 #84-12, Medellín', '2025-05-29 23:56:27'),
(3, 'Camila Rodríguez', '1019087765', '3126678899', 'camila.rodriguez@yahoo.com', 'Av. 68 #30-20, Cali', '2025-05-29 23:56:27'),
(4, 'Juan Pablo Torres', '1100453278', '3001239876', 'juan.torres@gmail.com', 'Cl 56A #12-15, Bucaramanga', '2025-05-29 23:56:27'),
(5, 'Natalia Ríos', '1098765432', '3014567890', 'natalia.rios@gmail.com', 'Cra 10 #23-45, Cartagena', '2025-05-29 23:56:27'),
(6, 'Carlos Peña', '1032458890', '3102233445', 'carlos.pena@outlook.com', 'Cl 8 #25-50, Barranquilla', '2025-05-29 23:56:27'),
(7, 'Valentina Ruiz', '1011234567', '3145678920', 'valentina.ruiz@hotmail.com', 'Av. El Poblado #112, Medellín', '2025-05-29 23:56:27'),
(8, 'Santiago Vargas', '1009876543', '3161122334', 'santiago.vargas@gmail.com', 'Cl 20 #35-40, Pereira', '2025-05-29 23:56:27'),
(9, 'Isabella Castro', '1045567890', '3159988776', 'isabella.castro@yahoo.com', 'Cra 50 #100-10, Bogotá', '2025-05-29 23:56:27'),
(10, 'Felipe Moreno', '1056782345', '3172233445', 'felipe.moreno@gmail.com', 'Cl 45 #30-60, Manizales', '2025-05-29 23:56:27'),
(11, 'Daniela Acosta', '1020987654', '3114567788', 'daniela.acosta@live.com', 'Cra 15 #10-30, Cúcuta', '2025-05-29 23:56:27'),
(12, 'Tomás Herrera', '1099887765', '3184561234', 'tomas.herrera@gmail.com', 'Cl 100 #50-70, Ibagué', '2025-05-29 23:56:27'),
(13, 'Juliana López', '1087765543', '3196678899', 'juliana.lopez@hotmail.com', 'Av. Circunvalar #200, Santa Marta', '2025-05-29 23:56:27'),
(14, 'Sebastián Gil', '1065432198', '3135566778', 'sebastian.gil@gmail.com', 'Cl 60 #12-22, Montería', '2025-05-29 23:56:27'),
(15, 'Mariana Torres', '1076543210', '3003344556', 'mariana.torres@gmail.com', 'Cra 33 #90-15, Neiva', '2025-05-29 23:56:27'),
(16, 'TechWave Solutions S.A.S.', '901456789', '6013456789', 'contacto@techwave.co', 'Cra. 45 #112-35, Bogotá D.C.', '2025-05-30 00:08:26'),
(17, 'DigitalFix Corp', '900987654', '6047654321', 'soporte@digitalfix.com', 'Cl. 76 #52-40, Medellín, Antioquia', '2025-05-30 00:08:26'),
(18, 'CompuZona Ltda.', '830112233', '6023344556', 'ventas@compuzona.co', 'Av. 3N #45-19, Cali, Valle del Cauca', '2025-05-30 00:08:26'),
(19, 'RedSmart Networks S.A.S.', '901234321', '6017865432', 'info@redsmart.com', 'Cra. 10 #24-76, Bogotá D.C.', '2025-05-30 00:08:26'),
(20, 'ElectroTech Group S.A.', '890765432', '6051237890', 'servicio@electrotech.co', 'Cll. 19 #9-58, Barranquilla, Atlántico', '2025-05-30 00:08:26');

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

--
-- Volcado de datos para la tabla `facturas`
--

INSERT INTO `facturas` (`id`, `numero_factura`, `cliente`, `nombre_cliente`, `email_cliente`, `telefono_cliente`, `reparacion_id`, `fecha_emision`, `subtotal`, `impuesto`, `total`, `metodo_pago`, `estado`, `fecha_registro`, `fecha_actualizacion`) VALUES
(1, 'ITECH986592', '890765432', 'ElectroTech Group S.A.', 'servicio@electrotech.co', '6051237890', 1, '2025-05-30', 180000.00, 34200.00, 214200.00, 'Nequi', 'Pagada', '2025-05-30 00:13:06', '2025-05-30 00:13:06');

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
(1, 'Batería Samsung A12 Original', 65000.00, 42000.00, 'BAT-SAM-A12', 'NO TIENE', '3 meses', 10, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(2, 'Pantalla Completa Xiaomi Redmi Note 8', 180000.00, 120000.00, 'LCD-XIA-RN8', 'NO TIENE', '3 meses', 7, '2025-05-30 00:02:59', '2025-05-30 00:11:54'),
(3, 'Botón de encendido Motorola G9', 15000.00, 8000.00, 'BTN-ENC-MOT-G9', 'NO TIENE', '1 mes', 20, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(4, 'Puerto de carga iPhone 12', 35000.00, 20000.00, 'PCH-IP12', 'NO TIENE', '1 mes', 12, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(5, 'Memoria RAM DDR5 16GB 4800MHz Corsair', 250000.00, 210000.00, 'RAM-DDR5-16GB-CRS', 'NO TIENE', '12 meses', 6, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(6, 'Disco SSD 512GB M.2 NVMe Kingston', 220000.00, 180000.00, 'SSD-M2-512-KS', 'NO TIENE', '12 meses', 5, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(7, 'Flex de pantalla Huawei Y9 2019', 18000.00, 10000.00, 'FLX-HW-Y92019', 'NO TIENE', '1 mes', 9, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(8, 'Cable Flex Botón Home iPhone 7', 25000.00, 16000.00, 'FLX-HOME-IP7', 'NO TIENE', '1 mes', 14, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(9, 'Kit de Pasta Térmica + Alcohol Isopropílico', 12000.00, 6000.00, 'KIT-PAST-ALC', 'NO TIENE', '1 mes', 30, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(10, 'Teclado para Laptop Acer Aspire E15', 70000.00, 45000.00, 'KEY-ACR-E15', 'NO TIENE', '6 meses', 11, '2025-05-30 00:02:59', '2025-05-30 00:02:59'),
(11, 'Pantalla LED 32\" Samsung UN32J4300', 320000.00, 260000.00, 'LCD-TV-SAM-32J43', 'NO TIENE', '6 meses', 4, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(12, 'Pantalla LED 43\" LG 43LM6300', 480000.00, 390000.00, 'LCD-TV-LG-43LM63', 'NO TIENE', '6 meses', 3, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(13, 'Kit de retroiluminación LED 32\"', 75000.00, 55000.00, 'KIT-BACKLED-32', 'NO TIENE', '3 meses', 10, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(14, 'Fuente de poder TV LG 43\" EAX67872801', 95000.00, 72000.00, 'FUENTE-LG-43', 'NO TIENE', '3 meses', 5, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(15, 'T-Con Board Samsung 40\" T370HW02', 130000.00, 98000.00, 'TCON-SAM-40', 'NO TIENE', '3 meses', 3, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(16, 'Main Board TV RCA LED40E45RH', 150000.00, 110000.00, 'MB-RCA-40E45', 'NO TIENE', '3 meses', 2, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(17, 'Control IR TV Philips 32PFL5708', 25000.00, 14000.00, 'IR-PHI-32PFL', 'NO TIENE', '1 mes', 6, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(18, 'Pantalla LED 55\" Hisense H55B7100', 650000.00, 520000.00, 'LCD-TV-HSN-55B71', 'NO TIENE', '6 meses', 2, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(19, 'Cable LVDS para TV Samsung 40\"', 20000.00, 11000.00, 'LVDS-SAM-40', 'NO TIENE', '1 mes', 8, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(20, 'Botón encendido TV TCL 43\" L43S6500', 18000.00, 9000.00, 'BTN-TCL-43S65', 'NO TIENE', '1 mes', 5, '2025-05-30 00:03:35', '2025-05-30 00:03:35'),
(21, 'Pantalla Completa Huawei P20 Lite', 160000.00, 110000.00, 'LCD-HW-P20L', 'NO TIENE', '3 meses', 7, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(22, 'Disco Duro HDD 1TB Seagate 2.5\"', 160000.00, 125000.00, 'HDD-1TB-SGT', 'NO TIENE', '6 meses', 6, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(23, 'Cámara Frontal Samsung A30S', 35000.00, 20000.00, 'CAM-FR-SAM-A30S', 'NO TIENE', '1 mes', 10, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(24, 'Botón de volumen Xiaomi Redmi Note 9', 12000.00, 7000.00, 'BTN-VOL-XIA-RN9', 'NO TIENE', '1 mes', 12, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(25, 'Disco SSD 1TB 2.5\" Kingston A400', 290000.00, 240000.00, 'SSD-1TB-KS-A400', 'NO TIENE', '12 meses', 5, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(26, 'Memoria RAM DDR3 8GB 1333MHz Desktop', 95000.00, 75000.00, 'RAM-DDR3-8GB-DESK', 'NO TIENE', '6 meses', 8, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(27, 'Bisel Pantalla Laptop HP 15.6\"', 45000.00, 30000.00, 'BIS-HP-15', 'NO TIENE', '3 meses', 4, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(28, 'Puerto HDMI TV LG 42LB5800', 30000.00, 20000.00, 'HDMI-LG-42LB', 'NO TIENE', '1 mes', 6, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(29, 'Teclado retroiluminado Lenovo Ideapad 3', 85000.00, 62000.00, 'KEY-LNV-IDP3', 'NO TIENE', '6 meses', 5, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(30, 'Pantalla LED 24\" Samsung Curva LC24F390', 420000.00, 360000.00, 'LCD-MON-SAM24C', 'NO TIENE', '6 meses', 3, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(31, 'Cargador USB-C 25W Original Samsung', 70000.00, 50000.00, 'CHG-USB-SAM-25W', 'NO TIENE', '3 meses', 9, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(32, 'Sensor de proximidad iPhone X', 40000.00, 25000.00, 'SEN-PROX-IPX', 'NO TIENE', '1 mes', 10, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(33, 'Modulo de Wifi Laptop Dell Latitude 5480', 45000.00, 32000.00, 'WIFI-MOD-DELL54', 'NO TIENE', '3 meses', 7, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(34, 'Carcasa completa Moto G5 Plus', 60000.00, 40000.00, 'CRC-MOT-G5P', 'NO TIENE', '1 mes', 4, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(35, 'Mainboard Laptop HP 14-bs007la', 520000.00, 430000.00, 'MB-HP-14BS', 'NO TIENE', '6 meses', 2, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(36, 'Ventilador Interno PC 120mm RGB', 35000.00, 22000.00, 'FAN-PC-120RGB', 'NO TIENE', '6 meses', 15, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(37, 'Panel LED TV Philips 50PFL5602/F7', 600000.00, 500000.00, 'LCD-PHI-50PFL', 'NO TIENE', '6 meses', 2, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(38, 'Tarjeta de sonido externa USB 7.1', 30000.00, 18000.00, 'SND-USB-71', 'NO TIENE', '3 meses', 11, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(39, 'Adaptador USB Bluetooth 5.0 PC', 25000.00, 16000.00, 'BT-USB-50', 'NO TIENE', '3 meses', 18, '2025-05-30 00:04:40', '2025-05-30 00:04:40'),
(40, 'Pantalla LCD Acer Nitro 5 15.6\" FHD', 450000.00, 370000.00, 'LCD-ACR-NTR5', 'NO TIENE', '6 meses', 3, '2025-05-30 00:04:40', '2025-05-30 00:04:40');

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

--
-- Volcado de datos para la tabla `materiales_reparacion`
--

INSERT INTO `materiales_reparacion` (`id`, `reparacion_id`, `nombre`, `precio`, `cantidad`, `subtotal`, `fecha_registro`, `sku`) VALUES
(1, 1, 'Pantalla Completa Xiaomi Redmi Note 8', 180000.00, 1, 180000.00, '2025-05-30 00:11:54', 'LCD-XIA-RN8');

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

--
-- Volcado de datos para la tabla `reparaciones`
--

INSERT INTO `reparaciones` (`id`, `cliente`, `nombreCliente`, `emailCliente`, `telefonoCliente`, `dispositivo`, `marcaModelo`, `imei`, `problema`, `descripcion`, `costo`, `costoMateriales`, `estado`, `fecha_registro`, `fecha_actualizacion`) VALUES
(1, '890765432', 'ElectroTech Group S.A.', 'servicio@electrotech.co', '6051237890', 'Celular', 'Xiaomi Redmi 8', '812984198589242', 'Problemas en la pantalla', 'Se debe cambiar totalmente la pantalla debido a que el display sufrio daños severos.', 180000.00, 180000.00, 'Pagada', '2025-05-30 00:11:54', '2025-05-30 00:13:06');

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
(1, 'Juan Ramirez', 'jgrc20042507@itechsupport.com', '123', '3102081541', 'Administrador', '2025-05-29 23:52:35'),
(2, 'admin', 'admin@itechsupport.com', 'admin', '3219120392', 'Administrador', '2025-05-29 23:54:56');

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
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `factura_id`, `producto_nombre`, `producto_sku`, `cantidad`, `precio_unitario`, `subtotal`, `fecha_registro`) VALUES
(1, 1, 'Pantalla Completa Xiaomi Redmi Note 8', 'LCD-XIA-RN8', 1, 180000.00, 180000.00, '2025-05-30 00:13:06');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historial_busquedas`
--
ALTER TABLE `historial_busquedas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `materiales_reparacion`
--
ALTER TABLE `materiales_reparacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reparaciones`
--
ALTER TABLE `reparaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
