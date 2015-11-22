/**
 * @file 博客主控制器，主要写一些所有模块全部都用的，比如标题设置，压缩
 * @author xiaowu
 */

'use strict';

import fs from 'fs';
import path from 'path';

export default class extends think.controller.base {
    /**
     * 设置标题
     *
     * @param {string} data 标题
     */
    set_title(...data) {
        data.push(this.config('blog.name'));
        this.assign('title', data.join(this.config('blog.title_separate')));
    }

    /**
     * 显示404页面
     *
     * @return {Promise} []
     */
    error404() {
        return think.statusAction(404, this.http);
    }

    /**
     * 打印日志
     *
     * @param  {string|Object} data 数据
     *
     * @return {Promise}      []
     */
    log(data) {
        if (think.isObject(data)) {
            data = JSON.stringify(data);
        }
        return think.log(data, 'BLOG');
    }

    /**
     * 前置
     */
    async __before() {
        await super.__before();
    }

    /**
     * 初始化
     *
     * @param  {Object} http http
     */
    init(http) {
        // 调用父类的init方法
        super.init(http);
    }

}
