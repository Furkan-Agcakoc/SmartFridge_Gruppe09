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
  `household_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `household_id_fk` FOREIGN KEY (`household_id`) REFERENCES `household` (`id`) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `household`
--

DROP TABLE IF EXISTS `household`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `household` (
  `id` int NOT NULL DEFAULT '0',
  `household_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `grocery`
--

DROP TABLE IF EXISTS `grocery`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grocery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grocery_name` varchar(128) NOT NULL DEFAULT '',
  `household_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `grocery_fk1` FOREIGN KEY (`household_id`) REFERENCES `household` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

INSERT INTO `grocery` (`grocery_name`) VALUES
('Mehl'),
('Zucker'),
('Salz'),
('Pfeffer'),
('Olivenöl'),
('Butter'),
('Eier'),
('Milch'),
('Sahne'),
('Käse'),
('Zwiebeln'),
('Knoblauch'),
('Karotten'),
('Tomaten'),
('Kartoffeln'),
('Paprika'),
('Gurken'),
('Zitronen'),
('Äpfel'),
('Bananen'),
('Orangen'),
('Brokkoli'),
('Spinat'),
('Pilze'),
('Hähnchenbrust'),
('Rindfleisch'),
('Schweinefleisch'),
('Lachs'),
('Thunfisch'),
('Garnelen'),
('Reis'),
('Nudeln'),
('Brot'),
('Hafer'),
('Linsen'),
('Bohnen'),
('Erbsen'),
('Mais'),
('Joghurt'),
('Honig'),
('Senf'),
('Ketchup'),
('Sojasauce'),
('Essig'),
('Basilikum'),
('Petersilie'),
('Thymian'),
('Rosmarin'),
('Lorbeerblätter'),
('Currypulver'),
('Paprikapulver'),
('Chiliflocken'),
('Zimt'),
('Muskat'),
('Vanille'),
('Kakao'),
('Backpulver'),
('Natron'),
('Walnüsse'),
('Mandeln'),
('Erdnüsse'),
('Sonnenblumenkerne'),
('Oliven'),
('Kapern'),
('Feta'),
('Parmesan'),
('Mozzarella'),
('Gorgonzola'),
('Blauschimmelkäse'),
('Quark'),
('Schokolade'),
('Kokosnuss'),
('Avocado'),
('Süßkartoffeln'),
('Rote Beete'),
('Sellerie'),
('Kohl'),
('Blumenkohl'),
('Grüne Bohnen'),
('Zucchini'),
('Aubergine'),
('Koriander'),
('Minze'),
('Dill'),
('Schnittlauch'),
('Oregano'),
('Majoran'),
('Sardellen'),
('Trüffelöl'),
('Sesamöl'),
('Chilisauce'),
('Worcestershiresauce'),
('Ahornsirup'),
('Marmelade'),
('Pesto'),
('Tofu'),
('Seitan'),
('Hummus'),
('Couscous'),
('Quinoa'),
('Roggenmehl'),
('Dinkelmehl'),
('Gerste'),
('Bulgur'),
('Polenta'),
('Kichererbsen'),
('Schwarze Bohnen'),
('Kidneybohnen'),
('Weißer Essig'),
('Balsamico-Essig'),
('Apfelessig'),
('Trüffel'),
('Sauerrahm'),
('Creme Fraiche'),
('Saurer Hering'),
('Makrele'),
('Forelle'),
('Hecht'),
('Karpfen'),
('Scholle'),
('Entenbrust'),
('Wildfleisch'),
('Lammfleisch'),
('Kalbfleisch'),
('Speck'),
('Schinken'),
('Truthahn'),
('Putenbrust'),
('Entenfett'),
('Gänsefett'),
('Kokosmilch'),
('Kokosöl'),
('Mandelmilch'),
('Sojamilch'),
('Leinsamen'),
('Chiasamen'),
('Kürbiskerne'),
('Schwarzkümmel'),
('Kurkuma'),
('Kardamom'),
('Safran'),
('Fenchelsamen'),
('Anis'),
('Kreuzkümmel'),
('Sternanis'),
('Lorbeerblatt'),
('Muskatblüte'),
('Szechuanpfeffer'),
('Meerrettich'),
('Wasabi'),
('Ingwer'),
('Tamarinde'),
('Zitronengras'),
('Galgant'),
('Harissa'),
('Tahini'),
('Grüner Tee'),
('Kaffee'),
('Grieß'),
('Tapioka'),
('Agar-Agar'),
('Gelatine'),
('Rum'),
('Whisky'),
('Cognac'),
('Marsala'),
('Portwein'),
('Sherry'),
('Trockenfrüchte'),
('Feigen'),
('Kiwi'),
('Mango'),
('Ananas'),
('Papaya'),
('Granatapfel'),
('Blaubeeren'),
('Himbeeren'),
('Erdbeeren'),
('Schwarze Johannisbeeren'),
('Rhabarber'),
('Staudensellerie'),
('Artischocken'),
('Spargel'),
('Fenchel'),
('Rucola'),
('Radicchio'),
('Endivie'),
('Lollo Rosso'),
('Eisbergsalat'),
('Frühlingszwiebeln'),
('Lauch'),
('Schalotten'),
('Meerrettich'),
('Eiweißpulver'),
('Proteinriegel'),
('Kakaonibs'),
('Goji-Beeren'),
('Acai-Beeren'),
('Matcha-Pulver'),
('Camembert');

