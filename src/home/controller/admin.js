'use strict';

import fs from 'fs';
import path from 'path';
import Base from './base';
import Util from '../../common/util';
import Create from '../../common/create_sitemap';

export default class extends Base {
    /**
     * 初始化
     *
     * @param  {Object} http http
     */
    init(http){
        super.init(http); //调用父类的init方法 
    }

    /**
     * 更新文章缓存
     */
    async updateArticleCache() {
        await think('new_article_data', null);
        await think('index_article_data', null);
    }

    /**
     * 更新标签缓存
     */
    async updateTagsCache() {
        await think('rand_tags_list_data', null);
    }

    /**
     * 前置
     *
     * @param  {Object} http http对象
     */
    async __before(http) {
        await super.__before(http);

        /**
         * 不需要登录检查的action名
         *
         * @type {Array}
         */
        let action = [
            'login',
            'exit'
        ];

        if (action.indexOf(this.http.action) > -1) {
            return this;
        }

        let user_info = await this.session('user_info');
        if (think.isEmpty(user_info)) {
            return this.redirect('/admin/login', 302);
        }

        this.user_info = user_info;
        this.assign('user_info', user_info);
    }

    /**
     * 登录
     *
     * @return {Promise} []
     */
    async loginAction() {
        if(this.isGet()){
            this.set_location({
                name: '登录'
            });
            this.set_title('登录');
            return this.display();    
        }

        let data = this.post();
        let user_info = this.config('blog.user_info');

        if(data.username !== user_info.username || data.password !== user_info.password){
            this.log({
                msg: '登录用户失败',
                data: data
            });
            return this.tips('用户名或者密码错误', '/admin/login/');
        }

        this.log({
            msg: '登录用户成功',
            data: data
        });

        await this.session('user_info', user_info);

        return this.redirect('/admin/');
    }

    /**
     * 设置当前位置
     *
     * @param {Object} data 数据 {url, name}
     */
    set_location(...data) {
        data.unshift({
            url: '/admin',
            name: '后台'
        });

        super.set_location(...data);
    }

    /**
     * 主页
     *
     * @return {Promise} []
     */
    async indexAction() {

        // 设置当前位置
        super.set_location({
            name: '后台'
        });

        this.set_title('后台主页');

        return this.display();
    }

    /**
     * 管理文章列表
     *
     * @param {int} page 页码
     * @param {string} key 关键字
     * @param {number} list_id 分类id
     * @return {Promise} []
     */
    async articleAction() {
        let page = this.param('page');
        let key = this.param('key').trim();
        let list_id = this.param('list_id');
        let where = {};

        // 处理条件
        if(list_id){
            let list_data = this.config('list_data').filter(val => String(val.id) === list_id);
            if(!think.isEmpty(list_data)){
                where.list_id = list_data[0].id;
            }
            this.assign('list_id', list_id);
        }
        if(key){
            where.title = ['like', '%' + key + '%'];
            this.assign('key', key);
        }

        // 设置当前位置
        this.set_location({
            name: '管理文章'
        });

        let data = this.model('article').field('list_id, id, title, url').order('id DESC').where(where).page(page);

        data = await data.countSelect({}, false);

        let page_url = `/admin/article/?page={$page}&key=${key}&list_id=${list_id}`;

        // 配置模板数据
        this.assign({
            list: data.data,
            page_data: data.count > 0 ? Util.getPageStr(data, page_url) : ''
        });

        this.set_title('管理文章');

        return this.display();
    }

    /**
     * 编辑文章
     *
     * @param {number} id 文章id
     * @return {Promise} []
     */
    async editArticleAction() {
        let id = this.param('id');

        let data = await this.model('article').field('id, title, content, update_date, hit, list_id, url').where({
            id: id
        }).find();

        // 如果滑数据
        if(think.isEmpty(data)){
            return this.error404();
        }

        // 标签数据
        let tags_data = await this.model('tags').field('id, name').order('id DESC').select();

        // 如果有标签数据并且文章有标签信息
        if(!think.isEmpty(tags_data) && !think.isEmpty(data.tags_data)){
            let hash = {};
            data.tags_data.forEach(val => {
                hash[val.tags_id] = 1;
            });

            tags_data.forEach(val => val.checked = !!hash[val.id]);
        }

        // 设置当前位置
        this.set_location({
            name: '编辑文章'
        });

        // 配置模板数据
        this.assign({
            tags_data: think.isEmpty(tags_data) ? null : tags_data,
            data: data,
            type: 'edit'
        });

        this.set_title('编辑文章');

        return this.display();
    }

