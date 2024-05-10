CREATE DATABASE IF NOT EXISTS `Smartfridge` /*!40100 DEFAULT CHARACTER SET utf8mb3 */;
USE `Smartfridge`;

-- ------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fridge`
--

DROP TABLE IF EXISTS `fridge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fridge` (
  `id` int NOT NULL DEFAULT '0',
  `fridge_name` varchar(100) NOT NULL DEFAULT '',
  `groceriesstatement_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `groceriesstatement_id_idx` (`groceriesstatement_id`),
  CONSTRAINT `fridge_groceriesstatement_fk` FOREIGN KEY (`groceriesstatement_id`) REFERENCES `groceriesstatement` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fridge`
--

LOCK TABLES `fridge` WRITE;
/*!40000 ALTER TABLE `fridge` DISABLE KEYS */;
INSERT INTO `fridge` VALUES (1,'Fridge1',1);
/*!40000 ALTER TABLE `fridge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groceries`
--

DROP TABLE IF EXISTS `groceries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groceries` (
  `id` int NOT NULL DEFAULT '0',
  `groceries_name` varchar(100) NOT NULL DEFAULT '',
  `user_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `groceries_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groceries`
--

LOCK TABLES `groceries` WRITE;
/*!40000 ALTER TABLE `groceries` DISABLE KEYS */;
INSERT INTO `groceries` VALUES (1,'Banane',1),(2,'Apfel',1),(3,'Butter',1),(4,'Käse',1);
/*!40000 ALTER TABLE `groceries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `household`
--

DROP TABLE IF EXISTS `household`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `household` (
  `id` int NOT NULL DEFAULT '0',
  `household_name` varchar(100) NOT NULL DEFAULT '',
  `user_id` int NOT NULL DEFAULT '0',
  `fridge_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `fridge_id_idx` (`fridge_id`),
  CONSTRAINT `household_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `household_fridge_fk` FOREIGN KEY (`fridge_id`) REFERENCES `fridge` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `household`
--

LOCK TABLES `household` WRITE;
/*!40000 ALTER TABLE `household` DISABLE KEYS */;
INSERT INTO `household` VALUES (1,'Haus von Sead',1,1),(2,'FamilieAslan',1,1),(3,'KocaHaus',1,1);
/*!40000 ALTER TABLE `household` ENABLE KEYS */;
UNLOCK TABLES;

-- Further tables would follow the same pattern for unique foreign key names.
--
-- Table structure for table `groceriesstatement`
--

DROP TABLE IF EXISTS `groceriesstatement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groceriesstatement` (
  `id` int NOT NULL DEFAULT '0',
  `groceries_name` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(1024) NOT NULL DEFAULT '',
  `quantity` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groceriesstatement`
--

LOCK TABLES `groceriesstatement` WRITE;
/*!40000 ALTER TABLE `groceriesstatement` DISABLE KEYS */;
INSERT INTO `groceriesstatement` VALUES (1,'Zucker','g',7),(2,'Erdbeere','Stück',8),(3,'Nutella','gramm',20),(4,'Wasser','liter',3);
/*!40000 ALTER TABLE `groceriesstatement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL DEFAULT '0',
  `firstname` varchar(128) NOT NULL DEFAULT '',
  `lastname` varchar(256) NOT NULL DEFAULT '',
  `nickname` varchar(128) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `google_users_id` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Baran','Kocabey','baranbey','bk115@hdm-stuttgart.de','GJyAC4Hsx1VVgu3ixb6irDtqsg12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe` (
  `id` int NOT NULL DEFAULT '0',
  `recipe_name` varchar(100) NOT NULL DEFAULT '',
  `duration` varchar(100) NOT NULL DEFAULT '',
  `portions` int NOT NULL DEFAULT '0',
  `instruction` varchar(1024) NOT NULL DEFAULT '',
  `user_id` int NOT NULL DEFAULT '0',
  `groceriesstatement_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `groceriesstatement_id_idx` (`groceriesstatement_id`),
  CONSTRAINT `recipe_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `recipe_groceriesstatement_fk` FOREIGN KEY (`groceriesstatement_id`) REFERENCES `groceriesstatement` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
INSERT INTO `recipe` (id, recipe_name, duration, portions, instruction, user_id, groceriesstatement_id) VALUES
(1, 'Döner', '40 Minuten', 2, 'Schritt 1: Hände waschen. Schritt 2: Brot vorbereiten', 0, 0),
(2, 'Mercimek Suppe', '15 Minuten', 1, 'Schritt 1: Hände waschen. Schritt 2: Wasser kochen.', 0, 0);
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Reset session to initial settings
--

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;