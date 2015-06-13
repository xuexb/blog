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

    self.assign('title', '搜索 ' + key + ' 的结果——前端小武');

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
        var key, desc;

        if (isEmpty(list_data)) {
            return self.__404Action();
        }
        //设置导航
        self.assign('nav_list_id', list_data.id);
        self.assign('nav_list_name', list_data.name);


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

        self.assign('title', list_data.name + '——前端小武');


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

            //生成描述
            self.assign('description', data.markdown_content
                .replace(/<[^>]+?>/g, '').replace(/[\r\n]/g, ',').substr(0, 120) + '...');

            // 标题
            // 处理留言和谢亮
            if(url !== 'xiaowu' && url !== 'links' && url !== 'zaixianliuyan'){
                self.assign('title', data.title + '_' + list_data.name + '_前端小武');
            } else {
                self.assign('title', data.title + '——前端小武');
            }

            return self.display();
        });
    });
}



module.exports = Controller('Touch/BaseController', function() {
    return App;
});