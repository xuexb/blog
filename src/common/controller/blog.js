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
     * 初始化ls
     */
    async init_ls() {
        /**
         * ls的缓存对象
         *
         * @example
         *     {
         *         js: {
         *             key: {
         *                 uri: '',
         *                 md5: '',
         *             }
         *         }
         *     }
         * @type {Object}
         */
        let ls_data = await think.cache('ls_data');

        // 如果没有缓存
        if (think.isEmpty(ls_data)) {
            ls_data = {
                js: await this.init_ls_data('js'),
                css: await this.init_ls_data('css')
            };

            await think.cache('ls_data', ls_data, {
                timeout: 60 * 60 * 24 * 30
            });
        }

        this.config('ls__cache', ls_data)
    }

    /**
     * 初始化ls文件
     *
     * @param  {string} type 类型， css||js
     *
     * @return {Object}      配置对象
     */
    async init_ls_data(type = 'js') {
        let result = {};
        let config_ls = this.config('blog.ls');
        let data = config_ls[type];

        if(think.isEmpty(data)){
            return result;
        }

        Object.keys(data).forEach(key => {
            // 文件路径
            let filepath = path.resolve(think.ROOT_PATH, data[key]);

            // 如果该文件不存在
            if (!fs.existsSync(filepath)) {
                return;
            }

            // 获取文件内容
            let filedata = fs.readFileSync(filepath).toString();

            result[key] = {
                uri: filepath,
                md5: think.md5(filedata).substr(0, 6)
            } 
        });

        return result;
    }

    ls(id, type = 'js') {
        let ls_data = this.config('ls__cache')[type];
        if (!id || !ls_data[id]) {
            return '';
        }

        ls_data = ls_data[id];
        let cookie_data = this.cookie(type + '_'+ id);
        let data = fs.readFileSync(ls_data.uri).toString();
        let html;

        if (!cookie_data || cookie_data !== ls_data.md5) {
            if (type === 'js') {
                html = `<script id="${type}_${id}">${data}</script>`;
            } else {
                html = `<style id="${type}_${id}">${data}</style>`;
            }
            html += `<script>LS.set('${type}_${id}', '${ls_data.md5}')</script>`;
        } else {
            html = `<script>LS.get('${type}_${id}', '${type}')</script>`;
        }

        return html;
    }

    /**
     * 前置
     */
    async __before() {
        await this.init_ls();
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
