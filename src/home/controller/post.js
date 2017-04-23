'use strict';

import fs from 'fs';
import path from 'path';
import Base from './base';

const stats = think.promisify(fs.stat);


export default class extends Base {
  /**
   * index action
   * @return {[type]} [description]
   */
  indexAction() {
    return this.listAction();
  }
  /**
   * post list
   * @return {Promise} []
   */
  async listAction() {
    let model = this.model('post');
    let where = {
      tag: this.get('tag'),
      cate: this.get('cate')
    };
    if(this.get('name')) {
      let user = await this.model('user').where({name: this.get('name')}).find();
      if(!think.isEmpty(user)) {
        where.where = {user_id: user.id};
      }
    }

    let tagName = '', cateName = '';
    if(where.tag) {
      tagName = await this.model('tag').where({pathname: where.tag}).find();
      if(!think.isEmpty(tagName)) {
        tagName = tagName.name;
      } else {
        return think.statusAction(404, this.http);
      }
    }
    if(where.cate) {
      [cateName] = this.assign('categories').filter(cate =>
        cate.pathname.toLowerCase() === where.cate.toLowerCase()
      );
      if (cateName && cateName.name) {
        cateName = cateName.name;
      } else {
        return think.statusAction(404, this.http);
      }
    }

    let list = await model.getPostList(this.get('page'), where);
    list.data.forEach(post => post.pathname = encodeURIComponent(post.pathname));
    let {data, ...pagination} = list;
    this.assign({
      posts: data,
      pagination,
      tag: tagName,
      cate: cateName,
      pathname: where.tag || where.cate
    });
    return this.display();
  }
  /**
   * post detail
   * @return {[type]} [description]
   */
  async detailAction() {
    this.http.url = decodeURIComponent(this.http.url);
    let pathname = this.get('pathname');
    if(pathname === 'list') { return this.listAction(); }

    let detail = await this.model('post').getPostDetail(pathname);
    if(think.isEmpty(detail)) {
      return this.redirect('/');
    }
    detail.pathnameSource = detail.pathname;
    detail.pathname = encodeURIComponent(detail.pathname);
    this.assign('post', detail);

    return this.display();
  }

  /**
   * post detail markdown
   * @return {[type]} [description]
   */
  async detailmdAction() {
    this.http.url = decodeURIComponent(this.http.url);
    let pathname = this.get('pathname').replace(/\.md$/, '');

    let detail = await this.model('post').field('markdown_content, title').setRelation(false).where({pathname}).find();
    if(think.isEmpty(detail)) {
      return think.statusAction(404, this.http);
    }

    this.type('text/plain');

    return this.end(`# ${detail.title}

> 原文: <${this.options.site_url}/post/${encodeURIComponent(pathname)}.html>

${detail.markdown_content}`);
  }

  async pageAction() {
    let pathname = this.get('pathname');
    let detail = await this.model('post')
      .setRelation(false)
      .where({
        pathname,
        is_public: 1, //公开
        type: 1, //文章
        status: 3 //已经发布
      })
      .find();
    detail.pathname = encodeURIComponent(detail.pathname);
    this.assign('page', detail);
    this.assign('pathname', pathname);

    let template = 'page';

    // 支持自定义模板
    if(detail.options) {
      try {
        detail.options = JSON.parse(detail.options);
        if(detail.options.template) {
          let filepath = path.join(think.ROOT_PATH, '/view/home/template/', detail.options.template);
          await stats(filepath);
          template = filepath;
        }
      } catch(e) {
        console.log(e);  // eslint-disable-line no-console
      }
    }

    return this.display(template);
  }
  /**
   * post archive
   * @return {[type]} [description]
   */
  async archiveAction() {
    let model = this.model('post');
    let data = await model.getPostArchive();
    for(let i in data) { data[i].map(post => post.pathname = encodeURIComponent(post.pathname)) }
    this.assign('list', data);
    return this.display();
  }

  async tagAction() {
    let model = this.model('tag');
    let data = await model.getTagArchive();
    this.assign('list', data);
    return this.display();
  }
  /**
   * search action
   * @return {[type]} [description]
   */
  async searchAction() {
    let keyword = this.get('keyword').trim();
    if(keyword) {
      let postModel = this.model('post');
      let searchResult = await postModel.getPostSearch(keyword, this.get('page'));
      this.assign('searchData', searchResult);
      this.assign('pagination', searchResult);
    }

    //热门标签
    let tagModel = this.model('tag');
    let hotTags = await tagModel.getHotTags();
    this.assign('hotTags', hotTags);


    this.assign('keyword', keyword);
    return this.display();
  }
}
