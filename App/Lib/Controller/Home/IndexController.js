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

    return self.__get_list().then(function(data) {
        self.assign({
            list: data,
            title: '学习吧 - 专注计算机基础知识和WEB前端开发'
        });

        return self.display();
    });
}


/**
 * 查看文章页
 */
App.viewAction = function() {
    var self = this,
        sql = {},
        url = self.get("url");

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
        field: 'id, markdown_content, hit, update_date, list_id, title, url, create_uid',
        where: sql
    }).then(function(data) {
        var sql;

        if (isEmpty(data)) { //没有这个内容
            return self.__404Action();
        }

        sql = [
            D('List').get({ //查列表
                one: 1,
                field: 'url, name, id',
                where: {
                    id: data.list_id
                }
            }),
            D('User').get({ //查作者
                one: 1,
                field: 'nickname',
                where: {
                    uid: data.create_uid
                }
            }),
            // D('TagsIndex').get({ //查标签
            //     where: {
            //         article_id: data.id
            //     }
            // }),
            D('Article').get({ //查相关文章
                field: 'id, title, url',
                limit: 6,
                order: 'rand()',
                where: {
                    id: ['!=', data.id],
                    list_id: data.list_id
                }
            })
        ];

        return Promise.all(sql).then(function(res) {
            var list_data,
                user_data;


            if (isEmpty(res) || isEmpty(res[0]) /*|| isEmpty(res[1])*/ ) { //没有分类
                return self.__404Action();
            }

            

            list_data = res[0];
            user_data = res[1];

            //标签
            ////临时添加标签
            res.splice(2, 0 , []);
            self.assign('tags_data', res[2]);


            //喜欢变量
            res[3].forEach(function(val) {
                val.uri = Url.article.view(val.id, val.url);
            });
            self.assign('like_list', res[3]);


            //列表变量
            self.assign('list_name', list_data.name);
            self.assign('list_url', list_data.url);
            self.assign('list_uri', Url.article.list(list_data.id, list_data.url));

            // 详情页变量
            // 用户变量
            data.nickname = user_data.nickname;
            if (data.nickname) {
                data.user_uri = Url.user.view(user_data.id);
            }
            //发布时间
            data.update_date = Date.elapsedDate(data.update_date, 'yyyy-M-d h:m');

            self.assign("data", data);

            //初始导航
            //单独处理
            var nav_type;

            if(url === 'xieliang'){
                nav_type = 'about';
            } else if(url === 'zaixianliuyan'){
                nav_type = 'message';
            } else {
                nav_type = 'article';
            }
            self.__set_nav(nav_type, list_data.id);



            // 标题
            self.assign('title', data.title + '_' + list_data.name + '_学习吧');


            return self.display();
        });
    });
}



module.exports = Controller("Home/BaseController", function() {
    return App;
});