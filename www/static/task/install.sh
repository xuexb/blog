echo "==================================";
echo  "开始安装...";
echo  "(安装过程可能会有报错，无视即可）";
echo "==================================";
cd ../ && npm install && cp -f ./task/grunt-css-sprite/sprite.js ./node_modules/grunt-css-sprite/tasks/sprite.js && echo "安装完成"