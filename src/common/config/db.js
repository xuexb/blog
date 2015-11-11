'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  host: 'www.xuexb.com',
  port: '3306',
  name: 'xuexb',
  user: 'root',
  pwd: '',
  prefix: '',
  encoding: 'utf8',
  nums_per_page: 10,
  log_sql: true,
  log_connect: true,
  cache: {
    on: false,
    type: '',
    timeout: 3600
  }
};
