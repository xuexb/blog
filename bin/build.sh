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
node xuexb.com.stc.config.js
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
sed -i 's$<link amp-replace-css>$<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>$g' ./output/view/amp/layout.html