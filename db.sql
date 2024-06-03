-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versione server:              11.3.2-MariaDB - mariadb.org binary distribution
-- S.O. server:                  Win64
-- HeidiSQL Versione:            12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dump della struttura del database branch
CREATE DATABASE IF NOT EXISTS `branch` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `branch`;

-- Dump della struttura di tabella branch.environment
CREATE TABLE IF NOT EXISTS `environment` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `environment` varchar(30) NOT NULL,
  `path` varchar(200) NOT NULL DEFAULT '.',
  `deploy_path` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `environment` (`environment`),
  UNIQUE KEY `path` (`path`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dump dei dati della tabella branch.environment: ~4 rows (circa)
INSERT INTO `environment` (`ID`, `environment`, `path`, `deploy_path`) VALUES
	(1, 'DEV', 'C:\\Users\\user\\Desktop\\src\\visualizzazione_branch_3', 'C:\\Users\\user\\Desktop\\src\\visualizzazione_branch_3\\deploy.bat'),
	(2, 'PROD', 'C:\\Users\\user\\Desktop\\src\\visualizzazione_branch_2', NULL),
	(3, 'TEST', 'C:\\Users\\user\\Desktop\\src\\visualizzazione_branch_4', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
