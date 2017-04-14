'use strict';

import Base from './base';


export default class extends Base {
  /**
   * 首页如果设置了自定义首页则渲染对应页面
   * @return {[type]} [description]
   */
  async indexAction() {
    let {frontPage} = await this.model('options').getOptions();
    if(frontPage) {
      this.get('pathname', frontPage);
      return this.action('post', 'page');
    }

    return this.action('post', 'list');
  }

  /**
   * 输出opensearch
   */
  opensearchAction() {
    this.type('text/xml');
    return this.display('opensearch.xml');
  }

  /**
   * rss
   * @return {[type]} [description]
   */
  async rssAction() {
    let model = this.model('post');
    let list = await model.getPostRssList();
    this.assign('list', list);
    this.assign('currentTime', (new Date()).toString());

    this.type('text/xml');
    return super.display('rss.xml');
  }

  /**
   * sitemap action
   * @return {[type]} [description]
   */
  async sitemapAction() {
    let postModel = this.model('post');
    let postList = postModel.getPostSitemapList();
    this.assign('postList', postList);

    let tagModel = this.model('tag');
    let tagList = tagModel.getTagArchive();
    this.assign('tags', tagList);

    this.type('text/xml');

    return this.display('sitemap.xml');
  }
}
