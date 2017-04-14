'use strict';

import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import Base from './base';

const cluster = require('cluster');

const statsAsync = think.promisify(fs.stat);
const readdirAsync = think.promisify(fs.readdir);
const readFileAsync = think.promisify(fs.readFile);
const writeFileAsync = think.promisify(fs.writeFile);
const THEME_DIR = path.join(think.ROOT_PATH, '/view/home/');

export default class extends Base {
  /**
   * forbidden ../ style path
   */
  pathCheck(themePath, basePath = THEME_DIR) {
    if(themePath.indexOf(basePath) !== 0) {
      this.fail();
      throw Error(`theme path ${themePath} error`);
    }
    return true;
  }

  async getAction() {
    switch(this.get('type')) {
      case 'templateList':
        return await this.getPageTemplateList();
      case 'themeList':
      default:
        return await this.getThemeList();
    }
  }

  /**
   * Fork theme
   */
  async putAction() {
    try {
      await this.model('options').updateOptions('theme', new_theme);
      return this.success();
    } catch(e) {
      return this.fail(e);
    }
  }

  /**
   * 获取主题列表
   */
  async getThemeList() {
    let result = [];
    let infoFile = path.join(THEME_DIR, 'package.json');
    try {
      await statsAsync(infoFile);
      let pkg = think.require(infoFile);
      result.push(think.extend({id: pkg.name}, pkg));
    } catch(e) {
      console.log(e);  // eslint-disable-line no-console
    }
    return this.success(result);
  }

  /**
   * 获取主题的自定义模板
   */
  async getPageTemplateList() {
    let templatePath = path.join(THEME_DIR, 'template');
    this.pathCheck(templatePath);

    let templates = [];
    try {
      let stat = await statsAsync(templatePath);
      if(!stat.isDirectory()) {
        throw Error();
      }
    } catch(e) {
      return this.success(templates);
    }
    templates = await readdirAsync(templatePath);
    templates = templates.filter(t => /\.html$/.test(t));
    return this.success(templates);
  }
}
