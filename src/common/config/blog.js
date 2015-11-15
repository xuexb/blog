'use strict';
/**
 * 博客配置
 */
export default {
    name: '前端小武',
    url: 'https://xuexb.com',
    static_prefix: '/static/',
    static_type: 'src/',
    get_static: function get_static(path) {
        return this.static_prefix + this.static_type + path;
    },

    list_mark: '{__list__}',

    /**
     * 是否压缩
     *
     * @type {Boolean}
     */
    compress: false
};
