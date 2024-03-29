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
yarn webpack.build.production;
echo 'webpack end';

echo 'stc start ...';
node stc.config.js;
echo 'stc end';
echo 'stc admin start ...';
node stc.admin.config.js;
echo 'stc admin end';

yarn compile;
yarn copy-package;

# 复制app
cp -r app output;
cp -r yarn.lock output;

# 删除没用文件
rm -rf output/app/common/runtime;
#rm -rf output/www/static/admin/js/*.map;
find output/ -name '*.map' | xargs rm;

# 删除原始文件
# find output/www/static/home -type f -regex ".*/[a-z0-9]*\.[a-z]*$" | xargs rm;

# Service Worker
yarn build:sw