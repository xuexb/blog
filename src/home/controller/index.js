'use strict';

import Base from './base';
import Util from '../../common/util';

export default class extends Base {
    /**
     * 列表使用的默认字段
     *
     * @type {String}
     */
    static listSqlField = 'id, title, list_id, url, update_date, hit, markdown_content_list';

    /**
     * 主页
     *
     * @return {Promise} []
     */
    async indexAction() {
        let article = this.model('article');
        let data = await article.field(this.listSqlField).order('id DESC').limit(10).select();
        this.assign('list', data);
        return this.display();
    }

    /**
     * 列表
     *
     * @param {string} xssurl 列表url
     * @param {number} page 页码
     * @return {Promise} []
     */
    async listAction() {
        let url = this.param('xssurl');
        let page = this.param('xsspage');
        let list_data = this.config('list') || [];

        // 根据url筛选出列表数据，如果不存在则说明传的是假的
        list_data = list_data.filter((val) => val.url === url);

        if(!list_data || !list_data.length){
            return this.error404();
        }

        list_data = list_data[0];

        // 根据列表id查文章数据
        let data = await this.model('article').field(this.listSqlField).order('id DESC').where({
            'list_id': list_data.id
        }).page(page).countSelect({}, false);

        // 配置模板数据
        this.assign({
            current_list_data: list_data,
            list: data.data,
            page_data: data.count > 0 ? Util.getPageStr(data, '/list/'+ list_data.url + '/{$page}/') : '',
            title: list_data.name + '——'+ this.config('blog.name')
        });

        return this.display();
    }

    /**
     * 搜索列表
     *
     * @param {string} key 关键字
     * @param {number} page 页码
     * @return {Promise} []
     */
    async searchAction() {
        let key = this.param('key').trim();
        let page = this.param('page');

        // 根据key查文章列表数据
        let data = await this.model('article').field(this.listSqlField).order('id DESC').where({
            title: ['like', '%' + key + '%']
        }).page(page).countSelect({}, false);

        // 高亮标题关键词
        data.data.forEach((val) => {
            if (val.title) {
                val.title = val.title.replace(RegExp(key, 'gi'), function($0) {
                    return '<mark>' + $0 + '</mark>';
                });
            }
        });

        // 如果有数据，插入/更新这个key
        if (data.count > 0) {
            let update_search_result = await this.model('search').thenAdd({
                name: key,
                hit: 0
            }, {
                name: key
            });

            // 如果已存在
            if(update_search_result.id && update_search_result.type === 'exist'){
                await this.model('search').where({
                    id: update_search_result.id
                }).increment('hit');
                this.log({
                    msg: '更新搜索词',
                    key: key
                });
            } else {
                this.log({
                    msg: '添加搜索词',
                    key: key
                });
            }
        }

        // 配置模板数据
        this.assign({
            key: key,
            list: data.data,
            page_data: data.count > 0 ? Util.getPageStr(data, '/search/'+ key + '/{$page}/') : '',
            title: '搜索 ' + key + ' 的结果——'+ this.config('blog.name')
        });

        return this.display();
    }

    /**
     * 标签列表
     *
     * @param {string} xssurl 标签url
     * @param {number} xsspage 页码
     * @return {Promise} []
     */
    async tagsListAction() {
        let url = this.param('xssurl');
        let page = this.param('xsspage');

        let where = {};

        if(isFinite(url)){
            where.id = url;
        } else {
            where.url = url;
        }

        // 查出来标签的数据
        let tags_data = await this.model('tags').field('name, id, url').where(where).find();

        // 如果没有这个标签
        if(think.isEmpty(tags_data)){
            return this.error404();
        }

        // 根据标签id来关联的文章列表数据
        let data = await this.model('tags_index').field('tags_id, article_id').where({
            tags_id: tags_data.id
        }).page(page).getByTagsList(this.listSqlField);

        // 生成列表使用的数据
        data.data = data.data.map((val) => val.article_data);

        // 如果有数据，插入/更新这个key
        if (data.count > 0) {
            await this.model('tags').where({
                id: tags_data.id
            }).increment('hit');
            this.log({
                msg: '更新标签hit+1',
                tags_id: tags_data.id
            });
        }

        // 配置模板数据
        this.assign({
            tags_data: tags_data,
            list: data.data,
            page_data: data.count > 0 ? Util.getPageStr(data, '/tags/'+ url + '/{$page}/') : '',
            title: tags_data.name + '——'+ this.config('blog.name')
        });

        // return this.json(data.data)

        return this.display();
    }

    /**
     * 标签主页
     *
     * @return {Promise} []
     */
    async tagsAction() {
        let model_tags_index = this.model('tags_index');
        let data = await this.model('tags').field('id, name, hit, url').order('hit DESC').select();

        let max_count = 0;

        // 拿标签数据去查文章个数
        for (let val of data) {
            val.article_count = await model_tags_index.where({
                tags_id: val.id
            }).count('id');

            max_count += val.article_count;
        }

        this.assign({
            max_count: max_count,
            list: data,
            title: '标签——'+ this.config('blog.name')
        })
        return this.display();
    }

    /**
     * 说情页
     *
     * @return {Promise} []
     */
    async viewAction() {
        let url = this.param('url');

        let where = {};

        if(isFinite(url)){
            where.id = url;
        } else {
            where.url = url;
        }

        let data = await this.model('article')
            .field('id, markdown_content, hit, update_date, list_id, title, url, catalog')
            .where(where)
            .find();

        // 如果为空，说明该文章不存在
        if(think.isEmpty(data)){
            return this.error404();
        }

        // 上一个
        let prev_article = await this.model('article').field('id, title, url').limit(1).where({
            id: data.id - 1
        }).setRelation(false).find();

        // 下一个
        let next_article = await this.model('article').field('id, title, url').limit(1).where({
            id: data.id + 1
        }).setRelation(false).find();

        // 根据来路判断是不是从搜索页进来，如果是则提示相关的东东
        let referer = this.referrer();
        if (referer && referer.indexOf('search/') > 0) {
            referer = (referer + '/').match(/search\/(.*?)\//) || ['', ''];

            referer = referer[1];

            // 兼容非路由的
            referer = referer.replace('?key=', '');

            referer = decodeURIComponent(referer);
        } else {
            referer = null;
        }

        let like_data = null;
        if(referer){
            this.log({
                msg: '从搜索页跳到详情页',
                key: referer
            });

            like_data = await this.model('article').limit(6).field('id, title, url').where({
                id: ['!=', data.id],
                title: ['like', '%' + referer + '%']
            }).setRelation(false).select();
        } else {
            like_data = await this.model('article').order('rand()').limit(6).field('id, title, url').where({
                id: ['!=', data.id],
                list_id: data.list_id
            }).setRelation(false).select();
        }

        if(referer){
            this.assign('key', referer);
        }

        // 配置模板数据
        this.assign({
            like_data: think.isEmpty(like_data) ? null : like_data,
            data: data,
            prev_article_data: think.isEmpty(prev_article) ? null : prev_article,
            next_article_data: think.isEmpty(next_article) ? null : next_article
        });

        return this.display();
    }
}
