/**
 * @file 压缩html中间件
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

export default class extends think.middleware.base {

    /**
     * run
     * @return {} []
     */
    run(content) {
        if (!content) {
            return content;
        }

        let compress = this.http.param('compress');

        if (!compress) {
            compress = this.config('compress') ? '1' : '0';
        }

        if (compress !== '1') {
            return content;
        }

        let preCache = [];

        // 替换pre
        content = content.replace(/<pre>([\s\S]+?)<\/pre>/g, function ($0) {
            return '{<' + preCache.push($0) + '>}';
        });

        // 替换textarea
        content = content.replace(/<textarea[^>]+?>([\s\S]+?)<\/textarea>/g, function ($0) {
            return '{<' + preCache.push($0) + '>}';
        });

        // 去换行
        content = content.replace(/\n(\s*)/g, '');

        // 还原替换的数据
        content = content.replace(/\{\<(\d+?)\>\}/g, function ($0, $1) {
            return preCache[$1 - 1] || '';
        });

        preCache = null;

        return content;
    }
}
