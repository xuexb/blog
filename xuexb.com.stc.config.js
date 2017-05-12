var stc = require('stc');
var cssCompress = require('stc-css-compress');
var resourceVersion = require('stc-resource-version');
var localstorage = require('stc-localstorage');
var localstorageAdapter = require('stc-localstorage-nunjucks');
var cssCombine = require('stc-css-combine');
var htmlCompress = require('stc-html-compress');
var uglify = require('stc-uglify');
var inline = require('stc-inline');
var replace = require('stc-replace');

stc.config({
    product: 'xuexb.com',
    include: ['view/home/', 'view/common/', 'www/static/home/'],
    outputPath: 'output',
    tpl: {
        engine: 'nunjucks',
        ld: ['{%', '{{', '{#'],
        rd: ['%}', '}}', '#}']
    }
});

stc.workflow({
    uglify: {plugin: uglify},
    cssCombine: {plugin: cssCombine, include: /\.css$/},
    cssCompress: {
        plugin: cssCompress
    },
    // localstorage: {
    //     include: {
    //         type: 'tpl'
    //     },
    //     plugin: localstorage,
    //     options: {
    //         adapter: localstorageAdapter,
    //         minLength: 200,
    //         appId: '3e988cdb'
    //     }
    // },
    
    htmlCompress: {
        plugin: htmlCompress,
        options: {
            trim: true
        }
    },
    resourceVersion: {
        plugin: resourceVersion
    },

    // inline: {
    //     plugin: inline,
    //     include: /\.(js|html|css)$/,
    //     options: {
    //         uglify: true,
    //         datauri: true,
    //         jsinline: true,
    //         allowRemote: true
    //     }
    // },

    // md替换mip的style标签, 这种方式也是给醉了
    // 有bug, 先用sed替换   
    // replace: {
    //     plugin: replace,
    //     include: [/view\/mip(.+?)\.html/, {
    //         type: 'tpl'
    //     }],
    //     options: {
    //         '<style>': '<style mip-custom>'
    //     }
    // }

});

stc.start();