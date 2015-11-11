'use strict';
/**
 * model
 */
export default class extends think.model.relation {

    //直接定义 relation 属性
    relation = {
        tagdata: {
            type: think.model.HAS_ONE, //relation type
            model: 'tags', //model name
            name: 'tagdata', //data name
            key: 'tags_id',
            fKey: 'id', //forign key
            field: 'id, name, url'
        }
    }

    init(...args) {
        super.init(...args);
    }
}
