'use strict';

import Base from './base';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let article = this.model('article');

        let data = await article.field('title, id, list_id').order('id DESC').limit(3).select();

        return this.json(data);
    }
}
