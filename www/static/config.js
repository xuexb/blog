/**
 * 嫁拍html5移动端项目打包配置
 * @description 这里以源目录src为根目录，这提供把源目录里的文件打包/合并/复制到生成后目录dist功能
 */

var 
    app = {},
    css, js, copy, task;

/**
 * 任务集合
 * @description 每次发布的版本都可以找到，可以直接通过grunt task:ver来发布
 * @type {Object}
 */
task = app.task = {};

/**
 * 样式集合
 * @description 可以通过dist-css来完成打包，样式应该颗粒化，
 *              项目每个css文件都应该出现在这个里面，然后可以组合为task来发布
 * @type {Object}
 */
css = app.css = {};

/**
 * js集合
 * @description 可以通过dist-js来完成打包，样式应该颗粒化，
 *              项目每个js文件都应该出现在这个里面，然后可以组合为task来发布
 * @type {Object}
 */
js = app.js = {};

/**
 * 复制文件
 * @description 可以把src源文件夹里的文件复制到dist里，通常用来复制图片
 * @type {Object}
 */
copy = app.copy = {};


// 任务配置
task['0.0.2'] = [
    'dist-css:global',
    'dist-css:admin',
    'dist-js:all'
];
task.wise = [
    'dist-js:wise_global',
    'dist-css:wise_global'
]

// ================================================================
//                          样式配置
// ================================================================

/**
 * 全部样式
 */
css.global = 'pc/global.css';

css.admin = 'pc/admin.css';



// ================================================================
//                          js配置
// ================================================================


// ================================================================
//                          copy配置
// ================================================================
js.all = {
    src: 'pc/**/*.js',
    noCmd: 'seajs/sea.js'
}

js.sea = {
    noCmd: 'seajs/sea.js'
}

js.admin = 'pc/admin/**/*.js';

js.ls = {
    noCmd: 'ls.js'
}

// wise
js.wise_global = {
    noCmd: [
        'wise/sm/zepto.min.js',
        'wise/sm/sm.config.js',
        'wise/sm/sm.min.js',
        'wise/xuexb.js'
    ],
    dest: 'wise/global.js'
}
css.wise_global = [
    'wise/global.css'
]

module.exports = app;