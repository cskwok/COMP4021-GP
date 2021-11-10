-- --------------------------------------------------------
-- 主機:                           167.71.200.182
-- 伺服器版本:                        10.3.22-MariaDB-0+deb10u1 - Debian 10
-- 伺服器操作系統:                      debian-linux-gnu
-- HeidiSQL 版本:                  10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 傾印 socialdb 的資料庫結構
CREATE DATABASE IF NOT EXISTS `socialdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `socialdb`;

-- 傾印  表格 socialdb.commentlikes 結構
CREATE TABLE IF NOT EXISTS `commentlikes` (
  `likeid_c` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `commentid` int(11) unsigned NOT NULL,
  `userid` int(11) unsigned NOT NULL,
  `postid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`likeid_c`),
  KEY `commentid` (`commentid`),
  KEY `userid` (`userid`),
  KEY `postid` (`postid`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.commentlikes 的資料：~0 rows (約數)
/*!40000 ALTER TABLE `commentlikes` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentlikes` ENABLE KEYS */;

-- 傾印  表格 socialdb.comments 結構
CREATE TABLE IF NOT EXISTS `comments` (
  `commentid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `postid` int(11) unsigned NOT NULL,
  `userid` int(11) unsigned NOT NULL,
  `comment` text NOT NULL,
  `postTime` datetime NOT NULL,
  `editTime` datetime DEFAULT NULL,
  PRIMARY KEY (`commentid`),
  KEY `postid` (`postid`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.comments 的資料：~0 rows (約數)
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;

-- 傾印  表格 socialdb.friendrequests 結構
CREATE TABLE IF NOT EXISTS `friendrequests` (
  `requestid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `from_userid` int(10) unsigned NOT NULL,
  `to_userid` int(10) unsigned NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'waiting',
  PRIMARY KEY (`requestid`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.friendrequests 的資料：~0 rows (約數)
/*!40000 ALTER TABLE `friendrequests` DISABLE KEYS */;
/*!40000 ALTER TABLE `friendrequests` ENABLE KEYS */;

-- 傾印  表格 socialdb.friends 結構
CREATE TABLE IF NOT EXISTS `friends` (
  `friendid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user1id` int(10) unsigned NOT NULL,
  `user2id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`friendid`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.friends 的資料：~0 rows (約數)
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;

-- 傾印  表格 socialdb.postlikes 結構
CREATE TABLE IF NOT EXISTS `postlikes` (
  `likeid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(10) unsigned NOT NULL,
  `postid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`likeid`),
  KEY `userid` (`userid`),
  KEY `postid` (`postid`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.postlikes 的資料：~0 rows (約數)
/*!40000 ALTER TABLE `postlikes` DISABLE KEYS */;
/*!40000 ALTER TABLE `postlikes` ENABLE KEYS */;

-- 傾印  表格 socialdb.posts 結構
CREATE TABLE IF NOT EXISTS `posts` (
  `postid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(10) unsigned NOT NULL,
  `content` text DEFAULT NULL,
  `postTime` datetime NOT NULL,
  `editTime` datetime DEFAULT NULL,
  `postPic` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`postid`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.posts 的資料：~2 rows (約數)
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` (`postid`, `userid`, `content`, `postTime`, `editTime`, `postPic`) VALUES
	(188, 29, 'yummy', '2020-05-18 19:56:13', NULL, '9e1d08c2d4641d17a639479f9608cdcffa88b890.jpg'),
	(193, 42, 'angry :(', '2020-05-19 04:26:24', '2020-05-19 04:26:32', '651b332232729ed74630065e497ee899b21dcc18.jpg');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;

-- 傾印  表格 socialdb.sessions 結構
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.sessions 的資料：~2 rows (約數)
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

-- 傾印  表格 socialdb.users 結構
CREATE TABLE IF NOT EXISTS `users` (
  `userid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `gender` char(1) NOT NULL,
  `birthday` date NOT NULL,
  `bio` text DEFAULT NULL,
  `publicity` varchar(10) NOT NULL DEFAULT 'private',
  `pic` varchar(64) NOT NULL DEFAULT 'profile_pic_default.png',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- 正在傾印表格  socialdb.users 的資料：~2 rows (約數)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`userid`, `username`, `password`, `email`, `nickname`, `gender`, `birthday`, `bio`, `publicity`, `pic`) VALUES
	(29, 'jerry', '$2b$12$/viStkFexyZqn8j2lpwcFecvOuHV0KK18I5/EhfH2b9Y2wk4qvrfO', 'jerry@abc.com', 'Jerry', 'F', '1998-10-28', NULL, 'private', '3dc748077126cfe409d053a8ec1e2158ab27995c.png'),
	(42, 'tom', '$2b$12$4VmUloiXv8T9PcXELDtnLOiopq.2Ihtr1slwgOR9zgkQVf7KHgGna', 'tom@abc.com', 'Tom', 'M', '1997-07-30', 'I go to school by bus.', 'private', '8f9b75844a9629da49687c72055fd74f6bd4b6a9.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
