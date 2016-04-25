/**
 * @file command.blog
 * @author fe.xiaowu@gmail.com
 * @description 灵感来自52cik乱码 http://www.52cik.com/
 */

/* eslint-disable no-console */

((window) => {
    'use strict';

    // 仅支持 chrome
    if (!window.chrome) {
        return false;
    }

    /**
     * 命令对象
     *
     * @type {Object}
     */
    var command = window.command = {};

    /**
     * 命令集
     *
     * @type {Object}
     */
    var cmd = command.cmd = {};

    /**
     * 控制台输出样式
     * @type {Object}
     */
    var styles = {
        pad: 'padding:115px;',

        blue: 'color:#369;',
        green: 'color:#360;',
        red: 'color:#A51A0C;',

        head: 'font-size:16px;font-weight:bold;',
        bold: 'font-weight:bold;',

        normal: 'font-weight: normal;',

        mark: 'background-color:#ff0;'
    };

    /**
     * 帮助命令
     */
    cmd.help = () => {
        console.clear();

        console.log(
            [
                '%c控制台操作命令:',
                '',
                '%chelp %c- %c显示帮助信息',
                '%cposts %c- %c列出所有文章',
                '%ctags %c- %c列出所有标签',
                '%csearch("关键词") %c- %c搜索符合的文章',
                '%csearch`关键词` %c- %c搜索符合的文章 (es6字符模板方式)'
            ].join('\n'),
            styles.blue + styles.bold,
            styles.green + styles.bold, styles.red, styles.blue,
            styles.green + styles.bold, styles.red, styles.blue,
            styles.green + styles.bold, styles.red, styles.blue,
            styles.green + styles.bold, styles.red, styles.blue,
            styles.green + styles.bold, styles.red, styles.blue
        );
    };

    /**
     * 标签列表
     *
     * @return {Undefined} undefined
     */
    cmd.tags = () => {
        let list = command.optioins.data;
        let tags = {};
        let tagsCount = 0;

        list.forEach(post => {
            // 如果没有标签
            if (!post.tags || !post.tags.length) {
                return;
            }

            // 如果标签是个字符串
            if ('string' === typeof post.tags) {
                post.tags = post.tags.indexOf(',') ? post.tags.split(',') : [post.tags];
            }

            post.tags.forEach(key => {
                if (!tags[key]) {
                    tags[key] = [];
                }

                tags[key].push(post);

                tagsCount += 1;
            });
        });

        if (tagsCount === 0) {
            return console.log('%c当前没有标签～', styles.blue);
        }

        console.group('标签列表');
        Object.keys(tags).forEach(key => {
            console.groupCollapsed(key + ' - 共 ' + tags[key].length + ' 篇');
            tags[key].forEach(post => {
                console.log(
                    '%c' + post.title + ' %c-> %c' + post.url,
                    styles.green + styles.bold, styles.red, styles.blue
                );
            });
            console.groupEnd();
        });
        console.groupEnd();
    };

    /**
     * 列出文章列表
     */
    cmd.posts = () => {
        let list = command.optioins.data;

        // 如果有文章
        if (list.length) {
            console.group('文章列表:');
            list.forEach((post) => {
                console.log(
                    '%c' + post.title + ' %c-> %c' + post.url,
                    styles.green + styles.bold, styles.red, styles.blue
                );
            });
            console. groupEnd();

            console.log('%c共 %c' + list.length + ' %c篇文章，点击链接即可打开。', styles.blue, styles.red, styles.blue);
        }
        else {
            console.log('%c当前没有文章～', styles.blue);
        }
    };

    /**
     * 搜索
     *
     * @param  {string} key 关键词
     * @return {Undefined} undefined
     */
    cmd.search = (key) => {
        key = Array.isArray(key) ? key[0] : key; // 支持字符模板模式

        if (!key) {
            return console.log('请输入关键字查询');
        }

        // 关键词正则
        let re = new RegExp(key.replace(/[.\\[\]{}()|^$?*+]/g, '\\$&'), 'i');
        let iCount = 0;

        console.group('搜索关键词 "' + key + '"');
        command.optioins.data.forEach(function (post) {
            // 如果标签匹配
            if (re.test(post.title)) {
                let title = post.title.split(key);
                let count = title.length;

                title = title.map(val => '%c' + val).join('%c' + key);

                let log = [
                    title + ' %c-> ' + post.url
                ];

                new Array(count + count - 1).join(',').split(',').forEach((val, index) => {
                    if (index % 2 === 0) {
                        log.push(styles.green + styles.bold);
                    }
                    else {
                        log.push(styles.mark);
                    }
                });

                log.push(styles.normal);

                console.log.apply(console, log);

                iCount++;
            }
        });
        console.groupEnd();

        console.log('%c共找到 %c' + iCount + ' %c篇文章，点击链接即可打开。', styles.blue, styles.red, styles.blue);
    };

    // 1. 让控制台里可以直接输入命令
    // 2. 统一处理返回值
    Object.keys(cmd).forEach(key => {
        let old = cmd[key];
        cmd[key] = (...args) => {
            old(...args);
            return command.optioins.name;
        };
        cmd[key].toString = () => {
            return cmd[key]();
        };
    });

    /**
     * 创建控制台
     *
     * @description 会覆盖window[key]方法以具备在控制台内直接打命令运行
     * @param {Object}              optioins            配置对象
     * @param {Array|Function}      options.data        数据，如果是方法则认为返回Promise
     * @param {string}              options.name        名称，显示在每条结果的最后
     */
    command.create = (optioins = {}) => {
        // 合并默认参数
        command.optioins = Object.assign({}, command.defaults, optioins);

        // 如果数据是个方法，则认为是个promise
        if ('function' === typeof command.optioins.data) {
            console.log('%c加载数据中...', styles.blue + styles.bold);

            Promise.all([command.optioins.data()]).then((data) => {
                command.optioins.data = data[0];
                command._run();
            }, (err) => {
                throw new Error('加载数据出错');
            });
        }
        else if (Array.isArray(command.optioins.data)) {
            command._run();
        }
        else {
            throw new Error('optioins.data 不正确');
        }
    };

    /**
     * 运行
     */
    command._run = () => {
        Object.keys(cmd).forEach(key => {
            command['_' + key] = window[key];
            window[key] = cmd[key];
        });

        cmd.help();
    };

    /**
     * 恢复代码
     *
     * @description 将把之前覆盖的window[key]方法还原
     */
    command.noConflict = () => {
        Object.keys(cmd).forEach(key => {
            window[key] = command[key];
        });
    };

    /**
     * 默认参数
     *
     * @type {Object}
     */
    command.defaults = {
        name: 'command.blog',
        data: []
    };
})(window);