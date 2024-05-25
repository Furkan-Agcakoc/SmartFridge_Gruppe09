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
  `household_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `household_id_fk` FOREIGN KEY (`household_id`) REFERENCES `household` (`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `groceries`
--

DROP TABLE IF EXISTS `groceries`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groceries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groceries_name` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groceries`
--

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `household`
--


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
  `fridge_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fridge_id` (`fridge_id`),
    CONSTRAINT `fridge_id_fk` FOREIGN KEY (`fridge_id`) REFERENCES `fridge` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



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
  `google_user_id` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `recipe_name` varchar(100) NOT NULL DEFAULT '',
  `duration` varchar(100) NOT NULL DEFAULT '',
  `portions` int NOT NULL DEFAULT '0',
  `instruction` varchar(1024) NOT NULL DEFAULT '',
  `user_id` int NOT NULL DEFAULT '0',
  `groceriesstatement_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `groceries_recipe`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groceries_recipe` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `groceries_id`   int NOT NULL DEFAULT '0',
  `recipe_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `inhabitant`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inhabitant` (
  `household_id`int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL DEFAULT '0',

  PRIMARY KEY (`household_id`, `user_id`),
  KEY `household_id` (`household_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `inhabitant_fk1` FOREIGN KEY (`household_id`) REFERENCES `household` (`id`),
  CONSTRAINT `inhabitant_fk2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `recipelocation`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipelocation` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `household_id`   int NOT NULL DEFAULT '0',
  `recipe_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




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