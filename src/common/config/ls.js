/**
 * @file ls配置
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

export default {
    on: true,
    css: {
        'global': '/static/dist/pc/global.css',
        'wise_global': '/static/dist/wise/global.css'
    },
    js: {
        'wise_global': '/static/dist/wise/global.js'
    },
    options: {
        open: '<%',
        close: '%>'
    }
};

