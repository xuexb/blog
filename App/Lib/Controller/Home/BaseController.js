/**
 * 博客初始化
 * @description 包括一些公用方法，如 设置导航高亮，获取最新文章列表，
 */
'use strict';

var App = {};

/**
 * 出错提示
 * @param  {string} str 错误的内容
 */
App.error_msg = function(str){
    this.assign('errmsg', str);
    this.assign('back_url', this.referer());
    return this.display('Home:index:error');
}


/**
 * 前置操作 ,临时的判断是否登录
 */
App.__before = function() {
    var self = this;

    return self.session('user_name').then(function(data) {
        self.user_name = data;
        self.assign('user_name', data);
        return self;
    });
}



/**
 * 成功提示
 * @param  {string} str 成功的内容
 */
App.success_msg = function(str){
    this.assign('errmsg', str);
    this.assign('back_url', this.referer());
    return this.display('Home:index:success');
}


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
        //处理宽屏
        var auto = parseInt(self.get('auto') || self.cookie('auto'), 10) || 0;;
        self.assign('auto', auto);
        self.cookie('auto', auto);

        self.assign("LIST", data[0]);
        self.LIST = data[0];
        self.assign('new_article', data[1]);
        self.assign('hot_search', data[2]);
        self.assign('view_search', '');
        self.assign('links', false);
        self.assign('key', '');
        self.assign('Url', Url);
        self.assign('ui-auto', self.cookie('ui-auto'));
        return data;
    });
}


/**
 * 设置导航
 * @param  {string=home} type 导航类型有 home,article,demo,tags,about,message
 * @param {int} list_id 高亮的分类
 */
App.__set_nav = function(type, list_id) {
    var self = this;
    self.assign('nav_list_id', list_id);
    self.assign("nav_type", type || 'home');
    return self;
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
        .select();
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
 * 获取分类数据
 * @return {array}
 */
App.__get_list_data = function() {
    return D('List').get({
        cache: true
    });
}


/**
 * 空操作
 */
App.__call = function(http) {
    // return this.end('__call')
    return this.__404Action(http);
}


/**
 * 404错误页
 */
App.__404Action = function(http) {
    this.status(404);
    return this.display(VIEW_PATH + '/Home/index_404.html');
}


/**
 * 内部调用列表
 * @description 处理分类名, 发表时间等内容, 查标签， 支持列表分页查询，不支持单个查询
 * @param {object} options 配置
 * @param {boolean} options.isPage 是否为分页列表
 * @return {Promise}
 */
App.__get_list = function(options) {
    var self = this;

    options = options || {};

    options.field = options.field || 'id, title, list_id, url, update_date, hit, markdown_content_list';

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

            //发布时间
            val.create_date = Date.elapsedDate(val.create_date, 'yyyy-M-d');
        });

        return Promise.all(arr).then(function(list_data) {
            content_data.forEach(function(val, index) { //把分类的数据叠加到主数据上
                val.list_data = list_data[index];
            });
            return data;
        });
    });
}


module.exports = Controller(function() {
    return App;
});