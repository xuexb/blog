/**
 * @file 博客配置
 * @author xiaowu
 */

'use strict';

export default {
    name: '前端小武',
    version: '3.0.3',
    url: 'https://xuexb.com',
    static_prefix: '/static/',
    static_type: 'src/',

    /**
     * 获取静态资源路径
     *
     * @param  {string} path 路径
     *
     * @return {string}      绝对路径
     */
    get_static: function (path) {
        path += path.indexOf('?') > -1 ? '&v=' + this.version : '?r='+ this.version;
        return this.static_prefix + this.static_type + path;
    },

    /**
     * 列表分隔线
     *
     * @type {String}
     */
    list_mark: '{__list__}',

    /**
     * 标签分隔线
     *
     * @type {String}
     */
    title_separate: '_',

    /**
     * 用户信息
     *
     * @type {Object}
     */
    user_info: {
        username: 'test',
        password: 'test'
    }
};
