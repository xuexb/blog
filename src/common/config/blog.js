/**
 * @file 博客配置
 * @author xiaowu
 */

'use strict';

export default {
    name: '前端小武',
    url: 'https://xuexb.com',
    static_prefix: '/static/',
    static_type: 'src/',

    /**
     * 获取静态资源
     *
     * @param  {string} path 路径
     *
     * @return {string}      绝对路径
     */
    get_static: function get_static(path) {
        return this.static_prefix + this.static_type + path;
    },

    /**
     * ls配置
     *
     * @type {Object}
     */
    ls: {
        css: {
            'global': 'A'
        }
    },

    /**
     * 列表分隔线
     *
     * @type {String}
     */
    list_mark: '{__list__}',

    /**
     * 是否压缩
     *
     * @type {Boolean}
     */
    compress: false,

    /**
     * 标签分隔线
     *
     * @type {String}
     */
    title_separate: '_'
};
