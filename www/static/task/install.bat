@echo off
color 02
echo ==================================
echo  开始安装...
echo.
echo  (安装过程可能会有报错，无视即可）
echo ==================================
cd ../ && npm install && copy task\grunt-css-sprite\sprite.js node_modules\grunt-css-sprite\tasks && echo 安装完成 && pause