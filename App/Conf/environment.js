/**
 * 环境配置
 * @description 根据environment.json里配置的hostname来加载不同的配置文件，并覆盖传来的参数，注意加载的配置文件是基于当前路径下的
 * @author fe.xiaowu@gmail.com
 * @path App/Conf/environment.js
 */


'use strict';

var hostname = require('os').hostname();
var data = require('./environment.json');


module.exports = function(config) {
    var fileName, file;

    //遍历所有的配置环境数据
    data.forEach(function(val) {

        if (!Array.isArray(val.name)) {
            val.name = [val.name];
        }

        if (val.name.indexOf(hostname) > -1) {
            fileName = val.config;
        }
    });

    if (fileName) {
        try {
            file = require('./' + fileName);
            Object.keys(file).forEach(function(val) {
                config[val] = file[val];
            });
        } catch (e) {}
    }

    return config;
}