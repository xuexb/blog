/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50528
Source Host           : localhost:3306
Source Database       : xuexb

Target Server Type    : MYSQL
Target Server Version : 50528
File Encoding         : 65001

Date: 2014-12-10 23:58:52
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='文章表';

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('1', '#测试', '#测试#测试#测试#测试', '1', '1417968861488', '1417968861488', '1', '0', '0', '这是测试', null, '1');
INSERT INTO `article` VALUES ('2', '<p>fdsfsdf</p>\n', 'fdsfsdf', '1', '1418223697716', '1418223697716', '4', '0', '0', 'test', null, '8');
INSERT INTO `article` VALUES ('3', '<p>fdsfsdf</p>\n', 'fdsfsdf', '1', '1418223753439', '1418223753439', '4', '0', '0', 'test', 'zaixianliuyan', '8');
INSERT INTO `article` VALUES ('4', '<h1 id=\"-\">去就测试日</h1>\n<pre><code class=\"lang-js\">alert(1);\n</code></pre>\n<pre><code class=\"lang-html\">&lt;a herf=&quot;#&quot;&gt;a&lt;/a&gt;\n</code></pre>\n<blockquote>\n<p>fdsfdsf\nfsdfds</p>\n<p>fdfsdf</p>\n</blockquote>\n<ul>\n<li>1</li>\n<li>2</li>\n<li><p>3</p>\n</li>\n<li><p>1</p>\n</li>\n<li>2</li>\n<li>3</li>\n</ul>\n<table>\n<thead>\n<tr>\n<th>fdfd</th>\n<th>fdsfd</th>\n<th>fdf</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>fsdf</td>\n<td>ffdfd</td>\n<td>fdfdf</td>\n</tr>\n</tbody>\n</table>\n', '# 去就测试日\r\n```js\r\nalert(1);\r\n```\r\n\r\n``` html\r\n<a herf=\"#\">a</a>\r\n```\r\n\r\n> fdsfdsf\r\n> fsdfds\r\n>\r\n> fdfsdf\r\n\r\n* 1\r\n* 2\r\n* 3\r\n\r\n1. 1\r\n2. 2\r\n3. 3\r\n\r\nfdfd | fdsfd | fdf\r\n--- | --- | ---\r\nfsdf | ffdfd | fdfdf', '1', '1418223833855', '1418223833855', '3', '0', '0', 'jshint配置', null, '8');
INSERT INTO `article` VALUES ('5', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p><b>324234</b></p>\n<p><hr>fdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226558987', '1418226558987', '1', '0', '0', '标签', null, '8');
INSERT INTO `article` VALUES ('6', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p><b>324234</b></p>\n<p><hr>fdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226561872', '1418226561872', '1', '0', '0', '标签', null, '8');
INSERT INTO `article` VALUES ('7', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p>324234\nfdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226626356', '1418226626356', '1', '0', '0', '标签', null, '8');
INSERT INTO `article` VALUES ('8', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p>324234\nfdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226628904', '1418226628904', '1', '0', '0', '标签', null, '8');
INSERT INTO `article` VALUES ('9', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p>324234\nfdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226631277', '1418226631277', '1', '0', '0', '标签', null, '8');

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
  `user_name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `user_pass` varchar(255) DEFAULT NULL COMMENT '密码',
  `status` int(1) DEFAULT '0' COMMENT '用户状态，1为禁用，0为启用',
  `update_ip` varchar(255) DEFAULT NULL COMMENT '最后登录IP',
  `create_ip` varchar(255) DEFAULT NULL COMMENT '创建时IP',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 MIN_ROWS=1000;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '谢亮', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `user` VALUES ('3', 'fdfdfdff', null, null, null, null, null, null, '1418221390217', '1418221390217', '0', '1', 'fdfdfdff', '51ba2fcc34ee04e9d68f0a370fb9783a', '0', '127.0.0.1', '127.0.0.1');
INSERT INTO `user` VALUES ('4', 'f发射点犯得上', null, null, null, null, null, null, '1418221428104', '1418221428104', '0', '1', 'f发射点犯得上', '2ecaec197671bb4e60da0dbc2a39c129', '0', '127.0.0.1', '127.0.0.1');
INSERT INTO `user` VALUES ('5', 'fsdfds', null, null, null, null, null, null, '1418221435336', '1418221435336', '0', '1', 'fsdfds', 'b6ce03635a3c48f97caeaa9384824a46', '0', '127.0.0.1', '127.0.0.1');
INSERT INTO `user` VALUES ('6', 'fsdfsd', null, null, null, null, null, null, '1418221459529', '1418221459529', '0', '1', 'fsdfsd', 'd58e3582afa99040e27b92b13c8f2280', '0', '127.0.0.1', '127.0.0.1');
INSERT INTO `user` VALUES ('7', 'fsdfsdf', null, null, null, null, null, null, '1418221513880', '1418221513880', '0', '1', 'fsdfsdf', '8cd8ed164b91837bc13004e9b1de2405', '0', '127.0.0.1', '127.0.0.1');
INSERT INTO `user` VALUES ('8', 'xuexb', null, null, null, null, null, null, '1418221527424', '1418221840209', '0', '4', 'xuexb', 'ac05168d4d9ebade9221878440e8885d', '0', '127.0.0.1', '127.0.0.1');
