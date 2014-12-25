//这里定义一些全局通用的函数，该文件会被自动加载
'use strict';



/**
 * Url解析对象
 * @type {object}
 */
global.Url = {};

/**
 * 文章链接
 * @type {Object}
 */
Url.article = {
    all: function(page){
        return '/all/' + (page ? page + '/' : '');
    },
    view: function(id, url, page) {
        if (url) {
            id = url;
        }

        return '/html/' + id + '.html' + (page ? '?page='+ page : '');
    },
    list: function(id, url, page) {
        if (url) {
            id = url;
        }

        return '/list/' + id + '/' + (page ? page + '/' : '');
    },
    search: function(val, page){
        return '/search/'+ val + '/' + (page ? page + '/' : '');
    },
    create: function(){
        return '/admin/article/create';
    },
    edit: function(id){
        return '/admin/article/edit?id='+ id;
    },
    del: function(id){
        return '/admin/article/del?id='+ id;
    }
}



Url.admin = {
    login: function(){
        return '/admin/login';
    }
}


/**
 * 标签链接
 * @type {Object}
 */
Url.tags = {
    list: function(id, url, page) {
        if (url) {
            id = url;
        }

        return '/tags/' + id + '/' + (page ? page + '/' : '');
    },
    index: function(){
        return '/tags/';
    }
}



/**
 * 美化时间
 * @param  {number} date 目标时间戳
 * @param {string} str 时间格式
 * @return {string}   美化成功的
 */
Date.elapsedDate = function(date, str) {
    var past = (new Date() - date) / 1000,
        result;
    if (past < 10) {
        result = '刚刚';
    } else if (past < 60) {
        result = Math.round(past) + '秒前';
    } else if (past < 3600) {
        result = Math.round(past / 60) + '分钟前';
    } else if (past < 86400) {
        result = Math.round(past / 3600) + '小时前';
    } else {
        result = Date.formatDate(date, str);
    }
    return result;
}



/**
 * 日期格式化
 * @type {[type]}
 * "yyyy-MM-dd hh:mm:ss.S" =>
 * "yyyy-MM-dd E HH:mm:ss" =>
 * "yyyy-MM-dd EE hh:mm:ss" =>
 * "yyyy-MM-dd EEE hh:mm:ss" =>
 * "yyyy-M-d h:m:s.S" =>
 */
Date.formatDate = function(date, str) {

    var getTime,
        key;

    str = str || 'yyyy-M-d h:m:s';

    if (date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
    } else {
        date = new Date();
    }

    getTime = {
        'M+': date.getMonth() + 1, //月份           
        'd+': date.getDate(), //日           
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
        'H+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'S': date.getMilliseconds() //毫秒           
    }


    //如果有年
    if (/(y+)/i.test(str)) {
        //RegExp.$1为上次正则匹配的第1个结果，那么length就不用说了吧
        str = str.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (key in getTime) {
        if (new RegExp('(' + key + ')').test(str)) {
            str = str.replace(RegExp.$1, (RegExp.$1.length === 1) ? (getTime[key]) :
                (('00' + getTime[key]).substr(('' + getTime[key]).length)));
        }
    }
    return str;
}



/**
 * 获取分页
 * @param  {object} opt 分页配置对象
 * @param  {string} url 分页连接，用 {$page} 表示分页变量
 * @return {string}     最终分页代码，有可能是空字符
 */
global.get_page = function(opt, url) {
    opt = opt || {};
    url = String(url);

    var render = function(num) {
        return url.replace(/{\$page}/g, num);
    }

    var str = '',
        page = parseInt(opt.page, 10) || 1,
        i = 1,
        pageCount = parseInt(opt.total, 10) || 0;

    if (pageCount > 1) {

        if (page > 1) {
            str += '<a href="' + render(page - 1) + '">上一页</a>';
        } else {
            str += '<span class="disabled">上一页</span>';
        }

        if (pageCount < 7) {
            for (i; i <= pageCount; i++) {
                if (page === i) {
                    str += '<span class="current">' + i + '</span>';
                } else {
                    str += '<a href="' + render(i) + '">' + i + '</a>';
                }
            }
        } else {
            var start, end;
            if (page === 1) {
                str += '<span class="current">1</span>';
            } else {
                str += '<a href="' + render(1) + '">1</a>';
            }
            if (page > 4) {
                str += '<span class="dot">...</span>';
            }
            if (page < 5) {
                start = 1;
            } else {
                start = page - 2;
            }

            if (page > (pageCount - 4)) {
                end = pageCount;
            } else {
                end = page + 3;
            }
            for (var i2 = start; i2 < end; i2++) {
                if (i2 !== 1 && i2 !== pageCount) { //避免重复输出1和最后一页
                    if (i2 === page) {
                        str += '<span class="current">' + i2 + '</span>';
                    } else {
                        str += '<a href="' + render(i2) + '">' + i2 + '</a>';
                    }
                }
            }
            if (page < (pageCount - 4)) {
                str += '<span class="dot">...</span>';
            }
            if (page === pageCount) {
                str += '<span class="current">' + pageCount + '</span>';
            } else {
                str += '<a href="' + render(pageCount) + '">' + pageCount + '</a>';
            }
            start = end = null;
        }

        if (page < pageCount) {
            str += '<a href="' + render(page + 1) + '">下一页</a>';
        } else {
            str += '<span class="disabled">下一页</span>';
        }


        str = '<div class="ui-page mt20">' + str + '</div>';
    }

    return str;
}


global.xss_html = function(str){
    var data = [],
        i,len;
    str = String(str);



    //过滤 代码块
    str = str.replace(/(```|`)([\s\S]+?)(\1)/g, function($0){
        return '```'+ (data.push($0) - 1) +'```';
    });

    //转义下
    // str = encodeHTML(str);

    str = str.replace(/<[^>]*?>/g, '');


    //把代码块替换到内容
    for(i=0,len = data.length; i<len; i++){
        str = str.replace('```'+ i +'```', data[i]);
    }


    i = len = data = null;

    return str;
}


/**
 * 循环 for jquery
 */
global.each = function(obj, callback, args) {
    var value,
        i = 0,
        length = obj.length,
        isArray = Array.isArray(obj);

    if (args) {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
    }

    return obj;
}