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
}
