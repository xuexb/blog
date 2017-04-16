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
echo 'stc end';

npm run compile;
npm run copy-package;

# 复制app
cp -r app output;

# 删除没用文件
rm -rf output/app/common/runtime;
#rm -rf output/www/static/admin/js/*.map;
#find output/app -name '*.map' | xargs rm;

# 替换style为mip, amp规范的
sed -i 's/<style>/<style mip-custom>/g' ./output/view/mip/layout.html
sed -i 's/<style>/<style amp-custom>/g' ./output/view/amp/layout.html