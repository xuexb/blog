/**
 * 前台控制器
 * @description 包括 主页，列表，详情页，标签页，标签列表，搜索页
 */

'use strict';

var App = {};


App.allAction = function(){
    return App.indexAction.call(this);
}


/**
 * 主页
 */
App.indexAction = function() {
    var self = this;

    var page = parseInt(self.get('page'), 10) || 1,
        page_size = parseInt(self.get('page_size'), 10) || 10,
        list_id = parseInt(self.get('list_id'), 10) || null,
        key = self.get('key').trim();

    var sql = {};

    sql.isPage = true;

    sql.page = page;

    sql.limit = page_size;

    if (key) {
        sql.where = {
            title: ['like', '%' + key + '%']
        }
    }

    if(list_id){
        if(!sql.where){
            sql.where = {};
        }
        sql.where.list_id = list_id;
    }

    return self.__get_list(sql).then(function(data){
        var key_reg;

        if (key) {
            key_reg = new RegExp(key, 'gi');

            //关键词高亮
            //只替换标题里的，因为内容是Md生成的html，一替换会出问题
            data.data.forEach(function(val) {
                if (val.title) {
                    val.title = val.title.replace(key_reg, function($0) {
                        return '<mark>' + $0 + '</mark>';
                    });
                }
            });
        }

        self.assign('list', data.data);

        return self.display();
    });
}

module.exports = Controller('Touch/BaseController', function() {
    return App;
});