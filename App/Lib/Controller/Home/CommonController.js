/**
 * 公用的API
 */
'use strict';

var App = {};


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
App.user_logoutAction = function(){
    var self = this;
    
    return self.session('user_name', null).then(function(){
        self.cookie('token', null);
        return self;
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


//暴露
module.exports = Controller(function() {
    return App;
});