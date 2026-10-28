-- ============================================================================
-- Barangay San Juan Management System (Licab, Nueva Ecija)
-- MySQL / MariaDB Database Schema (XAMPP / phpMyAdmin)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `barangay_sanjuan_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `barangay_sanjuan_db`;

-- Clean up any incompatible legacy tables if previously imported
DROP TABLE IF EXISTS `system_meta`;
DROP TABLE IF EXISTS `staff_users`;
DROP TABLE IF EXISTS `blotter_cases`;
DROP TABLE IF EXISTS `barangay_officials`;
DROP TABLE IF EXISTS `emergency_hotlines`;

-- ----------------------------------------------------------------------------
-- 1. Admin Users Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(64) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `full_name` VARCHAR(180) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `contact_no` VARCHAR(40) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `purok` VARCHAR(80) NOT NULL DEFAULT 'Purok 1',
  `password` VARCHAR(255) NOT NULL DEFAULT 'admin123',
  `avatar_url` LONGTEXT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Residents Table (Registrations, Approvals, Population & Voters)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `residents` (
  `id` VARCHAR(64) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `full_name` VARCHAR(180) NOT NULL,
  `email` VARCHAR(150) NOT NULL DEFAULT '',
  `contact_no` VARCHAR(40) NOT NULL DEFAULT '',
  `address` VARCHAR(255) NOT NULL DEFAULT '',
  `purok` VARCHAR(80) NOT NULL DEFAULT 'Purok 1',
  `street` VARCHAR(150) DEFAULT '',
  `house_no` VARCHAR(60) DEFAULT '',
  `civil_status` VARCHAR(40) NOT NULL DEFAULT 'Single',
  `is_registered_voter` TINYINT(1) NOT NULL DEFAULT 0,
  `role` VARCHAR(20) NOT NULL DEFAULT 'resident',
  `status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
  `request_date` VARCHAR(64) NOT NULL,
  `avatar_url` LONGTEXT DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL DEFAULT 'password123',
  `temporary_password` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_residents_status` (`status`),
  KEY `idx_residents_purok` (`purok`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Document Requests Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `document_requests` (
  `id` VARCHAR(64) NOT NULL,
  `resident_id` VARCHAR(64) NOT NULL,
  `full_name` VARCHAR(180) NOT NULL,
  `profile_url` LONGTEXT DEFAULT NULL,
  `contact_no` VARCHAR(40) NOT NULL DEFAULT '',
  `address` VARCHAR(255) NOT NULL DEFAULT '',
  `document_type` VARCHAR(150) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `is_archived` TINYINT(1) NOT NULL DEFAULT 0,
  `purpose` TEXT NOT NULL,
  `date_requested` VARCHAR(64) NOT NULL,
  `pickup_period` VARCHAR(64) NOT NULL,
  `control_no` VARCHAR(64) NOT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_doc_resident` (`resident_id`),
  KEY `idx_doc_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Announcements Table (Starts empty by default)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `description` TEXT NOT NULL,
  `event_time` VARCHAR(150) DEFAULT '',
  `image_url` LONGTEXT DEFAULT NULL,
  `author` VARCHAR(150) NOT NULL DEFAULT 'Barangay Admin',
  `author_avatar` LONGTEXT DEFAULT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  `sort_ts` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Announcement Comments Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `announcement_comments` (
  `id` VARCHAR(64) NOT NULL,
  `announcement_id` VARCHAR(64) NOT NULL,
  `author` VARCHAR(150) NOT NULL,
  `author_avatar` LONGTEXT DEFAULT NULL,
  `content` TEXT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  `sort_ts` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_comment_ann` (`announcement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Resident Messages & Blotter Reports Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `resident_messages` (
  `id` VARCHAR(64) NOT NULL,
  `resident_id` VARCHAR(64) NOT NULL,
  `resident_name` VARCHAR(180) NOT NULL,
  `resident_avatar` LONGTEXT DEFAULT NULL,
  `contact_no` VARCHAR(40) NOT NULL DEFAULT '',
  `message` TEXT NOT NULL,
  `category` VARCHAR(120) NOT NULL DEFAULT 'General Inquiry',
  `status` VARCHAR(40) NOT NULL DEFAULT 'Pending',
  `created_at` VARCHAR(64) NOT NULL,
  `sort_ts` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_msg_resident` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Message Replies Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `message_replies` (
  `id` VARCHAR(64) NOT NULL,
  `message_id` VARCHAR(64) NOT NULL,
  `sender` VARCHAR(150) NOT NULL DEFAULT 'Barangay Admin',
  `message` TEXT NOT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  `sort_ts` BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_reply_msg` (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin Account (Hon. Harold Villaroman)
INSERT IGNORE INTO `admin_users` (
  `id`, `first_name`, `last_name`, `full_name`, `email`, `contact_no`, `address`, `purok`, `password`, `avatar_url`
) VALUES (
  'admin-1',
  'Hon. Harold',
  'Villaroman',
  'Hon. Harold Villaroman',
  'admin.sanjuan@licab.gov.ph',
  '09944258953',
  'Barangay Hall, San Juan, Licab, Nueva Ecija',
  'Purok 1',
  'admin123',
  '/user_profile_default.png'
);
