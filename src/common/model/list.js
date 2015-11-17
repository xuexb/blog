'use strict';
/**
 * model
 */
export default class extends think.model.base {
    init(...args) {
        super.init(...args);
    }

    /**
     * 获取有缓存的列表数据
     *
     * @return {Promise}   []
     */
    getCacheList() {
        return this.cache('list_data').order('id DESC').select();
    }
}