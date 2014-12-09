/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50528
Source Host           : localhost:3306
Source Database       : xuexb

Target Server Type    : MYSQL
Target Server Version : 50528
File Encoding         : 65001

Date: 2014-12-09 16:45:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `article`
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `markdown_content` text COMMENT 'md格式的内容',
  `content` text COMMENT '内容',
  `hit` bigint(20) DEFAULT NULL COMMENT '查看次数',
  `create_date` bigint(20) DEFAULT NULL COMMENT '创建时间',
  `update_date` bigint(20) DEFAULT NULL COMMENT '更新时间',
  `list_id` int(2) DEFAULT NULL COMMENT '分类ID',
  `is_jing` smallint(1) DEFAULT '0' COMMENT '是否加精',
  `is_ding` smallint(1) DEFAULT '0' COMMENT '是否置顶',
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `url` varchar(255) DEFAULT NULL COMMENT '链接',
  `create_uid` int(2) DEFAULT NULL COMMENT '创建人ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='文章表';

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('1', '#测试', '#测试#测试#测试#测试', '1', '1417968861488', '1417968861488', '1', '0', '0', '这是测试', null, '1');

-- ----------------------------
-- Table structure for `list`
-- ----------------------------
DROP TABLE IF EXISTS `list`;
CREATE TABLE `list` (
  `id` int(2) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) DEFAULT NULL COMMENT '分类名',
  `url` varchar(255) DEFAULT NULL COMMENT '链接',
  `keywords` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='分类表';

-- ----------------------------
-- Records of list
-- ----------------------------
INSERT INTO `list` VALUES ('1', '电脑知识', 'diannaozhishi', null, null);
INSERT INTO `list` VALUES ('2', '前端开发', 'qianduankaifa', null, null);
INSERT INTO `list` VALUES ('3', 'Nodejs', 'nodejs', null, null);
INSERT INTO `list` VALUES ('4', '记事本', 'jishiben', null, null);

-- ----------------------------
-- Table structure for `search`
-- ----------------------------
DROP TABLE IF EXISTS `search`;
CREATE TABLE `search` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '搜索的词',
  `hit` bigint(20) DEFAULT NULL COMMENT '搜索次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of search
-- ----------------------------

-- ----------------------------
-- Table structure for `tags`
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `create_date` bigint(20) DEFAULT NULL COMMENT '添加时间',
  `update_date` bigint(20) DEFAULT NULL COMMENT '更新时间 ',
  `hit` bigint(20) DEFAULT NULL COMMENT '标签查看次数',
  `create_uid` int(1) DEFAULT NULL COMMENT '创建用户ID',
  `url` varchar(255) DEFAULT NULL COMMENT '链接',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='标签表';

-- ----------------------------
-- Records of tags
-- ----------------------------
INSERT INTO `tags` VALUES ('1', '测试1', null, null, '1', '1', null);
INSERT INTO `tags` VALUES ('2', '测试2', null, null, '1', '1', null);
INSERT INTO `tags` VALUES ('3', '地圭', null, null, '1', '1', null);

-- ----------------------------
-- Table structure for `tags_index`
-- ----------------------------
DROP TABLE IF EXISTS `tags_index`;
CREATE TABLE `tags_index` (
  `tags_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '标签ID',
  `article_id` bigint(20) NOT NULL COMMENT '文章ID',
  PRIMARY KEY (`tags_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签索引表';

-- ----------------------------
-- Records of tags_index
-- ----------------------------
INSERT INTO `tags_index` VALUES ('1', '1');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(2) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(255) DEFAULT NULL COMMENT '昵称',
  `address` varchar(255) DEFAULT NULL,
  `description` text,
  `email` varchar(255) DEFAULT NULL,
  `sex` int(1) DEFAULT NULL,
  `job` varchar(255) DEFAULT NULL,
  `qq` int(11) DEFAULT NULL,
  `create_date` bigint(20) DEFAULT NULL,
  `update_date` bigint(20) DEFAULT NULL,
  `hit` bigint(20) DEFAULT NULL,
  `login_hit` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 MIN_ROWS=1000;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '谢亮', null, null, null, null, null, null, null, null, null, null);