    /**
     * 添加文章
     * @return {Promise} []
     */
    async addArticleAction() {

        // 设置当前位置
        this.set_location({
            name: '添加文章'
        });

        // 标签数据
        let tags_data = await this.model('tags').field('id, name').order('id DESC').select();

        // 配置模板数据
        this.assign({
            tags_data: think.isEmpty(tags_data) ? null : tags_data,
            data: {},
            type: 'add'
        });

        this.set_title('添加文章');

        return this.display('home/admin/edit_article');
    }

    /**
     * 提示
     *
     * @param  {strin} str 字符
     *
     * @return {Promise}     []
     */
    tips(str = '', url = '') {
        this.set_location({
            name: '操作提示'
        });
        this.assign({
            msg: str,
            back_url: url
        });

        this.set_title('操作提示');

        return this.display('home/admin/tips');
    }

    /**
     * 删除文章
     *
     * @param {number} id 文章id
     * @return {Promise} []
     */
    async delArticleAction() {
        let id = this.param('id');

        // 删除文章
        await this.model('article').where({
            id: id
        }).delete();

        // 删除标签索引
        await this.model('tags_index').where({
            article_id: id
        }).delete();

        return this.tips('删除成功', '/admin/article/');
    }

    /**
     * 筛选标签数据
     *
     * @param  {Array} newArr 新标签数据
     * @param  {Array} oldArr 旧标签数据
     *
     * @return {Object}        {jia, jian}
     */
    filterTags(newArr, oldArr) {
        if(think.isEmpty(newArr)){
            newArr = [];
        }
        if (!think.isArray(newArr)){
            newArr = [newArr];
        }

        if(think.isEmpty(oldArr)){
            oldArr = [];
        }
        if (!think.isArray(oldArr)){
            oldArr = [oldArr];
        }

        let result = {
            jia: [],
            jian: []
        };

        // 如果新数组有，旧数组没有，则说明为加
        newArr.forEach(val => {
            if(oldArr.indexOf(val) === -1){
                result.jia.push(val);
            }
        });

        // 如果旧数组有，新数组没有，则说明为减
        oldArr.forEach(val => {
            if(newArr.indexOf(val) === -1){
                result.jian.push(val);
            }
        });

        return result;
    }

    /**
     * 保存文章
     *
     * @type {POST}
     * @return {Promise} []
     */
    async saveArticleAction() {
        let data = this.post();
        let list_mark = think.config('blog.list_mark');

        // 渲染后的md，一定要去列表标识
        let temp = Util.renderMarkdown(data.content.replace(new RegExp(list_mark, 'g'), ''));
        data.markdown_content = temp.data;

        // 渲染后的列表md
        data.markdown_content_list = Util.renderMarkdown(data.content.split(list_mark)[0]).data;

        // 更新时间
        data.update_date = Date.now();

        // 导航数据
        temp.catalog = temp.catalog.map(val => {
            if(val.level === 2){
                return `<li><a href="#${val.id}">${val.text}</a></li>`;
            }

            return `<li class="child"><a href="#${val.id}">${val.text}</a></li>`;
        });
        if(!think.isEmpty(temp.catalog)){
            data.catalog = `<div class="article-detail-sidebar"><ul>${temp.catalog.join('')}</ul></div>`;
        }

        // 更新文章缓存
        await this.updateArticleCache();

        // 如果有id则表示为修改
        if(data.id){
            // 处理标签索引
            let tags_obj = this.filterTags(data.tags_id, data.old_tags_id);

            // 处理新加的标签
            for(let val of tags_obj.jia) {
                await this.model('tags_index').thenAdd({
                    article_id: data.id,
                    tags_id: val
                }, {
                    article_id: data.id,
                    tags_id: val
                });
            };

            // 处理减少的标签
            for(let val of tags_obj.jian){
                await this.model('tags_index').where({
                    article_id: data.id,
                    tags_id: val
                }).delete();;
            }

            // 更新信息
            let res = await this.model('article').where({
                id: data.id
            }).update(data);

            if(think.isEmpty(res)){
                return this.tips('保存失败');
            } else {
                return this.tips('保存成功');
            }
        }

        // 创建时间
        data.create_date = data.update_date;

        // 准备去重
        let where = {
            _logic: 'OR',
            title: data.title
        }
        if(data.url){
            where.url = url;
        }

        let res = await this.model('article').thenAdd(data, where);

        // 如果新添加成功，则插入标签
        if(res.type === 'add' && !think.isEmpty(data.tags_id)){
            if(!think.isArray(data.tags_id)){
                data.tags_id = [data.tags_id];
            }
            // 处理新加的标签
            for(let val of data.tags_id) {
                await this.model('tags_index').thenAdd({
                    article_id: res.id,
                    tags_id: val
                }, {
                    article_id: res.id,
                    tags_id: val
                });
            };
        }

        // 删除没用数据
        delete data.tags_id;
        delete data.old_tags_id;


        let tips;

        if(think.isEmpty(res)){
            tips = '添加失败';
        } else if(res.type === 'exist'){
            tips = '出现重复';
        } else if(res.type === 'add'){
            tips = '添加成功';
        } else {
            tips = '未知错误';
        }

        return this.tips(tips);
    }

