/**
 * @file 生成站点地图
 * @author xiaowu
 */

'use strict';

let Create = {};

import fs from 'fs';
import path from 'path';
import Util from './util';


/**
 * 生成xml地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
Create.createXml = function(data) {
    let arr = [];
    let now = Util.parseDate.format(new Date(), 'yyyy-MM-dd');

    arr.push('<?xml version="1.0" encoding="UTF-8"?>');
    arr.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');


    // 添加主页
    arr.push('<url>');
    arr.push('<loc>' + data.home.url + '</loc>');
    arr.push('<lastmod>' + now + '</lastmod>');
    arr.push('<changefreq>always</changefreq>');
    arr.push('<priority>1.0</priority>');
    arr.push('</url>');


    //添加列表
    data.list.forEach(function(val) {
        arr.push('<url>');
        arr.push('<loc>' + data.home.url + '/list/'+ (val.url || val.id) +'/' + '</loc>');
        arr.push('<lastmod>' + now + '</lastmod>');
        arr.push('<changefreq>always</changefreq>');
        arr.push('<priority>0.9</priority>');
        arr.push('</url>');
    });

    //添加文章
    data.article.forEach(function(val) {
        arr.push('<url>');
        arr.push('<loc>' + data.home.url + '/html/'+ (val.url || val.id) +'.html' + '</loc>');
        arr.push('<lastmod>' + Util.parseDate.format(val.update_date, 'yyyy-MM-dd') + '</lastmod>');
        arr.push('<changefreq>always</changefreq>');
        arr.push('<priority>0.8</priority>');
        arr.push('</url>');
    });

    //添加文章
    data.search.forEach(function(val) {
        arr.push('<url>');
        arr.push('<loc>' + data.home.url + '/search/'+ val.name +'/' + '</loc>');
        arr.push('<lastmod>' + now + '</lastmod>');
        arr.push('<changefreq>always</changefreq>');
        arr.push('<priority>0.7</priority>');
        arr.push('</url>');
    });

    arr.push('</urlset>');

    fs.writeFileSync(path.resolve(think.ROOT_PATH, './www/sitemap.xml'), arr.join('\n'));
}


/**
 * 生成rss地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
Create.createRss = function(data) {
    let arr = [];
    let now = Util.parseDate.format(new Date(), 'yyyy-MM-dd');

    arr.push('<?xml version="1.0" encoding="UTF-8"?>');
    arr.push('<rss version="2.0">');
    arr.push('<channel>');
    arr.push('<title>' + data.home.title + '</title>');
    arr.push('<link>' + data.home.url + '</link>');
    arr.push('<description>前端开发小武专注WEB前端和用户体验</description>');
    arr.push('<language>zh-cn</language>');
    arr.push('<generator>前端小武</generator>');
    arr.push('<lastBuildDate>' + now + '</lastBuildDate>');

    //添加文章
    data.article.length = 50;
    data.article.forEach(function(val) {
        arr.push('<item>');
        arr.push('<link>' + data.home.url + '/html/'+ (val.url || val.id) +'.html' + '</link>');
        arr.push('<pubDate>' + Util.parseDate.format(val.create_date, 'yyyy-MM-dd') + '</pubDate>');
        arr.push('<title>' + val.title + '</title>');
        arr.push('<author>前端小武</author>');
        arr.push('<description><![CDATA[' + val.markdown_content + ']]></description>');
        arr.push('</item>');
    });


    arr.push('</channel></rss>');

    fs.writeFileSync(path.resolve(think.ROOT_PATH, './www/rss2.xml'), arr.join('\n'));
    fs.writeFileSync(path.resolve(think.ROOT_PATH, './www/rss.xml'), arr.join('\n'));
}


/**
 * 生成txt地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
Create.createTxt = function(data) {
    let arr = [];

    // 添加主页
    arr.push(data.home.url);


    //添加列表
    data.list.forEach(function(val) {
        arr.push(data.home.url + '/list/'+ (val.url || val.id) +'/');
    });

    //添加文章
    data.article.forEach(function(val) {
        arr.push(data.home.url + '/html/'+ (val.url || val.id) +'.html');
    });

    //添加文章
    data.search.forEach(function(val) {
        arr.push(data.home.url + '/search/'+ val.name +'/');
    });


    fs.writeFileSync(path.resolve(think.ROOT_PATH, './www/sitemap.txt'), arr.join('\n'));
}


/**
 * 生成html地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
Create.createHtml = function(data) {
    let arr = [];

    let get = function(url, title) {
        return '<li><a href="' + url + '">' + title + '</a></li>';
    }

    arr.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>网站地图_学习吧</title></head><body>');

    arr.push('<h1>网站地图</h1>', '<p>生成于 ' + Util.parseDate.format(new Date(), 'yyyy-MM-dd HH:m:ss') + '</p>');

    // 添加主页
    arr.push(get(data.home.url, data.home.title));


    arr.push(get('/rss.xml', 'rss订阅'));
    arr.push(get('/sitemap.xml', 'XML地图'));

    //添加列表
    data.list.forEach(function(val) {
        arr.push(get(data.home.url + '/list/'+ (val.url || val.id) +'/', val.name));
    });

    //添加文章
    data.article.forEach(function(val) {
        arr.push(get(data.home.url + '/html/'+ (val.url || val.id) +'.html', val.title));
    });

    //添加文章
    data.search.forEach(function(val) {
        arr.push(get(data.home.url + '/search/'+ val.name +'/', '搜索 ' + val.name));
    });


    arr.push('</body></html>');

    fs.writeFileSync(path.resolve(think.ROOT_PATH, './www/sitemap.html'), arr.join('\n'));
}


export default Create;