/**
 * @file LS.js
 * @description 只是玩玩，代码没有考虑过多的场景
 * @author xiaowu
 * @email fe.xiaowu@baidu.com
 */

(function (window, document) {
    'use strict';

    /**
     * 暴露空间
     * @type {Object}
     */
    var LS = window.LS = {
        set: function () {},
        get: function () {}

    };

    /**
     * 别名
     * @type {Object}
     */
    var cname = {
        js: 'script',
        css: 'style'

    };

    /**
     * 写入cookie
     *
     * @param  {string} key   名
     * @param  {string} value 值,删除则是null
     */
    var setcookie = function (key, value) {
        var time = value === null ? -1 : 999;
        var expires = '; expires=' + new Date(+new Date + 864e5 * time).toGMTString();
        document.cookie = key + '=' + value + '; path=/;'+ expires;
    };

    /**
     * 使用数据插入到页面head中
     *
     * @param  {string} tagName 标签名
     * @param  {string} data    数据
     */
    var append = function (tagName, data) {
        var div = document.createElement(tagName);
        div.innerHTML = data;
        document.head.appendChild(div);
        div = null;
    };

    /**
     * 读取缓存并写入到页面中
     *
     * @param  {string} id   缓存id
     * @param  {string} type 缓存类型，有js,css
     */
    var cache2html = function (id, type) {
        var data = localStorage[id];

        // 如果缓存里没有数据
        if (!data) {
            setcookie(id, null);
            return location.reload(true);
        }

        // 把数据写入到页面中
        append(cname[type], data);
    };

    /**
     * 写入缓存
     *
     * @param  {string} id 元素id
     * @param {string} md5 md5值
     */
    var html2cache = function (id, md5) {
        var elem = document.getElementById(id);
        var innerHTML;

        // 如果没有元素
        if (!elem) {
            return;
        }

        innerHTML = elem.innerHTML.trim();

        // 写入缓存
        localStorage[id] = innerHTML;

        // 写入后再读取，验证是否写入成功
        if (localStorage[id] === innerHTML) {
            setcookie(id, md5);
        } else {
            setcookie(id, null);
            delete localStorage[id];
        }
    };

    // 如果支持缓存
    // 为了防止禁用cookie时的报错
    try {
        if (window.localStorage && navigator.cookieEnabled) {
            LS.get = cache2html;
            LS.set = html2cache;
        }
    }
    catch (e) {}
})(window, document);