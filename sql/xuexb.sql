/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50528
Source Host           : localhost:3306
Source Database       : xuexb

Target Server Type    : MYSQL
Target Server Version : 50528
File Encoding         : 65001

Date: 2014-12-11 19:49:39
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
  `markdown_content_list` text COMMENT '列表用md文档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='文章表';

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('1', '<h1 id=\"-\">订单状态</h1>\n<h2 id=\"-\">订单的所有状态：</h2>\n<pre><code class=\"lang-js\">var a= 1;\nalert(a);\n</code></pre>\n<p>{<strong>list</strong>}</p>\n<pre><code class=\"lang-css\">.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {\n    position:relative;\n    margin-top:1em;\n    margin-bottom:16px;\n    font-weight:bold;\n    line-height:1.4\n}\n</code></pre>\n<ul>\n<li><code>1</code> 订单被取消。订单在后台显示. 但是前台不再显示 </li>\n<li><code>2</code> 订单创建中。说明：未确定（时间. 外景地. 套餐）任一个。 </li>\n<li><code>3</code> 订单创建完成。 </li>\n<li><code>4</code> 已交定金。 </li>\n<li><code>5</code> 拍摄前锁定。</li>\n<li><code>6</code> 拍摄中。</li>\n<li><code>7</code> 尾款交齐。WEB：浏览影集 </li>\n<li><code>8</code> 婚纱照已上传。长显示：婚纱照已上传（等待新人选择精修）。WEB：浏览影集. 选择精修 </li>\n<li><code>9</code> 精修选择完成。长显示：精修选择完成（摄影师制作中）。WEB：浏览影集. 浏览精修 </li>\n<li><code>10</code> 精修已上传。长显示：精修已上传（等待新人确定）。WEB：浏览影集. 确认精修. 确认精修完成（操作） </li>\n<li><code>11</code> 精修完成。长显示：精修完成（等待婚件定制）。WEB：浏览影集. 浏览精修. 婚件制作（操作） </li>\n<li><code>12</code> 婚件定制完成。长显示：婚件定制完成（婚件制作中）。WEB：浏览影集. 浏览精修 </li>\n<li><code>13</code> 交易完成。WEB：浏览影集. 浏览精修 </li>\n<li><code>14</code> 交易协商中。 </li>\n</ul>\n<h2 id=\"-\">子订单：</h2>\n<ul>\n<li><code>101</code> 补充订单被取消。订单在后台显示. 但是前台不再显示 </li>\n<li><code>102</code> 补充订单创建中。说明：等待用户确认定制完成。 </li>\n<li><code>103</code> 补充订单确定。等待用户付款。有付款链接 </li>\n<li><code>104</code> 付款完成。 </li>\n<li><code>105</code> 精修已上传。长显示：精修已上传（等待新人确定）。WEB：确认精修. 确认精修完成（操作） </li>\n<li><code>106</code> 精修完成。长显示：精修完成（婚件制作中）。WEB：确认收货（操作） </li>\n<li><code>107</code> 交易完成。 </li>\n<li><code>108</code> 交易协商中。 </li>\n</ul>\n<h2 id=\"-\">子订单逻辑</h2>\n<h3 id=\"1-ps-\">1 如果子订单里只有PS精修</h3>\n<p>在确认子订单后进入状态 <code>103</code>，会在<code>APP</code>上生成付款链接，交钱后进入 <code>104</code>，此时摄影师可以上传<strong>修后照片</strong>，然后确认 <strong>精修</strong>，进入 <code>105</code>，用户此时可以查看子订单的<strong>修后照片</strong>，并对其进行<code>ok</code>or<code>no</code>，用户在所有照片都<code>ok</code>后可对这个子订单进行<strong>精修完成确认</strong>，此时因该子订单为纯PS精修，那么在确认后会直接进入 <code>107</code> 交易完成</p>\n<blockquote>\n<p>1.1 这里有个点就是：摄影师在通过用户已上传精修照后，此时订单会进入<code>105</code>,而这时用户要求再<strong>重修</strong>，那么子订单状态码是不变的，摄影师再次修完这个照片后上传就不用确认了，因为状态本来就是 <code>105</code>, 用户可以直接进入查看，并操作<code>ok</code>or<code>no</code></p>\n</blockquote>\n<h3 id=\"2-\">2 如果子订单里只有婚件制作</h3>\n<p>在确认子订单后进入状态 <code>103</code>，会在<code>APP</code>上生成付款链接，交钱后由于该子订单只有婚件没有PS，所以直接进入 <code>106</code> 的状态，用户可以进行 <strong>确认收货</strong> 处理，然后进入  <code>107</code></p>\n<h3 id=\"3-ps-\">3 如果子订单里包含PS精修和婚件制作</h3>\n<p>在确认子订单后进入状态 <code>103</code>，会在<code>APP</code>上生成付款链接，交钱后进入 <code>104</code>，此时摄影师可以上传<strong>修后照片</strong>，然后确认 <strong>精修</strong>，进入 <code>105</code>，用户此时可以查看子订单的<strong>修后照片</strong>，并对其进行<code>ok</code>or<code>no</code>，用户在所有照片都<code>ok</code>后可对这个子订单进行<strong>精修完成确认</strong>，进入 <code>106</code> 的状态，用户可以进行 <strong>确认收货</strong> 处理，然后进入  <code>107</code></p>\n<h2 id=\"-\">订单逻辑</h2>\n<p>在操作套外婚件的时候就为该主订单生成子订单，状态为102，并在新人主页显示，用户在套外确认前的所有套外婚件都属于该订单，一但确认用户要是再选套外的就再生成一个， 套内套外不相干，可并行操作</p>\n<h2 id=\"-\">页面访问权限</h2>\n<blockquote>\n<p>注： 加粗的表示为页面按钮元素，高亮的数字表示订单状态码！</p>\n</blockquote>\n<h3 id=\"-\">查看影集页面 - 摄影师</h3>\n<p>在 <code>7-13</code> 可进入，页面上的 <strong>上传按钮</strong> 在 <code>13</code> 的时候不显示</p>\n<h3 id=\"-\">精修单页面 - 摄影师</h3>\n<p>在 <code>9,10</code> 可进入，页面上的 <strong>确认完成</strong> 在 <code>10</code>的时候不显示</p>\n<blockquote>\n<p>调用的数据是用户要求修的套内婚件照片，一旦确认，则会在用户端显示，用户要求<strong>重修</strong>后又会在该页显示，修完后就不用再确认了</p>\n</blockquote>\n<h3 id=\"-\">上传页面 - 摄影师</h3>\n<p>在 <code>7-12</code> 可进入</p>\n<blockquote>\n<p>上传照片的数据必须大于等于套餐内要求的数据</p>\n</blockquote>\n<h3 id=\"-ps-\">套外PS精修页面 - 摄影师</h3>\n<p>在 <code>104-105</code> 可进入，页面上的 <strong>确认完成</strong> 在<code>105</code>的时候不显示</p>\n<blockquote>\n<p>调用的数据是用户套外额外添加的，一旦确认，则会在用户端显示，用户要求<strong>重修</strong>后又会在该页显示，修完后就不用再确认了</p>\n</blockquote>\n<h3 id=\"-\">查看影集页面 - 新人</h3>\n<p>在 <code>7-13</code> 可进入，<strong>打包下载</strong> 在<code>13</code>的时候可用</p>\n<h3 id=\"-\">查看精修页面 - 新人</h3>\n<p>在 <code>7-13</code> 可进入，<strong>打包下载</strong> 在<code>13</code>的时候可用</p>\n<blockquote>\n<p>该页调用的数据是用户筛选的修后照片，且为用户<strong>OK</strong>的</p>\n</blockquote>\n<h3 id=\"-\">选择精修页面 - 新人</h3>\n<p>在 <code>8</code> 可进入，选择完成后该页不可进入</p>\n<blockquote>\n<p>这里确认的条件是选择的必须等于套餐内送的</p>\n</blockquote>\n<h3 id=\"-\">精修确认页面 - 新人</h3>\n<p>在 <code>10, 105</code> 可进入，用户可在该状态下反复的要求摄影师<strong>重修</strong>，一旦确认，该页面不可进入</p>\n<blockquote>\n<p>这里确认的条件是必须确认的等于要求修的数量</p>\n</blockquote>\n<h3 id=\"-\">套内婚件列表  - 新人</h3>\n<p>在 <code>11</code> 可进入，一旦确认，则不能进入，如果有没有确认的套外婚件则会“作废”（不显示）</p>\n<h3 id=\"-\">套内婚件制作页面  - 新人</h3>\n<p>在 <code>11</code> 可进入，该页的<strong>确认按钮</strong>其实就是返回列表页面的链接，只是做一下数量的判断，不满足不能返回</p>\n<blockquote>\n<p>该页调用的数据为用户精修的照片，且为<strong>OK</strong>状态的，如果数量不够或者不满意可以在套外选择“PS精修”</p>\n</blockquote>\n<h3 id=\"-\">套外婚件列表 - 新人</h3>\n<p>在 <code>11</code> 可进入，确认套外后会生成子订单，用户可再次进入该页进行另外的套外制作，多个套外不冲突</p>\n<blockquote>\n<p>一个子订单内只能有一个“PS精修”</p>\n<p>婚件的完成度为 当前已选择照片数量等于婚件内要求照片数量</p>\n<p>PS完成度为 1张表示已完成，否则为制作中</p>\n</blockquote>\n<h3 id=\"-\">套外婚件制作页面 - 新人</h3>\n<p>在 <code>11</code> 可进入</p>\n<blockquote>\n<p>该页调用的数据为用户精修的照片，且为<strong>OK</strong>状态的，如果数量不够或者不满意可以在套外选择“PS精修”</p>\n</blockquote>\n<h3 id=\"-ps-\">套外PS精修页面 - 新人</h3>\n<p>在 <code>11</code> 可进入</p>\n<blockquote>\n<p>该页调用的数据为用户没有修精过的照片，数量不限，以张为单位计算</p>\n</blockquote>\n', '# 订单状态\r\n\r\n## 订单的所有状态：\r\n\r\n```js\r\nvar a= 1;\r\nalert(a);\r\n```\r\n{__list__}\r\n```css\r\n.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {\r\n    position:relative;\r\n    margin-top:1em;\r\n    margin-bottom:16px;\r\n    font-weight:bold;\r\n    line-height:1.4\r\n}\r\n```\r\n\r\n* `1` 订单被取消。订单在后台显示. 但是前台不再显示 \r\n* `2` 订单创建中。说明：未确定（时间. 外景地. 套餐）任一个。 \r\n* `3` 订单创建完成。 \r\n* `4` 已交定金。 \r\n* `5` 拍摄前锁定。\r\n* `6` 拍摄中。\r\n* `7` 尾款交齐。WEB：浏览影集 \r\n* `8` 婚纱照已上传。长显示：婚纱照已上传（等待新人选择精修）。WEB：浏览影集. 选择精修 \r\n* `9` 精修选择完成。长显示：精修选择完成（摄影师制作中）。WEB：浏览影集. 浏览精修 \r\n* `10` 精修已上传。长显示：精修已上传（等待新人确定）。WEB：浏览影集. 确认精修. 确认精修完成（操作） \r\n* `11` 精修完成。长显示：精修完成（等待婚件定制）。WEB：浏览影集. 浏览精修. 婚件制作（操作） \r\n* `12` 婚件定制完成。长显示：婚件定制完成（婚件制作中）。WEB：浏览影集. 浏览精修 \r\n* `13` 交易完成。WEB：浏览影集. 浏览精修 \r\n* `14` 交易协商中。 \r\n\r\n\r\n## 子订单：\r\n\r\n* `101` 补充订单被取消。订单在后台显示. 但是前台不再显示 \r\n* `102` 补充订单创建中。说明：等待用户确认定制完成。 \r\n* `103` 补充订单确定。等待用户付款。有付款链接 \r\n* `104` 付款完成。 \r\n* `105` 精修已上传。长显示：精修已上传（等待新人确定）。WEB：确认精修. 确认精修完成（操作） \r\n* `106` 精修完成。长显示：精修完成（婚件制作中）。WEB：确认收货（操作） \r\n* `107` 交易完成。 \r\n* `108` 交易协商中。 \r\n\r\n\r\n## 子订单逻辑\r\n\r\n### 1 如果子订单里只有PS精修\r\n\r\n在确认子订单后进入状态 `103`，会在`APP`上生成付款链接，交钱后进入 `104`，此时摄影师可以上传**修后照片**，然后确认 **精修**，进入 `105`，用户此时可以查看子订单的**修后照片**，并对其进行`ok`or`no`，用户在所有照片都`ok`后可对这个子订单进行**精修完成确认**，此时因该子订单为纯PS精修，那么在确认后会直接进入 `107` 交易完成\r\n\r\n> 1.1 这里有个点就是：摄影师在通过用户已上传精修照后，此时订单会进入`105`,而这时用户要求再**重修**，那么子订单状态码是不变的，摄影师再次修完这个照片后上传就不用确认了，因为状态本来就是 `105`, 用户可以直接进入查看，并操作`ok`or`no`\r\n\r\n### 2 如果子订单里只有婚件制作\r\n\r\n在确认子订单后进入状态 `103`，会在`APP`上生成付款链接，交钱后由于该子订单只有婚件没有PS，所以直接进入 `106` 的状态，用户可以进行 **确认收货** 处理，然后进入  `107`\r\n\r\n### 3 如果子订单里包含PS精修和婚件制作\r\n\r\n在确认子订单后进入状态 `103`，会在`APP`上生成付款链接，交钱后进入 `104`，此时摄影师可以上传**修后照片**，然后确认 **精修**，进入 `105`，用户此时可以查看子订单的**修后照片**，并对其进行`ok`or`no`，用户在所有照片都`ok`后可对这个子订单进行**精修完成确认**，进入 `106` 的状态，用户可以进行 **确认收货** 处理，然后进入  `107`\r\n\r\n\r\n\r\n## 订单逻辑\r\n\r\n在操作套外婚件的时候就为该主订单生成子订单，状态为102，并在新人主页显示，用户在套外确认前的所有套外婚件都属于该订单，一但确认用户要是再选套外的就再生成一个， 套内套外不相干，可并行操作\r\n\r\n\r\n## 页面访问权限\r\n\r\n> 注： 加粗的表示为页面按钮元素，高亮的数字表示订单状态码！\r\n\r\n### 查看影集页面 - 摄影师\r\n\r\n在 `7-13` 可进入，页面上的 **上传按钮** 在 `13` 的时候不显示\r\n\r\n### 精修单页面 - 摄影师\r\n\r\n在 `9,10` 可进入，页面上的 **确认完成** 在 `10 `的时候不显示\r\n\r\n> 调用的数据是用户要求修的套内婚件照片，一旦确认，则会在用户端显示，用户要求**重修**后又会在该页显示，修完后就不用再确认了\r\n\r\n### 上传页面 - 摄影师\r\n\r\n在 `7-12` 可进入\r\n\r\n> 上传照片的数据必须大于等于套餐内要求的数据\r\n\r\n### 套外PS精修页面 - 摄影师\r\n\r\n在 `104-105` 可进入，页面上的 **确认完成** 在`105`的时候不显示\r\n\r\n> 调用的数据是用户套外额外添加的，一旦确认，则会在用户端显示，用户要求**重修**后又会在该页显示，修完后就不用再确认了\r\n\r\n### 查看影集页面 - 新人\r\n\r\n在 `7-13` 可进入，**打包下载** 在`13`的时候可用\r\n\r\n### 查看精修页面 - 新人\r\n\r\n在 `7-13` 可进入，**打包下载** 在`13`的时候可用\r\n\r\n> 该页调用的数据是用户筛选的修后照片，且为用户**OK**的\r\n\r\n### 选择精修页面 - 新人\r\n\r\n在 `8` 可进入，选择完成后该页不可进入\r\n\r\n> 这里确认的条件是选择的必须等于套餐内送的\r\n\r\n### 精修确认页面 - 新人\r\n\r\n在 `10, 105` 可进入，用户可在该状态下反复的要求摄影师**重修**，一旦确认，该页面不可进入\r\n\r\n> 这里确认的条件是必须确认的等于要求修的数量\r\n\r\n### 套内婚件列表  - 新人\r\n\r\n在 `11` 可进入，一旦确认，则不能进入，如果有没有确认的套外婚件则会“作废”（不显示）\r\n\r\n### 套内婚件制作页面  - 新人\r\n\r\n在 `11` 可进入，该页的**确认按钮**其实就是返回列表页面的链接，只是做一下数量的判断，不满足不能返回\r\n\r\n> 该页调用的数据为用户精修的照片，且为**OK**状态的，如果数量不够或者不满意可以在套外选择“PS精修”\r\n\r\n### 套外婚件列表 - 新人\r\n\r\n在 `11` 可进入，确认套外后会生成子订单，用户可再次进入该页进行另外的套外制作，多个套外不冲突\r\n\r\n> 一个子订单内只能有一个“PS精修”\r\n> \r\n> 婚件的完成度为 当前已选择照片数量等于婚件内要求照片数量\r\n>\r\n> PS完成度为 1张表示已完成，否则为制作中\r\n\r\n### 套外婚件制作页面 - 新人\r\n\r\n在 `11` 可进入\r\n\r\n> 该页调用的数据为用户精修的照片，且为**OK**状态的，如果数量不够或者不满意可以在套外选择“PS精修”\r\n\r\n### 套外PS精修页面 - 新人\r\n\r\n在 `11` 可进入\r\n\r\n> 该页调用的数据为用户没有修精过的照片，数量不限，以张为单位计算', '1', '1417968861488', '1418298285666', '1', '0', '0', '这是测试', null, '<h1 id=\"-\">订单状态</h1>\n<h2 id=\"-\">订单的所有状态：</h2>\n<pre><code class=\"lang-js\">var a= 1;\nalert(a);\n</code></pre>\n');
INSERT INTO `article` VALUES ('2', '<p>fdsfsdf</p>\n', 'fdsfsdf', '1', '1418223697716', '1418223697716', '4', '0', '0', 'test', null, null);
INSERT INTO `article` VALUES ('3', '<h1 id=\"-\">订单状态</h1>\n<h2 id=\"-\">订单的所有状态：</h2>\n<ul>\n<li><code>1</code> 订单被取消。订单在后台显示. 但是前台不再显示 </li>\n<li><code>2</code> 订单创建中。说明：未确定（时间. 外景地. 套餐）任一个。 </li>\n<li><code>3</code> 订单创建完成。 </li>\n<li><code>4</code> 已交定金。 </li>\n<li><code>5</code> 拍摄前锁定。</li>\n<li><code>6</code> 拍摄中。</li>\n<li><code>7</code> 尾款交齐。WEB：浏览影集 </li>\n<li><code>8</code> 婚纱照已上传。长显示：婚纱照已上传（等待新人选择精修）。WEB：浏览影集. 选择精修 </li>\n<li><code>9</code> 精修选择完成。长显示：精修选择完成（摄影师制作中）。WEB：浏览影集. 浏览精修 </li>\n<li><code>10</code> 精修已上传。长显示：精修已上传（等待新人确定）。WEB：浏览影集. 确认精修. 确认精修完成（操作） </li>\n<li><code>11</code> 精修完成。长显示：精修完成（等待婚件定制）。WEB：浏览影集. 浏览精修. 婚件制作（操作） </li>\n<li><code>12</code> 婚件定制完成。长显示：婚件定制完成（婚件制作中）。WEB：浏览影集. 浏览精修 </li>\n<li><code>13</code> 交易完成。WEB：浏览影集. 浏览精修 </li>\n<li><code>14</code> 交易协商中。 </li>\n</ul>\n<h2 id=\"-\">子订单：</h2>\n<ul>\n<li><code>101</code> 补充订单被取消。订单在后台显示. 但是前台不再显示 </li>\n<li><code>102</code> 补充订单创建中。说明：等待用户确认定制完成。 </li>\n<li><code>103</code> 补充订单确定。等待用户付款。有付款链接 </li>\n<li><code>104</code> 付款完成。 </li>\n<li><code>105</code> 精修已上传。长显示：精修已上传（等待新人确定）。WEB：确认精修. 确认精修完成（操作） </li>\n<li><code>106</code> 精修完成。长显示：精修完成（婚件制作中）。WEB：确认收货（操作） </li>\n<li><code>107</code> 交易完成。 </li>\n<li><code>108</code> 交易协商中。 </li>\n</ul>\n<h2 id=\"-\">子订单逻辑</h2>\n<h3 id=\"1-ps-\">1 如果子订单里只有PS精修</h3>\n<p>在确认子订单后进入状态 <code>103</code>，会在<code>APP</code>上生成付款链接，交钱后进入 <code>104</code>，此时摄影师可以上传<strong>修后照片</strong>，然后确认 <strong>精修</strong>，进入 <code>105</code>，用户此时可以查看子订单的<strong>修后照片</strong>，并对其进行<code>ok</code>or<code>no</code>，用户在所有照片都<code>ok</code>后可对这个子订单进行<strong>精修完成确认</strong>，此时因该子订单为纯PS精修，那么在确认后会直接进入 <code>107</code> 交易完成</p>\n<blockquote>\n<p>1.1 这里有个点就是：摄影师在通过用户已上传精修照后，此时订单会进入<code>105</code>,而这时用户要求再<strong>重修</strong>，那么子订单状态码是不变的，摄影师再次修完这个照片后上传就不用确认了，因为状态本来就是 <code>105</code>, 用户可以直接进入查看，并操作<code>ok</code>or<code>no</code></p>\n</blockquote>\n<h3 id=\"2-\">2 如果子订单里只有婚件制作</h3>\n<p>在确认子订单后进入状态 <code>103</code>，会在<code>APP</code>上生成付款链接，交钱后由于该子订单只有婚件没有PS，所以直接进入 <code>106</code> 的状态，用户可以进行 <strong>确认收货</strong> 处理，然后进入  <code>107</code></p>\n<h3 id=\"3-ps-\">3 如果子订单里包含PS精修和婚件制作</h3>\n<p>在确认子订单后进入状态 <code>103</code>，会在<code>APP</code>上生成付款链接，交钱后进入 <code>104</code>，此时摄影师可以上传<strong>修后照片</strong>，然后确认 <strong>精修</strong>，进入 <code>105</code>，用户此时可以查看子订单的<strong>修后照片</strong>，并对其进行<code>ok</code>or<code>no</code>，用户在所有照片都<code>ok</code>后可对这个子订单进行<strong>精修完成确认</strong>，进入 <code>106</code> 的状态，用户可以进行 <strong>确认收货</strong> 处理，然后进入  <code>107</code></p>\n<h2 id=\"-\">订单逻辑</h2>\n<p>在操作套外婚件的时候就为该主订单生成子订单，状态为102，并在新人主页显示，用户在套外确认前的所有套外婚件都属于该订单，一但确认用户要是再选套外的就再生成一个， 套内套外不相干，可并行操作</p>\n<h2 id=\"-\">页面访问权限</h2>\n<blockquote>\n<p>注： 加粗的表示为页面按钮元素，高亮的数字表示订单状态码！</p>\n</blockquote>\n<h3 id=\"-\">查看影集页面 - 摄影师</h3>\n<p>在 <code>7-13</code> 可进入，页面上的 <strong>上传按钮</strong> 在 <code>13</code> 的时候不显示</p>\n<h3 id=\"-\">精修单页面 - 摄影师</h3>\n<p>在 <code>9,10</code> 可进入，页面上的 <strong>确认完成</strong> 在 <code>10</code>的时候不显示</p>\n<blockquote>\n<p>调用的数据是用户要求修的套内婚件照片，一旦确认，则会在用户端显示，用户要求<strong>重修</strong>后又会在该页显示，修完后就不用再确认了</p>\n</blockquote>\n<h3 id=\"-\">上传页面 - 摄影师</h3>\n<p>在 <code>7-12</code> 可进入</p>\n<blockquote>\n<p>上传照片的数据必须大于等于套餐内要求的数据</p>\n</blockquote>\n<h3 id=\"-ps-\">套外PS精修页面 - 摄影师</h3>\n<p>在 <code>104-105</code> 可进入，页面上的 <strong>确认完成</strong> 在<code>105</code>的时候不显示</p>\n<blockquote>\n<p>调用的数据是用户套外额外添加的，一旦确认，则会在用户端显示，用户要求<strong>重修</strong>后又会在该页显示，修完后就不用再确认了</p>\n</blockquote>\n<h3 id=\"-\">查看影集页面 - 新人</h3>\n<p>在 <code>7-13</code> 可进入，<strong>打包下载</strong> 在<code>13</code>的时候可用</p>\n<h3 id=\"-\">查看精修页面 - 新人</h3>\n<p>在 <code>7-13</code> 可进入，<strong>打包下载</strong> 在<code>13</code>的时候可用</p>\n<blockquote>\n<p>该页调用的数据是用户筛选的修后照片，且为用户<strong>OK</strong>的</p>\n</blockquote>\n<h3 id=\"-\">选择精修页面 - 新人</h3>\n<p>在 <code>8</code> 可进入，选择完成后该页不可进入</p>\n<blockquote>\n<p>这里确认的条件是选择的必须等于套餐内送的</p>\n</blockquote>\n<h3 id=\"-\">精修确认页面 - 新人</h3>\n<p>在 <code>10, 105</code> 可进入，用户可在该状态下反复的要求摄影师<strong>重修</strong>，一旦确认，该页面不可进入</p>\n<blockquote>\n<p>这里确认的条件是必须确认的等于要求修的数量</p>\n</blockquote>\n<h3 id=\"-\">套内婚件列表  - 新人</h3>\n<p>在 <code>11</code> 可进入，一旦确认，则不能进入，如果有没有确认的套外婚件则会“作废”（不显示）</p>\n<h3 id=\"-\">套内婚件制作页面  - 新人</h3>\n<p>在 <code>11</code> 可进入，该页的<strong>确认按钮</strong>其实就是返回列表页面的链接，只是做一下数量的判断，不满足不能返回</p>\n<blockquote>\n<p>该页调用的数据为用户精修的照片，且为<strong>OK</strong>状态的，如果数量不够或者不满意可以在套外选择“PS精修”</p>\n</blockquote>\n<h3 id=\"-\">套外婚件列表 - 新人</h3>\n<p>在 <code>11</code> 可进入，确认套外后会生成子订单，用户可再次进入该页进行另外的套外制作，多个套外不冲突</p>\n<blockquote>\n<p>一个子订单内只能有一个“PS精修”</p>\n<p>婚件的完成度为 当前已选择照片数量等于婚件内要求照片数量</p>\n<p>PS完成度为 1张表示已完成，否则为制作中</p>\n</blockquote>\n<h3 id=\"-\">套外婚件制作页面 - 新人</h3>\n<p>在 <code>11</code> 可进入</p>\n<blockquote>\n<p>该页调用的数据为用户精修的照片，且为<strong>OK</strong>状态的，如果数量不够或者不满意可以在套外选择“PS精修”</p>\n</blockquote>\n<h3 id=\"-ps-\">套外PS精修页面 - 新人</h3>\n<p>在 <code>11</code> 可进入</p>\n<blockquote>\n<p>该页调用的数据为用户没有修精过的照片，数量不限，以张为单位计算</p>\n</blockquote>\n', '# 订单状态\r\n\r\n## 订单的所有状态：\r\n\r\n* `1` 订单被取消。订单在后台显示. 但是前台不再显示 \r\n* `2` 订单创建中。说明：未确定（时间. 外景地. 套餐）任一个。 \r\n* `3` 订单创建完成。 \r\n* `4` 已交定金。 \r\n* `5` 拍摄前锁定。\r\n* `6` 拍摄中。\r\n* `7` 尾款交齐。WEB：浏览影集 \r\n* `8` 婚纱照已上传。长显示：婚纱照已上传（等待新人选择精修）。WEB：浏览影集. 选择精修 \r\n* `9` 精修选择完成。长显示：精修选择完成（摄影师制作中）。WEB：浏览影集. 浏览精修 \r\n* `10` 精修已上传。长显示：精修已上传（等待新人确定）。WEB：浏览影集. 确认精修. 确认精修完成（操作） \r\n* `11` 精修完成。长显示：精修完成（等待婚件定制）。WEB：浏览影集. 浏览精修. 婚件制作（操作） \r\n* `12` 婚件定制完成。长显示：婚件定制完成（婚件制作中）。WEB：浏览影集. 浏览精修 \r\n* `13` 交易完成。WEB：浏览影集. 浏览精修 \r\n* `14` 交易协商中。 \r\n\r\n\r\n## 子订单：\r\n\r\n* `101` 补充订单被取消。订单在后台显示. 但是前台不再显示 \r\n* `102` 补充订单创建中。说明：等待用户确认定制完成。 \r\n* `103` 补充订单确定。等待用户付款。有付款链接 \r\n* `104` 付款完成。 \r\n* `105` 精修已上传。长显示：精修已上传（等待新人确定）。WEB：确认精修. 确认精修完成（操作） \r\n* `106` 精修完成。长显示：精修完成（婚件制作中）。WEB：确认收货（操作） \r\n* `107` 交易完成。 \r\n* `108` 交易协商中。 \r\n\r\n\r\n## 子订单逻辑\r\n\r\n### 1 如果子订单里只有PS精修\r\n\r\n在确认子订单后进入状态 `103`，会在`APP`上生成付款链接，交钱后进入 `104`，此时摄影师可以上传**修后照片**，然后确认 **精修**，进入 `105`，用户此时可以查看子订单的**修后照片**，并对其进行`ok`or`no`，用户在所有照片都`ok`后可对这个子订单进行**精修完成确认**，此时因该子订单为纯PS精修，那么在确认后会直接进入 `107` 交易完成\r\n\r\n> 1.1 这里有个点就是：摄影师在通过用户已上传精修照后，此时订单会进入`105`,而这时用户要求再**重修**，那么子订单状态码是不变的，摄影师再次修完这个照片后上传就不用确认了，因为状态本来就是 `105`, 用户可以直接进入查看，并操作`ok`or`no`\r\n\r\n### 2 如果子订单里只有婚件制作\r\n\r\n在确认子订单后进入状态 `103`，会在`APP`上生成付款链接，交钱后由于该子订单只有婚件没有PS，所以直接进入 `106` 的状态，用户可以进行 **确认收货** 处理，然后进入  `107`\r\n\r\n### 3 如果子订单里包含PS精修和婚件制作\r\n\r\n在确认子订单后进入状态 `103`，会在`APP`上生成付款链接，交钱后进入 `104`，此时摄影师可以上传**修后照片**，然后确认 **精修**，进入 `105`，用户此时可以查看子订单的**修后照片**，并对其进行`ok`or`no`，用户在所有照片都`ok`后可对这个子订单进行**精修完成确认**，进入 `106` 的状态，用户可以进行 **确认收货** 处理，然后进入  `107`\r\n\r\n\r\n\r\n## 订单逻辑\r\n\r\n在操作套外婚件的时候就为该主订单生成子订单，状态为102，并在新人主页显示，用户在套外确认前的所有套外婚件都属于该订单，一但确认用户要是再选套外的就再生成一个， 套内套外不相干，可并行操作\r\n\r\n\r\n## 页面访问权限\r\n\r\n> 注： 加粗的表示为页面按钮元素，高亮的数字表示订单状态码！\r\n\r\n### 查看影集页面 - 摄影师\r\n\r\n在 `7-13` 可进入，页面上的 **上传按钮** 在 `13` 的时候不显示\r\n\r\n### 精修单页面 - 摄影师\r\n\r\n在 `9,10` 可进入，页面上的 **确认完成** 在 `10 `的时候不显示\r\n\r\n> 调用的数据是用户要求修的套内婚件照片，一旦确认，则会在用户端显示，用户要求**重修**后又会在该页显示，修完后就不用再确认了\r\n\r\n### 上传页面 - 摄影师\r\n\r\n在 `7-12` 可进入\r\n\r\n> 上传照片的数据必须大于等于套餐内要求的数据\r\n\r\n### 套外PS精修页面 - 摄影师\r\n\r\n在 `104-105` 可进入，页面上的 **确认完成** 在`105`的时候不显示\r\n\r\n> 调用的数据是用户套外额外添加的，一旦确认，则会在用户端显示，用户要求**重修**后又会在该页显示，修完后就不用再确认了\r\n\r\n### 查看影集页面 - 新人\r\n\r\n在 `7-13` 可进入，**打包下载** 在`13`的时候可用\r\n\r\n### 查看精修页面 - 新人\r\n\r\n在 `7-13` 可进入，**打包下载** 在`13`的时候可用\r\n\r\n> 该页调用的数据是用户筛选的修后照片，且为用户**OK**的\r\n\r\n### 选择精修页面 - 新人\r\n\r\n在 `8` 可进入，选择完成后该页不可进入\r\n\r\n> 这里确认的条件是选择的必须等于套餐内送的\r\n\r\n### 精修确认页面 - 新人\r\n\r\n在 `10, 105` 可进入，用户可在该状态下反复的要求摄影师**重修**，一旦确认，该页面不可进入\r\n\r\n> 这里确认的条件是必须确认的等于要求修的数量\r\n\r\n### 套内婚件列表  - 新人\r\n\r\n在 `11` 可进入，一旦确认，则不能进入，如果有没有确认的套外婚件则会“作废”（不显示）\r\n\r\n### 套内婚件制作页面  - 新人\r\n\r\n在 `11` 可进入，该页的**确认按钮**其实就是返回列表页面的链接，只是做一下数量的判断，不满足不能返回\r\n\r\n> 该页调用的数据为用户精修的照片，且为**OK**状态的，如果数量不够或者不满意可以在套外选择“PS精修”\r\n\r\n### 套外婚件列表 - 新人\r\n\r\n在 `11` 可进入，确认套外后会生成子订单，用户可再次进入该页进行另外的套外制作，多个套外不冲突\r\n\r\n> 一个子订单内只能有一个“PS精修”\r\n> \r\n> 婚件的完成度为 当前已选择照片数量等于婚件内要求照片数量\r\n>\r\n> PS完成度为 1张表示已完成，否则为制作中\r\n\r\n### 套外婚件制作页面 - 新人\r\n\r\n在 `11` 可进入\r\n\r\n> 该页调用的数据为用户精修的照片，且为**OK**状态的，如果数量不够或者不满意可以在套外选择“PS精修”\r\n\r\n### 套外PS精修页面 - 新人\r\n\r\n在 `11` 可进入\r\n\r\n> 该页调用的数据为用户没有修精过的照片，数量不限，以张为单位计算', '1', '1418223753439', '1418297025898', '4', '0', '0', 'test', 'zaixianliuyan', null);
INSERT INTO `article` VALUES ('4', '<h1 id=\"-\">去就测试日</h1>\n<pre><code class=\"lang-js\">alert(1);\n</code></pre>\n<pre><code class=\"lang-html\">&lt;a herf=&quot;#&quot;&gt;a&lt;/a&gt;\n</code></pre>\n<blockquote>\n<p>fdsfdsf\nfsdfds</p>\n<p>fdfsdf</p>\n</blockquote>\n<ul>\n<li>1</li>\n<li>2</li>\n<li><p>3</p>\n</li>\n<li><p>1</p>\n</li>\n<li>2</li>\n<li>3</li>\n</ul>\n<table>\n<thead>\n<tr>\n<th>fdfd</th>\n<th>fdsfd</th>\n<th>fdf</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>fsdf</td>\n<td>ffdfd</td>\n<td>fdfdf</td>\n</tr>\n</tbody>\n</table>\n', '# 去就测试日\r\n```js\r\nalert(1);\r\n```\r\n\r\n``` html\r\n<a herf=\"#\">a</a>\r\n```\r\n\r\n> fdsfdsf\r\n> fsdfds\r\n>\r\n> fdfsdf\r\n\r\n* 1\r\n* 2\r\n* 3\r\n\r\n1. 1\r\n2. 2\r\n3. 3\r\n\r\nfdfd | fdsfd | fdf\r\n--- | --- | ---\r\nfsdf | ffdfd | fdfdf', '1', '1418223833855', '1418223833855', '3', '0', '0', 'jshint配置', null, null);
INSERT INTO `article` VALUES ('5', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p><b>324234</b></p>\n<p><hr>fdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226558987', '1418226558987', '1', '0', '0', '标签', null, null);
INSERT INTO `article` VALUES ('6', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p><b>324234</b></p>\n<p><hr>fdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226561872', '1418226561872', '1', '0', '0', '标签', null, null);
INSERT INTO `article` VALUES ('7', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p>324234\nfdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226626356', '1418226626356', '1', '0', '0', '标签', null, null);
INSERT INTO `article` VALUES ('8', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p>324234\nfdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226628904', '1418226628904', '1', '0', '0', '标签', null, null);
INSERT INTO `article` VALUES ('9', '<p>//临时添加标签\n            res.splice(2, 0 , []);</p>\n<p>324234\nfdsfsdf\nfsdfsdfds\nfdsfds</p>\n', '//临时添加标签\r\n            res.splice(2, 0 , []);\r\n\r\n<b>324234</b>\r\n<hr>fdsfsdf\r\nfsdfsdfds\r\nfdsfds', '0', '1418226631277', '1418226631277', '1', '0', '0', '标签', null, null);

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
  `url` varchar(255) DEFAULT NULL COMMENT '链接',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='标签表';

-- ----------------------------
-- Records of tags
-- ----------------------------
INSERT INTO `tags` VALUES ('1', '测试1', null, null, '1', null);
INSERT INTO `tags` VALUES ('2', '测试2', null, null, '1', null);
INSERT INTO `tags` VALUES ('3', '地圭', null, null, '1', null);

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
