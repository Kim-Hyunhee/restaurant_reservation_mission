/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- restaurant_reservation 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `restaurant_reservation` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `restaurant_reservation`;

-- 테이블 restaurant_reservation.customer 구조 내보내기
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 restaurant_reservation.customer:~2 rows (대략적) 내보내기
INSERT INTO `customer` (`id`, `username`, `password`) VALUES
	(1, 'customer1', '$2b$10$QJ/agR2BixF.5OfwAx4gBOpAH/kDSC6XnWVmTv7U3RqzKV9n7G2jW'),
	(2, 'customer2', '$2b$10$QJ/agR2BixF.5OfwAx4gBOpAH/kDSC6XnWVmTv7U3RqzKV9n7G2jW'),
	(3, 'customer3', '$2b$10$QJ/agR2BixF.5OfwAx4gBOpAH/kDSC6XnWVmTv7U3RqzKV9n7G2jW');

-- 테이블 restaurant_reservation.menu 구조 내보내기
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurantId` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `category` enum('한식','일식','중식','양식') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_085156de3c3a44eba017a6a0846` (`restaurantId`),
  CONSTRAINT `FK_085156de3c3a44eba017a6a0846` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 restaurant_reservation.menu:~9 rows (대략적) 내보내기
INSERT INTO `menu` (`id`, `restaurantId`, `name`, `price`, `category`, `description`) VALUES
	(1, 1, '맛있는 메뉴', 20000, '한식', '이 메뉴는 정말 맛있습니다.'),
	(2, 1, '맛있는 메뉴', 30000, '한식', '이 메뉴는 정말 맛있습니다.'),
	(3, 1, '맛있는 메뉴', 20000, '한식', '이 메뉴는 정말 맛있습니다.'),
	(4, 1, '맛있는 메뉴', 2000011, '양식', '이 메뉴는 정말 맛있습니다.'),
	(5, 1, '맛있는 메뉴', 2000011, '양식', '이 메뉴는 정말 맛있습니다.'),
	(6, 1, '맛있는 메뉴', 2000011, '양식', '이 메뉴는 정말 맛있습니다.'),
	(7, 1, '맛있는 메뉴', 2000011, '양식', '이 메뉴는 정말 맛있습니다.'),
	(9, 1, '맛있는 메뉴', 2000011, '양식', '이 메뉴는 정말 맛있습니다.'),
	(10, 1, '맛있는 메뉴', 2000011, '양식', '이 메뉴는 정말 맛있습니다.');

-- 테이블 restaurant_reservation.reservation 구조 내보내기
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(255) NOT NULL,
  `startTime` varchar(255) NOT NULL,
  `endTime` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `guests` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `restaurantId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7dce8a5a6907476eba30fedde91` (`customerId`),
  KEY `FK_2a2d6c09d1469e65c347513256a` (`restaurantId`),
  CONSTRAINT `FK_2a2d6c09d1469e65c347513256a` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_7dce8a5a6907476eba30fedde91` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 restaurant_reservation.reservation:~1 rows (대략적) 내보내기
INSERT INTO `reservation` (`id`, `date`, `startTime`, `endTime`, `phone`, `guests`, `customerId`, `restaurantId`) VALUES
	(2, '2025-03-09', '12:30', '13:30', '010-7777-7777', 3, 1, 1);

-- 테이블 restaurant_reservation.reservation_menus_menu 구조 내보내기
CREATE TABLE IF NOT EXISTS `reservation_menus_menu` (
  `reservationId` int(11) NOT NULL,
  `menuId` int(11) NOT NULL,
  PRIMARY KEY (`reservationId`,`menuId`),
  KEY `IDX_8a937c2673a60db25a3dd17dc6` (`reservationId`),
  KEY `IDX_3450614b0b68d0109f44cd5d0e` (`menuId`),
  CONSTRAINT `FK_3450614b0b68d0109f44cd5d0e3` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_8a937c2673a60db25a3dd17dc69` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 restaurant_reservation.reservation_menus_menu:~1 rows (대략적) 내보내기
INSERT INTO `reservation_menus_menu` (`reservationId`, `menuId`) VALUES
	(2, 10);

-- 테이블 restaurant_reservation.restaurant 구조 내보내기
CREATE TABLE IF NOT EXISTS `restaurant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 데이터 restaurant_reservation.restaurant:~2 rows (대략적) 내보내기
INSERT INTO `restaurant` (`id`, `username`, `password`) VALUES
	(1, 'restaurant1', '$2b$10$QJ/agR2BixF.5OfwAx4gBOpAH/kDSC6XnWVmTv7U3RqzKV9n7G2jW'),
	(2, 'restaurant2', '$2b$10$QJ/agR2BixF.5OfwAx4gBOpAH/kDSC6XnWVmTv7U3RqzKV9n7G2jW');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
