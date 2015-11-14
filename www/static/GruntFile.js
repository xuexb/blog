/**
 * @file 博客静态编译
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */
'use strict';

module.exports = function (grunt) {
    'use strict';

    var extend = require('extend');

    var config = grunt.file.readJSON('package.json');
    var banner = '/*' + config.name + ' - v' + config.version + ' - <%= grunt.template.today("yyyy-mm-dd") %>*/';

    // 应用配置
    var App = require('./config');

    // 配置
    grunt.initConfig({
        cssmin: {
            options: {
                banner: banner,
                compatibility: 'ie7'
            }
        },
        pkg: config
    });

    // 激活插件
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build-css', '编译css', function (name) {
        var app = checkApp('css', name);

        if (!app) {
            return false;
        }

        // 如果有源则压缩源
        if (app.src) {
            grunt.config.set('cssmin.src', {
                options: {
                    banner: app.banner || banner
                },
                files: [
                    {
                        expand: true,
                        cwd: app.srcPath,
                        src: app.src,
                        dest: app.distPath,
                        filter: 'isFile'
                    }
                ]
            });
            grunt.task.run('cssmin:src');
        }

    });

    /**
     * 检查配置里是否存在 自己要找的方法
     *
     * @param  {string} type 应该名, 有home
     * @param  {string} fnName  方法如
     * @return {Object} 结果对象
     */
    function checkApp(type, fnName) {
        var object = null;

        if (!App[type]) {
            console.log('没有找到项目 : ' + type);
        }
        else {
            if (!App[type][fnName]) {
                console.log('没有找到配置 : ' + fnName);
            }
            else {
                object = App[type][fnName];
                if (Array.isArray(object) || 'string' === typeof object) {
                    object = {
                        src: object
                    };
                }

                object = extend({}, object);

                // fix cwd情况
                if (object.cwd) {
                    object.srcPath = 'src/' + object.cwd;
                    object.distPath = 'dist/' + object.cwd;
                }
                else {
                    object.srcPath = 'src/';
                    object.distPath = 'dist/';
                }
            }
        }

        return object;
    }
};
