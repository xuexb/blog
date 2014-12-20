/**
 * 前台控制器
 * @description 包括 主页，列表，详情页，标签页，标签列表，搜索页
 */

'use strict';

var App = {};


/**
 * 主页
 */
App.indexAction = function() {
    var self = this;

    return self.__get_list({
        limit: 10
    }).then(function(data) {
        self.assign('links', true);
        self.assign({
            list: data,
            title: '学习吧 - 专注计算机基础知识和WEB前端开发'
        });

        return self.display();
    });
}


/**
 * 标签列表
 */
App.tag_listAction = function() {

}


/**
 * 标签主页
 */
App.tagsAction = function() {
    var self = this;

    return D('Tags').get({
        cache: true,
        field: 'url, id, name'
    }).then(function(tags_data) {
        var arr;

        //如果没有标签则直接退出
        if (isEmpty(tags_data)) {
            return tags_data;
        }

        arr = [];

        tags_data.forEach(function(val) {
            arr.push(D('TagsIndex').where({
                article_id: val.id
            }).count('article_id'));
        });

        return Promise.all(arr).then(function(tags_index_data) {
            tags_data.forEach(function(val, index) {
                val.count = tags_index_data[index];
            });
            return tags_data;
        });
    }).then(function(tags_data) {
        self.assign('tags_data', tags_data);
        self.assign('title', '标签_学习吧');
        self.__set_nav('tags');
        return self.display();
    });
}


/**
 * 搜索列表页
 */
App.searchAction = function() {
    var self = this,
        key = self.get('key').trim(),
        page = parseInt(self.get('page'), 10) || 1;

    if (!key) {
        return self.__404Action();
    }


    return self.__get_list({
        where: {
            title: ['like', '%' + key + '%']
        },
        isPage: true,
        page: page
    }).then(function(data) {
        var key_reg = new RegExp(key, 'gi');

        //关键词高亮
        data.data.forEach(function(val) {
            if (val.title) {
                val.title = val.title.replace(key_reg, function($0) {
                    return '<mark>' + $0 + '</mark>';
                });
            }

            if (val.markdown_content_list) {
                val.markdown_content_list = val.markdown_content_list.replace(key_reg, function($0) {
                    return '<mark>' + $0 + '</mark>';
                });
            }
        });

        //如果有这个词，则存库里
        //且必须有数据，第一页
        if(data.count > 0 && page === 1){
            return D('Search').thenAdd({
                name: key,
                hit: 0
            }, {
                name: key
            }, true).then(function(update_data){
                return D('Search').where({
                    id: update_data.id
                }).updateInc('hit').then(function(){
                    return data;
                });
            });
        }

        return data;
    }).then(function(data){
        self.assign({
            list: data.data,
            key: key,
            page: data.count > 0 ?
                get_page(data, Url.article.search(key, '{$page}')) : '',
            title: '搜索 ' + key + ' 的结果_学习吧'
        });
        return self.display();
    });
}


/**
 * 列表
 * @return {[type]} [description]
 */
App.listAction = function() {
    var self = this,
        url = self.get('url'),
        page = parseInt(self.get('page'), 10) || 1;

    if (!url) {
        return self.__404Action();
    }

    //先查分类出来
    return D('List').get({
        one: 1,
        where: {
            url: url
        },
        field: 'id, name, url'
    }).then(function(list_data) {
        if (isEmpty(list_data)) {
            return self.__404Action();
        }

        return self.__get_list({
            where: {
                list_id: list_data.id
            },
            isPage: true,
            page: page
        }).then(function(data) {
            //设置导航
            self.__set_nav('article', list_data.id);

            self.assign({
                list_data: list_data,
                list: data.data,
                page: data.count > 0 ?
                    get_page(data, Url.article.list(list_data.id, list_data.url, '{$page}')) : '',
                title: list_data.name + '_学习吧'
            });

            return self.display();
        });
    });
}


/**
 * 查看文章页
 */
