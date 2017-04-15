var stc = require('stc');
var cssCompress = require('stc-css-compress');
var resourceVersion = require('stc-resource-version');
var localstorage = require('stc-localstorage');
var localstorageAdapter = require('stc-localstorage-nunjucks');
var cssCombine = require('stc-css-combine');
var htmlCompress = require('stc-html-compress');
var uglify = require('stc-uglify');
var inline = require('stc-inline');

stc.config({
    product: 'xuexb.com',
    include: ['view/', 'www/static/'],
    exclude: [/static\/admin\/src/, /static\/upload/],
    outputPath: 'output',
    tpl: {
        engine: 'nunjucks',
        ld: ['{%', '{{', '{#'],
        rd: ['%}', '}}', '#}']
    }
});

stc.workflow({
    uglify: {plugin: uglify, exclude: [/static\/admin\/src/]},
    cssCombine: {plugin: cssCombine, include: /\.css$/},
    cssCompress: {
        plugin: cssCompress
    },
    localstorage: {
        include: {
            type: 'tpl'
        },
        plugin: localstorage,
        options: {
            adapter: localstorageAdapter,
            minLength: 200,
            appId: '3e988cdb'
        }
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
    inline: {
        plugin: inline,
        include: /\.html$/,
        options: {
            uglify: true,
            datauri: true,
            jsinline: true,
            allowRemote: true
        }
    }
});

stc.start();
