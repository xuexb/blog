'use strict';

/**
 * model
 */
export default class extends think.model.base {
    init(...args) {
        super.init(...args);
    }

    /**
    * 获取缓存的随机列表数据
    *
    * @param {number} top top
    *
    * @return {Promise}   []
    */
    getCacheRandList(top = 20) {
        return this.field('name, id, url').cache('rand_tags_list_data').order('rand()').limit(top).select();
    }
}
