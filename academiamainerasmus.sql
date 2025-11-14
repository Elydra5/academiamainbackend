-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 14. 13:41
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `academiamainerasmus`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `duration` int(11) NOT NULL DEFAULT 120,
  `teacher` varchar(50) NOT NULL,
  `receipt_id` int(11) DEFAULT NULL,
  `hourly_rate` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `attendance`
--

INSERT INTO `attendance` (`id`, `group_id`, `student_id`, `date`, `duration`, `teacher`, `receipt_id`, `hourly_rate`) VALUES
(1, 1, 1, '2025-11-13', 120, 'test', 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `course_group`
--

CREATE TABLE `course_group` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `short_description` varchar(50) NOT NULL,
  `moodle_id` int(11) NOT NULL,
  `start_date` timestamp NULL DEFAULT current_timestamp(),
  `end_date` varchar(50) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'active',
  `teacher` varchar(50) DEFAULT NULL,
  `long_description` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `course_group`
--

INSERT INTO `course_group` (`id`, `name`, `short_description`, `moodle_id`, `start_date`, `end_date`, `status`, `teacher`, `long_description`) VALUES
(1, 'test', 'test', 100, '2025-11-13 12:06:54', '2025. 12. 01.', 'active', 'test', 'its a test description');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `enrollments`
--

INSERT INTO `enrollments` (`id`, `student_id`, `group_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `generated_receipts`
--

CREATE TABLE `generated_receipts` (
  `receipt_number` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `paid` int(11) NOT NULL DEFAULT 1,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `generated_receipts`
--

INSERT INTO `generated_receipts` (`receipt_number`, `student_id`, `period_start`, `period_end`, `paid`, `payment_date`, `total_amount`, `payment_method`) VALUES
(1, 1, '2025-11-13', '2025-11-13', 1, '2025-11-13 12:08:55', 1.00, 'card');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(200) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `enrollment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `student`
--

INSERT INTO `student` (`id`, `first_name`, `last_name`, `phone`, `enrollment_date`) VALUES
(1, 'teststudent', 'teststudent', '+236746214', '2025-11-13 12:08:06');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role` varchar(50) NOT NULL,
  `first_name` varchar(200) NOT NULL,
  `last_name` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `moodle_id` int(11) NOT NULL,
  `last_login` varchar(100) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`username`, `password`, `role`, `first_name`, `last_name`, `email`, `moodle_id`, `last_login`, `status`) VALUES
('test', '$2b$10$/RVnEbig5d4C8i/ynX8tmuqW1/ngYh6pWQi3LLOJsJb652IZqV/9G', 'test', 'test', 'test', 'test@test.test', 100, NULL, 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `group_id` (`group_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `teacher` (`teacher`),
  ADD KEY `receipt_attendance_fk` (`receipt_id`);

--
-- A tábla indexei `course_group`
--
ALTER TABLE `course_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacher` (`teacher`);

--
-- A tábla indexei `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `student_id` (`student_id`),
  ADD KEY `group_id` (`group_id`);

--
-- A tábla indexei `generated_receipts`
--
ALTER TABLE `generated_receipts`
  ADD PRIMARY KEY (`receipt_number`),
  ADD KEY `student_fk` (`student_id`);

--
-- A tábla indexei `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `course_group`
--
ALTER TABLE `course_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `generated_receipts`
--
ALTER TABLE `generated_receipts`
  MODIFY `receipt_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `receipt_attendance_fk` FOREIGN KEY (`receipt_id`) REFERENCES `generated_receipts` (`receipt_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_fk` FOREIGN KEY (`teacher`) REFERENCES `users` (`username`);

--
-- Megkötések a táblához `course_group`
--
ALTER TABLE `course_group`
  ADD CONSTRAINT `assigned_teacher_fk` FOREIGN KEY (`teacher`) REFERENCES `users` (`username`);

--
-- Megkötések a táblához `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `group_enrollment_fk` FOREIGN KEY (`group_id`) REFERENCES `course_group` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `generated_receipts`
--
ALTER TABLE `generated_receipts`
  ADD CONSTRAINT `student_fk` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
