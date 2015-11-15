/**
 * @file 博客主控制器，主要写一些所有模块全部都用的，比如标题设置，压缩
 * @author xiaowu
 */

'use strict';

export default class extends think.controller.base {
    /**
     * 压缩页面html并显示
     */
    async displayMin() {
        let templateFile = await this.fetch();
        let preCache = [];

        // 替换pre
        templateFile = templateFile.replace(/<pre>([\s\S]+?)<\/pre>/g, function ($0) {
            return '{<' + preCache.push($0) + '>}';
        });

        // 替换textarea
        templateFile = templateFile.replace(/<textarea[^>]+?>([\s\S]+?)<\/textarea>/g, function ($0) {
            return '{<' + preCache.push($0) + '>}';
        });

        templateFile = templateFile.replace(/\n(\s*)/g, '');
        templateFile = templateFile.replace(/\{\<(\d+?)\>\}/g, function ($0, $1) {
            return preCache[$1 - 1] || '';
        });

        preCache = null;

        this.end(templateFile);
    }

    setTitle(str = '', flag = false) {
        
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
     * 初始化压缩配置
     * @description 优先使用url中的compress，不存在则使用配置的compress
     */
    initCompress() {
        let compress = this.param('compress');

        if(!compress){
            compress = this.config('compress') ? '1' : '0';
        }

        if(compress === '1'){
            this.display = this.displayMin;
        }
    }


    /**
     * 打印日志
     *
     * @param  {string|Object} data 数据
     *
     * @return {Promise}      []
     */
    log(data) {
        if(think.isObject(data)){
            data = JSON.stringify(data);
        }
        return think.log(data, 'BLOG');
    }

    /**
     * 初始化
     *
     * @param  {Object} http http
     */
    init(http){
        super.init(http); //调用父类的init方法 

        this.initCompress();
    }

}
