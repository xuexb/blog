var stc = require('stc');
var cssCompress = require('stc-css-compress');
var resourceVersion = require('stc-resource-version');
var cssCombine = require('stc-css-combine');
var htmlCompress = require('stc-html-compress');
var uglify = require('stc-uglify');
var replace = require('stc-replace');

stc.config({
    product: 'home',
    include: ['view/', 'www/static/'],
    exclude: [/www\/static\/admin\/src\//],
    outputPath: 'output',
    tpl: {
        engine: 'nunjucks',
        ld: ['{%', '{{', '{#'],
        rd: ['%}', '}}', '#}']
    }
});

stc.workflow({
    uglify: { 
        plugin: uglify, 
        exclude: [/static\/admin\//] // 后台管理不压缩，因为 webpack 压缩过了
    },
    cssCombine: {plugin: cssCombine, include: /\.css$/},
    cssCompress: {
        plugin: cssCompress
    },
    htmlCompress: {
        plugin: htmlCompress,
        options: {
            trim: true
        }
    },
    resourceVersion: {
        plugin: resourceVersion
    },
});

stc.start();
