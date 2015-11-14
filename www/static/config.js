/**
 * @file 博客静态编译配置
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */
'use strict';

var config = {};

/**
 * 样式集合
 * @description 可以通过build-css来完成打包，样式应该颗粒化，
 *              项目每个css文件都应该出现在这个里面，然后可以组合为task来发布
 * @type {Object}
 */
var css = config.css = {};

/**
 * 全局css
 *
 * @type {String}
 */
css.global = 'pc/global.css';


module.exports = config;