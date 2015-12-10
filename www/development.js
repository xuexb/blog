var thinkjs = require('thinkjs');
var path = require('path');

var rootPath = path.dirname(__dirname);

var instance = new thinkjs({
  APP_PATH: rootPath + '/app',
  ROOT_PATH: rootPath,
  RESOURCE_PATH: __dirname,
  env: 'development'
});
//watch compile code
instance.compile();

instance.run();

var ls = require('think-ls');
new ls().build().then(function(a){
    console.log('编译ls结束~');
});