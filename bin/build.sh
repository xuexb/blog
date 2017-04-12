#!/bin/sh

rm -rf firekylin;
rm -rf output;
rm -rf output.theme;

mkdir output;

echo 'webpack start ...';
npm run webpack.build.production;
echo 'webpack end';

node stc.config.js;

mkdir -p www/theme/firekylin.build/html;
cp -r www/theme/firekylin/*.html www/theme/firekylin.build/html/
cp -r www/theme/firekylin/inc www/theme/firekylin.build/html/
cp -r www/theme/firekylin/template www/theme/firekylin.build/html/
cp -r www/theme/firekylin/error www/theme/firekylin.build/html/
cp -r www/theme/firekylin/package.json www/theme/firekylin.build/html/

node stc.view.config.js;

cp -r output.theme/www/theme/firekylin.build/html/* output.theme/www/theme/firekylin;
rm -rf output.theme/www/theme/firekylin.build;
cp -r output.theme/www/ output/www/
rm -rf output.theme;
rm -rf www/theme/firekylin.build/;


npm run compile;
npm run copy-package;

cp -r app output;
rm -rf output/app/common/runtime;

cp -r www/*.js output/www;


rm -r output/app/common/config/db.js;
rm -rf output/www/static/js/*.map;

mv output dist;
cp .thinkjsrc dist/
cp .installed dist/