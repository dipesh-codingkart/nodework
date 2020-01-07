-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2020 at 05:58 AM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_login`
--

CREATE TABLE `admin_login` (
  `admin_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin_login`
--

INSERT INTO `admin_login` (`admin_id`, `name`, `email`, `password`) VALUES
(1, 'quizadmin', 'xyz@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `queans`
--

CREATE TABLE `queans` (
  `qa_id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `option` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `usetime` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `queans`
--

INSERT INTO `queans` (`qa_id`, `question`, `option`, `answer`, `usetime`) VALUES
(19, 'what is 10+2 ?', '{\"10\":\"10\",\"12\":\"12\"}', '12', '00:01:00'),
(20, 'A,B,...,D', '{\"C\":\"C\",\"D\":\"D\"}', 'C', '00:01:00'),
(21, '12+4 =  ?', '{\"11\":\"11\",\"12\":\"12\",\"16\":\"16\",\"19\":\"19\"}', '16', '00:01:00'),
(26, 'node js use express module', '{\"yes\":\"yes\",\"no\":\"no\"}', 'yes', '00:01:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int(3) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `age`, `email`) VALUES
(1, 'ddddd', 12, 'x@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `users_result`
--

CREATE TABLE `users_result` (
  `id` int(11) NOT NULL,
  `correct_ans` bigint(11) NOT NULL,
  `total_answer` varchar(11) NOT NULL,
  `attempt_ques` bigint(11) NOT NULL,
  `status` int(4) NOT NULL DEFAULT '1',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_result`
--

INSERT INTO `users_result` (`id`, `correct_ans`, `total_answer`, `attempt_ques`, `status`, `create_date`) VALUES
(60, 1, '5', 5, 1, '2019-12-25 20:07:11'),
(61, 1, '5', 5, 1, '2020-01-05 05:38:47'),
(62, 0, '5', 5, 1, '2020-01-05 10:28:06'),
(63, 0, '5', 5, 1, '2020-01-05 10:38:36'),
(64, 0, '5', 5, 1, '2020-01-05 10:44:14'),
(65, 3, '5', 5, 1, '2020-01-05 10:53:20'),
(66, 3, '3', 3, 1, '2020-01-05 11:12:13'),
(67, 1, '3', 1, 1, '2020-01-05 11:17:43'),
(68, 2, '4', 4, 1, '2020-01-05 11:40:45'),
(69, 1, '3', 1, 1, '2020-01-06 19:55:46'),
(70, 0, '3', 0, 1, '2020-01-06 19:56:24'),
(71, 1, '3', 2, 1, '2020-01-06 19:57:45'),
(72, 2, '4', 4, 1, '2020-01-06 19:59:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_login`
--
ALTER TABLE `admin_login`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `queans`
--
ALTER TABLE `queans`
  ADD PRIMARY KEY (`qa_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_result`
--
ALTER TABLE `users_result`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_login`
--
ALTER TABLE `admin_login`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `queans`
--
ALTER TABLE `queans`
  MODIFY `qa_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users_result`
--
ALTER TABLE `users_result`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
