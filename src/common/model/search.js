'use strict';
/**
 * model
 */
export default class extends think.model.base {
    init(...args) {
        super.init(...args);
    }

    /**
     * 获取有缓存的点击排行,top6
     *
     * @return {Promise}   []
     */
    getCacheHitTopList() {
        return this.field('name, hit').cache('search_hit_data').order('hit DESC').limit(6).select();
    }
}