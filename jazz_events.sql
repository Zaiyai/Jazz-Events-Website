-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2026 at 07:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jazz_events`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `client_id` int(10) UNSIGNED NOT NULL,
  `client_name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date DEFAULT NULL,
  `no_of_guests` smallint(5) UNSIGNED NOT NULL,
  `venue` varchar(255) NOT NULL,
  `theme` varchar(255) NOT NULL,
  `status` enum('ACCEPTED','PENDING','REJECTED') NOT NULL DEFAULT 'PENDING',
  `budget` decimal(12,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `name`, `type`, `client_id`, `client_name`, `email`, `phone`, `date_from`, `date_to`, `no_of_guests`, `venue`, `theme`, `status`, `budget`, `created_at`, `updated_at`) VALUES
(33, 'Name', 'Type', 1, 'Albero, Edrian', 'edrian.albero0@gmail.com', '09249942', '5345-01-23', '9288-02-05', 123, 'Venue', 'Themes', 'PENDING', 123.00, '2026-05-10 18:18:04', '2026-05-10 18:18:04'),
(46, 'wer', '3453q', 1, 'Albero, Edrian', 'edrian.albero0@gmail.com', '32543', '4234-02-23', '4645-02-05', 2342, '243', '3423', 'PENDING', 2.00, '2026-05-12 01:07:22', '2026-05-12 01:07:22'),
(47, 'sdf', 'sfd', 1, 'Albero, Edrian', 'edrian.albero0@gmail.com', '069067', '3421-12-14', '6566-05-04', 2342, 'gsdg', 'dwee', 'PENDING', 2.00, '2026-05-12 01:08:35', '2026-05-12 01:08:35');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `no_of_guests` smallint(5) UNSIGNED NOT NULL,
  `celebrant` varchar(100) NOT NULL,
  `client_id` int(10) UNSIGNED NOT NULL,
  `client_name` varchar(150) NOT NULL,
  `date` date NOT NULL DEFAULT curdate(),
  `venue` varchar(255) NOT NULL,
  `theme` varchar(255) NOT NULL,
  `status` enum('PLANNING','ONGOING','BLOCKED','COMPLETED') DEFAULT 'PLANNING',
  `amount` int(11) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `name`, `type`, `no_of_guests`, `celebrant`, `client_id`, `client_name`, `date`, `venue`, `theme`, `status`, `amount`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Family Reunion', 'Reunion', 30, '', 1, 'Edrian Albero', '2026-05-01', 'Bahay', 'Barbie', 'COMPLETED', 10000, 'Edrian', '2026-05-01 15:41:47', '2026-05-01 15:41:47'),
(13, 'Tawag non', 'Conference', 102, '', 0, 'Rommel Garma', '2026-05-08', 'SHangri-La', '', 'ONGOING', 25000, '', '2026-05-01 17:06:44', '2026-05-01 17:06:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `initials` varchar(2) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('ADMIN','CLIENT','STAFF') NOT NULL,
  `is_online` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `initials`, `email`, `password`, `user_type`, `is_online`, `created_at`, `updated_at`) VALUES
