-- phpMyAdmin SQL Dump
-- version 4.5.3.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 31, 2019 at 07:22 PM
-- Server version: 5.6.28
-- PHP Version: 5.5.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bravo`
--

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `code` char(3) NOT NULL,
  `name` varchar(30) NOT NULL,
  `is_crypto` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`code`, `name`, `is_crypto`) VALUES
('BRL', 'Brazilian Real', 0),
('BTC', 'Bitcoin', 1),
('ETH', 'Ethereum', 1),
('EUR', 'Euro', 0),
('USD', 'United States Dollar', 0);

--
-- Triggers `currency`
--
DELIMITER $$
CREATE TRIGGER `currency_PreventDeletion` BEFORE DELETE ON `currency` FOR EACH ROW BEGIN

  IF old.code = "USD" THEN 
    SIGNAL SQLSTATE '45000'       SET MESSAGE_TEXT = 'This record is allowed to be remove!';
  END IF;

END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `currency`
--
ALTER TABLE `currency`
  ADD PRIMARY KEY (`code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
