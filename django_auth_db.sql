-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 23, 2025 at 02:11 AM
-- Server version: 11.7.2-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `django_auth_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts_comment`
--

CREATE TABLE `accounts_comment` (
  `id` bigint(20) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `project_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_comment`
--

INSERT INTO `accounts_comment` (`id`, `content`, `created_at`, `project_id`, `user_id`) VALUES
(1, 'This looks like a great project! What is your timeline for deployment?', '2025-04-05 09:00:00.000000', 1, 4),
(2, 'We plan to deploy the first 10 stations within 6 months of funding', '2025-04-05 10:00:00.000000', 1, 3),
(3, 'Love the sustainable approach to fashion!', '2025-04-10 11:00:00.000000', 2, 6),
(4, 'How does your AI handle complex patient needs?', '2025-03-20 12:00:00.000000', 3, 4),
(5, 'Our AI has been trained on thousands of care scenarios to handle most common situations', '2025-03-20 13:00:00.000000', 3, 3),
(6, 'Goood', '2025-04-22 23:04:19.046397', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `accounts_customuser`
--

CREATE TABLE `accounts_customuser` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_email_verified` tinyint(1) NOT NULL,
  `bio` longtext NOT NULL,
  `is_entrepreneur` tinyint(1) NOT NULL,
  `is_investor` tinyint(1) NOT NULL,
  `location` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `profile_picture` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_customuser`
--

INSERT INTO `accounts_customuser` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `is_staff`, `is_active`, `date_joined`, `email`, `is_email_verified`, `bio`, `is_entrepreneur`, `is_investor`, `location`, `phone_number`, `profile_picture`) VALUES
(2, 'pbkdf2_sha256$720000$cHmnk5qPoirzfiANyuERnM$4KfYE2ZeOqzs327J2Nr7ZR6RTC7ZRg50vDhNS2I+/9I=', '2025-04-22 22:57:15.893409', 0, 'Moeen', 'Moeen', 'Khan', 0, 1, '2025-04-21 18:05:49.995015', 'kmoeen3233@gmail.com', 1, '', 0, 0, '', '', 'profile_pics/icon.png'),
(3, 'pbkdf2_sha256$720000$abc123$def456', '2025-04-22 10:00:00.000000', 0, 'entrepreneur1', 'Sarah', 'Johnson', 0, 1, '2025-04-01 09:00:00.000000', 'sarah@example.com', 1, 'Tech entrepreneur with 10 years experience', 1, 0, 'San Francisco, CA', '5551234567', 'profile_pics/sarah.jpg'),
(4, 'pbkdf2_sha256$720000$ghi789$jkl012', '2025-04-22 11:00:00.000000', 0, 'investor1', 'Michael', 'Williams', 0, 1, '2025-04-02 10:00:00.000000', 'michael@example.com', 1, 'Angel investor focusing on green tech', 0, 1, 'New York, NY', '5552345678', 'profile_pics/michael.jpg'),
(5, 'pbkdf2_sha256$720000$mno345$pqr678', '2025-04-22 12:00:00.000000', 0, 'entrepreneur2', 'Lisa', 'Chen', 0, 1, '2025-04-03 11:00:00.000000', 'lisa@example.com', 1, 'Founder of sustainable fashion brand', 1, 0, 'Los Angeles, CA', '5553456789', 'profile_pics/lisa.jpg'),
(6, 'pbkdf2_sha256$720000$stu901$vwx234', '2025-04-22 13:00:00.000000', 0, 'investor2', 'David', 'Brown', 0, 1, '2025-04-04 12:00:00.000000', 'david@example.com', 1, 'Venture capitalist with focus on AI', 0, 1, 'Boston, MA', '5554567890', 'profile_pics/david.jpg'),
(7, 'pbkdf2_sha256$720000$QajILrLyUbSYYX8Jz61JjL$d3XxCQHAb6aAvklpBrCYilqIYJer+DRY4MtUZTd3OWU=', NULL, 1, 'innovest', '', '', 1, 1, '2025-04-22 22:17:02.718135', 'innovest05@gmail.com', 0, '', 0, 0, '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `accounts_customuser_groups`
--

CREATE TABLE `accounts_customuser_groups` (
  `id` bigint(20) NOT NULL,
  `customuser_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_customuser_user_permissions`
--

CREATE TABLE `accounts_customuser_user_permissions` (
  `id` bigint(20) NOT NULL,
  `customuser_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_emailverificationtoken`
--

CREATE TABLE `accounts_emailverificationtoken` (
  `id` bigint(20) NOT NULL,
  `token` uuid NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_investment`
--

CREATE TABLE `accounts_investment` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `investment_type` varchar(10) NOT NULL,
  `equity_percentage` decimal(5,2) DEFAULT NULL,
  `interest_rate` decimal(5,2) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `investor_id` bigint(20) NOT NULL,
  `project_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_investment`
--

INSERT INTO `accounts_investment` (`id`, `amount`, `investment_type`, `equity_percentage`, `interest_rate`, `created_at`, `status`, `investor_id`, `project_id`) VALUES
(1, 50000.00, 'EQUITY', 5.00, NULL, '2025-04-10 09:00:00.000000', 'APPROVED', 4, 1),
(2, 25000.00, 'EQUITY', 2.50, NULL, '2025-04-12 10:00:00.000000', 'APPROVED', 6, 1),
(3, 30000.00, 'EQUITY', 3.00, NULL, '2025-04-15 11:00:00.000000', 'APPROVED', 4, 2),
(4, 750000.00, 'EQUITY', 20.00, NULL, '2025-03-20 12:00:00.000000', 'APPROVED', 6, 3);

-- --------------------------------------------------------

--
-- Table structure for table `accounts_project`
--

CREATE TABLE `accounts_project` (
  `id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `category` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `goal_amount` decimal(12,2) NOT NULL,
  `raised_amount` decimal(12,2) NOT NULL,
  `equity_offered` decimal(5,2) NOT NULL,
  `end_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `featured_image` varchar(100) NOT NULL,
  `video_url` varchar(200) DEFAULT NULL,
  `business_plan` varchar(100) DEFAULT NULL,
  `entrepreneur_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_project`
--

INSERT INTO `accounts_project` (`id`, `title`, `description`, `category`, `status`, `goal_amount`, `raised_amount`, `equity_offered`, `end_date`, `created_at`, `updated_at`, `featured_image`, `video_url`, `business_plan`, `entrepreneur_id`) VALUES
(1, 'Solar-Powered Urban Charging Stations', 'Network of solar-powered charging stations for electric vehicles in urban areas', 'TECHNOLOGY', 'ACTIVE', 500000.00, 125000.00, 15.00, '2025-12-31', '2025-04-01 09:00:00.000000', '2025-04-20 10:00:00.000000', 'projects/solar_charging.jpg', 'https://youtu.be/example1', 'business_plans/solar_plan.pdf', 3),
(2, 'Recycled Denim Collection', 'Fashion line made entirely from recycled denim materials', 'FASHION', 'ACTIVE', 100000.00, 45000.00, 10.00, '2025-11-30', '2025-04-05 10:00:00.000000', '2025-04-18 11:00:00.000000', 'projects/denim_collection.jpg', 'https://youtu.be/example2', 'business_plans/denim_plan.pdf', 5),
(3, 'AI-Powered Healthcare Assistant Robot', 'Robotic assistant for elderly care facilities with AI capabilities', 'HEALTHCARE', 'FUNDED', 750000.00, 750000.00, 20.00, '2025-10-31', '2025-03-15 11:00:00.000000', '2025-04-15 12:00:00.000000', 'projects/healthcare_robot.jpg', 'https://youtu.be/example3', 'business_plans/robot_plan.pdf', 3);

-- --------------------------------------------------------

--
-- Table structure for table `accounts_projectupdate`
--

CREATE TABLE `accounts_projectupdate` (
  `id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `project_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_projectupdate`
--

INSERT INTO `accounts_projectupdate` (`id`, `title`, `content`, `created_at`, `image`, `project_id`) VALUES
(1, 'First Prototype Completed', 'We have successfully completed our first working prototype of the solar charging station!', '2025-04-15 09:00:00.000000', 'updates/prototype1.jpg', 1),
(2, 'Material Sourcing', 'Secured partnerships with denim recycling facilities in three states', '2025-04-12 10:00:00.000000', 'updates/denim_sourcing.jpg', 2),
(3, 'FDA Approval', 'Received preliminary FDA approval for our healthcare robot in assisted living facilities', '2025-04-01 11:00:00.000000', 'updates/fda_approval.jpg', 3),
(4, 'Investment Milestone', 'Reached 25% of our funding goal - thank you to all our supporters!', '2025-04-18 12:00:00.000000', 'updates/funding_update.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add user', 6, 'add_customuser'),
(22, 'Can change user', 6, 'change_customuser'),
(23, 'Can delete user', 6, 'delete_customuser'),
(24, 'Can view user', 6, 'view_customuser'),
(25, 'Can add email verification token', 7, 'add_emailverificationtoken'),
(26, 'Can change email verification token', 7, 'change_emailverificationtoken'),
(27, 'Can delete email verification token', 7, 'delete_emailverificationtoken'),
(28, 'Can view email verification token', 7, 'view_emailverificationtoken'),
(29, 'Can add crowdfunding campaign', 8, 'add_crowdfundingcampaign'),
(30, 'Can change crowdfunding campaign', 8, 'change_crowdfundingcampaign'),
(31, 'Can delete crowdfunding campaign', 8, 'delete_crowdfundingcampaign'),
(32, 'Can view crowdfunding campaign', 8, 'view_crowdfundingcampaign'),
(33, 'Can add company', 9, 'add_company'),
(34, 'Can change company', 9, 'change_company'),
(35, 'Can delete company', 9, 'delete_company'),
(36, 'Can view company', 9, 'view_company'),
(37, 'Can add contribution', 10, 'add_contribution'),
(38, 'Can change contribution', 10, 'change_contribution'),
(39, 'Can delete contribution', 10, 'delete_contribution'),
(40, 'Can view contribution', 10, 'view_contribution'),
(41, 'Can add crowdfunding campaign', 11, 'add_crowdfundingcampaign'),
(42, 'Can change crowdfunding campaign', 11, 'change_crowdfundingcampaign'),
(43, 'Can delete crowdfunding campaign', 11, 'delete_crowdfundingcampaign'),
(44, 'Can view crowdfunding campaign', 11, 'view_crowdfundingcampaign'),
(45, 'Can add company', 12, 'add_company'),
(46, 'Can change company', 12, 'change_company'),
(47, 'Can delete company', 12, 'delete_company'),
(48, 'Can view company', 12, 'view_company'),
(49, 'Can add contribution', 13, 'add_contribution'),
(50, 'Can change contribution', 13, 'change_contribution'),
(51, 'Can delete contribution', 13, 'delete_contribution'),
(52, 'Can view contribution', 13, 'view_contribution'),
(53, 'Can add product', 14, 'add_product'),
(54, 'Can change product', 14, 'change_product'),
(55, 'Can delete product', 14, 'delete_product'),
(56, 'Can view product', 14, 'view_product'),
(57, 'Can add comment', 15, 'add_comment'),
(58, 'Can change comment', 15, 'change_comment'),
(59, 'Can delete comment', 15, 'delete_comment'),
(60, 'Can view comment', 15, 'view_comment'),
(61, 'Can add investment', 16, 'add_investment'),
(62, 'Can change investment', 16, 'change_investment'),
(63, 'Can delete investment', 16, 'delete_investment'),
(64, 'Can view investment', 16, 'view_investment'),
(65, 'Can add project', 17, 'add_project'),
(66, 'Can change project', 17, 'change_project'),
(67, 'Can delete project', 17, 'delete_project'),
(68, 'Can view project', 17, 'view_project'),
(69, 'Can add project update', 18, 'add_projectupdate'),
(70, 'Can change project update', 18, 'change_projectupdate'),
(71, 'Can delete project update', 18, 'delete_projectupdate'),
(72, 'Can view project update', 18, 'view_projectupdate'),
(73, 'Can add featured company', 19, 'add_featuredcompany'),
(74, 'Can change featured company', 19, 'change_featuredcompany'),
(75, 'Can delete featured company', 19, 'delete_featuredcompany'),
(76, 'Can view featured company', 19, 'view_featuredcompany'),
(77, 'Can add comment', 20, 'add_comment'),
(78, 'Can change comment', 20, 'change_comment'),
(79, 'Can delete comment', 20, 'delete_comment'),
(80, 'Can view comment', 20, 'view_comment'),
(81, 'Can add team member', 21, 'add_teammember'),
(82, 'Can change team member', 21, 'change_teammember'),
(83, 'Can delete team member', 21, 'delete_teammember'),
(84, 'Can view team member', 21, 'view_teammember'),
(85, 'Can add product', 22, 'add_product'),
(86, 'Can change product', 22, 'change_product'),
(87, 'Can delete product', 22, 'delete_product'),
(88, 'Can view product', 22, 'view_product'),
(89, 'Can add investment', 23, 'add_investment'),
(90, 'Can change investment', 23, 'change_investment'),
(91, 'Can delete investment', 23, 'delete_investment'),
(92, 'Can view investment', 23, 'view_investment'),
(93, 'Can add product image', 24, 'add_productimage'),
(94, 'Can change product image', 24, 'change_productimage'),
(95, 'Can delete product image', 24, 'delete_productimage'),
(96, 'Can view product image', 24, 'view_productimage');

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_comment`
--

CREATE TABLE `crowdfunding_comment` (
  `id` bigint(20) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_company`
--

CREATE TABLE `crowdfunding_company` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `industry_type` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `website` varchar(200) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `owner_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crowdfunding_company`
--

INSERT INTO `crowdfunding_company` (`id`, `name`, `industry_type`, `location`, `description`, `website`, `logo`, `status`, `created_at`, `updated_at`, `owner_id`) VALUES
(1, 'GreenTech Innovations', 'Clean Technology', 'San Francisco, CA', 'Developing sustainable energy solutions for urban environments', 'https://greentech.example.com', 'logos/greentech.png', 'Active', '2025-01-15 09:00:00.000000', '2025-04-01 10:00:00.000000', 3),
(2, 'EcoFashion Co', 'Sustainable Fashion', 'Los Angeles, CA', 'Creating eco-friendly clothing from recycled materials', 'https://ecofashion.example.com', 'logos/ecofashion.png', 'Active', '2025-02-10 10:00:00.000000', '2025-04-05 11:00:00.000000', 5),
(3, 'Future Robotics', 'Artificial Intelligence', 'Boston, MA', 'Building next-generation service robots for healthcare', 'https://futurerobotics.example.com', 'logos/robotics.png', 'Active', '2025-03-05 11:00:00.000000', '2025-04-10 12:00:00.000000', 3);

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_contribution`
--

CREATE TABLE `crowdfunding_contribution` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `comment` longtext DEFAULT NULL,
  `anonymous` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `contributor_id` bigint(20) NOT NULL,
  `campaign_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crowdfunding_contribution`
--

INSERT INTO `crowdfunding_contribution` (`id`, `amount`, `comment`, `anonymous`, `created_at`, `contributor_id`, `campaign_id`) VALUES
(1, 5000.00, 'Great initiative!', 0, '2025-04-05 09:00:00.000000', 2, 1),
(2, 10000.00, 'Happy to support green energy', 0, '2025-04-08 10:00:00.000000', 4, 1),
(3, 2500.00, NULL, 1, '2025-04-10 11:00:00.000000', 5, 2),
(4, 50000.00, 'This project aligns with our values', 0, '2025-04-12 12:00:00.000000', 6, 1),
(5, 500000.00, 'Excited about this technology!', 0, '2025-03-15 13:00:00.000000', 4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_crowdfundingcampaign`
--

CREATE TABLE `crowdfunding_crowdfundingcampaign` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `target_amount` decimal(12,2) NOT NULL,
  `current_amount` decimal(12,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `company_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crowdfunding_crowdfundingcampaign`
--

INSERT INTO `crowdfunding_crowdfundingcampaign` (`id`, `title`, `description`, `target_amount`, `current_amount`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`, `company_id`) VALUES
(1, 'Community Solar Initiative', 'Bring solar power to low-income neighborhoods', 250000.00, 120000.00, '2025-04-01', '2025-06-30', 'Active', '2025-04-01 09:00:00.000000', '2025-04-22 10:00:00.000000', 1),
(2, 'Zero-Waste Fashion Line', 'Launch our new zero-waste clothing collection', 150000.00, 65000.00, '2025-04-05', '2025-07-15', 'Active', '2025-04-05 10:00:00.000000', '2025-04-22 11:00:00.000000', 2),
(3, 'Robotics for Senior Care', 'Develop robots to assist in elderly care facilities', 500000.00, 500000.00, '2025-03-10', '2025-05-31', 'Completed', '2025-03-10 11:00:00.000000', '2025-04-15 12:00:00.000000', 3);

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_featuredcompany`
--

CREATE TABLE `crowdfunding_featuredcompany` (
  `id` bigint(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `logo` varchar(100) NOT NULL,
  `location` varchar(200) NOT NULL,
  `website` varchar(200) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crowdfunding_featuredcompany`
--

INSERT INTO `crowdfunding_featuredcompany` (`id`, `name`, `description`, `logo`, `location`, `website`, `created_at`, `is_active`) VALUES
(1, 'GreenTech Innovations', 'Leading the way in sustainable urban energy solutions', 'featured/greentech.png', 'San Francisco, CA', 'https://greentech.example.com', '2025-04-01 09:00:00.000000', 1),
(2, 'EcoFashion Co', 'Revolutionizing fashion with sustainable materials', 'featured/ecofashion.png', 'Los Angeles, CA', 'https://ecofashion.example.com', '2025-04-05 10:00:00.000000', 1),
(3, 'Future Robotics', 'Building the next generation of service robots', 'featured/robotics.png', 'Boston, MA', 'https://futurerobotics.example.com', '2025-04-10 11:00:00.000000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_investment`
--

CREATE TABLE `crowdfunding_investment` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `equity_percentage` decimal(5,2) NOT NULL,
  `payment_status` varchar(20) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `investor_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_product`
--

CREATE TABLE `crowdfunding_product` (
  `id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `category` varchar(20) NOT NULL,
  `short_description` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `cover_image` varchar(100) NOT NULL,
  `video_url` varchar(200) DEFAULT NULL,
  `goal_amount` decimal(10,2) NOT NULL,
  `minimum_investment` decimal(10,2) NOT NULL,
  `raised_amount` decimal(10,2) NOT NULL,
  `equity_offered` decimal(5,2) NOT NULL,
  `funding_status` varchar(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `risks` longtext NOT NULL,
  `business_plan` varchar(100) NOT NULL,
  `website` varchar(200) NOT NULL,
  `fundraiser_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_productimage`
--

CREATE TABLE `crowdfunding_productimage` (
  `id` bigint(20) NOT NULL,
  `image` varchar(100) NOT NULL,
  `caption` varchar(200) NOT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_product_gallery_images`
--

CREATE TABLE `crowdfunding_product_gallery_images` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `productimage_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_product_team_members`
--

CREATE TABLE `crowdfunding_product_team_members` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `teammember_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crowdfunding_teammember`
--

CREATE TABLE `crowdfunding_teammember` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `bio` longtext NOT NULL,
  `image` varchar(100) NOT NULL,
  `linkedin_url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(15, 'accounts', 'comment'),
(12, 'accounts', 'company'),
(13, 'accounts', 'contribution'),
(11, 'accounts', 'crowdfundingcampaign'),
(6, 'accounts', 'customuser'),
(7, 'accounts', 'emailverificationtoken'),
(16, 'accounts', 'investment'),
(14, 'accounts', 'product'),
(17, 'accounts', 'project'),
(18, 'accounts', 'projectupdate'),
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'contenttypes', 'contenttype'),
(20, 'crowdfunding', 'comment'),
(9, 'crowdfunding', 'company'),
(10, 'crowdfunding', 'contribution'),
(8, 'crowdfunding', 'crowdfundingcampaign'),
(19, 'crowdfunding', 'featuredcompany'),
(23, 'crowdfunding', 'investment'),
(22, 'crowdfunding', 'product'),
(24, 'crowdfunding', 'productimage'),
(21, 'crowdfunding', 'teammember'),
(5, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-04-21 17:52:11.604364'),
(2, 'contenttypes', '0002_remove_content_type_name', '2025-04-21 17:52:11.643734'),
(3, 'auth', '0001_initial', '2025-04-21 17:52:11.809109'),
(4, 'auth', '0002_alter_permission_name_max_length', '2025-04-21 17:52:11.836902'),
(5, 'auth', '0003_alter_user_email_max_length', '2025-04-21 17:52:11.840902'),
(6, 'auth', '0004_alter_user_username_opts', '2025-04-21 17:52:11.845900'),
(7, 'auth', '0005_alter_user_last_login_null', '2025-04-21 17:52:11.849900'),
(8, 'auth', '0006_require_contenttypes_0002', '2025-04-21 17:52:11.851900'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2025-04-21 17:52:11.855900'),
(10, 'auth', '0008_alter_user_username_max_length', '2025-04-21 17:52:11.859900'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2025-04-21 17:52:11.868902'),
(12, 'auth', '0010_alter_group_name_max_length', '2025-04-21 17:52:11.888903'),
(13, 'auth', '0011_update_proxy_permissions', '2025-04-21 17:52:11.894903'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2025-04-21 17:52:11.907901'),
(15, 'accounts', '0001_initial', '2025-04-21 17:52:12.162092'),
(16, 'admin', '0001_initial', '2025-04-21 17:52:12.226262'),
(17, 'admin', '0002_logentry_remove_auto_add', '2025-04-21 17:52:12.232262'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2025-04-21 17:52:12.238262'),
(19, 'sessions', '0001_initial', '2025-04-21 17:52:12.268142'),
(20, 'crowdfunding', '0001_initial', '2025-04-22 09:58:54.559930'),
(21, 'accounts', '0002_company_crowdfundingcampaign_contribution', '2025-04-22 13:34:31.044780'),
(22, 'accounts', '0003_product', '2025-04-22 19:00:28.900834'),
(23, 'accounts', '0004_auto_20250423_0242', '2025-04-22 20:42:55.770466'),
(24, 'crowdfunding', '0002_featuredcompany', '2025-04-22 22:35:25.194387'),
(25, 'accounts', '0005_alter_comment_user_alter_investment_investor', '2025-04-22 23:02:50.100120'),
(26, 'crowdfunding', '0003_productimage_teammember_product_investment_comment', '2025-04-22 23:02:50.568097');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('25kqujz87phup9ibb6vdxqq8jkh1kbko', 'e30:1u7Dm4:pRpIBTbxIj1aJXyizp9zAYdLnL7ZKVRWbGkm7fykvno', '2025-05-06 13:34:56.322092'),
('3ac6wzcgwvmmqvvjdsah8kb072ngnltx', '.eJxVjEEOwiAQRe_C2pABmQ64dO8ZyMCgVA1NSrsy3l2bdKHb_977LxV5XWpce5njKOqkrDr8bonzo7QNyJ3bbdJ5ass8Jr0peqddXyYpz_Pu_h1U7vVbe4uQyHLxXFBwsOAgc3BHAeMgiQhSYO_JGA5o5WoAHQKFoSAZsur9AckzNqs:1u7C96:Xj1KA9MdjPjfNLdUCfi0RyoFNUQFlg7ruiArH5P9LBY', '2025-05-06 11:50:36.863507'),
('7hik7pwicme9q7jzq7an6590d72v408d', 'e30:1u7Dtt:nFV7z6EnZT7BrxLQGN3yMjD-aa9v9h4nl3TiMG_RPrU', '2025-05-06 13:43:01.355460'),
('hz893p9iusea9ydh8454l7easrthq4mi', '.eJxVjEEOwiAQRe_C2hAZSgGX7nsGMtOZStVAUtqV8e7apAvd_vfef6mE25rT1mRJM6uLAnX63QjHh5Qd8B3LreqxlnWZSe-KPmjTQ2V5Xg_37yBjy9-axE-WWGJngrBzoaMYKE6BrHUGvIfo2JzZA3jukQwgGEKHAXsK4NX7A-gJN6k:1u7MYF:FFYod7f4fPAwSbOCh-VWjTW54ATm3Kg_Bf2VGhZmETU', '2025-05-06 22:57:15.893409'),
('jeoiwihaa5r5ozt0i2o5plbp3u7tc277', 'e30:1u7BvJ:r7YOhCkM87yIa6NvUG4JwqDPcQdvKvffLkbjXR6ysaM', '2025-05-06 11:36:21.543948'),
('mqiclm1jxouptirt3dtq5314hjvnlcqf', '.eJxVjEEOwiAQRe_C2pABmQ64dO8ZyMCgVA1NSrsy3l2bdKHb_977LxV5XWpce5njKOqkrDr8bonzo7QNyJ3bbdJ5ass8Jr0peqddXyYpz_Pu_h1U7vVbe4uQyHLxXFBwsOAgc3BHAeMgiQhSYO_JGA5o5WoAHQKFoSAZsur9AckzNqs:1u6vXq:w7lWYSw8s9f5hQC4x20QBm72HXppljHnSLyQ8NBkuMg', '2025-05-05 18:07:02.741301'),
('mzhnz7doc44wpl3yt313rn1wihhzqcwx', 'e30:1u7BqI:qLbu-di7JV8EfNXRPGlASkVzhDsR-F9bRUlF_8aZODE', '2025-05-06 11:31:10.921682'),
('nsbwc3f3qd89nj2kqnmo44o7uuio1tgn', 'e30:1u7KXZ:Ojlrf-XbBpm6b1hFC_VoG8OaWrS_WZZobD3f3Tz2Nj8', '2025-05-06 20:48:25.178733'),
('zkud4djsdtnl50x52x5wt8oo39wcyopi', 'e30:1u7Dnj:B9gYnpqXVJLztyF2jw-ve4VjunsmTq_eBt_mXzTK5JI', '2025-05-06 13:36:39.466619'),
('zo12966swbqwc8nxxvp9m117ehvfgh4q', 'e30:1u7M5c:qdh3PwJHSg4VZDY3EK5zjPA8Ev0r9ZAi0C_U-5jFCx8', '2025-05-06 22:27:40.643893');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `raised_amount` decimal(10,2) DEFAULT NULL,
  `goal_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `image`, `raised_amount`, `goal_amount`) VALUES
(1, 'Product-1', 'feni_flood.png', 10000.00, 30000.00),
(2, 'Solar Charger', 'solar_charger.png', 125000.00, 500000.00),
(3, 'Eco Denim Jacket', 'denim_jacket.png', 45000.00, 100000.00),
(4, 'Healthcare Robot', 'healthcare_robot.png', 750000.00, 750000.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_comment`
--
ALTER TABLE `accounts_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accounts_comment_project_id_9b8c4308_fk_accounts_project_id` (`project_id`),
  ADD KEY `accounts_comment_user_id_7847fb99_fk_accounts_customuser_id` (`user_id`);

--
-- Indexes for table `accounts_customuser`
--
ALTER TABLE `accounts_customuser`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `accounts_customuser_groups`
--
ALTER TABLE `accounts_customuser_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `accounts_customuser_groups_customuser_id_group_id_c074bdcb_uniq` (`customuser_id`,`group_id`),
  ADD KEY `accounts_customuser_groups_group_id_86ba5f9e_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `accounts_customuser_user_permissions`
--
ALTER TABLE `accounts_customuser_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `accounts_customuser_user_customuser_id_permission_9632a709_uniq` (`customuser_id`,`permission_id`),
  ADD KEY `accounts_customuser__permission_id_aea3d0e5_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `accounts_emailverificationtoken`
--
ALTER TABLE `accounts_emailverificationtoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `accounts_investment`
--
ALTER TABLE `accounts_investment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accounts_investment_investor_id_80ba60ad_fk_accounts_` (`investor_id`),
  ADD KEY `accounts_investment_project_id_0124dd7b_fk_accounts_project_id` (`project_id`);

--
-- Indexes for table `accounts_project`
--
ALTER TABLE `accounts_project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accounts_project_entrepreneur_id_9f576069_fk_accounts_` (`entrepreneur_id`);

--
-- Indexes for table `accounts_projectupdate`
--
ALTER TABLE `accounts_projectupdate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accounts_projectupda_project_id_9ba386a8_fk_accounts_` (`project_id`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `crowdfunding_comment`
--
ALTER TABLE `crowdfunding_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crowdfunding_comment_parent_id_633a1a32_fk_crowdfund` (`parent_id`),
  ADD KEY `crowdfunding_comment_user_id_a0900eb0_fk_accounts_customuser_id` (`user_id`),
  ADD KEY `crowdfunding_comment_product_id_d6948406_fk_crowdfund` (`product_id`);

--
-- Indexes for table `crowdfunding_company`
--
ALTER TABLE `crowdfunding_company`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crowdfunding_company_owner_id_c25a1a30_fk_accounts_customuser_id` (`owner_id`);

--
-- Indexes for table `crowdfunding_contribution`
--
ALTER TABLE `crowdfunding_contribution`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crowdfunding_contrib_contributor_id_f0fc930e_fk_accounts_` (`contributor_id`),
  ADD KEY `crowdfunding_contrib_campaign_id_1a10e52b_fk_crowdfund` (`campaign_id`);

--
-- Indexes for table `crowdfunding_crowdfundingcampaign`
--
ALTER TABLE `crowdfunding_crowdfundingcampaign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crowdfunding_crowdfu_company_id_e6fa83f8_fk_crowdfund` (`company_id`);

--
-- Indexes for table `crowdfunding_featuredcompany`
--
ALTER TABLE `crowdfunding_featuredcompany`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crowdfunding_investment`
--
ALTER TABLE `crowdfunding_investment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `crowdfunding_investm_investor_id_3d7660a1_fk_accounts_` (`investor_id`),
  ADD KEY `crowdfunding_investm_product_id_7cc6f410_fk_crowdfund` (`product_id`);

--
-- Indexes for table `crowdfunding_product`
--
ALTER TABLE `crowdfunding_product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `crowdfunding_product_fundraiser_id_a8e312fc_fk_accounts_` (`fundraiser_id`);

--
-- Indexes for table `crowdfunding_productimage`
--
ALTER TABLE `crowdfunding_productimage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `crowdfunding_product_gallery_images`
--
ALTER TABLE `crowdfunding_product_gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `crowdfunding_product_gal_product_id_productimage__a9053c48_uniq` (`product_id`,`productimage_id`),
  ADD KEY `crowdfunding_product_productimage_id_6145871a_fk_crowdfund` (`productimage_id`);

--
-- Indexes for table `crowdfunding_product_team_members`
--
ALTER TABLE `crowdfunding_product_team_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `crowdfunding_product_tea_product_id_teammember_id_4797ec5c_uniq` (`product_id`,`teammember_id`),
  ADD KEY `crowdfunding_product_teammember_id_370b2788_fk_crowdfund` (`teammember_id`);

--
-- Indexes for table `crowdfunding_teammember`
--
ALTER TABLE `crowdfunding_teammember`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_accounts_customuser_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts_comment`
--
ALTER TABLE `accounts_comment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `accounts_customuser`
--
ALTER TABLE `accounts_customuser`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `accounts_customuser_groups`
--
ALTER TABLE `accounts_customuser_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accounts_customuser_user_permissions`
--
ALTER TABLE `accounts_customuser_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accounts_emailverificationtoken`
--
ALTER TABLE `accounts_emailverificationtoken`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `accounts_investment`
--
ALTER TABLE `accounts_investment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `accounts_project`
--
ALTER TABLE `accounts_project`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `accounts_projectupdate`
--
ALTER TABLE `accounts_projectupdate`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `crowdfunding_comment`
--
ALTER TABLE `crowdfunding_comment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crowdfunding_company`
--
ALTER TABLE `crowdfunding_company`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `crowdfunding_contribution`
--
ALTER TABLE `crowdfunding_contribution`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `crowdfunding_crowdfundingcampaign`
--
ALTER TABLE `crowdfunding_crowdfundingcampaign`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `crowdfunding_featuredcompany`
--
ALTER TABLE `crowdfunding_featuredcompany`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `crowdfunding_investment`
--
ALTER TABLE `crowdfunding_investment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crowdfunding_product`
--
ALTER TABLE `crowdfunding_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crowdfunding_productimage`
--
ALTER TABLE `crowdfunding_productimage`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crowdfunding_product_gallery_images`
--
ALTER TABLE `crowdfunding_product_gallery_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crowdfunding_product_team_members`
--
ALTER TABLE `crowdfunding_product_team_members`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crowdfunding_teammember`
--
ALTER TABLE `crowdfunding_teammember`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts_comment`
--
ALTER TABLE `accounts_comment`
  ADD CONSTRAINT `accounts_comment_project_id_9b8c4308_fk_accounts_project_id` FOREIGN KEY (`project_id`) REFERENCES `accounts_project` (`id`),
  ADD CONSTRAINT `accounts_comment_user_id_7847fb99_fk_accounts_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_customuser` (`id`);

--
-- Constraints for table `accounts_customuser_groups`
--
ALTER TABLE `accounts_customuser_groups`
  ADD CONSTRAINT `accounts_customuser__customuser_id_bc55088e_fk_accounts_` FOREIGN KEY (`customuser_id`) REFERENCES `accounts_customuser` (`id`),
  ADD CONSTRAINT `accounts_customuser_groups_group_id_86ba5f9e_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `accounts_customuser_user_permissions`
--
ALTER TABLE `accounts_customuser_user_permissions`
  ADD CONSTRAINT `accounts_customuser__customuser_id_0deaefae_fk_accounts_` FOREIGN KEY (`customuser_id`) REFERENCES `accounts_customuser` (`id`),
  ADD CONSTRAINT `accounts_customuser__permission_id_aea3d0e5_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);

--
-- Constraints for table `accounts_emailverificationtoken`
--
ALTER TABLE `accounts_emailverificationtoken`
  ADD CONSTRAINT `accounts_emailverifi_user_id_4ff4e6c5_fk_accounts_` FOREIGN KEY (`user_id`) REFERENCES `accounts_customuser` (`id`);

--
-- Constraints for table `accounts_investment`
--
ALTER TABLE `accounts_investment`
  ADD CONSTRAINT `accounts_investment_investor_id_80ba60ad_fk_accounts_` FOREIGN KEY (`investor_id`) REFERENCES `accounts_customuser` (`id`),
  ADD CONSTRAINT `accounts_investment_project_id_0124dd7b_fk_accounts_project_id` FOREIGN KEY (`project_id`) REFERENCES `accounts_project` (`id`);

--
-- Constraints for table `accounts_project`
--
ALTER TABLE `accounts_project`
  ADD CONSTRAINT `accounts_project_entrepreneur_id_9f576069_fk_accounts_` FOREIGN KEY (`entrepreneur_id`) REFERENCES `accounts_customuser` (`id`);

--
-- Constraints for table `accounts_projectupdate`
--
ALTER TABLE `accounts_projectupdate`
  ADD CONSTRAINT `accounts_projectupda_project_id_9ba386a8_fk_accounts_` FOREIGN KEY (`project_id`) REFERENCES `accounts_project` (`id`);

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `crowdfunding_comment`
--
ALTER TABLE `crowdfunding_comment`
  ADD CONSTRAINT `crowdfunding_comment_parent_id_633a1a32_fk_crowdfund` FOREIGN KEY (`parent_id`) REFERENCES `crowdfunding_comment` (`id`),
  ADD CONSTRAINT `crowdfunding_comment_product_id_d6948406_fk_crowdfund` FOREIGN KEY (`product_id`) REFERENCES `crowdfunding_product` (`id`),
  ADD CONSTRAINT `crowdfunding_comment_user_id_a0900eb0_fk_accounts_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_customuser` (`id`);

--
-- Constraints for table `crowdfunding_company`
--
ALTER TABLE `crowdfunding_company`
  ADD CONSTRAINT `crowdfunding_company_owner_id_c25a1a30_fk_accounts_customuser_id` FOREIGN KEY (`owner_id`) REFERENCES `accounts_customuser` (`id`);

--
-- Constraints for table `crowdfunding_contribution`
--
ALTER TABLE `crowdfunding_contribution`
  ADD CONSTRAINT `crowdfunding_contrib_campaign_id_1a10e52b_fk_crowdfund` FOREIGN KEY (`campaign_id`) REFERENCES `crowdfunding_crowdfundingcampaign` (`id`),
  ADD CONSTRAINT `crowdfunding_contrib_contributor_id_f0fc930e_fk_accounts_` FOREIGN KEY (`contributor_id`) REFERENCES `accounts_customuser` (`id`);

--
-- Constraints for table `crowdfunding_crowdfundingcampaign`
--
ALTER TABLE `crowdfunding_crowdfundingcampaign`
  ADD CONSTRAINT `crowdfunding_crowdfu_company_id_e6fa83f8_fk_crowdfund` FOREIGN KEY (`company_id`) REFERENCES `crowdfunding_company` (`id`);

--
-- Constraints for table `crowdfunding_investment`
--
ALTER TABLE `crowdfunding_investment`
  ADD CONSTRAINT `crowdfunding_investm_investor_id_3d7660a1_fk_accounts_` FOREIGN KEY (`investor_id`) REFERENCES `accounts_customuser` (`id`),
  ADD CONSTRAINT `crowdfunding_investm_product_id_7cc6f410_fk_crowdfund` FOREIGN KEY (`product_id`) REFERENCES `crowdfunding_product` (`id`);

--
-- Constraints for table `crowdfunding_product`
--
ALTER TABLE `crowdfunding_product`
  ADD CONSTRAINT `crowdfunding_product_fundraiser_id_a8e312fc_fk_accounts_` FOREIGN KEY (`fundraiser_id`) REFERENCES `accounts_customuser` (`id`);

--
-- Constraints for table `crowdfunding_product_gallery_images`
--
ALTER TABLE `crowdfunding_product_gallery_images`
  ADD CONSTRAINT `crowdfunding_product_product_id_d5d67fe7_fk_crowdfund` FOREIGN KEY (`product_id`) REFERENCES `crowdfunding_product` (`id`),
  ADD CONSTRAINT `crowdfunding_product_productimage_id_6145871a_fk_crowdfund` FOREIGN KEY (`productimage_id`) REFERENCES `crowdfunding_productimage` (`id`);

--
-- Constraints for table `crowdfunding_product_team_members`
--
ALTER TABLE `crowdfunding_product_team_members`
  ADD CONSTRAINT `crowdfunding_product_product_id_1ba7fcd6_fk_crowdfund` FOREIGN KEY (`product_id`) REFERENCES `crowdfunding_product` (`id`),
  ADD CONSTRAINT `crowdfunding_product_teammember_id_370b2788_fk_crowdfund` FOREIGN KEY (`teammember_id`) REFERENCES `crowdfunding_teammember` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_accounts_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_customuser` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
