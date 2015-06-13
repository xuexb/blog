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

    self.super('init', http);

    self.assign('nav_list_id', '');
    self.assign('nav_list_name', '全部文章');
    self.assign('key', '');

    self.assign('title', '前端小武--前端开发小武专注计算机基础和WEB前端开发知识');
    self.assign('keywords', '前端小武  谢耀武  小武  计算机基础   前端开发');
    self.assign('description', '谢耀武，网名前端小武，喜欢各种折腾, 喜欢研究源, 对美好的代码有极强的透视症, 崇尚有强烈技术氛围的UED...');

    //分类数据 0 
    arr.push(self.__get_list_data());

    return Promise.all(arr).then(function(data) {
        self.assign('LIST', data[0]);
        return data;
    });
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
App.__404Action = function() {
    this.status(404);
    return this.display(VIEW_PATH + '/Touch/404.html');
}


/**
 * 内部调用列表
 * @description 处理分类名, 发表时间等内容, 查标签， 支持列表分页查询，不支持单个查询
 * @param {object} options 配置
 * @param {boolean} options.isPage 是否为分页列表
 * @return {Promise}
 */
// SELECT t.* FROM post_has_tags AS h,tags AS t WHERE h.post_id = 3 AND h.tag_id = t.id 
App.__get_list = function(options) {
    options = options || {};

    options.field = options.field || 'id, title, list_id, url, update_date, hit, markdown_content_list';

    return D('Article').get(options).then(function(data) { //查分类名 + 修改url + 发布时间 + 列表图 + 内容
        var content_data = options.isPage ? data.data : data;

        var arr = [];
        var List = D('List');

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
            val.update_date = Date.elapsedDate(val.update_date, 'yyyy-M-d');
        });

        return Promise.all(arr).then(function(list_data) {
            content_data.forEach(function(val, index) { //把分类的数据叠加到主数据上
                val.list_data = list_data[index];
            });
            return data;
        }).then(function(){
            // var sql = [];

            // content_data.forEach(function(val){
            //     console.log(val.id);
            // });

            // console.log(sql);

            // // return data;

            // return Promise.all(sql).then(function(tags_data){
            //     console.log(tags_data);
            //     return data;
            // });
            return data;
        });
    });
}


module.exports = Controller(function() {
    return App;
});