(1, 'Albero, Edrian', 'EA', 'edrian.albero0@gmail.com', '123', 'ADMIN', 0, '2026-05-10 02:05:35', '2026-05-10 02:05:35'),
(2, 'Dela Cruz, Patricia Anne L.', '', 'patricia.dc3@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(3, 'Santos, Maria Angela R.', '', 'maria.santos1@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(4, 'Ramos, Nicole Mae C.', '', 'nicole.ramos7@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(5, 'Garcia, Michael Vincent T.', '', 'michael.garcia4@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(6, 'Torres, Samantha Joy P.', '', 'samantha.torres5@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(7, 'Flores, Kevin Matthew D.', '', 'kevin.flores6@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(8, 'Aquino, Joshua Miguel S.', '', 'joshua.aquino8@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(9, 'Reyes, John Carlo M.', '', 'john.reyes2@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(10, 'Villanueva, Daniel Joseph B.', '', 'daniel.villa12@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(11, 'Castro, Hannah Louise G.', '', 'hannah.castro11@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(12, 'Navarro, Camille Rose A.', '', 'camille.navarro9@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(13, 'Mendoza, Alyssa Kate N.', '', 'alyssa.mendoza13@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(14, 'Lim, Christian Paul E.', '', 'christian.lim10@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(15, 'Perez, Nathaniel Cruz O.', '', 'nathaniel.perez14@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(16, 'Gutierrez, Bianca Marie H.', '', 'bianca.gutierrez15@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(17, 'Rivera, Francis Xavier Q.', '', 'francis.rivera16@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(18, 'Diaz, Patrick Laurence W.', '', 'patrick.diaz18@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(19, 'Morales, Trisha Nicole F.', '', 'trisha.morales19@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(20, 'Bautista, Erika Mae J.', '', 'erika.bautista17@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(21, 'Fernandez, Mark Anthony K.', '', 'mark.fernandez20@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(22, 'Tan, Jerome Albert S.', '', 'jerome.tan22@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(23, 'Domingo, Karen Mae T.', '', 'karen.domingo25@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(24, 'Ong, Vincent Paul D.', '', 'vincent.ong24@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(25, 'Lopez, Angela Denise P.', '', 'angela.lopez21@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(26, 'Salazar, Christine Joy V.', '', 'christine.salazar23@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(27, 'Cruz, Monica Faith B.', '', 'monica.cruz29@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(28, 'Valdez, Princess Elaine M.', '', 'princess.valdez27@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(29, 'Alvarez, Cedric James L.', '', 'cedric.alvarez28@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(30, 'Padilla, Joshua Ryan A.', '', 'joshua.padilla26@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(31, 'Staff, Emmanuel Jose L.', '', 'emmanuel.staff105@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(32, 'Staff, Charles Vincent T.', '', 'charles.staff103@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(33, 'Mercado, Ethan Gabriel C.', '', 'ethan.mercado30@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(34, 'Staff, Adrian Cole R.', '', 'adrian.staff101@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(35, 'Staff, Beatrice Anne M.', '', 'beatrice.staff102@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(36, 'Staff, Gabriel Louis A.', '', 'gabriel.staff107@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(37, 'Staff, Ivan Matthew G.', '', 'ivan.staff109@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(38, 'Staff, Francesca Joy D.', '', 'francesca.staff106@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(39, 'Staff, Denise Marie P.', '', 'denise.staff104@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(40, 'Staff, Jasmine Nicole S.', '', 'jasmine.staff110@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(41, 'Staff, Hannah Claire V.', '', 'hannah.staff108@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:16', '2026-05-10 02:06:16'),
(42, 'Staff, Kenneth Paul F.', '', 'kenneth.staff111@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(43, 'Staff, Nina Camille O.', '', 'nina.staff114@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(44, 'Staff, Lara Mae C.', '', 'lara.staff112@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(45, 'Staff, Michael Andre J.', '', 'michael.staff113@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(46, 'Staff, Oliver James T.', '', 'oliver.staff115@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(47, 'Staff, Rachel Marie B.', '', 'rachel.staff118@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(48, 'Staff, Tiffany Rose E.', '', 'tiffany.staff120@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(49, 'Staff, Steven Kyle L.', '', 'steven.staff119@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(50, 'Staff, Patricia Anne V.', '', 'patricia.staff116@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(51, 'Staff, Quentin Miguel D.', '', 'quentin.staff117@gmail.com', '123', 'STAFF', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(52, 'Soriano, Alyssa Mae T.', '', 'alyssa.soriano32@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(53, 'Ramirez, John Paul A.', '', 'john.ramirez31@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(54, 'Pascual, Trina Joy M.', '', 'trina.pascual34@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(55, 'Antonio, Joshua Lance D.', '', 'joshua.antonio35@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(56, 'Molina, Beatrice Anne S.', '', 'beatrice.molina36@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(57, 'Chua, Daniel Joseph F.', '', 'daniel.chua37@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(58, 'Velasco, Camille Rose N.', '', 'camille.velasco38@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(59, 'Del Rosario, Miguel Andre V.', '', 'miguel.delrosario33@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(60, 'Yap, Christian Paul G.', '', 'christian.yap41@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(61, 'Sy, Monica Claire B.', '', 'monica.sy42@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(62, 'Uy, Hannah Louise P.', '', 'hannah.uy44@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(63, 'De Leon, Patricia Mae L.', '', 'patricia.deleon40@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(64, 'David, Kevin Matthew R.', '', 'kevin.david39@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(65, 'Yu, Bianca Marie J.', '', 'bianca.yu48@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(66, 'Co, Mark Anthony W.', '', 'mark.co49@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(67, 'Kho, Francis Xavier D.', '', 'francis.kho47@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(68, 'Go, Nathan Miguel C.', '', 'nathan.go43@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(69, 'Tan, Cedric James M.', '', 'cedric.tan45@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(70, 'Lao, Princess Elaine T.', '', 'princess.lao46@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(71, 'Sarmiento, Nicole Mae A.', '', 'nicole.sarmiento52@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(72, 'Roxas, Jerome Albert V.', '', 'jerome.roxas51@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(73, 'Villareal, Samantha Joy H.', '', 'samantha.villareal54@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(74, 'Luna, Ethan Gabriel R.', '', 'ethan.luna55@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(75, 'Manalo, Joshua Ryan E.', '', 'joshua.manalo53@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(76, 'Ang, Erika Mae K.', '', 'erika.ang50@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(77, 'Galang, Angela Denise O.', '', 'angela.galang56@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(78, 'Tolentino, Patrick Laurence T.', '', 'patrick.tolentino57@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(79, 'Bonifacio, Karen Mae F.', '', 'karen.bonifacio58@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(80, 'Magsaysay, Vincent Paul L.', '', 'vincent.magsaysay59@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(81, 'Jacinto, Christine Joy Q.', '', 'christine.jacinto60@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(82, 'Abad, Daniel Cruz S.', '', 'daniel.abad61@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(83, 'Barrera, Camille Anne D.', '', 'camille.barrera62@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(84, 'Calderon, Joshua Miguel N.', '', 'joshua.calderon63@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(85, 'Dizon, Alyssa Kate V.', '', 'alyssa.dizon64@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(86, 'Espino, Francis Kyle T.', '', 'francis.espino65@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(87, 'Herrera, Bianca Louise M.', '', 'bianca.herrera68@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(88, 'Gonzales, Michael Andre P.', '', 'michael.gonzales67@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(89, 'Ilagan, John Vincent C.', '', 'john.ilagan69@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(90, 'Jimenez, Patricia Anne W.', '', 'patricia.jimenez70@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(91, 'Macapagal, Hannah Rose T.', '', 'hannah.macapagal72@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(92, 'Natividad, Cedric Paul G.', '', 'cedric.natividad73@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(93, 'Palma, Joshua Carl L.', '', 'joshua.palma75@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(94, 'Ocampo, Samantha Nicole R.', '', 'samantha.ocampo74@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(95, 'Lacson, Nathaniel James B.', '', 'nathaniel.lacson71@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(96, 'Ferrer, Trisha Nicole A.', '', 'trisha.ferrer66@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(97, 'Roldan, Kevin Joseph D.', '', 'kevin.roldan77@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(98, 'Wenceslao, Patricia Joy M.', '', 'patricia.wenceslao82@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(99, 'Samson, Camille Grace E.', '', 'camille.samson78@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(100, 'Tiongson, Miguel Louis F.', '', 'miguel.tiongson79@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(101, 'Quinto, Monica Joy S.', '', 'monica.quinto76@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(102, 'Zamora, John Michael N.', '', 'john.zamora83@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(103, 'Aguirre, Bianca Kate O.', '', 'bianca.aguirre84@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(104, 'Beltran, Francis Matthew P.', '', 'francis.beltran85@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(105, 'Dumlao, Kevin Andre R.', '', 'kevin.dumlao87@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(106, 'Cunanan, Samantha Anne Q.', '', 'samantha.cunanan86@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(107, 'Umali, Alyssa Marie H.', '', 'alyssa.umali80@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(108, 'Vergara, Christian Kyle J.', '', 'christian.vergara81@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(109, 'Enriquez, Hannah Nicole S.', '', 'hannah.enriquez88@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(110, 'Hilario, Mark Anthony V.', '', 'mark.hilario91@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(111, 'Guinto, Patricia Mae U.', '', 'patricia.guinto90@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(112, 'Isidro, Angela Claire W.', '', 'angela.isidro92@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(113, 'Malabanan, Bianca Joy AA.', '', 'bianca.malabanan96@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(114, 'Faustino, Joshua Vincent T.', '', 'joshua.faustino89@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(115, 'Nicolas, Joshua Ryan AB.', '', 'joshua.nicolas97@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(116, 'Ledesma, Cedric Paul Z.', '', 'cedric.ledesma95@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(117, 'Javier, Daniel Joseph X.', '', 'daniel.javier93@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(118, 'Ortega, Samantha Rose AC.', '', 'samantha.ortega98@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(119, 'Katigbak, Trisha Mae Y.', '', 'trisha.katigbak94@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(120, 'Pineda, Michael Vincent AD.', '', 'michael.pineda99@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(121, 'Quezada, Nicole Mae AE.', '', 'nicole.quezada100@gmail.com', '123', 'CLIENT', 0, '2026-05-10 02:06:17', '2026-05-10 02:06:17'),
(123, 'Kacy', '', 'kmaldo@gmail.com', '123', 'CLIENT', 0, '2026-05-10 11:33:55', '2026-05-10 11:33:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
