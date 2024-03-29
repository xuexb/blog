var stc = require('stc');
var cssCompress = require('stc-css-compress');
var resourceVersion = require('stc-resource-version');
var cssCombine = require('stc-css-combine');
var htmlCompress = require('stc-html-compress');
var uglify = require('stc-uglify');
var replace = require('stc-replace');

stc.config({
  product: "home",
  include: ["view/", "www/static/"],
  exclude: [/www\/static\/admin\//, /view\/admin\//],
  outputPath: "output",
  tpl: {
    engine: "nunjucks",
    ld: ["{%", "{{", "{#"],
    rd: ["%}", "}}", "#}"],
  },
});

stc.workflow({
  uglify: {
    plugin: uglify,
  },
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
      type: "hash",
    },
    plugin: resourceVersion,
  },
});

stc.start();
