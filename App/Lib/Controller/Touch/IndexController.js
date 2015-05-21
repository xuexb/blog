/**
 * 前台控制器
 * @description 包括 主页，列表，详情页，标签页，标签列表，搜索页
 */

'use strict';

var App = {};

/**
 * 全部文章
 */
App.allAction = function(){
    return App.indexAction.call(this);
}


/**
 * 主页
 */
App.indexAction = function() {
    var self = this;

    return self.display(VIEW_PATH + '/Touch/index_index.html');
}


/**
 * 标签列表
 */
App.tag_listAction = function() {
    return App.indexAction.call(this);
}


/**
 * 标签主页
 */
App.tagsAction = function() {
    return App.indexAction.call(this);
}


/**
 * 搜索列表页
 * @param {string} key 关键字
 */
App.searchAction = function() {
    var self = this,
        key = self.get('key').trim();

    self.assign('key', key);

    return App.indexAction.call(this);
}


/**
 * 列表
 * @param {string} url 分类的url
 */
App.listAction = function() {
    var self = this,
        url = self.get('url');

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
        //设置导航
        self.assign('nav_list_id', list_data.id);
        self.assign('nav_list_name', list_data.name);
        return App.indexAction.call(self);
    });
}


/**
 * 查看文章页
 * @param {string|int} url 文章url或者文章id
 */
App.viewAction = function() {
    var self = this,
        sql = {},
        url = self.get('url');

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
            })
        ];


        //更新点击数
        sql.push(D('Article').where({
            id: data.id
        }).updateInc('hit'));

        return Promise.all(sql).then(function(res) {
            var list_data;

            if (isEmpty(res) || isEmpty(res[0])) { //没有分类
                return self.__404Action();
            }

            // 列表数据
            list_data = res[0];

            //列表变量
            self.assign('list_name', list_data.name);
            self.assign('list_url', list_data.url);
            self.assign('list_uri', Url.article.list(list_data.id, list_data.url));

            // 详情页变量
            //发布时间
            data.update_date = Date.elapsedDate(data.update_date, 'yyyy-M-d h:m');

            self.assign('data', data);

            self.assign('title', data.title);

            return self.display();
        });
    });
}



module.exports = Controller('Touch/BaseController', function() {
    return App;
});