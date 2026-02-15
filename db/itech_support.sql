-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: itech_support
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cedula` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=2267 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Laura Gómez Henao','1025457896','3104567821','laura.gomez@gmail.com','Calle 12 #45-67, Bogotá','2025-05-29 23:56:27'),(2,'Andrés Martínez Romero','1002345678','3113344121','andresrmartinez@hotmail.com','Cra 7 #84-12, Medellín','2025-05-29 23:56:27'),(3,'Camila Rodríguez','1019087765','3126678899','camila.rodriguez@yahoo.com','Av. 68 #30-20, Cali','2025-05-29 23:56:27'),(4,'Juan Pablo Torres','1100453278','3001239876','juan.torres@gmail.com','Cl 56A #12-15, Bucaramanga','2025-05-29 23:56:27'),(5,'Natalia Ríos','1098765432','3014567890','natalia.rios@gmail.com','Cra 10 #23-45, Cartagena','2025-05-29 23:56:27'),(6,'Carlos Peña','1032458890','3102233445','carlos.pena@outlook.com','Cl 8 #25-50, Barranquilla','2025-05-29 23:56:27'),(7,'Valentina Ruiz','1011234567','3145678920','valentina.ruiz@hotmail.com','Av. El Poblado #112, Medellín','2025-05-29 23:56:27'),(8,'Santiago Vargas','1009876543','3161122334','santiago.vargas@gmail.com','Cl 20 #35-40, Pereira','2025-05-29 23:56:27'),(9,'Isabella Castro','1045567890','3159988776','isabella.castro@yahoo.com','Cra 50 #100-10, Bogotá','2025-05-29 23:56:27'),(10,'Felipe Moreno','1056782345','3172233445','felipe.moreno@gmail.com','Cl 45 #30-60, Manizales','2025-05-29 23:56:27'),(11,'Daniela Acosta','1020987654','3114567788','daniela.acosta@live.com','Cra 15 #10-30, Cúcuta','2025-05-29 23:56:27'),(12,'Tomás Herrera','1099887765','3184561234','tomas.herrera@gmail.com','Cl 100 #50-70, Ibagué','2025-05-29 23:56:27'),(13,'Juliana López','1087765543','3196678899','juliana.lopez@hotmail.com','Av. Circunvalar #200, Santa Marta','2025-05-29 23:56:27'),(14,'Sebastián Gil Moreno','1065432198','3135566778','sebastiangilm@gmail.com','Cl 60 #12-22, Montería','2025-05-29 23:56:27'),(16,'TechWave Solutions S.A.S.','901456789','6013456789','contacto@techwave.co','Cra. 45 #112-35, Bogotá D.C.','2025-05-30 00:08:26'),(17,'DigitalFix Corp','900987654','6047654321','soporte@digitalfix.com','Cl. 76 #52-40, Medellín, Antioquia','2025-05-30 00:08:26'),(18,'CompuZona Ltda.','830112233-8','6023344556','ventas@compuzona.co','Av. 3N #45-19, Cali, Valle del Cauca','2025-05-30 00:08:26'),(19,'RedSmart Networks S.A.S.','901234321','6017865432','info@redsmart.com','Cra. 10 #24-76, Bogotá D.C.','2025-05-30 00:08:26'),(20,'ElectroTech Group S.A.','890765432','6051237890','servicio@electrotech.co','Cll. 19 #9-58, Barranquilla, Atlántico','2025-05-30 00:08:26'),(21,'Juan Guillermo Ramirez Cuervo','1023522704','3102081540','jgrc20042507@hotmail.com','Cll 23a #47 - 12 Sabaneta, Antioquia','2025-09-26 03:19:44'),(2234,'Marleny Torres Milk','1929418948','3203923094','marlenytm@yahoo.es','Cll 23 #190 - 88 Uraba, Antioquia','2025-10-05 03:00:53'),(2235,'Luz Mery Tabares Corrales','32389492','3201814892','lmerytab@hotmail.com','Vereda El Tubo, Sta Barbara Antioquia','2025-10-12 02:47:45'),(2236,'Maria del Socorro Blandon','39382087','3198912842','bsocorrito@gmail.com','Vereda Los Charcos, Sta Barbara Antioquia','2025-10-12 22:08:56'),(2237,'Mr Leo Ramírez García','74322460','3206665543','mrleorg@gmail.com','Cl 32# 65d - 32 Itagüí, Ant','2025-10-13 00:18:04'),(2238,'Mr Orión Ramirez García','23456434','3102081000','mrorionrg@hotmail.com','Cra 23# 22s - 55 Envigado, Ant','2025-10-13 00:18:04'),(2239,'Margarita Corrales Tabares','32184717','3108371641','margaract@icloud.com','Vereda el Pedregal Itagüí Antioquia ','2025-10-14 02:18:01'),(2241,'Jhon Alex Castaño','28165371','3000001392','jacastano@hotmail.com','Cra 3# 33d - 55 Envigado, Ant','2025-10-15 03:21:06'),(2242,'Pachito De Jesus','267237623','3109248912','pachixd@ph.com','Cll 87d #231 - 53 Teusaquillo','2025-10-17 16:41:25'),(2244,'Martha Alicia Suarez Ferrer','48992050','3010824812','ferreralic@yahoo.es','Cll 1 #84 - 23 Barrancabermenja','2025-10-26 17:07:03'),(2245,'Federico Gomez Bolaños','32481942','3010942184','fedevalgo@hotmail.com','Cll22 #43 - 12 Pasto','2025-10-26 19:14:42'),(2246,'Francisco Rojas Mendez','102093192','3102199120','franciscoroja@gmail.com','Cll 7 43 - 80 Santandes','2025-11-01 23:00:58'),(2250,'Luz Albani Zapata','1023912482','3012949182','luzalb@yahoo.es','Av Cr42 #43 - 90 Santander','2025-12-10 00:35:38'),(2251,'Madecentro Colombia SAS','811028650','6040921','madecentromade@madecentro.co','Cll 7 Sur #42 - 70 OF 505, Medellin','2025-12-13 02:33:53'),(2252,'RTA Muebles SAS','801209421','3209041121','mariana.bb@rta.com.co','Cedi Yumbo, Valle del Cauca','2025-12-13 02:35:42'),(2253,'Virtual Muebles SA','802919211','60429602','david.mina@virtualmuebles.com.co','Cll 7 sur #42 - 70','2025-12-13 02:37:07'),(2254,'Dimatek SAS','811029831','3129092142','diego.lopez@distri.com','Edificio San Fernando, Poblado','2025-12-13 02:38:55'),(2255,'Julian Alberto Ruiz T','1020912001','3100499102','juliantorres@gmail.com','Envigado','2025-12-13 02:54:17'),(2256,'Jose Miguel Correa','32019481','3006858810','josembarber@gmail.com','Calle Sucre Santa Barbara','2025-12-13 23:04:32'),(2257,'Andres Miguel Tabares','1112110204','3010293900','andytaba@hotmail.com','Cll 23 #12 -23 Sucre','2025-12-13 23:29:03'),(2258,'Armando Ríos','10028271','3018689898','armandi@yahoo.es','Cra 2 #87 - 21, Villanueva','2025-12-13 23:42:05'),(2259,'Leonel Alvarez Perez','1910242839','3002910238','leonelalpe@hotmail.com','Cll 7 Norte #43 - 21 San Cristobal','2025-12-16 03:07:40'),(2261,'Fanny Arteaga Jimenez','102949182','3001298421','artfanny@hotmail.com','Cll 32# 45-21 Santa Rosa de Osos','2025-12-28 20:26:04'),(2262,'Marcos Campos','1029491829','3019284112','marcossca@gmail.com','Vereda Nogal Santander','2025-12-28 20:27:06'),(2264,'Mariana Garcia Corrales','1001748653','3209929320','magarcorrales2002@gmail.com','Cll7 #21 -12','2025-12-28 23:28:22'),(2266,'Fernando Arboleda Nunez','1290284218','3219200219','nunfer19@hotmail.com','Cll 29 # 102 -29 Bogota','2026-01-12 23:08:23');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config_recibos`
--

