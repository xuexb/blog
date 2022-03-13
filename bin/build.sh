#!/bin/sh

rm -rf output;
mkdir output;

cp .thinkjsrc output/
cp .installed output/

echo 'copy www/* start ...';
mkdir output/www;
cp -r www/* output/www;
rm -rf output/www/static;
echo 'copy www/* end';

echo 'webpack start ...';
npm run webpack.build.production;
echo 'webpack end';

echo 'stc start ...';
node stc.config.js;
# node xuexb.com.stc.config.js
echo 'stc end';

npm run compile;
npm run copy-package;

# 复制app
cp -r app output;
cp -r yarn.lock output;

# 删除没用文件
rm -rf output/app/common/runtime;
#rm -rf output/www/static/admin/js/*.map;
#find output/app -name '*.map' | xargs rm;