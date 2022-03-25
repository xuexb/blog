'use strict';
/**
 * middleware
 */
export default class extends think.middleware.base {
  /**
   * run
   * @return {} []
   */
  run(){
    if (process.env.BLOG_ENV) {
      this.http.res.setHeader('x-blog-env', process.env.BLOG_ENV);
    }
  }
}