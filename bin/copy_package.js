var fs = require('fs');
var content = fs.readFileSync('./package.json', 'utf8');
var data = JSON.parse(content);
delete data.devDependencies;
data.scripts = {
  start: 'node www/production.js'
};
fs.writeFileSync('output/package.json', JSON.stringify(data, undefined, 4));
