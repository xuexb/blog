/**
 * 易结网前端自动化编译, 请先配置 app.json
 *
 * @copyright 易结网
 *
 * @author xieliang
 *
 * @version 2.0
 *
 * @link
 *     1, http://www.xuexb.com/html/223.html
 *     2, http://www.xuexb.com/html/222.html
 *     
 * @description 文档待整理
 * 
 */

module.exports = function(grunt) {
    'use strict'; //严禁模式



    var transport_script = require('grunt-cmd-transport').script.init(grunt),
        config = grunt.file.readJSON('package.json'), //读取 package.json 配置
        banner = '/*' + config.name + ' - v' + config.version + ' - <%= grunt.template.today("yyyy-mm-dd  HH:mm:ss") %>*/';//默认添加压缩文件头信息

    //应用配置
    var App = grunt.file.readJSON("app.json");



    var obj = {}; //初始化对象
    var transport = obj.transport = {}; //seajs提取依赖
    var concat = obj.concat = {}; //合并代码
    var uglify = obj.uglify = {}; //压缩js
    var copy = obj.copy = {}; //复制文件
    var cssmin = obj.cssmin = {}; //css压缩
    var watch = obj.watch = {}; //文件监听
    var connect = obj.connect = {}; //web server
    var sprite = obj.sprite = {};//雪碧图
    var jshint = obj.jshint = {};//jshint
    var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;//url重写


    //配置包
    obj.pkg = config;


    //抽取cmd依赖配置
    //不使用alias
    transport.options = {
        debug: false,
        paths: [''],
        // alias: { //命名引用, 这里写的生成前的地址
        //     // 'jquery': 'lib/jquery',//jquery库
        //     // 'base': 'lib/base',//初类
        //     // 'dialog': 'lib/dialog'//弹出层
        // },
        parsers: { //解析方式
            '.js': [transport_script.jsParser]
        }
    }

    //复制文件配置
    copy.options = {
        paths: ['']
    }

    //js压缩配置
    uglify.options = {
        banner: banner+'\n'
    }


    //css压缩配置
    cssmin.options = {
        banner: banner,
        compatibility: 'ie7'
    }


    // http服务配置
    connect.options = {
        port: config.port,
        base: "./",
        hostname: '127.0.0.1',
        middleware: function(connect, options) {
            var middlewares = [];

            // RewriteRules support
            middlewares.push(rewriteRulesSnippet);

            if (!Array.isArray(options.base)) {
                options.base = [options.base];
            }

            var directory = options.directory || options.base[options.base.length - 1];
            options.base.forEach(function(base) {
                // Serve static files.
                middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            // 添加对字体文件的支持
            middlewares.unshift(function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            });

            return middlewares;
        }
    }
    connect.server = {}
    connect.server_keepalive = {
        options: {
            keepalive: true
        }
    }



    // 自动雪碧图配置
    sprite.options = {
        // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
        padding: 0,
        // 是否使用 image-set 作为2x图片实现，默认不使用
        useimageset: false,
        // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
        newsprite: false,
        // 给雪碧图追加时间戳，默认不追加
        spritestamp: true,
        // 在CSS文件末尾追加时间戳，默认不追加
        cssstamp: false,
        // 默认使用二叉树最优排列算法
        algorithm: 'binary-tree',
        // 默认使用`pngsmith`图像处理引擎
        engine: 'pngsmith',
        // 映射CSS中背景路径，支持函数和数组，默认为 null
        imagepath_map: null
    }



    //jshint
    jshint.options = {
        jshintrc: true
    }
    jshint.test = {
        src: 'test.js'
    }


    // watch
    watch.options = {
        options: {
            livereload: false
        }
    }
    watch.debug = {
        options: {
            livereload: true
        },
        files: ['tpl/**/*', 'src/**/*', '!src/css/lib/*.css', 'src/css/lib/global.css']
    }


    grunt.initConfig(obj);



    //激活插件
    grunt.loadNpmTasks('grunt-contrib-livereload');//雪碧图
    grunt.loadNpmTasks('grunt-css-sprite');//雪碧图
    grunt.loadNpmTasks('grunt-cmd-transport');//cmd抽取依赖
    grunt.loadNpmTasks('grunt-cmd-concat');//合并
    grunt.loadNpmTasks('grunt-contrib-watch');//兼听
    grunt.loadNpmTasks('grunt-contrib-copy');//复制
    grunt.loadNpmTasks('grunt-contrib-uglify');//js压缩
    grunt.loadNpmTasks('grunt-contrib-cssmin');//css压缩
    grunt.loadNpmTasks('grunt-contrib-connect');//服务http
    grunt.loadNpmTasks('grunt-connect-rewrite');//url rewrite
    grunt.loadNpmTasks('grunt-contrib-jshint');//url rewrite




    grunt.registerTask("server", "http调试", function(){
        var taskName = [];
        if (config.rewrite !== "src" && config.rewrite !== "src->src") {
            create_rules();//创建路由映射
            taskName.push('configureRewriteRules');
        }
        taskName.push('connect:server_keepalive');
        grunt.task.run(taskName);
    });



    grunt.registerTask("task", "多任务", function( name) {
        var app;
        //检查方法
        if(!check_app('task', name)){
            return false;
        }
        app = App['task'][name];
        grunt.task.run(app);
    });



    grunt.registerTask("init-css", "初始化css", function( name) {
        var app,
            result;

        //检查方法
        if(!check_app('css', name)){
            return false;
        }
        
        //app.home.css.common
        app = App['css'][name];

        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }

        //如果有依赖包
        if (app.dest) {

            result = {//提前声明好用
                options: {
                    noncmd: true
                },
                dest: get_path_str(config.src_path + app.dest),
            }

            if (app.src) {//如果有源
                result.src = get_path_arr(app.src, config.src_path);
            }

            if(app.sprite){//如果有sprite图

                if(!result.src){
                    result.src = [];//让下面可以push用                   
                }

                if(!Array.isArray(app.sprite)){//如果不是数组则整成数组
                    app.sprite = [app.sprite];
                }

                app.sprite.forEach(function(val){//遍历所有的sprite, 把sprite的src追加到src里
                    if(val.src){
                        result.src.push(get_path_str(config.src_path + val.src));
                    }
                });

            }

        }


        if(result && result.src && result.src.length){//如果有src才算真爱, 才让其全并
            grunt.config.set('concat.init', result);
            grunt.task.run('concat:init');
        } else {
            log("app.css."+ name +" 包里没有配置源css值, 如: src, sprite");
        }
    });



    grunt.registerTask("dist-css", "编译css", function(name) {
        var app,
            result;

        //检查方法
        if(!check_app('css', name)){
            return false;
        }

        //app.home.css.common
        app = App['css'][name];

        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }

        //处理sprite到dist, 但不压缩
        if(app.sprite){
            if(!Array.isArray(app.sprite)){
                app.sprite = [app.sprite];
            }

            app.sprite.forEach(function(val, index){
                var sprite_src = get_path_str(config.dist_path + val.src);

                //把需要sprite的css复制到dist里
                grunt.config.set('copy.sprite-'+ index, {
                    src: get_path_str(config.src_path + val.src),
                    dest: sprite_src
                });
                grunt.task.run('copy:sprite-'+ index);

                // console.log(get_path_str(src_path + val.src), sprite_src)

                var options = val.options;
                if(!Array.isArray(options)){
                    options = [options];
                }

                //自动雪碧sprite
                options.forEach(function(val2, index2){

                    //如果没有定义或者不为false则复制图
                    if(val2.copy === void 0 || !val2.copy === false){
                        //把sprite的图复制到dist里, 要不spriet会失败
                        grunt.config.set('copy.sprite-img-'+ index + index2, {
                            files: [{
                                cwd: config.src_path + val2.imagepath,
                                expand: true,
                                src: '*.png',
                                dest: config.dist_path + val2.imagepath,
                                filter: 'isFile'
                            }]
                        });
                        grunt.task.run('copy:sprite-img-'+ index + index2);
                    }

                    



                    //定义dist目录
                    val2.imagepath = config.dist_path + val2.imagepath;
                    val2.spritedest = config.dist_path + val2.spritedest;


                    // console.log(sprite_src, val2.imagepath,val2.spritedest)


                    grunt.config.set('sprite.dist-'+ index + index2, {
                        options: val2,
                        src: sprite_src,
                        dest: sprite_src
                    });
                    grunt.task.run('sprite:dist-'+ index + index2);
                });
            });


            // grunt.task.run('copy');
            // grunt.task.run('sprite');
        }


        //处理源到dist, 但不压缩
        if(app.src){
            // 复制
            result = {
                files: [{
                    expand: true,
                    cwd: config.src_path,
                    src: app.src,
                    dest: config.dist_path,
                    filter: 'isFile'
                }]
            }
            grunt.config.set('copy.src', result);
            grunt.task.run('copy:src');
        }


        if(app.dest){//如果有依赖处理

            result = {//提前声明好用
                options: {
                    noncmd: true
                },
                dest: get_path_str(config.dist_path + app.dest),
            }

            if (app.src) {//如果有源
                result.src = get_path_arr(app.src, config.dist_path);
            }

            if(app.sprite){//如果有sprite图

                if(!result.src){
                    result.src = [];//让下面可以push用                   
                }

                if(!Array.isArray(app.sprite)){//如果不是数组则整成数组
                    app.sprite = [app.sprite];
                }

                app.sprite.forEach(function(val){//这里的sprite css已经在dist层里, 且处理过合并img了
                    val.src && result.src.push(get_path_str(config.dist_path + val.src));
                });

            }




            if(result.src && result.src.length){

                //合并
                grunt.config.set('concat.dest', result);
                grunt.task.run('concat:dest');

                //定义要输出到页头上的合并的文件
                var concat_target = result.src.map(function(value) {
                    return value.replace('dist/css/', '');//value.indexOf('/') > -1 ? value.substr(value.lastIndexOf('/') + 1) : value
                }).toString();
                concat_target = '/*'+ concat_target + '*/';


                //压缩
                grunt.config.set('cssmin.dest', {
                    options: {
                        banner: (app.banner || banner) + '\n' + concat_target
                    },
                    src: get_path_str(config.dist_path + app.dest),
                    dest: get_path_str(config.dist_path + app.dest)
                });
                grunt.task.run('cssmin:dest');
            }
        }




        if(app.src){//如果有源则压缩源
            grunt.config.set('cssmin.src', {
                options: {
                    banner: app.banner || banner
                },
                files:  [{
                    expand: true,
                    cwd: config.dist_path,
                    src: app.src,
                    dest: config.dist_path,
                    filter: 'isFile'
                }]
            });
            grunt.task.run('cssmin:src');
        }


        if(app.sprite){//如果有雪碧压缩她吧... 强占她吧
            result = [];//要压缩的路径包, 这里是要遍历sprite的src生成出来

            if(!Array.isArray(app.sprite)){
                app.sprite = [app.sprite];
            }

            app.sprite.forEach(function(val){
                val.src && result.push(val.src);
            });


            if(result.length){
                grunt.config.set('cssmin.sprite', {
                    options: {
                        banner: app.banner || banner
                    },
                    files:  [{
                        expand: true,
                        cwd: config.dist_path,
                        src: result,
                        dest: config.dist_path,
                        filter: 'isFile'
                    }]
                });
                grunt.task.run('cssmin:sprite');
            }
        }
    });


    grunt.registerTask("watch-css", "调试css", function(name) {
        var app,
            result;

        //检查方法
        if(!check_app('css', name)){
            return false;
        }
        


        //app.home.css.common
        app = App['css'][name];


        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }

        //如果有依赖包
        if (app.dest) {
            result = [];


            //如果有源则 "插入" 源的路径
            if(app.src){    
                result = get_path_arr(app.src, config.src_path);
            }

            // 如果有sprite图, 则也插入
            if(app.sprite){
                if(!Array.isArray(app.sprite)){//保证是数组
                    app.sprite = [app.sprite];
                }


                result = result.concat(app.sprite.map(function(val){
                    return get_path_str(config.src_path + val.src);
                }));
            }
        }


        var taskName;
        if(result && result.length){
            grunt.config.set('watch.dest', {
                files: result,
                tasks: ['init-css:' + name +":true"] //运行初始化任务
            });
            grunt.task.run('watch:dest');
        } else {
            log("没有找到要监听的文件, 请查看是否配置过 src, sprite");
        }

    });




    /**
     * 初始化生成
     */
    grunt.registerTask("init-js", "初始化js", function(name) {
        var app, result;

        //检查方法
        if(!check_app('js', name)){
            return false;
        }
        
        //app.home.js.common
        app = App['js'][name];

        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }

        //如果没有生成版本
        if (!app.dest) {
            log("没有依赖文件, 不需要初始化");
            return false;
        }

        //如果没有cmd
        if(!app.noCmd){
            log("全部是cmd模块文件, 不需要初始化, 如果说你是在页面中直接引用的可在配置里添加一个 noCmd 空文件来解决");
            return false;
        }


        //如果有非cmd模块,则只生成 非cmd 模块
        result = {
            options: {
                noncmd: true
            },
            dest: get_path_str(config.src_path + app.dest),
            src: get_path_arr(app.noCmd, config.src_path)
        }


        grunt.config.set('concat.init', result);
        grunt.task.run('concat:init');
    });

    
    grunt.registerTask("dist-js", "编译js", function(name) {
        var app,
            result;

        //检查方法
        if(!check_app('js', name)){
            return false;
        }
        


        //app.home.js.common
        app = App['js'][name];

        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }


        //做jshint检查
        grunt.task.run('jsHint:'+ name);

        //如果有cmd模块, 先提取依赖到 dist 里
        if (app.src) {
            result = {
                files: [{
                    expand: true, //智能搜索
                    cwd: config.src_path,
                    src: app.src,
                    dest: config.dist_path,
                    filter: 'isFile'
                }]
            }


            //处理id前缀
            if (app.idleading) {
                result.options = {
                    idleading: app.idleading
                }
            } else {
                // if (app.cwd) {
                    
                //     //判断cwd是否设置的就是默认路径
                //     if (app.cwd.slice(- (type.length + 1), -1) === type) {
                //         result.options = {
                //             idleading: type + "/"
                //         }
                //     }
                // } else {
                //     result.options = {//添加uri前缀
                //         idleading: type + "/"
                //     }
                // }
            }

            grunt.config.set('transport.src', result);
            grunt.task.run('transport:src');
        }


        //如果有非cmd模块
        if(app.noCmd){
            //复制src到dist
            result = {
                files: [{
                    expand: true, //智能搜索
                    cwd: config.src_path,
                    src: app.noCmd,
                    dest: config.dist_path,
                    filter: 'isFile'
                }]
            }
            grunt.config.set("copy.noCmd", result);
            grunt.task.run("copy:noCmd");
        }

        //分情况进行合并
        //如果有 dest, 则dest已经有nocmd了,所有只需要处理src
        if(app.dest){

            // if (!grunt.file.exists(get_path_str(src_path + app.dest))) {
            //     log("依赖文件不存在, 请先初始化 : "+ get_path_str(src_path + app.dest));
            //     return false;
            // }

            //先把src里的dest移动过来
            result = {
                options: {
                    noncmd: true
                },
                dest: get_path_str(config.dist_path + app.dest)
            }


            //如果有nocmd的模块, 则添加, 这里的模块已经在dist层了
            if (app.noCmd) {
                result.src = get_path_arr(app.noCmd, config.dist_path);
                // result.src.push.apply(result.src, get_path_arr(app.src, dist_path));
            }

            //如果有 源文件, 则一并合成,这里的源已经在dist层了
            if (app.src) {
                if(!result.src){
                    result.src = [];
                }
                result.src = result.src.concat(get_path_arr(app.src, config.dist_path));
                // result.src.push.apply(result.src, get_path_arr(app.src, dist_path));
            }
            
            grunt.config.set('concat.dest', result);
            grunt.task.run('concat:dest');


            
            //定义要输出到页头上的合并的文件
            var concat_target = result.src.map(function(value) {
                return value.replace('dist/js/', '');//value.indexOf('/') > -1 ? value.substr(value.lastIndexOf('/') + 1) : value
            }).toString();
            concat_target = '/*'+ concat_target + '*/';


            //压缩最终版
            result = {
                options: {
                    banner: (app.banner || banner) + '\n' + concat_target + '\n'
                },
                src: get_path_str(config.dist_path + app.dest),
                dest: get_path_str(config.dist_path + app.dest)
            }
            grunt.config.set("uglify.dest", result);
            grunt.task.run("uglify:dest");
        } 

        //压缩 源
        if(app.src){
            //这里的源已经在dist里了
            //开始压缩src
            result = {
                options: {
                    banner: (app.banner || banner) + '\n'
                },
                files: [{
                    expand: true, //智能搜索
                    cwd: config.dist_path,
                    src: app.src,
                    dest: config.dist_path,
                    filter: 'isFile'
                }]
            }
            grunt.config.set("uglify.src", result);
            grunt.task.run("uglify:src");
        }

        //压缩非cmd
        if(app.noCmd){
            result = {
                options: {
                    banner: (app.banner || banner) + '\n'
                },
                files: [{
                    expand: true, //智能搜索
                    cwd: config.dist_path,
                    src: app.noCmd,
                    dest: config.dist_path,
                    filter: 'isFile'
                }]
            }
            grunt.config.set("uglify.noCmd", result);
            grunt.task.run("uglify:noCmd");
        }
    });


    grunt.registerTask('jsHint', function(name){
        var app, result;

        //检查方法
        if(!check_app('js', name)){
            return false;
        }
        


        //app.home.js.common
        app = App['js'][name];

        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }

        //做jshint检查
        if(app.src){
            result = {
                src: get_path_arr(app.src, config.src_path)
            }
            
        }
        if(app.noCmd){
            if(!result){
                result = {
                    src: []
                }
            }
            result.src = result.src.concat(get_path_arr(app.noCmd, config.src_path));
        }
        if(result && result.src && result.src.length){
            grunt.config.set('jshint.check', result);
            grunt.task.run('jshint:check');
        }
    });





    grunt.registerTask("watch-js", "调试js", function(name) {
        var app, result;

        //检查方法
        if(!check_app('js', name)){
            return false;
        }

        //app.home.js.common
        app = App['js'][name];

        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }

        //如果有依赖包
        if (app.dest) {
            if (app.noCmd) { //必须有源才行, 没有源的话去找个妹子要点吧
                grunt.task.run('init-js:' + name);//这里先初始化, 以防文件没有初始化过
                result = {
                    files: get_path_arr(app.noCmd, config.src_path),
                    tasks: ['init-js:' + name] //运行初始化任务
                }
            }
        }

        //如果有则说明有源文件和依赖文件, 需要监听
        var taskName;
        if (result) {
            grunt.config.set('watch.dest', result);
            grunt.task.run('watch:dest');
        } else { //如果没有依赖文件, 则只启动web server,后期可以做成监听并刷新
            log("没有配置源文件, 不需要调试")
        }
    });
    


    
    
    grunt.registerTask("init-copy", function(){
        log("复制文件不需要初始化");
    });

    grunt.registerTask("watch-copy", function(){
        log("复制文件不需要调试");
    });


    grunt.registerTask("dist-copy", "复制文件到dist层", function(name){
        var app;

        //检查方法
        if(!check_app('copy', name)){
            return false;
        }
        

        app = App['copy'][name];

        //兼容直接写源文件地址
        if(Array.isArray(app) || 'string' === typeof(app)){
            app = {
                src: app
            }
        }


        if(!app.src){
            log("请先配置源文件地址");
            return false;
        }


        grunt.config.set("copy.dist", {
            files: [{
                expand: true, //智能搜索
                cwd: config.src_path,
                src: app.src,
                dest: config.dist_path,
                filter: 'isFile'
            }]
        });
        grunt.task.run("copy:dist");
    });






    /**
     * 打印日志
     * @param  {string} str 要打印的信息
     */
    function log(str) {
        grunt.log.writeln("Error => "+ str);
    }



    /**
     * 获取目标路径
     * @param  {string} type   类型， 如： css,js,img
     * @param  {string} target 目标，如：src源，dist编译，dist发布版
     * @return {string}        最终路径
     */
    function get_path(target) {
        return config[(target || 'src') + '_path'];
    }





    /**
     * 转换路径, 摘自sea.js
     * @param  {string} path 要转换的路径
     * @return {string} 转换后的路径
     * @example
     *     1, ./a/../b => ./b
     *     2, ./a/b/c/d/../../e => ./a/b/e
     */
    function get_path_str(path) {
        var DIRNAME_RE = /[^?#]*\//
        var DOT_RE = /\/\.\//g
        var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//
        var MULTI_SLASH_RE = /([^:/])\/+\//g
        path = path.replace(DOT_RE, "/")

        path = path.replace(MULTI_SLASH_RE, "$1/")
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, "/")
        }
        return path
    }


    /**
     * 转换路径, 数组类型
     * @param  {array} arr  数组
     * @param  {undefined | string} path 路径前缀或者空
     * @return {array}      转换后的数组
     */
    function get_path_arr(arr, path) {
        if (!Array.isArray(arr)) {
            arr = [arr];
        }

        return arr.map(function(key) {
            return get_path_str(key.indexOf('!') === 0 ? //解决如果是 ("!xl.txt", "src/txt/") 的问题
                    ('!'+ path + key.substr(1)) : 
                    path + key);
        });
    }




    /**
     * 创建路由
     */
    function create_rules() {
        var rules,
            rewrite = config.rules;


        if("string" === typeof(rewrite)){
            if (rewrite === 'dist' || rewrite === 'dist->src') {//把线上指向源
                rules = [{
                    from: '^/'+ config.dist_path +'(.*)$',
                    to: '/'+ config.src_path +'$1'
                }]
            } else if(rewrite === 'src->dist'){
                rules = [{
                    from: '^/'+ config.src_path +'(.*)$',
                    to: '/'+ config.dist_path +'$1'
                }]
            }
        } else if(Array.isArray(rewrite)){
            rules = rewrite;
        } else if("object" === typeof(rewrite)){
            rules = [ rewrite ];
        }

        if(rules){
            console.log("启动重写, 端口 "+ config.port);
            grunt.config.set('connect.rules', rules);
            rules = null;
        }
    }




    /**
     * 检查配置里是否存在 自己要找的方法
     * @param  {string} type 应该名, 有home
     * @param  {string} fnName  方法如
     * @return {boolean}         是否存在该方法
     */
    function check_app( type, fnName){
        var app = App;
        if(!app[type]){
            return !log("没有找到项目 : "+ type);
        }

        if(!app[type][fnName]){
            return !log("项目 '"+ type +"'里没有配置"+ fnName);
        }

        if (!app[type][fnName]) {
            return !log("项目 '"+ type +"'中没有配置"+ fnName);
        }
        return true;
    }

}