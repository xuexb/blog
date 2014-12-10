/**
 * 公用的API
 */
'use strict';

var App = {};


/**
 * 创建加密token码
 * @private
 * @param  {number} uid       用户id
 * @param  {string} user_name 用户名
 * @return {string}           密钥
 */
App.createToken = function(uid, user_name){
    if(!uid || !user_name){
        return '';
    }
    return md5(uid + 'xuexb'+ user_name);
}


/**
 * 退出
 * @description 注销session和cookie的token
 */
App.user_logoutAction = function(){
    var self = this;
    
    return self.session('user_info', null).then(function(){
        self.cookie('token', null);
        return self;
    });
}


/**
 * 写入对象数据到session,   注： 回调then里的参加为 传的data
 * @description session [, cookie]
 * @param {object} data 用户数据
 * @param {number} data.uid 用户id
 * @param {string} data.user_name 用户名
 * @param {string} auto 是否记录密码，cookie则忽略，0为临时，1为永久
 */
App.user_set_sessionAction = function(data, auto) {
    var self = this,
        uid, token, user_name;


    //小小的判断下
    // if (!isObject(data)) {
    //     console.log('用户登录方法数据为空');
    //     return getPromise();
    // }


    //如果不是cookie验证
    if (auto !== 'cookie') {
        uid = data.uid;
        user_name = data.user_name;

        
        //生成密钥
        token = self.createToken(uid, user_name);


        //hack
        self.cookie('token', token, {
            timeout: auto ? 60 * 60 * 24 * 365 : 0
        });


        // 把uid多存点
        self.cookie('user_name', user_name, {
            timeout: 60 * 60 * 24 * 365
        });
        self.cookie('uid', uid, {
            timeout: 60 * 60 * 24 * 365
        });
    }


    return self.session('user_info', data).then(function(){
        return data;//因为session返回的没有参数， 这里为了方便做了下hack
    });
}




/**
 * 登录
 * @description uid -> User -> User.status -> UserInfo.avatar_src -> sessionAction -> hit+1
 * @param  {number} uid 用户id
 * @param {boolean|string} auto 是否记住密码, 如果为cookie则绕过cookie设置
 */
App.user_loginAction = function(uid, auto){
    var self = this;

    return D('User').get({
        where: {
            uid: uid
        },
        one: 1,
        field: 'user_name, status'
    }).then(function(data) {
        //用户不存在 或者被禁用
        if (isEmpty(data) || data.status === 1) {
            return null;
        }


        //写入session
        return self.user_set_sessionAction({
            uid: uid,
            user_name: data.user_name
        }, auto).then(function(data){
            return self.user_update_infoAction(data.uid).then(function(){
                return data;
            });
        });
    });
}



/**
 * 检查用户是否登录, session->cookie
 * @return {Promise}
 */
App.user_checkAction = function() {
    var self = this;

    //异步cookie授权验证， 注cookie会先验证session
    return self.session('user_info').then(function(data){

        //处理自动登录
        var uid, user_name, token;


        //如果没有session
        if (data === void 0) {
            uid = self.cookie('uid') | 0;
            user_name = self.cookie('user_name');
            token = self.cookie('token');

            //如果cookie正确
            if (token && uid && user_name && token === self.createToken(uid, user_name)) {
                return self.user_loginAction(uid, 'cookie');
            }
        }

        return data;
    });

}

/**
 * 登录后更新用户登录信息
 * @param  {nubmer} uid 用户id
 */
App.user_update_infoAction = function(uid) {
    return D('User').where({
        uid: uid
    }).update({
        update_date: new Date() - 0,
        login_hit: ['EXP', 'login_hit+1'],
        update_ip: this.ip()
    });
}



/**
 * 更新用户访问数
 * @description 记录session以来判断是否查看过
 * @param  {string} uid 用户id
 */
// App.update_hitAction = function(uid) {
//     var self = this;

//     return self.session('hit_uid_' + uid).then(function(res) {
//         if (isEmpty(res)) {
//             return self.session('hit_uid_' + uid, 1).then(function() {
//                 return D('UserInfo').where({
//                     uid: uid
//                 }).update({
//                     hit: ['EXP', 'hit+1']
//                 });
//             });

//         }

//         return res;
//     });
// }




//暴露
module.exports = Controller(function() {
    return App;
});