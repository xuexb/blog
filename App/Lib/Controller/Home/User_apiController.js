/**
 * 用户相关的API
 */
'use strict';

var App = {};


//用户权限缓存目录
App.authorization_path = DATA_PATH + '/user/';


/**
 * 用户授权数据
 * @description 只有在这个数组里的，用户才可以手动的禁止别人查看， 要不岂不是疯了？
 * @type {Array}
 */
App.authorization_arr = [
    'qq',
    'job',
    'sex',
    'email',
    'description',
    'address'
];

/**
 * 获取用户权限数组
 * @return {array}
 */
App.get_authorization_arrAction = function(){
    return App.authorization_arr;
}


/**
 * 获取用户资料权限
 * @param  {number} uid  用户id
 * @param  {string} type 要获取的类型
 * @return {boolean|object}     如果为true则说明禁止查看
 */
App.get_authorizationAction = function(uid, type) {
    var cache = uid && (F(uid, void 0, App.authorization_path) || {});

    if(type){
        return cache && cache[type] ? !0 : !1;
    }


    return cache;
}


/**
 * 设置用户权限
 * @param {number} uid  用户id
 * @param {object} data 用户数据
 */
App.set_authorizationAction = function(uid, data){

    // var obj = {};
    // 因为每步都是先获取再设置，所以不需要这一步

    // if(isObject(data)){//如果是对象则遍历禁用数组来
    //     App.authorization_arr.forEach(function(val){
    //         if(data[val]){
    //             obj[val] = data[val];
    //         }
    //     });
    // }
    
    F(uid, data, App.authorization_path);
    return data;
}



/**
 * 创建加密token码
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
App.logoutAction = function(){
    var self = this;
    
    return this.session('user_info', null).then(function(){
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
App.set_sessionAction = function(data, auto) {
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


    return this.session('user_info', data).then(function(){
        return data;//因为session返回的没有参数， 这里为了方便做了下hack
    });
}




/**
 * 登录
 * @description uid -> User -> User.status -> UserInfo.avatar_src -> sessionAction -> hit+1
 * @param  {number} uid 用户id
 * @param {boolean|string} auto 是否记住密码, 如果为cookie则绕过cookie设置
 */
App.loginAction = function(uid, auto){
    var self = this;

    return D('User').field('user_name, status').where({
        id: uid
    }).find().then(function(data) {
        //用户不存在
        if (isEmpty(data)) {
            return null;
        }

        //用户禁用
        if(data.status === 1){
            return null;
        }

        return D('UserInfo').field('avatar_src, login_time').where({
            uid: uid
        }).find().then(function(info_data){

            //为啥userInfo表里没有你呢?
            if(isEmpty(info_data)){
                return null;
            }


            //插入积分
            return self.action('Home:Integral_api:login', [{
                uid: uid,
                login_time: info_data.login_time
            }]).then(function(){
                //写入session
                return self.set_sessionAction({
                    uid: uid,
                    user_name: data.user_name,
                    avatar_src: info_data.avatar_src
                }, auto).then(function(data){
                    return self.update_infoAction(data.uid).then(function(){
                        return data;
                    });
                });
            });
            
        });

    }).catch(function(error){
        consoleError(error);
        return null;
    });
}



/**
 * 检查用户是否登录, session->cookie
 * @return {boolean|Promise}
 */
App.checkAction = function() {
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
                return self.loginAction(uid, 'cookie');
            }
        }

        return data;
    });

}

/**
 * 登录后更新用户登录信息
 * @param  {nubmer} uid 用户id
 */
App.update_infoAction = function(uid) {
    return D('UserInfo').where({
        uid: uid
    }).update({
        login_time: new Date() - 0,
        login_hit: ['EXP', 'login_hit+1'],
        login_ip: this.ip()
    });
}


/**
 * 注册后添加用户信息
 * @description 返回参数为当前用户的 userinfo 数据
 */
App.add_infoAction = function(uid) {
    var data = {
        uid: uid,
        reg_time: new Date() - 0,
        sex: 0,
        login_hit: 1,
        login_time: new Date() - 0,
        hit: 0,
        avatar_src: '/res/images/nophoto.jpg',
        reg_ip: this.ip(),
        login_ip: this.ip(),
        integral: 0
    }
    return D('UserInfo').add(data).then(function(id){
        data.uid = uid;
        return data;
    }).catch(function(error){
        consoleError('写入userinfo失败', error);
        return null;
    });
}


/**
 * 更新用户访问数
 * @description 记录session以来判断是否查看过
 * @param  {string} uid 用户id
 */
App.update_hitAction = function(uid) {
    var self = this;

    return self.session('hit_uid_' + uid).then(function(res) {
        if (isEmpty(res)) {
            return self.session('hit_uid_' + uid, 1).then(function() {
                return D('UserInfo').where({
                    uid: uid
                }).update({
                    hit: ['EXP', 'hit+1']
                });
            });

        }

        return res;
    });
}




//暴露
module.exports = Controller(function() {
    return App;
});