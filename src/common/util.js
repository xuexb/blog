//这里定义一些全局通用的函数，该文件会被自动加载
'use strict';

let Util = {};

let parseDate = Util.parseDate = {};



/**
 * 日期格式化
 * @type {[type]}
 * "yyyy-MM-dd hh:mm:ss.S" =>
 * "yyyy-MM-dd E HH:mm:ss" =>
 * "yyyy-MM-dd EE hh:mm:ss" =>
 * "yyyy-MM-dd EEE hh:mm:ss" =>
 * "yyyy-M-d h:m:s.S" =>
 */
parseDate.format = function (date, str) {

    var getTime,
        key;

    str = str || 'yyyy-M-d H:mm';

    if (date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
    }
    else {
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
    };


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
};



/**
 * 美化时间
 * @param  {number} date 目标时间戳
 * @param {string} str 时间格式
 * @return {string}   美化成功的
 */
parseDate.elapsed = function (date, str) {
    var past = (new Date() - date) / 1000,
        result;
    if (past < 10) {
        result = '刚刚';
    }
    else if (past < 60) {
        result = Math.round(past) + '秒前';
    }
    else if (past < 3600) {
        result = Math.round(past / 60) + '分钟前';
    }
    else if (past < 86400) {
        result = Math.round(past / 3600) + '小时前';
    }
    else {
        result = parseDate.format(date, str);
    }
    return result;
};



/**
 * 获取分页
 * @param  {object} opt 分页配置对象
 * @param  {string} url 分页连接，用 {$page} 表示分页变量
 * @return {string}     最终分页代码，有可能是空字符
 */
Util.getPageStr = function (option = {}, url = '') {
    let render = function (num) {
        return url.replace(/{\$page}/g, num);
    };

    let str = '';
    let page = option.currentPage;
    let pageCount = option.totalPages;

    if (pageCount > 1) {

        if (page > 1) {
            str += '<a href="' + render(page - 1) + '">上一页</a>';
        }
        else {
            str += '<span class="disabled">上一页</span>';
        }

        if (pageCount < 7) {
            for (let i = 1; i <= pageCount; i++) {
                if (page === i) {
                    str += '<span class="current">' + i + '</span>';
                }
                else {
                    str += '<a href="' + render(i) + '">' + i + '</a>';
                }
            }
        }
        else {
            if (page === 1) {
                str += '<span class="current">1</span>';
            }
            else {
                str += '<a href="' + render(1) + '">1</a>';
            }
            if (page > 4) {
                str += '<span class="dot">...</span>';
            }

            let start;
            let end;
            if (page < 5) {
                start = 1;
            }
            else {
                start = page - 2;
            }

            if (page > (pageCount - 4)) {
                end = pageCount;
            }
            else {
                end = page + 3;
            }
            for (let i2 = start; i2 < end; i2++) {
                if (i2 !== 1 && i2 !== pageCount) { //避免重复输出1和最后一页
                    if (i2 === page) {
                        str += '<span class="current">' + i2 + '</span>';
                    }
                    else {
                        str += '<a href="' + render(i2) + '">' + i2 + '</a>';
                    }
                }

            }
            if (page < (pageCount - 3)) {
                str += '<span class="dot">...</span>';
            }

            if (page === pageCount) {
                str += '<span class="current">' + pageCount + '</span>';
            }
            else {
                str += '<a href="' + render(pageCount) + '">' + pageCount + '</a>';
            }
        }

        if (page < pageCount) {
            str += '<a href="' + render(page + 1) + '">下一页</a>';
        }
        else {
            str += '<span class="disabled">下一页</span>';
        }


        str = '<div class="ui-page mt20">' + str + '</div>';
    }

    return str;
};
export default Util;
