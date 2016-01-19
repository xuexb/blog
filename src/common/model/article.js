'use strict';
/**
 * model
 */
export default class extends think.model.relation {

    // 关联表
    relation = {
        list_data: {
            type: think.model.HAS_ONE, //relation type
            model: 'list', //model name
            key: 'list_id',
            fKey: 'id', //forign key
            field: 'id, name, url',
        },
        tags_data: {
            type: think.model.HAS_MANY, //relation type
            model: 'tags_index', //model name
            key: 'id',
            fKey: 'article_id', //forign key
            field: 'article_id, tags_id'
        }
    };

    init(...args) {
        super.init(...args);
    }

    /**
     * 获取有缓存的最新文章列表，top6
     *
     * @return {Promise}   []
     */
    getCacheNewList() {
        let sql = this.field('title, id, url').cache('new_article_data').order('id DESC').limit(6);
        return sql.setRelation(false).select();
    }
}
