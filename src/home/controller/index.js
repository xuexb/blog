'use strict';

import Base from './base';
import child_process from 'child_process';

import Util from '../../common/util';

export default class extends Base {
    /**
     * 列表使用的默认字段
     *
     * @type {String}
     */
    list_sql_field = 'id, title, list_id, url, update_date, hit, markdown_content_list';

    /**
     * 初始化
     *
     * @param  {Object} http http
     */
    init(http){
        super.init(http); //调用父类的init方法 
    }

    /**
     * 更新node程序
     */
    async updateAction() {
        // 如果不是post
        if (!this.isPost()) {
            return this.error404();
        }

        let data = this.post();

        // 如果没有提交信息
        if (think.isEmpty(data.commits)) {
            return this.json({
                errmsg: '没有提交信息'
            });
        }

        if (think.isEmpty(data.commits.slice(-1)[0].message)) {
            return this.json({
                errmsg: '提交message为空'
            });
        }

        if (data.commits.slice(-1)[0].message.indexOf('[blog compile]') === -1) {
            return this.json({
                errmsg: '没有[blog compile]信息'
            });
        }

        // 执行拉取
        let self = this;
        child_process.exec(`git pull && npm run compile && npm run pm2-restart`, {
            cwd: think.ROOT_PATH
        }, function (err, b) {
            if (err) {
                console.log('更新博客失败');
            } else {
                console.log('更新博客成功');
            }
        });

        return this.json({
            status: 'ok'
        });
    }

    /**
     * rss订阅
     *
     * @return {Promise} []
     */
    rssAction() {
        return this.redirect('/rss.xml', 301);
    }

    /**
     * 主页
     *
     * @return {Promise} []
     */
    async indexAction() {
        let data = this.model('article').field(this.list_sql_field).order('id DESC').limit(10);

        data = await data.cache('index_article_data').select();

        this.assign({
            description: '谢耀武，网名前端小武，喜欢各种折腾, 喜欢研究源, 对美好的代码有极强的透视症, 崇尚有强烈技术氛围的UED...',
            list: data
        });

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
        let list_data = this.config('list_data') || [];

        // 根据url筛选出列表数据，如果不存在则说明传的是假的
        list_data = list_data.filter((val) => val.url === url);

        if(think.isEmpty(list_data)){
            return this.error404();
        }

        list_data = list_data[0];

        // 根据列表id查文章数据
        let data = await this.model('article').field(this.list_sql_field).order('id DESC').where({
            'list_id': list_data.id
        }).page(page).countSelect({}, false);

        // 配置模板数据
        this.assign({
            list: data.data,
            page_data: data.count > 0 ? Util.getPageStr(data, '/list/'+ list_data.url + '/{$page}/') : ''
        });

        // 设置标题
        this.set_title(list_data.name);

        // 设置当前位置
        this.set_location({
            name: list_data.name
        });

        // 设置导航
        this.set_nav_type('article', list_data.id);

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
        let data = await this.model('article').field(this.list_sql_field).order('id DESC').where({
            title: ['like', '%' + key + '%']
        }).page(page).countSelect({}, false);

        // 高亮标题关键词
        data.data.forEach((val) => {
            if (val.title) {
                val.title = val.title.replace(RegExp(key, 'gi'), ($0) => {
                    return '<mark>' + $0 + '</mark>';
                });
            }
        });

        // 模糊搜标签
        let tags_data = await this.model('tags').limit(6).field('id, name, url').where({
            'name|url': ['like', '%' + key +'%']
        }).select();

        // 高亮搜索词
        tags_data.forEach(val => {
            val.name = val.name.replace(RegExp(key, 'gi'), ($0) => {
                return '<mark>' + $0 + '</mark>';
            });
        });

        // 不管有没有数据，插入/更新这个key
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

        // 配置模板数据
        this.assign({
            tags_data: think.isEmpty(tags_data) ? null : tags_data,
            key: key,
            list: data.data,
            page_data: data.count > 0 ? Util.getPageStr(data, '/search/'+ key + '/{$page}/') : ''
        });

        // 设置标题
        this.set_title(`搜索 ${key} 的结果`);

        // 设置当前位置
        this.set_location({
            name: `搜索 ${key} 的结果`
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
        }).page(page).getByTagsList(this.list_sql_field);

        // 筛选出有文章信息的数据
        data.data = data.data.filter((val) => !think.isEmpty(val.article_data));

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
            page_data: data.count > 0 ? Util.getPageStr(data, '/tags/'+ url + '/{$page}/') : ''
        });

        // 设置标题
        this.set_title(tags_data.name, '标签');

        // 设置当前位置
        this.set_location({
            name: tags_data.name
        });

        this.set_nav_type('tags');

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

        // 配置模板数据
        this.assign({
            max_count: max_count,
            list: data
        });

        this.set_title('标签');

        // 设置当前位置
        this.set_location({
            name: '标签'
        });

        this.set_nav_type('tags');

        return this.display();
    }

    /**
     * 详情页
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

            like_data.forEach(val => {
                val.title = val.title.replace(RegExp(referer, 'gi'), ($0) => {
                    return '<mark>' + $0 + '</mark>';
                });
            });
        } else {
            like_data = await this.model('article').order('rand()').limit(6).field('id, title, url').where({
                id: ['!=', data.id],
                list_id: data.list_id
            }).setRelation(false).select();
        }

        // 如果有来路的key则设置key
        if(referer){
            this.assign('key', referer);
        }

        // 更新文章计数
        await this.model('article').where({
            id: data.id
        }).increment('hit');

        // 配置模板数据
        this.assign({
            like_data: think.isEmpty(like_data) ? null : like_data,
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

        // 根据类型设置标签
        if (data.url === 'xiaowu') {
            this.set_nav_type('xiaowu', data.list_data.id);
        } else if (data.url === 'links') {
            this.set_nav_type('links', data.list_data.id);
        } else {
            this.set_nav_type('article', data.list_data.id);
        }

        // 设置当前位置+标题
        if(data.list_data && data.list_data.id){
            this.set_title(data.title, data.list_data.name);

            this.set_location({
                url: `/list/${data.list_data.url || data.list_data.id}/`,
                name: data.list_data.name
            }, {
                name: data.title
            });
        } else {
            this.set_location({
                name: data.title
            });
            this.set_title(data.title);
        }

        return this.display();
    }
}
