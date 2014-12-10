/**
 * 用户后台控制器
 */

'use strict';

var App = {};


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
    data.id = parseInt(self.post('id'), 10) || 0;

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

    data.create_date = data.update_date = new Date() - 0;
    data.create_uid = self.user_info.uid;
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


    return D('User').get({
        one: 1,
        field: 'uid, user_name',
        where: {
            user_name: user_name,
            user_pass: md5(user_pass)
        }
    }).then(function(res) {
        if (isEmpty(res)) { //用户名、密码错误
            return self.error_msg('用户名或者密码错误');
        }

        return self.action('Home:Common:user_login', [res.uid, true]).then(function(data) {
            if (isEmpty(data)) {
                return self.error_msg('登录失败');
            }
            return self.success_msg('登录成功！');
        });

    });

}


/**
 * 注册提交数据
 * @return {[type]} [description]
 */
App.regPost = function() {
    var self = this;

    // 表单值
    var user_name = self.post('user_name'),
        user_pass = self.post('user_pass');

    if (!user_name) {
        return self.error_msg('用户名不能为空');
    } else if (user_name.length < 5) {
        return self.error_msg('用户名不能少于5位');
    } else if (!user_pass) {
        return self.error_msg('密码不能为空');
    } else if (user_pass.length < 6) {
        return self.error_msg('密码不能少于6位');
    }



    return D('User').thenAdd({
        user_name: user_name,
        user_pass: md5(user_pass),
        status: 0,
        nickname: user_name,
        hit: 0,
        login_hit: 1,
        create_date: new Date() - 0,
        create_ip: self.ip(),
        update_date: new Date() - 0,
        update_ip: self.ip(),
    }, {
        user_name: user_name
    }, true).then(function(res) {
        if (res.type === 'exist') { //已经被注册了
            return self.error_msg('该用户名已经被注册');
        }


        //写入session && cookie
        return self.action('Home:Common:user_set_session', [{
            user_name: user_name,
            uid: res.id
        }, 1]).then(function() {
            return self.success_msg('注册成功！', false);
        });
    });
}


/**
 * 注册
 */
App.regAction = function() {
    var self = this,
        token;

    //如果是提交
    if (self.isPost() && self.post('token')) {
        return self.session('token').then(function(data) {
            if (data === self.post('token')) { //如果是真爱
                return self.session('token', '').then(function() { //清空session
                    return self.regPost();
                });
            }

            return self.redirect('/center/reg');
        });
    }

    // 生成token
    token = md5(new Date() - 0);

    return self.session('token', token).then(function() {
        self.assign('token', token);
        self.assign('title', '注册_学习吧');
        return self.display();
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
App.__before = function() {
    var self = this;
    return D('User').where({
        uid: 1
    }).field('uid').find().then(funciton(data) {
        return data;
    });

    // 获取用户数据
    return self.action('Home:Common:user_check').then(function(data) {
        console.log(data)
            // if(isEmpty(data)){
            //     return self.redirect(Url.center.login());
            // }

        // self.user_info = data;//用户数据,如果为空则说明没有登录
        // self.user_status = Number(!isEmpty(self.user_info));
        // self.assign('user_info', self.user_info);//给模板赋值
        // self.assign('title', '个人中心_学习吧');
        // return data;
    });
}



module.exports = Controller("Home/BaseController", function() {
    return App;
});