App.viewAction = function() {
    var self = this,
        sql = {},
        url = self.get("url"),
        referer;

    if (!url) {
        return self.__404Action();
    }

    //拼sql条件
    if (!parseInt(url, 10)) { //非数字或者0
        sql.url = url;
    } else {
        sql.id = parseInt(url, 10);
    }

    //连id都是0还查毛库啊。
    if (!sql.id && !sql.url) {
        return self.__404Action();
    }

    //判断来路是否从搜索过来
    referer = self.referer();
    if(referer && referer.indexOf("search/") > 0){
        referer = referer.match(/search\/(.*?)\//) || ['', ''];
        referer = decodeURIComponent(referer[1]);
    } else {
        referer = null;
    }


    return D('Article').get({
        one: 1,
        field: 'id, markdown_content, hit, update_date, list_id, title, url',
        where: sql
    }).then(function(data) {
        var sql;

        if (isEmpty(data)) { //没有这个内容
            return self.__404Action();
        }

        sql = [
            D('List').get({ //查列表 0
                one: 1,
                field: 'url, name, id',
                where: {
                    id: data.list_id
                }
            }),
            D('TagsIndex').get({ //查标签 1
                cache: true,
                field: 'tags_id',
                where: {
                    article_id: data.id
                }
            })
        ];

        //如果是搜索过来的
        if(referer){
            sql.push(D('Article').get({ //查相关文章 2
                field: 'id, title, url',
                limit: 6,
                where: {
                    id: ['!=', data.id],
                    title: ['like', '%' + referer + '%']
                }
            }));
        } else {
            sql.push(D('Article').get({ //查相关文章 2
                field: 'id, title, url',
                limit: 6,
                order: 'rand()',
                where: {
                    id: ['!=', data.id],
                    list_id: data.list_id
                }
            }));
        }

        sql.push(D('Article').get({ //上一个 3
            field: 'id, title, url',
            one: 1,
            limit: 1,
            where: {
                id: data.id - 1
            }
        }),
        D('Article').get({ //下一个 4
            field: 'id, title, url',
            one: 1,
            limit: 1,
            where: {
                id: data.id + 1
            }
        }));


        //更新点击数
        sql.push(D('Article').where({
            id: data.id
        }).updateInc('hit'));

        return Promise.all(sql).then(function(res) { //拿标签索引来查标签内容
            var arr;

            if (isEmpty(res[1])) {
                return res;
            }

            arr = [];
            res[1].forEach(function(val) {
                arr.push(D('Tags').get({
                    field: 'id, name, url',
                    where: {
                        id: val.tags_id
                    },
                    one: true
                }));
            });

            return Promise.all(arr).then(function(tags) {
                tags.forEach(function(val) {
                    val.uri = Url.tags.list(val.id, val.url);
                });
                res[1] = tags;
                return res;
            });
        }).then(function(res) {
            var list_data;

            if (isEmpty(res) || isEmpty(res[0])) { //没有分类
                return self.__404Action();
            }

            // 列表数据
            list_data = res[0];

            //标签数据
            self.assign('tags_data', res[1]);


            //喜欢变量
            self.assign('view_search', res[2]);
            self.assign('view_search_type', referer ? 'search' : 'like');
            if(referer){
                self.assign('key', referer);
            }

            //列表变量
            self.assign('list_name', list_data.name);
            self.assign('list_url', list_data.url);
            self.assign('list_uri', Url.article.list(list_data.id, list_data.url));

            // 详情页变量
            //发布时间
            data.update_date = Date.elapsedDate(data.update_date, 'yyyy-M-d h:m');

            //处理内容分页
            //# 4
            var page = parseInt(self.get('page'), 10) || 1;
            var page_data = data.markdown_content.split(C('view_page'));
            var page_size = page_data.length;
            if(page_size !== 1){
                if(page < 1){
                    page = 1;
                } else if(page > page_size){
                    page = page_size;
                }

                data.markdown_content = page_data[page - 1];
            }
            // 内容分页
            self.assign('view_page', get_page({
                total: page_size,
                page: page
            }, Url.article.view(data.id, data.url, '{$page}')));


            self.assign("data", data);

            //初始导航
            //单独处理
            var nav_type;
            if (url === 'xieliang') {
                nav_type = 'about';
            } else if (url === 'zaixianliuyan') {
                nav_type = 'message';
            } else {
                nav_type = 'article';
            }
            self.__set_nav(nav_type, list_data.id);

            //处理上一个，下一个
            self.assign('prev_article', isEmpty(res[3]) ? null : res[3]);
            self.assign('next_article', isEmpty(res[4]) ? null : res[4]);

            // 标题
            self.assign('title', data.title + '_' + list_data.name + '_学习吧');

            return self.display();
        });
    });
}



module.exports = Controller("Home/BaseController", function() {
    return App;
});