    /**
     * 标签管理
     *
     * @return {Promise} []
     */
    async tagsAction() {
        let model_tags_index = this.model('tags_index');
        let data = await this.model('tags').field('id, name, hit, url').order('id DESC').select();


        // 配置模板数据
        this.assign({
            list: data
        });

        // 设置当前位置
        this.set_location({
            name: '标签管理'
        });

        this.set_title('标签管理');

        return this.display();
    }

    /**
     * 添加标签
     *
     * @return {Promise}  []
     */
    async addTagsAction() {
        // 设置当前位置
        this.set_location({
            url: '/admin/tags/',
            name: '标签'
        }, {
            name: '添加'
        });

        // 配置模板数据
        this.assign({
            data: {},
            type: 'add'
        });

        this.set_title('添加标签');

        return this.display('home/admin/edit_tags');
    }

    /**
     * 编辑标签
     *
     * @param {number} id 标签id
     * @return {Promise}  []
     */
    async editTagsAction() {
        let id = this.param('id');

        // 设置当前位置
        this.set_location({
            url: '/admin/tags/',
            name: '标签'
        }, {
            name: '编辑'
        });

        // 根据id查标签数据
        let data = await this.model('tags').where({
            id: id
        }).find();

        if(think.isEmpty(data)){
            return this.error404();
        }

        // 配置模板数据
        this.assign({
            data: data,
            type: 'edit'
        });

        this.set_title('编辑标签');

        return this.display('home/admin/edit_tags');
    }

    /**
     * 保存标签
     *
     * @type {POST}
     * @return {Promise} []
     */
    async saveTagsAction() {
        if(!this.isPost()){
            return this.error404();
        }

        let data = this.post();
        let tips = '';

        // 更新时间
        data.update_date = Date.now();

        // 如果有id表示为修改
        if(data.id){
            let res = await this.model('tags').where({
                id: data.id
            }).update(data);

            if(think.isEmpty(res)){
                tips = '保存失败';
            } else {
                tips = '保存成功';
            }
        } else {
            // 创建时间
            data.create_date = data.update_date;

            // 准备去重
            let where = {
                _logic: 'OR'
            };
            if(data.url){
                where.url = data.url;
            }
            if(data.name){
                where.name = data.name;
            }
            let res = await this.model('tags').thenAdd(data, where);

            if(think.isEmpty(res)){
                tips = '添加失败';
            } else if(res.type === 'exist'){
                tips = '已存在';
            } else if(res.type === 'add'){
                tips = '添加成功';
            } else {
                tips = '未知错误';
            }
        }

        // 更新标签缓存
        await this.updateTagsCache();

        return this.tips(tips, '/admin/tags/');
    }

    /**
     * 删除标签
     *
     * @param {number} id 文章id
     * @return {Promise} []
     */
    async delTagsAction() {
        let id = this.param('id');

        // 删除标签
        await this.model('tags').where({
            id: id
        }).delete();

        // 删除标签索引
        await this.model('tags_index').where({
            tags_id: id
        }).delete();

        return this.tips('删除成功', '/admin/tags/');
    }

    /**
     * 生成站点地图
     *
     * @return {[type]} [description]
     */
    async sitemapAction() {
        let result = {};

        result.list = this.config('list_data');

        result.article = await this.model('article')
            .field('id, url, update_date, title, markdown_content_list')
            .limit(50)
            .order('id DESC')
            .select();

        result.search = await this.model('search').field('name').limit(10).order('hit DESC').select();

        result.home = {
            title: this.config('blog.name'),
            url: this.config('blog.url')
        };

        //生成xml
        Create.createXml(result);

        // 生成txt
        Create.createTxt(result);

        // 生成html
        Create.createHtml(result);

        // 生成rss
        Create.createRss(result);

        return this.tips('成功');
    }
}