ALTER TABLE `grocery`
ADD CONSTRAINT `fk_grocery_household` FOREIGN KEY (`household_id`) REFERENCES `household` (`id`) ON DELETE CASCADE;


--
-- Table structure for table `measure`
--
DROP TABLE IF EXISTS `measure`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `measure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO measure (unit) VALUES
('g'),
('kg'),
('ml'),
('l'),
('Teelöffel'),
('Esslöffel'),
('Prise'),
('Stück');

ALTER TABLE `measure`
ADD COLUMN `household_id` int(11) DEFAULT NULL,
ADD CONSTRAINT `fk_measure_household` FOREIGN KEY (`household_id`) REFERENCES `household` (`id`) ON DELETE CASCADE;




-- Table structure for table `grocerystatement`
DROP TABLE IF EXISTS `grocerystatement`;
CREATE TABLE IF NOT EXISTS `grocerystatement` (
  `id` INT NOT NULL ,
  `grocery_name` INT NOT NULL DEFAULT '0',
  `unit` INT NOT NULL DEFAULT '0',
  `quantity` FLOAT NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `grocery_name` (`grocery_name`),
  KEY `unit` (`unit`),
  CONSTRAINT `grocerystatement_fk1` FOREIGN KEY (`grocery_name`) REFERENCES `grocery` (`id`),
  CONSTRAINT `grocerystatement_fk2` FOREIGN KEY (`unit`) REFERENCES `measure` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(128) NOT NULL DEFAULT '',
  `lastname` varchar(256) NOT NULL DEFAULT '',
  `nickname` varchar(128) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `google_user_id` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_google_user_id` (`google_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

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
  `portion` int NOT NULL DEFAULT '0',
  `instruction` varchar(1024) NOT NULL DEFAULT '',
  `user_id` int NOT NULL DEFAULT '0',
  `household_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `household_id` (`household_id`),
  CONSTRAINT `recipe_fk1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `recipe_fk2` FOREIGN KEY (`household_id`) REFERENCES `household` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `grocery_in_recipe`
--

DROP TABLE IF EXISTS `grocery_in_recipe`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `grocery_in_recipe` (
  `grocerystatement_id` int NOT NULL DEFAULT '0',
  `recipe_id` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`grocerystatement_id`, `recipe_id`),
    KEY `grocerystatement_id` (`grocerystatement_id`),
    KEY `recipe_id` (`recipe_id`),
    CONSTRAINT `grocery_in_recipe_fk1` FOREIGN KEY (`grocerystatement_id`) REFERENCES `grocerystatement` (`id`) ON DELETE CASCADE,
    CONSTRAINT `grocery_in_recipe_fk2` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Table structure for table `grocery_in_fridge`
--

DROP TABLE IF EXISTS `grocery_in_fridge`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `grocery_in_fridge` (
  `grocerystatement_id` int NOT NULL DEFAULT '0',
  `fridge_id` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`grocerystatement_id`, `fridge_id`),
    KEY `grocerystatement_id` (`grocerystatement_id`),
    KEY `fridge_id` (`fridge_id`),
    CONSTRAINT `grocery_in_fridge_fk1` FOREIGN KEY (`grocerystatement_id`) REFERENCES `grocerystatement` (`id`) ON DELETE CASCADE,
    CONSTRAINT `grocery_in_fridge_fk2` FOREIGN KEY (`fridge_id`) REFERENCES `fridge` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Table structure for table `inhabitant`
--

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
  CONSTRAINT `inhabitant_fk2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
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