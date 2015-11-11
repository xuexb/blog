'use strict';
/**
 * model
 */
export default class extends think.model.relation {

    //直接定义 relation 属性
    relation = {
        listdata: {
            type: think.model.HAS_ONE, //relation type
            model: 'list', //model name
            key: 'list_id',
            fKey: 'id', //forign key
            field: 'id, name, url',
        },
        tag: {
            type: think.model.HAS_MANY, //relation type
            model: 'tags_index', //model name
            key: 'id',
            fKey: 'article_id', //forign key
            field: 'article_id, tags_id',
        }
    }

    init(...args) {
        super.init(...args);
    }
}
