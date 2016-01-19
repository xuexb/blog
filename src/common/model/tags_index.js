'use strict';
/**
 * model
 */
export default class extends think.model.relation {

    relation = {
        tag_data: {
            type: think.model.HAS_ONE, //relation type
            model: 'tags', //model name
            key: 'tags_id',
            fKey: 'id', //forign key
            field: 'id, name, url'
        }
    };

    init(...args) {
        super.init(...args);
    }

    /**
     * 根据标签查列表
     *
     * @param  {string} field 字段
     *
     * @return {Promise}       {}
     */
    getByTagsList(field = 'id, title, list_id, url, update_date, hit, markdown_content_list') {
        this.relation = {
            article_data: {
                type: think.model.HAS_ONE, //relation type
                model: 'article', //model name
                key: 'article_id',
                fKey: 'id', //forign key
                field: field
            }
        }

        return this.setRelation('article_data').countSelect({}, false);
    }
}
