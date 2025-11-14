SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(200) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `enrollment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `duration` int(11) NOT NULL DEFAULT '120',
  `teacher` varchar(50) NOT NULL,
  `receipt_id` int(11) DEFAULT NULL,
  `hourly_rate` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `course_group` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `short_description` varchar(50) NOT NULL,
  `moodle_id` int(11) NOT NULL,
  `start_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` varchar(50) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'active',
  `teacher` varchar(50) DEFAULT NULL,
  `long_description` varchar(1000) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `generated_receipts` (
  `receipt_number` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `paid` int(11) NOT NULL DEFAULT '1',
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role` varchar(50) NOT NULL,
  `first_name` varchar(200) NOT NULL,
  `last_name` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `moodle_id` int(11) NOT NULL,
  `last_login` varchar(100) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `student_id` (`student_id`),
  ADD KEY `group_id` (`group_id`);

ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `group_id` (`group_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `teacher` (`teacher`),
  ADD KEY `receipt_attendance_fk` (`receipt_id`);

ALTER TABLE `course_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacher` (`teacher`);

ALTER TABLE `generated_receipts`
  ADD PRIMARY KEY (`receipt_number`),
  ADD KEY `student_fk` (`student_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);


ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `course_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `generated_receipts`
  MODIFY `receipt_number` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `enrollments`
  ADD CONSTRAINT `group_enrollment_fk` FOREIGN KEY (`group_id`) REFERENCES `course_group` (`id`) ON DELETE CASCADE;

ALTER TABLE `attendance`
  ADD CONSTRAINT `teacher_fk` FOREIGN KEY (`teacher`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `receipt_attendance_fk` FOREIGN KEY (`receipt_id`) REFERENCES `generated_receipts` (`receipt_number`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `course_group`
  ADD CONSTRAINT `assigned_teacher_fk` FOREIGN KEY (`teacher`) REFERENCES `users` (`username`);

ALTER TABLE `generated_receipts`
  ADD CONSTRAINT `student_fk` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);