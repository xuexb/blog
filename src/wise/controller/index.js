'use strict';

// 扩展blog基础
import Base from '../../common/controller/blog';

import Util from '../../common/util';

export default class extends Base {
    /**
     * 列表使用的默认字段
     *
     * @type {String}
     */
    list_sql_field = 'id, title, url';

    /**
     * 前置方法
     *
     * @private
     */
    async __before(http){
        this.assign('dark', this.cookie('dark'));

        // 列表数据
        this.config('list_data', await this.model('list').getCacheList());

        // 默认的title
        this.assign('title', '前端小武博客');

        // 列表数据设置到模板中
        this.assign('list_data', this.config('list_data'));

        this.assign('bar_title', '前端小武');
    }

    /**
     * 初始化
     *
     * @param  {Object} http http
     */
    init(http){
        super.init(http); //调用父类的init方法 
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
        let page = this.post('page') || 1;
        let list_data = this.config('list_data');
        let key = this.get('key');

        // 根据url筛选出列表数据，如果不存在则说明传的是假的
        list_data = list_data.filter((val) => val.url === url);

        if(think.isEmpty(list_data)){
            return this.error404();
        }

        list_data = list_data[0];

        // 根据列表id查文章数据
        let sql = this.model('article').field(this.list_sql_field).order('id DESC').where({
            'list_id': list_data.id
        }).page(page);

        if (key) {
            sql.where({
                title: ['like', '%' + key + '%']
            });
        }

        let data = await sql.countSelect({});

        // 飘红标题
        if (key && !think.isEmpty(data.data)) {
            data.data.forEach(function(val){
                val.title = val.title.replace(new RegExp(key, 'gi'), function($0){
                    return '<mark>' + $0 + '</mark>';
                });
            });
        }

        if (this.isPost()) {
            return this.json(data);
        }

        // 配置模板数据
        this.assign({
            key: key,
            list: data.data,
            title: `${list_data.name}_${think.config('blog.name')}`,
            bar_title: list_data.name
        });

        return this.display();
    }

    /**
     * 主页
     *
     * @type {GET|POST}
     * @param {string} key 关键词
     * @param {number} page 页码
     * @return {Promise} []
     */
    async indexAction() {
        let page = this.post('page') || 1;
        let sql = this.model('article').field(this.list_sql_field).order('id DESC').limit(10).setRelation(false);
        let key = this.get('key');

        if (key) {
            sql.where({
                title: ['like', '%' + key + '%']
            });
        }

        let data = await sql.page(page).countSelect({});

        // 飘红标题
        if (key && !think.isEmpty(data.data)) {
            data.data.forEach(function(val){
                val.title = val.title.replace(new RegExp(key, 'gi'), function($0){
                    return '<mark>' + $0 + '</mark>';
                });
            });
        }

        if (this.isPost()) {
            return this.json(data);
        }

        this.assign({
            key: key,
            list: data.data
        });

        this.display();
    }

    /**
     * 搜索列表
     *
     * @type {GET|POST}
     * @param {string} key 关键词
     * @param {number} page 页码
     * @return {Promise} []
     */
    async searchAction() {
        let page = this.post('page') || 1;
        let sql = this.model('article').field(this.list_sql_field).order('id DESC').limit(10).setRelation(false);
        let key = this.get('key');

        if (key) {
            sql.where({
                title: ['like', '%' + key + '%']
            });
        }

        let data = await sql.page(page).countSelect({});

        // 飘红标题
        if (key && !think.isEmpty(data.data)) {
            data.data.forEach(function(val){
                val.title = val.title.replace(new RegExp(key, 'gi'), function($0){
                    return '<mark>' + $0 + '</mark>';
                });
            });
        }

        if (this.isPost()) {
            return this.json(data);
        }

        this.assign({
            key: key,
            list: data.data
        });

        this.display('index');
    }

    /**
     * 详情页
     *
     * @param {string} url 文章链接或者id
     * @return {Promise} []
     */
    async viewAction() {
        let url = this.param('url');

        //如果为老域名，兼容下301
        if(url === 'xieliang'){
            return this.redirect('/html/xiaowu.html', 301);
        }

        let where = {};

        if(isFinite(url)){
            where.id = url;
        } else {
            where.url = url;
        }

        let data = await this.model('article')
            .field('id, markdown_content, hit, update_date, list_id, title, url, catalog, goto_url')
            .where(where)
            .find();

        // 如果为空，说明该文章不存在
        if(think.isEmpty(data)){
            return this.error404();
        }

        // 更新文章计数
        await this.model('article').where({
            id: data.id
        }).increment('hit');

        // 如果有跳转url
        if (data.goto_url) {
            return this.redirect(data.goto_url, 301);
        }

        // 上一个
        let prev_article = await this.model('article').field('id, title, url').limit(1).where({
            id: data.id - 1
        }).setRelation(false).find();

        // 下一个
        let next_article = await this.model('article').field('id, title, url').limit(1).where({
            id: data.id + 1
        }).setRelation(false).find();

        // 配置模板数据
        this.assign({
            data: data,
            prev_article_data: think.isEmpty(prev_article) ? null : prev_article,
            next_article_data: think.isEmpty(next_article) ? null : next_article
        });

        // 配置描述
        let description = data.markdown_content.replace(/<[^>]+?>/g, '')
            .replace(/[\r\n]/g, '')
            .replace(/\s+/g, '')
            .substr(0, 100) + '...';
        this.assign('description', description);

        this.assign({
            bar_title: data.title,
            title: data.title
        });

        return this.display();
    }
}
