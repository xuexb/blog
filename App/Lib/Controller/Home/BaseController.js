/**
 * 博客初始化
 * @description 包括一些公用方法，如 设置导航高亮，获取最新文章列表，
 */
'use strict';

var App = {};


/**
 * 初始化并调用父类初始化
 */
App.init = function(http) {
    var self = this;
    var arr = [];

    self.super("init", http);

    self.__set_nav();
    self.assign('title', '谢亮博客 - 学习吧');

    var arr = [];

    //分类数据
    arr.push(self.__get_list_data());

    // 最近更新的文章
    arr.push(self.__get_new_article());

    // 搜索最多的词
    arr.push(self.__hot_search());

    return Promise.all(arr).then(function(data) {
        (data[0] || []).forEach(function(val){
            val.uri = Url.article.list(val.id, val.url);
        });
        self.assign("LIST", data[0]);
        self.LIST = data[0];
        self.assign("new_article", data[1]);
        self.assign("hot_search", data[2]);
        return data;
    });
}


/**
 * 设置导航
 * @param  {string=home} type 导航类型
 */
App.__set_nav = function(type) {
    return this.assign("nav_type", type || 'home'), this;
}


/**
 * 获取最新的文章
 * @param {int=10} top 多少条
 * @return {Promise}
 */
App.__get_new_article = function(top) {
    return D('article').order('id DESC').limit(top || 10)
        .cache(true)
        .field('title, url, id')
        .select()
        .then(function(data) {

            //修正文章链接
            data.forEach(function(val) {
                val.uri = Url.article.view(val.id, val.url);
            });

            return data;
        });
}


/**
 * 搜索最多的词
 * @param {int=10} top 多少条
 * @return {Promise}
 */
App.__hot_search = function(top) {
    return D('search').order('hit DESC').limit(top || 10)
        .cache(true)
        .field('name, hit')
        .select();
}


/**
 * 获取分类名
 * @return {[type]} [description]
 */
App.__get_list_name = function(id){
    var name = null;
    each(this.LIST || [], function(){
        if(this.id === id){
            name = this.name;
            return false;
        }
    });

    return name;
}

/**
 * 获取分类数据
 * @return {array}
 */
App.__get_list_data = function() {
    return F('LIST') || [];
}


/**
 * 空操作
 */
App.__call = function(http) {
    return this.end('__call')
    return this.__404Action(http);
}


/**
 * 404错误页
 */
App.__404Action = function(http) {
    this.status(404);
    return this.end('404');
    // return this.display(VIEW_PATH + '/Home/404.html');
}


/**
 * 内部调用列表
 * @description 处理分类名, 作者, 发表时间等内容, 查标签， 支持列表分页查询，不支持单个查询
 * @param {object} options 配置
 * @param {boolean} options.isPage 是否为分页列表
 * @param {boolean} options.isUser 是否为用户调用,如果是则不追加用户信息
 * @return {Promise}
 */
App.__get_list = function(options) {
    var self = this;

    options = options || {};
    options.isUser = 1; //现在不查用户信息

    return D('Article').get(options).then(function(data) { //查分类名 + 修改url + 发布时间 + 列表图 + 内容
        var content_data = options.isPage ? data.data : data;

        var arr = [];
        var List = D('List');;

        //如果为空
        if(content_data.length === 0){
            return data;
        }

        content_data.forEach(function(val) {
            //查分类名和分类ID
            arr.push(List.get({
                cache: true,
                one: true,
                where: {
                    id: val.list_id
                }
            }));

            //修正链接
            val.uri = Url.article.view(val.id, val.url);

            //发布时间
            val.create_date = Date.elapsedDate(val.create_date, 'yyyy-M-d');
        });

        return Promise.all(arr).then(function(list_data) {
            content_data.forEach(function(val, index) { //把分类的数据叠加到主数据上
                if (list_data[index]) {
                    val.list_name = list_data[index].name;
                    val.list_uri = Url.article.list(list_data[index].id, list_data[index].url);
                }
            });
            return data;
        });
    }).then(function(data) { //查作者
        var content_data = options.isPage ? data.data : data;
        var arr = [];
        var User;


        //如果没有数据, 或者为当前用户查的, 则不追加用户信息
        if(content_data.length === 0 || options.isUser){
            return data;
        }


        User  = D("User");

        content_data.forEach(function(val) {
            arr.push(User.get({
                where: {
                    uid: val.create_uid
                },
                one: 1
            }));
        });

        return Promise.all(arr).then(function(list_data) {
            content_data.forEach(function(val, index) {
                if (list_data[index]) {
                    val.nickname = list_data[index].nickname;
                    val.user_uri = Url.user.view(list_data[index].uid);
                }
            });
            return data;
        });
    }).then(function(data){//查标签
        var content_data = options.isPage ? data.data : data;
        var arr = [];
        var TagsIndex;

        if(content_data.length === 0){
            return data;
        }

        TagsIndex = D('TagsIndex');

        content_data.forEach(function(val){
            arr.push(TagsIndex.get({
                where: {
                    article_id: val.list_id
                },
                field: 'tags_id',
                one: 1
            }));
        });

        return Promise.all(arr).then(function(temp) {
            var Tags = D('Tags');
            var arr = [];

            temp.forEach(function(val){
                if(val.tags_id){
                    arr.push(Tags.get({
                        one: 1,
                        field: 'name, id, url',
                        where: {
                            id: val.tags_id
                        }
                    }));
                }
            });

            return Promise.all(arr).then(function(tags_data) {

                tags_data.forEach(function(val){
                    val.uri = Url.tags.list(val.id, val.url);
                });

                // 附加到主对象上
                data.tags_data = tags_data;
// console.log(data)
                return data;
            });
        });
    });
}


module.exports = Controller(function() {
    return App;
});