'use strict';

import Base from './base';
import Util from '../../common/util';

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
     * 设置当前位置
     *
     * @param {Object} data 数据 {url, name}
     */
    setLocation(...data) {
        data.unshift({
            url: '/admin',
            name: '后台'
        });

        super.setLocation(...data);
    }

    /**
     * 主页
     *
     * @return {Promise} []
     */
    async indexAction() {

        // 设置当前位置
        super.setLocation({
            name: '后台'
        });

        return this.display();
    }

    /**
     * 管理文章列表
     *
     * @param {int} page 页码
     * @param {string} key 关键字
     * @param {number} list_id 分类id
     * @return {Proimise} []
     */
    async articleAction() {
        let page = this.param('page');
        let key = this.param('key').trim();
        let list_id = this.param('list_id');
        let where = {};

        // 处理条件
        if(list_id){
            let list_data = this.config('list').filter(val => String(val.id) === list_id);
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
        this.setLocation({
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

        return this.display();
    }

    /**
     * 编辑文章
     *
     * @param {number} id 文章id
     * @return {Proimise} []
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

        // 设置当前位置
        this.setLocation({
            name: '编辑文章'
        });

        // 配置模板数据
        this.assign({
            data: data,
            type: 'edit'
        });

        return this.display();
    }

    /**
     * 添加文章
     * @return {Proimise} []
     */
    async addArticleAction() {

        // 设置当前位置
        this.setLocation({
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

        return this.display('home/admin/edit_article');
    }

    /**
     * 提示
     *
     * @param  {strin} str 字符
     *
     * @return {Proimise}     []
     */
    tipsAction(str = '', url = '') {
        this.setLocation({
            name: '操作提示'
        });
        this.assign({
            msg: str,
            back_url: url
        });
        return this.display('home/admin/tips');
    }

    /**
     * 删除文章
     *
     * @param {number} id 文章id
     * @return {Proimise} []
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

        return this.tipsAction('删除成功', '/admin/article/');
    }

    /**
     * 保存文章
     *
     * @type {POST}
     * @return {Proimise} []
     */
    async saveArticleAction() {
        let data = this.post();
        let list_mark = think.config('blog.list_mark')

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

        if(data.id){
            let res = await this.model('article').where({
                id: data.id
            }).update(data);

            if(think.isEmpty(res)){
                return this.tipsAction('保存失败');
            } else {
                return this.tipsAction('保存成功');
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

        return this.tipsAction(tips);
    }

    /**
     * 标签管理
     *
     * @return {Proimise} []
     */
    async tagsAction() {
        let model_tags_index = this.model('tags_index');
        let data = await this.model('tags').field('id, name, hit, url').order('id DESC').select();


        // 配置模板数据
        this.assign({
            list: data
        });

        // 设置当前位置
        this.setLocation({
            name: '标签'
        });

        return this.display();
    }

    /**
     * 添加标签
     *
     * @return {Proimise}  []
     */
    async addTagsAction() {
        // 设置当前位置
        this.setLocation({
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

        return this.display('home/admin/edit_tags');
    }

    /**
     * 编辑标签
     *
     * @param {number} id 标签id
     * @return {Proimise}  []
     */
    async editTagsAction() {
        let id = this.param('id');

        // 设置当前位置
        this.setLocation({
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

        return this.display('home/admin/edit_tags');
    }

    /**
     * 保存标签
     *
     * @type {POST}
     * @return {Proimise} []
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

        return this.tipsAction(tips, '/admin/tags/');
    }

    /**
     * 删除标签
     *
     * @param {number} id 文章id
     * @return {Proimise} []
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

        return this.tipsAction('删除成功', '/admin/tags/');
    }
}
