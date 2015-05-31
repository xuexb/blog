module.exports = function(grunt) {
    'use strict';

    var config = grunt.file.readJSON('package.json'); //读取 package.json 配置


    var obj = {}; //初始化对象
    var jshint = obj.jshint = {}; //jshint
    var uglify = obj.uglify = {}; //压缩js
    var copy = obj.copy = {}; //复制文件

    //配置包
    obj.pkg = config;


    //jshint
    jshint.options = {
        jshintrc: true
    }
    jshint.all = {
        src: ['./App/**/*.js']
    }

    //js压缩配置
    uglify.options = {
        banner: '/*' + config.name + ' - v' + config.version +
            ' - <%= grunt.template.today("yyyy-mm-dd  HH:mm:ss") %>*/' + '\n'
    }
    uglify.all = {
        files: [{
            expand: true,
            cwd: './App/',
            src: '**/*.js',
            dest: './dist/'
        }]
    }

    // 复制
    copy.all = {
        files: [{
            expand: true,
            cwd: './App/Runtime/',
            src: '**/*',
            dest: './dist/Runtime/'
        }],
    }
    copy.environment = {
        'src': './App/Conf/environment.json',
        'dest': './dist/Conf/environment.json'
    }
    copy.tpl = {
        options: {
            process: function(content) {
                return content.replace(/[\r\n]/g, '').replace(/\s{2,}/g, '');
            }
        },
        files: [{
            expand: true,
            cwd: './App/View/',
            src: '**/*',
            dest: './dist/View/'
        }]
    }



    grunt.initConfig(obj);

    //激活插件
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy'); //复制


    grunt.registerTask('build', function() {
        grunt.task.run(['jshint', 'uglify', 'copy']);
    });
}