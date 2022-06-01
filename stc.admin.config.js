var stc = require('stc');
var cssCompress = require('stc-css-compress');
var resourceVersion = require('stc-resource-version');
var cssCombine = require('stc-css-combine');
var htmlCompress = require('stc-html-compress');
var replace = require('stc-replace');
// var uglify = require("stc-uglify");

stc.config({
  product: "admin",
  include: ["view/admin/", "www/static/admin/"],
  exclude: [/www\/static\/admin\/src\//],
  outputPath: "output",
  tpl: {
    engine: "nunjucks",
    ld: ["{%", "{{", "{#"],
    rd: ["%}", "}}", "#}"],
  },
});

stc.workflow({
//   uglify: {
//     plugin: uglify,
//     exclude: [/static\/admin\//], // 后台管理不压缩，因为 webpack 压缩过了
//   },
  cssCombine: { plugin: cssCombine, include: /\.css$/ },
  cssCompress: {
    plugin: cssCompress,
  },
  htmlCompress: {
    plugin: htmlCompress,
    options: {
      trim: true,
    },
  },
  resourceVersion: {
    options: {
      length: 5,
      type: "query",
    },
    plugin: resourceVersion,
  },
});

stc.start();
