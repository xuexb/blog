'use strict';

export default {
    db: {
        host: '',
        port: '',
        name: '',
        user: '',
        pwd: '',
        prefix: ''
    },

    compress: false,

    ls: {
        on: false,
        css: {
            'global': '/static/src/pc/global.css',
            'wise_global': '/static/src/wise/global.css'
        },
        js: {
            'wise_global': '/static/src/wise/global.js'
        },
    }
};
