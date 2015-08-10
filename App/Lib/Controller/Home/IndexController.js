/**
 * 前台控制器
 * @description 包括 主页，列表，详情页，标签页，标签列表，搜索页
 */

'use strict';

var App = {};


/**
 * rss订阅
 */
App.rssAction = function(){
    return this.redirect('/rss.xml', 301);
}

App.proxyAction = function(){
    var url = this.get('url');
    url = url.replace('http:/', '').replace('http://', '');
    return this.redirect('http://'+ url, 301);
}


/**
 * 全部文章
 */
App.allAction = function(){
    var self = this,
        page = parseInt(self.get('page'), 10) || 1;


    return self.__get_list({
        isPage: true,
        page: page
    }).then(function(data) {

        self.assign({
            list: data.data,
            page: data.count > 0 ?
                get_page(data, Url.article.all('{$page}')) : '',
            // title: '全部文章_学习吧'
        });

        return self.display();
    });
}

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
            // title: '学习吧 - 专注计算机基础知识和WEB前端开发'
        });

        return self.display();
    });
}


/**
 * 标签列表
 * @param {int} page 页码
 * @param {string} url 标签url
 */
App.tag_listAction = function() {

    var self = this//,
        // page = parseInt(self.get('page'), 10) || 1,
        // url = self.get('url');



    return self.display();
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
 * @param {string} key 关键字
 * @param {int} page 页码
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
        //只替换标题里的，因为内容是Md生成的html，一替换会出问题
        data.data.forEach(function(val) {
            if (val.title) {
                val.title = val.title.replace(key_reg, function($0) {
                    return '<mark>' + $0 + '</mark>';
                });
            }
        });

        //如果有这个词，则存库里
        //且必须有数据，第一页
        if (data.count > 0 && page === 1) {
            return D('Search').thenAdd({
                name: key,
                hit: 0
            }, {
                name: key
            }, true).then(function(update_data) {
                return D('Search').where({
                    id: update_data.id
                }).updateInc('hit').then(function() {
                    return data;
                });
            });
        }

        return data;
    }).then(function(data) {
        self.assign({
            list: data.data,
            key: key,
            page: data.count > 0 ?
                get_page(data, Url.article.search(key, '{$page}')) : '',
            title: '搜索 ' + key + ' 的结果——前端小武',
        });
        return self.display();
    });
}


/**
 * 列表
 * @param {string} url 分类的url
 * @param {int} page 页码
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
            var key, desc;

            if(url === 'wangzhanbiancheng'){
                key = '前端小武 谢耀武 前端开发';
            } else if(url === 'nodejs'){
                key = '前端小武 谢耀武 前端开发 nodejs';
                desc = 'Node是一个Javascript运行环境(runtime)。';
            } else if(url === 'qianduankaifa'){
                key = '前端小武 谢耀武 前端开发';
                desc = 'Web前端开发是一项很特殊的工作，涵盖的知识面非常广，既有具体的技术，又有抽象的理念。';
            } else if(url === 'diannaozhishi'){
                key = '前端小武 谢耀武 计算机基础';
                desc = '前端开发必须掌握的一些计算机基础知识。';
            } else if(url === 'jishiben'){
                key = '前端小武 谢耀武 前端故事';
            }

            if(key){
                self.assign('keywords', key);
            }

            if(desc){
                self.assign('description', desc);
            }

            //设置导航
            self.__set_nav('article', list_data.id);

            self.assign({
                list_data: list_data,
                list: data.data,
                page: data.count > 0 ?
                    get_page(data, Url.article.list(list_data.id, list_data.url, '{$page}')) : '',
                title: list_data.name + '——前端小武'
            });

            return self.display();
        });
    });
}


/**
 * 查看文章页
 * @param {string|int} url 文章url或者文章id
 */
App.viewAction = function() {
    var self = this,
        sql = {},
        url = self.get('url'),
        referer;

    if (!url) {
        return self.__404Action();
    }

    //拼sql条件
    if (!isFinite(url)) { //非数字或者0
        //如果为老域名，兼容下301
        if(url === 'xieliang'){
            return self.redirect('/html/xiaowu.html', 301);
        }
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
    if (referer && referer.indexOf('search/') > 0) {
        referer = referer.match(/search\/(.*?)\//) || ['', ''];
        referer = decodeURIComponent(referer[1]);
    } else {
        referer = null;
    }


    return D('Article').get({
        one: 1,
        field: 'id, markdown_content, hit, update_date, list_id, title, url, catalog',
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
        if (referer) {
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
            if (referer) {
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
            if (page_size !== 1) {
                if (page < 1) {
                    page = 1;
                } else if (page > page_size) {
                    page = page_size;
                }

                data.markdown_content = page_data[page - 1];

                //修分页带来的半个p标签问题
                if( page !== 1){
                    data.markdown_content = '<p><!-- start -->' + data.markdown_content;
                }
                if(page !== page_size){
                    data.markdown_content += '<!-- end --></p>';
                }
            }
            // 内容分页
            self.assign('view_page', get_page({
                total: page_size,
                page: page
            }, Url.article.view(data.id, data.url, '{$page}')));

            // 兼容https
            data.markdown_content = 
                data.markdown_content.replace(/http\:\/\/(www|github)\.xuexb\.com\/upload(s)?/g, function($0){
                    return $0.replace('http:', 'https:');
                });

            //生成描述
            self.assign('description', data.markdown_content
                .replace(/<[^>]+?>/g, '').replace(/[\r\n]/g, ',').substr(0, 120) + '...');

            //如果有目录
            if(data.catalog){
                //当前页慢不用翻页，其实只有在page=1的时候会有问题，因为默认页面是没有 ?page=1的
                if(page === 1){
                    data.catalog = data.catalog.replace(new RegExp('\\?page\\=1\#', 'g'), '#');
                }
                data.markdown_content = data.catalog + data.markdown_content;
            }


            self.assign('data', data);

            //初始导航
            //单独处理
            var nav_type = 'article';
            if (url === 'xiaowu') {
                nav_type = 'about';
            } else if (url === 'zaixianliuyan') {
                nav_type = 'message';
            } else if (url === 'links') {
                nav_type = 'links';
            }
            self.__set_nav(nav_type, list_data.id);

            //处理上一个，下一个
            self.assign('prev_article', isEmpty(res[3]) ? null : res[3]);
            self.assign('next_article', isEmpty(res[4]) ? null : res[4]);

            // 标题
            // 处理留言和谢亮
            if(nav_type === 'article'){
                self.assign('title', data.title + '_' + list_data.name + '_前端小武');
            } else {
                self.assign('title', data.title + '——前端小武');
            }

            return self.display();
        });
    });
}



module.exports = Controller('Home/BaseController', function() {
    return App;
});