DROP TABLE IF EXISTS `config_recibos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config_recibos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `encabezado` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `footer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_recibos`
--

LOCK TABLES `config_recibos` WRITE;
/*!40000 ALTER TABLE `config_recibos` DISABLE KEYS */;
/*!40000 ALTER TABLE `config_recibos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config_tienda`
--

DROP TABLE IF EXISTS `config_tienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config_tienda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `impuesto` decimal(5,2) DEFAULT '19.00',
  `encabezado_recibo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `pie_recibo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `terminos_condiciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_tienda`
--

LOCK TABLES `config_tienda` WRITE;
/*!40000 ALTER TABLE `config_tienda` DISABLE KEYS */;
/*!40000 ALTER TABLE `config_tienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturas`
--

DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_factura` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cliente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nombre_cliente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_cliente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono_cliente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reparacion_id` int DEFAULT NULL,
  `fecha_emision` date NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuesto` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `estado` enum('Pendiente','Pagada','Anulada') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pendiente',
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contador_impresiones` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_factura` (`numero_factura`),
  KEY `reparacion_id` (`reparacion_id`),
  KEY `cliente` (`cliente`),
  KEY `estado` (`estado`),
  CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`reparacion_id`) REFERENCES `reparaciones` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas`
--

LOCK TABLES `facturas` WRITE;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
INSERT INTO `facturas` VALUES (1,'ITECH986592','890765432','ElectroTech Group S.A.','servicio@electrotech.co','6051237890',1,'2025-05-30',180000.00,34200.00,214200.00,'Nequi','Pagada','2025-05-30 00:13:06','2025-05-30 00:13:06',0),(2,'ITECH135360','1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540',2,'2025-09-26',3580000.00,680200.00,4260200.00,'Daviplata','Pagada','2025-09-26 03:25:35','2025-09-26 03:25:35',0),(3,'ITECH706529','1292819482','Leo Ramirez Garcia','leoraga@gmail.com','3102081599',3,'2025-09-29',358000.00,68020.00,426020.00,'Efectivo','Pagada','2025-09-29 00:45:06','2025-09-29 00:45:06',0),(4,'ITECH980524','1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540',5,'2025-09-29',480000.00,91200.00,571200.00,'Efectivo','Pagada','2025-09-29 00:49:40','2025-09-29 00:49:40',0),(5,'ITECH067740','1032458890','Carlos Peña','carlos.pena@outlook.com','3102233445',8,'2025-09-29',35000.00,6650.00,41650.00,'Nequi','Pagada','2025-09-29 01:41:07','2025-09-29 01:41:07',0),(6,'ITECH563279','32389492','Luz Mery Tabares Corrales','lmerytab@hotmail.com','3201814892',9,'2025-10-12',180000.00,34200.00,214200.00,'Tarjeta Débito','Pagada','2025-10-12 02:52:43','2025-10-12 02:52:43',0),(7,'ITECH968086','1011234567','Valentina Ruiz','valentina.ruiz@hotmail.com','3145678920',6,'2025-10-12',35000.00,6650.00,41650.00,'Tarjeta Débito','Pagada','2025-10-12 04:39:29','2025-10-12 04:39:29',0),(8,'ITECH195436','39382087','Maria del Socorro Blandon','bsocorrito@gmail.com','3198912842',10,'2025-10-12',78000.00,14820.00,92820.00,'Daviplata','Pagada','2025-10-12 22:29:55','2025-10-12 22:29:55',0),(9,'ITECH398322','23456434','Mr Orión Ramirez García','mrorionrg@hotmail.com','3102081000',13,'2025-10-13',1100000.00,209000.00,1309000.00,'Efectivo','Pagada','2025-10-13 01:03:18','2025-10-13 01:03:18',0),(10,'ITECH398242','74322460','Mr Leo Ramírez García','mrleorg@gmail.com','3206665543',11,'2025-10-13',790000.00,150100.00,940100.00,'Tarjeta Crédito','Pagada','2025-10-13 01:03:18','2025-10-13 01:03:18',0),(11,'ITECH184231','32184717','Margarita Corrales Tabares','margaract@icloud.com','3108371641',14,'2025-10-14',230000.00,43700.00,273700.00,'Tarjeta Débito','Pagada','2025-10-14 02:33:03','2025-10-14 02:33:03',0),(13,'ITECH414250','129093184','Gabriel de Jesus Alvarez','gaboja@gmail.com','3001930192',17,'2025-10-15',450000.00,85500.00,535500.00,'Efectivo','Pagada','2025-10-15 00:33:34','2025-10-15 00:33:34',0),(14,'ITECH894392','1929418948','Marleny Torres Milk','marlenytm@yahoo.es','3203923094',18,'2025-10-15',290000.00,55100.00,345100.00,'Nequi','Pagada','2025-10-15 03:28:11','2025-10-15 03:28:11',0),(15,'ITECH955560','28165371','Jhon Alex Castaño','jacastano@hotmail.com','3000001392',19,'2025-10-15',290000.00,55100.00,345100.00,'Tarjeta Débito','Pagada','2025-10-15 03:29:13','2025-10-15 03:29:13',0),(16,'ITECH394884','267237623','Pachito De Jesus','pachixd@ph.com','3109248912',20,'2025-10-17',230000.00,43700.00,273700.00,'Transferencia Bancaria','Pagada','2025-10-17 16:43:14','2025-10-17 16:43:14',0),(17,'ITECH400414','121241240','Gabriela Pacheco','gabapacheco@hotmail.com','3221312412',21,'2025-10-25',12000.00,2280.00,14280.00,'Daviplata','Pagada','2025-10-25 11:06:39','2025-10-25 11:06:39',0),(18,'ITECH632900','1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540',23,'2025-10-28',18000.00,3420.00,21420.00,'Nequi','Pagada','2025-10-28 01:23:52','2025-10-28 01:23:52',0),(19,'ITECH358469','1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540',24,'2025-10-28',18000.00,3420.00,21420.00,'Nequi','Pagada','2025-10-28 01:52:38','2025-10-28 01:52:38',0),(20,'ITECH677306','102093192','Francisco Rojas Florez','franciscoroja@gmail.com','3102199120',26,'2025-11-01',600000.00,114000.00,714000.00,'Efectivo','Pagada','2025-11-01 23:11:17','2025-11-01 23:11:17',0),(21,'ITECH440427','102093192','Francisco Rojas','franciscoroja@gmail.com','3102199120',27,'2025-11-01',320000.00,60800.00,380800.00,'Efectivo','Pagada','2025-11-01 23:40:40','2025-11-01 23:40:40',0),(22,'ITECH088145','1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540',25,'2025-11-16',160000.00,30400.00,190400.00,'Nequi','Pagada','2025-11-16 02:44:46','2025-11-16 02:44:46',0),(23,'ITECH287998','1023912482','Luz Albani Zapata','luzalb@yahoo.es','3012949182',29,'2025-12-10',900000.00,171000.00,1071000.00,'Efectivo','Pagada','2025-12-10 00:41:27','2025-12-10 00:41:27',0),(24,'ITECH999801','1023912482','Luz Albani Zapata','luzalb@yahoo.es','3012949182',30,'2025-12-10',900000.00,171000.00,1071000.00,'Tarjeta Débito','Pagada','2025-12-10 01:26:39','2025-12-10 01:26:39',0),(25,'ITECH253898','811028650','Madecentro Colombia SAS','madecentromade@madecentro.co','6040921',31,'2025-12-13',320000.00,60800.00,380800.00,'Nequi','Pagada','2025-12-13 02:50:53','2025-12-13 02:50:53',0),(26,'ITECH680144','1020912001','Julian Alberto Ruiz T','juliantorres@gmail.com','3100499102',33,'2025-12-13',280000.00,53200.00,333200.00,'Efectivo','Pagada','2025-12-13 02:58:00','2025-12-13 02:58:00',0),(27,'ITECH727724','1112110204','Andres Miguel Tabares','andytaba@hotmail.com','3010293900',34,'2025-12-13',56000.00,10640.00,66640.00,'Efectivo','Pagada','2025-12-13 23:32:07','2025-12-13 23:32:07',0),(28,'ITECH676642','10028271','Armando Ríos','armandi@yahoo.es','3018689898',35,'2025-12-13',46000.00,8740.00,54740.00,'Efectivo','Pagada','2025-12-13 23:47:56','2025-12-13 23:47:56',0),(29,'ITECH568910','48992050','Martha Alicia Suarez Ferrer','ferreralic@yahoo.es','3010824812',37,'2025-12-16',120000.00,22800.00,142800.00,'Efectivo','Pagada','2025-12-16 03:26:08','2025-12-16 03:26:08',0),(30,'ITECH154755','1029491829','Marcos Campos','marcossca@gmail.com','3019284112',38,'2025-12-28',450000.00,85500.00,535500.00,'Efectivo','Pagada','2025-12-28 21:09:14','2025-12-28 21:09:14',0),(31,'ITECH279596','102949182','Fanny Arteaga Jimenez','artfanny@hotmail.com','3001298421',39,'2025-12-28',600000.00,114000.00,714000.00,'Tarjeta Débito','Pagada','2025-12-28 21:11:19','2025-12-28 21:11:19',0),(32,'ITECH720295','1001748653','Mariana Garcia Corrales','magarcorrales2002@gmail.com','3209929320',40,'2025-12-28',600000.00,114000.00,714000.00,'Nequi','Pagada','2025-12-28 23:32:00','2025-12-28 23:32:00',0),(33,'ITECH433144','1290284218','Fernando Arboleda Nunez','nunfer19@hotmail.com','3219200219',41,'2026-01-12',640000.00,121600.00,761600.00,'Efectivo','Pagada','2026-01-12 23:27:13','2026-01-12 23:27:13',0);
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_busquedas`
--

DROP TABLE IF EXISTS `historial_busquedas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_busquedas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('cliente','producto','reparacion','factura') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `item_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_busquedas`
--

LOCK TABLES `historial_busquedas` WRITE;
/*!40000 ALTER TABLE `historial_busquedas` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_busquedas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `sku` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `imei` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `garantia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `existencias` int NOT NULL DEFAULT '0',
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=2061 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (2,'Pantalla Completa Xiaomi Redmi Note 8',180000.00,120000.00,'LCD-XIA-RN8','NO TIENE','3 meses',10,'2025-05-30 00:02:59','2025-12-28 21:16:32'),(5,'Memoria RAM DDR5 16GB 4800MHz Corsair',250000.00,210000.00,'RAM-DDR5-16GB-CRS','NO TIENE','12 meses',10,'2025-05-30 00:02:59','2025-12-28 23:23:50'),(6,'Disco SSD 512GB M.2 NVMe Kingston',220000.00,180000.00,'SSD-M2-512-KS','NO TIENE','12 meses',10,'2025-05-30 00:02:59','2025-12-13 23:13:53'),(7,'Flex de pantalla Huawei Y9 2019',18000.00,10000.00,'FLX-HW-Y92019','NO TIENE','1 mes',8,'2025-05-30 00:02:59','2025-12-13 03:28:24'),(8,'Cable Flex Botón Home iPhone 7',25000.00,16000.00,'FLX-HOME-IP7','NO TIENE','1 mes',14,'2025-05-30 00:02:59','2025-05-30 00:02:59'),(10,'Teclado para Laptop Acer Aspire E15',70000.00,45000.00,'KEY-ACR-E15','NO TIENE','6 meses',20,'2025-05-30 00:02:59','2025-12-13 03:13:19'),(11,'Pantalla LED 32\" Samsung UN32J4300',320000.00,260000.00,'LCD-TV-SAM-32J43','NO TIENE','6 meses',4,'2025-05-30 00:03:35','2025-05-30 00:03:35'),(12,'Pantalla LED 43\" LG 43LM6300',480000.00,390000.00,'LCD-TV-LG-43LM63','NO TIENE','6 meses',2,'2025-05-30 00:03:35','2025-09-29 00:48:41'),(14,'Fuente de poder TV LG 43\" EAX67872801',95000.00,72000.00,'FUENTE-LG-43','NO TIENE','3 meses',5,'2025-05-30 00:03:35','2025-05-30 00:03:35'),(16,'Main Board TV RCA LED40E45RH',150000.00,110000.00,'MB-RCA-40E45','NO TIENE','3 meses',2,'2025-05-30 00:03:35','2025-05-30 00:03:35'),(17,'Control IR TV Philips 32PFL5708',25000.00,14000.00,'IR-PHI-32PFL','NO TIENE','1 mes',6,'2025-05-30 00:03:35','2025-05-30 00:03:35'),(18,'Pantalla LED 55\" Hisense H55B7100',650000.00,520000.00,'LCD-TV-HSN-55B71','NO TIENE','6 meses',5,'2025-05-30 00:03:35','2025-12-13 03:28:35'),(20,'Botón encendido TV TCL 43\" L43S6500',18000.00,9000.00,'BTN-TCL-43S65','NO TIENE','1 mes',5,'2025-05-30 00:03:35','2025-05-30 00:03:35'),(21,'Pantalla Completa Huawei P20 Lite',160000.00,110000.00,'LCD-HW-P20L','NO TIENE','3 meses',7,'2025-05-30 00:04:40','2025-05-30 00:04:40'),(22,'Disco Duro HDD 1TB Seagate 2.5\"',160000.00,125000.00,'HDD-1TB-SGT','NO TIENE','6 meses',5,'2025-05-30 00:04:40','2025-10-28 01:56:05'),(24,'Botón de volumen Xiaomi Redmi Note 9',12000.00,7000.00,'BTN-VOL-XIA-RN9','NO TIENE','1 mes',11,'2025-05-30 00:04:40','2025-10-25 11:05:11'),(25,'Disco SSD 1TB 2.5\" Kingston A400',290000.00,240000.00,'SSD-1TB-KS-A400','NO TIENE','12 meses',4,'2025-05-30 00:04:40','2026-01-12 23:21:13'),(26,'Memoria RAM DDR3 8GB 1333MHz Desktop',95000.00,75000.00,'RAM-DDR3-8GB-DESK','NO TIENE','6 meses',8,'2025-05-30 00:04:40','2025-05-30 00:04:40'),(27,'Bisel Pantalla Laptop HP 15.6\"',45000.00,30000.00,'BIS-HP-15','NO TIENE','3 meses',6,'2025-05-30 00:04:40','2025-12-28 23:44:28'),(28,'Puerto HDMI TV LG 42LB5800',30000.00,20000.00,'HDMI-LG-42LB','NO TIENE','1 mes',6,'2025-05-30 00:04:40','2025-05-30 00:04:40'),(2034,'Display ZTE Blade N8 8¨',180000.00,109000.00,'DISP-ZTE-BN8','NO TIENE','6 meses',9,'2025-10-12 02:49:04','2025-10-12 02:51:23'),(2035,'Puerto Carga Tipo C Moto G34S',78000.00,38000.00,'PORTC-TIPC-MOTOG','NO TIENE','2 meses',7,'2025-10-12 22:10:51','2025-10-12 22:14:55'),(2037,'Disco 2TB iPhone 17',1100000.00,850000.00,'SSD-2TB-IPHO','NO TIENE','12 meses',3,'2025-10-13 00:09:12','2025-10-15 00:17:50'),(2038,'Disco 1TB iPhone 14 o superior',790000.00,480000.00,'SSD-1TB-IPHO','NO TIENE','12 meses',4,'2025-10-13 00:09:13','2025-10-13 00:55:58'),(2039,'Lente Protector iPhone 17 Camera Gorilla Gluss',230000.00,140000.00,'CAPPR-IPHO17-GORGL','NO TIENE','1 mes',18,'2025-10-14 02:20:06','2025-11-23 17:50:33'),(2040,'Procesador Intel Core I8 3200G',450000.00,320000.00,'CPU-INTEL-I83200G','NO TIENE','6 meses',2,'2025-10-15 00:30:39','2025-10-15 00:32:20'),(2041,'Teclado interno Lenovo Thinkbook Laptop',290000.00,210000.00,'TECLI-LENO-LAPT','NO TIENE','6 meses',8,'2025-10-15 03:13:19','2025-10-15 03:23:56'),(2043,'Pantalla Iphone 17 pro',600000.00,550000.00,'IPH-PAN-17P','NO TIENE','12 meses',9,'2025-11-01 23:03:52','2025-11-01 23:06:58'),(2044,'Pantalla Iphone 10Pro',320000.00,280000.00,'IPH-PAN-10','NO TIENE','12 meses',9,'2025-11-01 23:32:11','2025-12-16 03:28:06'),(2046,'Disco HDD 2TB ADATA 3.5\" Shawk',900000.00,800000.00,'HDD-SHK-2TB','NO TIENE','12 meses',8,'2025-12-10 00:38:29','2025-12-13 03:28:09'),(2047,'Disco SSD 3TB ADATA',800000.00,580000.00,'SSD-ADT-3TB','NO TIENE','6 meses',10,'2025-12-12 05:17:15','2025-12-12 05:17:15'),(2048,'Batería Laptop HP HT03XL',320000.00,245000.00,'BAT-HP-HT03XL','NO TIENE','6 meses',10,'2025-12-13 02:21:53','2025-12-28 20:19:04'),(2049,'Pantalla LED 15.6\" Dell Inspiron',450000.00,360000.00,'LCD-DELL-156','NO TIENE','3 meses',8,'2025-12-13 02:24:27','2025-12-13 02:24:38'),(2050,'Memoria RAM DDR4 32GB 2666MHz',320000.00,250000.00,'RAM-DDR4-32GB','NO TIENE','12 meses',10,'2025-12-13 02:26:12','2025-12-13 02:26:12'),(2051,'Pantalla Samsung Galaxy A20',280000.00,200000.00,'LCD-SAM-A20','NO TIENE','6 meses',10,'2025-12-13 02:27:38','2025-12-28 17:31:06'),(2052,'Protector vidrio ceramico Iphone 17',56000.00,40000.00,'VIDR-CERA-IP17','NO TIENE','Ninguna',10,'2025-12-13 23:06:35','2025-12-28 17:30:53'),(2053,'Protecto Vidrio Generico Iphone 17',35000.00,20000.00,'VIDR-GENE-IP17','NO TIENE','Ninguna',10,'2025-12-13 23:16:54','2025-12-13 23:17:06'),(2054,'Protector Vidrio Cerámico Xiaomi 12',46000.00,20500.00,'VIDR-CERA-XIAO12','NO TIENE','Ninguna',8,'2025-12-13 23:44:15','2025-12-28 17:21:39'),(2055,'Camara Frontal POCO X7 Pro',120000.00,79000.00,'CAM-FRON-POCX7','NO TIENE','6 meses',10,'2025-12-16 03:15:27','2025-12-28 17:16:17'),(2056,'Gabinete Blanco XTRG Ledgreen RGB',450000.00,290000.00,'GAB-XTRG-RGB','NO TIENE','6 meses',9,'2025-12-28 20:22:22','2025-12-28 21:05:46'),(2057,'Gabinete RGB Rosa FRSK',600000.00,480000.00,'GAB-FRSK-RGB','NO TIENE','6 meses',8,'2025-12-28 20:23:10','2025-12-28 23:30:16'),(2060,'Disco SSD 1TB M.2 NVMe Kingston',350000.00,280000.00,'SSD-M2-1TB-KS','NO TIENE','12 meses',4,'2026-01-12 23:13:14','2026-01-12 23:21:13');
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiales_reparacion`
--

DROP TABLE IF EXISTS `materiales_reparacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiales_reparacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reparacion_id` int NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `cantidad` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `reparacion_id` (`reparacion_id`),
  CONSTRAINT `materiales_reparacion_ibfk_1` FOREIGN KEY (`reparacion_id`) REFERENCES `reparaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales_reparacion`
--

LOCK TABLES `materiales_reparacion` WRITE;
/*!40000 ALTER TABLE `materiales_reparacion` DISABLE KEYS */;
INSERT INTO `materiales_reparacion` VALUES (1,1,'Pantalla Completa Xiaomi Redmi Note 8',180000.00,1,180000.00,'2025-05-30 00:11:54','LCD-XIA-RN8'),(2,2,'Pantalla AMOLED Poco X7 Pro',3580000.00,1,3580000.00,'2025-09-26 03:23:19','PNT-AMOL-PX7'),(3,3,'Pantalla AMOLED Poco X7 Pro',358000.00,1,358000.00,'2025-09-29 00:32:34','PNT-AMOL-PX7'),(5,5,'Pantalla LED 43\" LG 43LM6300',480000.00,1,480000.00,'2025-09-29 00:48:41','LCD-TV-LG-43LM63'),(6,6,'Puerto de carga iPhone 12',35000.00,1,35000.00,'2025-09-29 00:56:08','PCH-IP12'),(8,8,'Puerto de carga iPhone 12',35000.00,1,35000.00,'2025-09-29 01:00:12','PCH-IP12'),(9,9,'Display ZTE Blade N8 8¨',180000.00,1,180000.00,'2025-10-12 02:51:23','DISP-ZTE-BN8'),(10,10,'Puerto Carga Tipo C Moto G34S',78000.00,1,78000.00,'2025-10-12 22:14:55','PORTC-TIPC-MOTOG'),(11,11,'Disco 1TB iPhone 14 o superior',790000.00,1,790000.00,'2025-10-13 00:55:58','SSD-1TB-IPHO'),(13,13,'Disco 2TB iPhone 17',1100000.00,1,1100000.00,'2025-10-13 01:00:13','SSD-2TB-IPHO'),(14,14,'Lente Protector iPhone 17 Camera Gorilla Gluss',230000.00,1,230000.00,'2025-10-14 02:27:44','CAPPR-IPHO17-GORGL'),(19,17,'Procesador Intel Core I8 3200G',450000.00,1,450000.00,'2025-10-15 00:32:20','CPU-INTEL-I83200G'),(20,18,'Teclado interno Lenovo Thinkbook Laptop',290000.00,1,290000.00,'2025-10-15 03:17:19','TECLI-LENO-LAPT'),(21,19,'Teclado interno Lenovo Thinkbook Laptop',290000.00,1,290000.00,'2025-10-15 03:23:56','TECLI-LENO-LAPT'),(22,20,'Lente Protector iPhone 17 Camera Gorilla Gluss',230000.00,1,230000.00,'2025-10-17 16:42:35','CAPPR-IPHO17-GORGL'),(23,21,'Botón de volumen Xiaomi Redmi Note 9',12000.00,1,12000.00,'2025-10-25 11:05:11','BTN-VOL-XIA-RN9'),(25,23,'Flex de pantalla Huawei Y9 2019',18000.00,1,18000.00,'2025-10-27 02:05:57','FLX-HW-Y92019'),(26,24,'Flex de pantalla Huawei Y9 2019',18000.00,1,18000.00,'2025-10-27 02:39:42','FLX-HW-Y92019'),(27,25,'Disco Duro HDD 1TB Seagate 2.5\"',160000.00,1,160000.00,'2025-10-28 01:56:05','HDD-1TB-SGT'),(28,26,'Pantalla Iphone 17 pro',600000.00,1,600000.00,'2025-11-01 23:06:58','IPH-PAN-17P'),(29,27,'Pantalla Iphone 10Pro',320000.00,1,320000.00,'2025-11-01 23:36:10','IPH-PAN-10'),(31,29,'Disco HDD 2TB ADATA 3.5\" Shawk',900000.00,1,900000.00,'2025-12-10 00:40:03','HDD-SHK-2TB'),(32,30,'Disco HDD 2TB ADATA 3.5\" Shawk',900000.00,1,900000.00,'2025-12-10 01:25:44','HDD-SHK-2TB'),(33,31,'Batería Laptop HP HT03XL',320000.00,1,320000.00,'2025-12-13 02:45:22','BAT-HP-HT03XL'),(34,33,'Pantalla Samsung Galaxy A20',280000.00,1,280000.00,'2025-12-13 02:55:25','LCD-SAM-A20'),(35,34,'Protector vidrio ceramico Iphone 17',56000.00,1,56000.00,'2025-12-13 23:30:24','VIDR-CERA-IP17'),(36,35,'Protector Vidrio Cerámico Xiaomi 12',46000.00,1,46000.00,'2025-12-13 23:46:06','VIDR-CERA-XIAO12'),(38,37,'Camara Frontal POCO X7 Pro',120000.00,1,120000.00,'2025-12-16 03:18:28','CAM-FRON-POCX7'),(39,38,'Gabinete Blanco XTRG Ledgreen RGB',450000.00,1,450000.00,'2025-12-28 21:05:46','GAB-XTRG-RGB'),(40,39,'Gabinete RGB Rosa FRSK',600000.00,1,600000.00,'2025-12-28 21:08:04','GAB-FRSK-RGB'),(41,40,'Gabinete RGB Rosa FRSK',600000.00,1,600000.00,'2025-12-28 23:30:16','GAB-FRSK-RGB'),(42,41,'Disco SSD 1TB M.2 NVMe Kingston',350000.00,1,350000.00,'2026-01-12 23:21:13','SSD-M2-1TB-KS'),(43,41,'Disco SSD 1TB 2.5\" Kingston A400',290000.00,1,290000.00,'2026-01-12 23:21:13','SSD-1TB-KS-A400');
/*!40000 ALTER TABLE `materiales_reparacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reparaciones`
--

DROP TABLE IF EXISTS `reparaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reparaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nombreCliente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `emailCliente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefonoCliente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispositivo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `marcaModelo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `imei` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `problema` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `costoMateriales` decimal(10,2) DEFAULT '0.00',
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Inicio Reparación',
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cliente` (`cliente`),
  KEY `estado` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reparaciones`
--

LOCK TABLES `reparaciones` WRITE;
/*!40000 ALTER TABLE `reparaciones` DISABLE KEYS */;
INSERT INTO `reparaciones` VALUES (1,'890765432','ElectroTech Group S.A.','servicio@electrotech.co','6051237890','Celular','Xiaomi Redmi 8','812984198589242','Problemas en la pantalla','Se debe cambiar totalmente la pantalla debido a que el display sufrio daños severos.',180000.00,180000.00,'Pagada','2025-05-30 00:11:54','2025-05-30 00:13:06'),(2,'1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540','Celular','POCO X7 Pro','84637829832342','Pantalla rota','Se debe cambiar display completo por quiebre interno.',3580000.00,3580000.00,'Pagada','2025-09-26 03:23:19','2025-09-26 03:25:35'),(3,'1292819482','Leo Ramirez Garcia','leoraga@gmail.com','3102081599','Celular','Poco X7','785942728756237','Pantalla con problemas','Se debe realizar cambio de cristal',358000.00,358000.00,'Pagada','2025-09-29 00:32:34','2025-09-29 00:45:06'),(5,'1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540','TV','LG 43\"','DF7645G2346DD2','Falla DIsplay','Se debe cambiar display',480000.00,480000.00,'Pagada','2025-09-29 00:48:41','2025-09-29 00:49:40'),(6,'1011234567','Valentina Ruiz','valentina.ruiz@hotmail.com','3145678920','Celular','Iphone 12','98247182745711','No carga dispositivo','Se debe cambiar puerto de carga  de dispositivo debido a que el actual tiene inconsistencias con contactos.',35000.00,35000.00,'Pagada','2025-09-29 00:56:08','2025-10-12 04:39:29'),(8,'1032458890','Carlos Peña','carlos.pena@outlook.com','3102233445','Celular','Iphone 12','98247182745711','No carga','Se debe cambiar puerto de carga  de dispositivo',35000.00,35000.00,'Pagada','2025-09-29 01:00:12','2025-09-29 01:41:07'),(9,'32389492','Luz Mery Tabares Corrales','lmerytab@hotmail.com','3201814892','Celular','ZTE','898230129494','Pantalla rota','Se debe cambiar display por que el actual esta roto',180000.00,180000.00,'Pagada','2025-10-12 02:51:23','2025-10-12 02:52:43'),(10,'39382087','Maria del Socorro Blandon','bsocorrito@gmail.com','3198912842','Celular','Motorola g34s','9089127874672','No carga celular','Se debe cambiar puerto de carga',78000.00,78000.00,'Pagada','2025-10-12 22:14:55','2025-10-12 22:29:55'),(11,'74322460','Mr Leo Ramírez García','mrleorg@gmail.com','3206665543','Celular','Iphone 15','82729062906','Aumento memoria','Por peticion de usuario, requiere aumento de almacenamiento',790000.00,790000.00,'Pagada','2025-10-13 00:55:58','2025-10-13 01:03:18'),(13,'23456434','Mr Orión Ramirez García','mrorionrg@hotmail.com','3102081000','Celular','Iphone 17','647256499264','Aumento almacenamiento','Por petición de cliente, solicita aumentar almacenamiento a 2TB',1100000.00,1100000.00,'Pagada','2025-10-13 01:00:13','2025-10-13 01:03:18'),(14,'32184717','Margarita Corrales Tabares','margaract@icloud.com','3108371641','Celular','iPhone 17','7762647817630','Agregar protector lente cámara trasera','Por petición de cliente se agregara lente protector módulo camara trasera.',230000.00,230000.00,'Pagada','2025-10-14 02:27:44','2025-10-14 02:33:03'),(17,'129093184','Gabriel de Jesus Alvarez','gaboja@gmail.com','3001930192','PC Escritorio','Lenovo ThinkPlane','5HF89810J481A','Cambio CPU','Se realiza cambio de CPU a equipo por una nueva generacion y compatible con board.',450000.00,450000.00,'Pagada','2025-10-15 00:32:20','2025-10-15 00:33:34'),(18,'1929418948','Marleny Torres Milk','marlenytm@yahoo.es','3203923094','Laptop','Lenovo','754HO8H26SD','Teclado con falla','Se debe realizar cambio de teclado interno.',290000.00,290000.00,'Pagada','2025-10-15 03:17:19','2025-10-15 03:28:11'),(19,'28165371','Jhon Alex Castaño','jacastano@hotmail.com','3000001392','Laptop','Lenovo','85HR42KVLP75','Teclas duras','Se debe cambiar teclado por deterioro.',290000.00,290000.00,'Pagada','2025-10-15 03:23:56','2025-10-15 03:29:13'),(20,'267237623','Pachito De Jesus','pachixd@ph.com','3109248912','Celular','Iphone 17','785239483632325','Agregar protecto camaras','Se debe agg pantalla',230000.00,230000.00,'Pagada','2025-10-17 16:42:35','2025-10-17 16:43:14'),(21,'121241240','Gabriela Pacheco','gabapacheco@hotmail.com','3221312412','Celular','Xiaomi Redmi 9','865409853819','Problemas con boton volumen','Se debe reemplazar pieza',12000.00,12000.00,'Pagada','2025-10-25 11:05:11','2025-10-25 11:06:39'),(23,'1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540','prueba','prueba','prueba','prueba','prueba',18000.00,18000.00,'Pagada','2025-10-27 02:05:57','2025-10-28 01:23:52'),(24,'1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540','prueba','pruebA','89523','PRUEBA','PRUEBA',18000.00,18000.00,'Pagada','2025-10-27 02:39:42','2025-10-28 01:52:38'),(25,'1023522704','Juan Guillermo Ramirez Cuervo','jgrc20042507@hotmail.com','3102081540','Celular','prue','3242','prueba','pruebaa',160000.00,160000.00,'Pagada','2025-10-28 01:56:05','2025-11-16 02:44:46'),(26,'102093192','Francisco Rojas Florez','franciscoroja@gmail.com','3102199120','Prueba','Prueba','8329823985','Prueba','Prueba',600000.00,600000.00,'Pagada','2025-11-01 23:06:58','2025-11-01 23:11:17'),(27,'102093192','Francisco Rojas','franciscoroja@gmail.com','3102199120','prueba','prueba','23958214090','Pantalla','Pantalla',320000.00,320000.00,'Pagada','2025-11-01 23:36:10','2025-11-01 23:40:40'),(29,'1023912482','Luz Albani Zapata','luzalb@yahoo.es','3012949182','DVR','HISENSE','902852935','No funciona, perdida informacion','Se debe cambiar disco, se tratara de recuperar informacion.',900000.00,900000.00,'Pagada','2025-12-10 00:40:03','2025-12-10 00:41:27'),(30,'1023912482','Luz Albani Zapata','luzalb@yahoo.es','3012949182','DVR','Hisense','8958285293','No guarda informacion','Se debe cambiar disco',900000.00,900000.00,'Pagada','2025-12-10 01:25:44','2025-12-10 01:26:39'),(31,'811028650','Madecentro Colombia SAS','madecentromade@madecentro.co','6040921','PC','Hp','5CG9DSJG98U','Bateria','Falla bateria, se debe instalar nueva',320000.00,320000.00,'Pagada','2025-12-13 02:45:22','2025-12-13 02:50:53'),(33,'1020912001','Julian Alberto Ruiz T','juliantorres@gmail.com','3100499102','Celular','Samsung','88912401290122','Pantalla con falla','Se debe cambiar pantalla completa',280000.00,280000.00,'Pagada','2025-12-13 02:55:25','2025-12-13 02:58:00'),(34,'1112110204','Andres Miguel Tabares','andytaba@hotmail.com','3010293900','Celular','Iphone 17','9194892589','Reemplazo vidrio pantalla','Se debe colocar nuevo vidrio protector.',56000.00,56000.00,'Pagada','2025-12-13 23:30:24','2025-12-13 23:32:07'),(35,'10028271','Armando Ríos','armandi@yahoo.es','3018689898','Celular','Xiaomi 12','82100937751','Cambio vidrio templado ','Se debe realizar cambio vidrio templado.',46000.00,46000.00,'Pagada','2025-12-13 23:46:06','2025-12-13 23:47:56'),(37,'48992050','Martha Alicia Suarez Ferrer','ferreralic@yahoo.es','3010824812','Celular','POCO X7 PRO','820921894129','Camara no sirve','Se debe cambiar lente con extensor completo',120000.00,120000.00,'Pagada','2025-12-16 03:18:28','2025-12-16 03:26:08'),(38,'1029491829','Marcos Campos','marcossca@gmail.com','3019284112','PC Escritorio','HP ','981299125209','Cambio de Rack/Gabinete','Cliente solicita cambio de GABINETE por uno RGB',450000.00,450000.00,'Pagada','2025-12-28 21:05:46','2025-12-28 21:09:14'),(39,'102949182','Fanny Arteaga Jimenez','artfanny@hotmail.com','3001298421','PC Escritorio','LENOVO','9F5892MU2','Cambio de Gabinete','Cliente solicito cambio a Gabinete Rosado RGB',600000.00,600000.00,'Pagada','2025-12-28 21:08:04','2025-12-28 21:11:19'),(40,'1001748653','Mariana Garcia Corrales','magarcorrales2002@gmail.com','3209929320','PC Escritorio','Lenovo','923MIF823','Cambio de Gabinete','Por peticion de cliente se camnbiara gabinete',600000.00,600000.00,'Pagada','2025-12-28 23:30:16','2025-12-28 23:32:00'),(41,'1290284218','Fernando Arboleda Nunez','nunfer19@hotmail.com','3219200219','PC Escritorio','Dell AIO','578G42ND96AJ9K','Aumento almacenamiento','Cliente requiere mayor almacenamiento, autoriza aumento a 1TB M2 para disco principal, y requiere adicional disco SSD SATA como almacenamiento de respaldo',640000.00,0.00,'Pagada','2026-01-12 23:21:13','2026-01-12 23:27:13');
/*!40000 ALTER TABLE `reparaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rol` enum('Administrador','Técnico','Vendedor','Usuario') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Usuario',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan Ramirez','jgrc20042507@gmail.com','Juan2025*','3102081541','Administrador','2025-05-29 23:52:35'),(3,'Mariana Garcia','2002marianagarcia@gmail.com','Mariana2025*','3200332923','Vendedor','2025-09-26 03:17:42'),(4,'Melany Ramirez','cautionmelany@hotmail.com','Melany2025*','3000532923','Técnico','2025-09-26 03:18:48'),(5,'Redes MDC','redes.madecentro@gmail.com','Juan2026*','3104061831','Técnico','2025-10-12 04:36:01'),(16,'Guillermo Garcia','guilloraga61@hotmail.com','Juan2026*','3104061829','Técnico','2025-12-13 02:07:53'),(21,'Flor Cuervo','florecuerdr@hotmail.com','Juan2022*','3120948221','Vendedor','2025-12-28 23:23:06'),(22,'Juan Bustamante','juan.bustam@madecentro.coo','Juan2025*','3019783529','Técnico','2026-01-12 23:10:47');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `factura_id` int NOT NULL,
  `producto_nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `producto_sku` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `factura_id` (`factura_id`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,1,'Pantalla Completa Xiaomi Redmi Note 8','LCD-XIA-RN8',1,180000.00,180000.00,'2025-05-30 00:13:06'),(2,2,'Pantalla AMOLED Poco X7 Pro','PNT-AMOL-PX7',1,3580000.00,3580000.00,'2025-09-26 03:25:35'),(3,3,'Pantalla AMOLED Poco X7 Pro','PNT-AMOL-PX7',1,358000.00,358000.00,'2025-09-29 00:45:06'),(4,4,'Pantalla LED 43\" LG 43LM6300','LCD-TV-LG-43LM63',1,480000.00,480000.00,'2025-09-29 00:49:40'),(5,5,'Puerto de carga iPhone 12','PCH-IP12',1,35000.00,35000.00,'2025-09-29 01:41:07'),(6,6,'Display ZTE Blade N8 8¨','DISP-ZTE-BN8',1,180000.00,180000.00,'2025-10-12 02:52:43'),(7,7,'Puerto de carga iPhone 12','PCH-IP12',1,35000.00,35000.00,'2025-10-12 04:39:29'),(8,8,'Puerto Carga Tipo C Moto G34S','PORTC-TIPC-MOTOG',1,78000.00,78000.00,'2025-10-12 22:29:55'),(9,9,'Disco 2TB iPhone 17','SSD-2TB-IPHO',1,1100000.00,1100000.00,'2025-10-13 01:03:18'),(10,10,'Disco 1TB iPhone 14 o superior','SSD-1TB-IPHO',1,790000.00,790000.00,'2025-10-13 01:03:18'),(14,13,'Procesador Intel Core I8 3200G','CPU-INTEL-I83200G',1,450000.00,450000.00,'2025-10-15 00:33:34'),(15,14,'Teclado interno Lenovo Thinkbook Laptop','TECLI-LENO-LAPT',1,290000.00,290000.00,'2025-10-15 03:28:14'),(16,15,'Teclado interno Lenovo Thinkbook Laptop','TECLI-LENO-LAPT',1,290000.00,290000.00,'2025-10-15 03:29:13'),(17,16,'Lente Protector iPhone 17 Camera Gorilla Gluss','CAPPR-IPHO17-GORGL',1,230000.00,230000.00,'2025-10-17 16:43:14'),(18,17,'Botón de volumen Xiaomi Redmi Note 9','BTN-VOL-XIA-RN9',1,12000.00,12000.00,'2025-10-25 11:06:39'),(19,18,'Flex de pantalla Huawei Y9 2019','FLX-HW-Y92019',1,18000.00,18000.00,'2025-10-28 01:23:52'),(20,19,'Flex de pantalla Huawei Y9 2019','FLX-HW-Y92019',1,18000.00,18000.00,'2025-10-28 01:52:38'),(21,20,'Pantalla Iphone 17 pro','IPH-PAN-17P',1,600000.00,600000.00,'2025-11-01 23:11:17'),(22,21,'Pantalla Iphone 10Pro','IPH-PAN-10',1,320000.00,320000.00,'2025-11-01 23:40:40'),(23,22,'Disco Duro HDD 1TB Seagate 2.5\"','HDD-1TB-SGT',1,160000.00,160000.00,'2025-11-16 02:44:46'),(24,23,'Disco HDD 2TB ADATA 3.5\" Shawk','HDD-SHK-2TB',1,900000.00,900000.00,'2025-12-10 00:41:28'),(25,24,'Disco HDD 2TB ADATA 3.5\" Shawk','HDD-SHK-2TB',1,900000.00,900000.00,'2025-12-10 01:26:39'),(26,25,'Batería Laptop HP HT03XL','BAT-HP-HT03XL',1,320000.00,320000.00,'2025-12-13 02:50:53'),(27,26,'Pantalla Samsung Galaxy A20','LCD-SAM-A20',1,280000.00,280000.00,'2025-12-13 02:58:00'),(28,27,'Protector vidrio ceramico Iphone 17','VIDR-CERA-IP17',1,56000.00,56000.00,'2025-12-13 23:32:07'),(29,28,'Protector Vidrio Cerámico Xiaomi 12','VIDR-CERA-XIAO12',1,46000.00,46000.00,'2025-12-13 23:47:56'),(30,29,'Camara Frontal POCO X7 Pro','CAM-FRON-POCX7',1,120000.00,120000.00,'2025-12-16 03:26:08'),(31,30,'Gabinete Blanco XTRG Ledgreen RGB','GAB-XTRG-RGB',1,450000.00,450000.00,'2025-12-28 21:09:14'),(32,31,'Gabinete RGB Rosa FRSK','GAB-FRSK-RGB',1,600000.00,600000.00,'2025-12-28 21:11:19'),(33,32,'Gabinete RGB Rosa FRSK','GAB-FRSK-RGB',1,600000.00,600000.00,'2025-12-28 23:32:00'),(34,33,'Disco SSD 1TB M.2 NVMe Kingston','SSD-M2-1TB-KS',1,350000.00,350000.00,'2026-01-12 23:27:13'),(35,33,'Disco SSD 1TB 2.5\" Kingston A400','SSD-1TB-KS-A400',1,290000.00,290000.00,'2026-01-12 23:27:13');
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-07  1:38:14
