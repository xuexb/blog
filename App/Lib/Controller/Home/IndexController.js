/**
 * 前台控制器
 * @description 包括 主页，列表，详情页，标签页，标签列表，搜索页
 */

'use strict';

var App = {};



App.indexAction = function() {
    var self = this;

    return self.__get_list().then(function(data) {
        self.assign({
            list: data,
            title: '学习吧 - 专注计算机基础知识和WEB前端开发'
        });

        return self.display();
    });
}



module.exports = Controller("Home/BaseController", function() {
    return App;
});