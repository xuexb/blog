/**
 * 用户后台控制器
 */

'use strict';

var App = {};


/**
 * 提取列表用内容
 */
App.get_list_content = function(str){
    var content,
        index = str.indexOf(C('list_mark'));

    //如果有标识
    if( index > -1){
        content = str.substr(0, index);
    } else {
        if(str.length < 300){
            content = str;
        } else {
            content = str.substr(0, 300);
            if ((content.match(/```/g) || []).length % 2 === 1) {
                content += '```';
            }
        }
    }
    
    return require('marked')(xss_html(content));
}


/**
 * 发布文章
 */
App.editArticleAction = function() {
    var self = this;

    var id = parseInt(self.get('id'), 10) || 0;

    if(!id){
        return self.error_msg('ID为空');
    }

    return D('Article').get({
        where:{
            id: id
        },
        field: 'id, title, content, update_date, hit, list_id',
        one: true
    }).then(function(data){
        if(isEmpty(data)){
            return self.error_msg('没有该文章');
        }

        data.update_date = Date.elapsedDate(data.update_date, 'yyyy-M-d');

        self.assign('data', data);

        return self.display();
    });
}


/**
 * 保存编辑文章
 */
App.updateArticleAction = function() {
    var self = this,
        data = {},
        marked, id;

    id = parseInt(self.get('id'), 10) || 0;

    data.title = self.post('title').trim();
    data.content = self.post('content');
    data.list_id = parseInt(self.post('list_id'), 10) || 0;

    if(!id){
        return self.error_msg('ID为空');
    } else if (data.title === '') {
        return self.error_msg('标题为空');
    } else if (!data.list_id) {
        return self.error_msg('分类为空');
    } else if (!data.content) {
        return self.error_msg('内容为空');
    }


    // 转成md
    marked = require('marked');
    data.markdown_content = marked(xss_html(data.content));


    // 列表用内容字段
    data.markdown_content_list = App.get_list_content(data.content);

    data.update_date = new Date() - 0;

    return D('Article').where({
        id: id
    }).update(data).then(function(res) {
        return self.success_msg('保存成功');
    }).catch(function() {
        return self.error_msg('保存失败');
    });
}


/**
 * 发布文章
 */
App.addArticleAction = function() {
    var self = this;
    return self.display();
}


/**
 * 保存文章
 */
App.saveArticleAction = function() {
    var self = this,
        data = {},
        marked;

    data.title = self.post('title').trim();
    data.content = self.post('content');
    data.list_id = parseInt(self.post('list_id'), 10) || 0;

    if (data.title === '') {
        return self.error_msg('标题为空');
    } else if (!data.list_id) {
        return self.error_msg('分类为空');
    } else if (!data.content) {
        return self.error_msg('内容为空');
    }

    // 转成md
    marked = require('marked');
    data.markdown_content = marked(xss_html(data.content));

    // 列表用内容字段
    data.markdown_content_list = App.get_list_content(data.content);

    data.create_date = data.update_date = new Date() - 0;
    data.hit = 0;

    return D('Article').add(data).then(function(res) {
        return self.success_msg('发布成功');
    }).catch(function() {
        return self.error_msg('发布失败');
    });
}


/**
 * 登录
 */
App.loginAction = function() {
    var self = this;

    F('user_info', {user_name: 'xuexb', user_pass: 'xieliang'})

    if (self.isPost()) {
        return self.loginPost();
    }

    self.assign('title', '登录_学习吧');
    return self.display();
}


/**
 * 登录提交
 */
App.loginPost = function() {
    var self = this;

    var user_info;

    // 表单值
    var user_name = self.post('user_name'),
        user_pass = self.post('user_pass'),
        auto = !!self.post('auto');

    if (!user_name) {
        return self.error_msg('用户名不能为空');
    } else if (user_name.length < 5) {
        return self.error_msg('用户名不能少于5位');
    } else if (!user_pass) {
        return self.error_msg('密码不能为空');
    } else if (user_pass.length < 6) {
        return self.error_msg('密码不能少于6位');
    }

    user_info = F('user_info');

    if(user_name !== user_info.user_name || user_pass !== user_info.user_pass){
        return self.error_msg('用户名或者密码错误');
    }

    return self.action('Home:Common:user_login', [user_name, true]).then(function(data) {
        if (isEmpty(data)) {
            return self.error_msg('登录失败');
        }
        return self.success_msg('登录成功！');
    });
}


/**
 * 后台主页
 * @return {[type]} [description]
 */
App.indexAction = function() {
    var self = this;
    return self.display();
}


/**
 * 前置操作
 */
// App.__before = function() {
//     // var self = this;
//     // return self.action('Home:Common:user_check').then(function(data) {
//     //     if (!isEmpty(data)) {
//     //         self.user_name = data;
//     //     }
//     //     return self;
//     // });
// }



module.exports = Controller("Home/BaseController", function() {
    return App;
});