/**
 * 用户后台控制器
 */

'use strict';

var App = {};


/**
 * 不用检查登录的控制器
 * @type {Array}
 */
App.no_login = ['login'];





// user api start
/**
 * 创建加密token码
 * @private
 * @param  {string} user_name 用户名
 * @return {string}           密钥
 */
App.createToken = function(user_name){
    if(!user_name){
        return '';
    }
    return md5('xuexb'+ user_name);
}


/**
 * 退出
 * @description 注销session和cookie的token
 */
App.logoutAction = function(){
    var self = this;
    
    return self.session('user_name', null).then(function(){
        self.cookie('token', null);
        return self.success_msg('退出成功');
    });
}


/**
 * 写入对象数据到session,   注： 回调then里的参加为 传的data
 * @description session [, cookie]
 * @param {string} user_name 用户名
 * @param {string} auto 是否记录密码，cookie则忽略，0为临时，1为永久
 */
App.user_set_sessionAction = function(user_name, auto) {
    var self = this,
        token;

    //如果不是cookie验证
    if (auto !== 'cookie') {
        //生成密钥
        token = self.createToken(user_name);

        //hack
        self.cookie('token', token, {
            timeout: auto ? 60 * 60 * 24 * 365 : 0
        });

        // 把user_name多存点
        self.cookie('user_name', user_name, {
            timeout: 60 * 60 * 24 * 365
        });
    }


    return self.session('user_name', user_name).then(function(){
        return user_name;//因为session返回的没有参数， 这里为了方便做了下hack
    });
}




/**
 * 登录
 * @param {string} user_name 用户名
 * @param {boolean|string} auto 是否记住密码, 如果为cookie则绕过cookie设置
 */
App.user_loginAction = function(user_name, auto){
    var self = this;

    if(user_name !== (F('user_info') || {}).user_name){
        return null;
    }

    //写入session
    return self.user_set_sessionAction(user_name, auto).then(function(){
        return user_name;
    });
}



/**
 * 检查用户是否登录, session->cookie
 * @return {Promise}
 */
App.user_checkAction = function() {
    var self = this;

    //异步cookie授权验证， 注cookie会先验证session
    return self.session('user_name').then(function(data){

        //处理自动登录
        var user_name, token;


        //如果没有session
        if (data === void 0) {
            user_name = self.cookie('user_name');
            token = self.cookie('token');

            //如果cookie正确
            if (token && user_name && token === self.createToken(user_name)) {
                return self.user_loginAction(user_name, 'cookie');
            }
        }

        return data;
    });
}
// user api end








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
        field: 'id, title, content, update_date, hit, list_id, url',
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

    data.hit = parseInt(self.post('hit').trim(), 10) || 0;
    data.url = self.post('url').trim();
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
    data.markdown_content = marked(xss_html(data.content.replace(C('list_mark'), '')));


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
 * 删除文章
 */
App.delArticleAction = function(){
    var self = this,
        id = parseInt(self.get('id'), 10) || 0,
        arr;


    if(!id){
        return self.__404Action();
    }

    arr = [];

    //删文章
    arr.push(D('Article').where({
        id: id
    }).delete());

    //删标签
    arr.push(D('TagsIndex').where({
        article_id: id
    }).delete());


    return Promise.all(arr).then(function(){
        return self.success_msg('删除成功');
    }).catch(function(err){
        console.log(err)
        return self.error_msg('删除失败');
    });
}

/**
 * 发布文章
 */
App.createArticleAction = function() {
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

    data.url = self.post('url').trim();
    data.hit = parseInt(self.post('hit').trim(), 10) || 0;
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
    data.markdown_content = marked(xss_html(data.content.replace(C('list_mark'), '')));

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

    return self.user_loginAction(user_name, true).then(function(data) {
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
 * 前置操作 判断必须为登录状态
 */
App.__before = function() {
    var self = this;

    //如果当前控制器不要求登录
    if(App.no_login.indexOf(self.http.action) > -1){
        return self;
    }

    return self.user_checkAction().then(function(data) {
        if (isEmpty(data)) {
            return self.redirect(Url.admin.login());
        } else {
            self.user_name = data;
        }
        return self;
    });
}



module.exports = Controller("Home/BaseController", function() {
    return App;
});