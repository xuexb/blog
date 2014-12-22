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
App.createToken = function(user_name) {
    if (!user_name) {
        return '';
    }
    return md5('xuexb' + user_name);
}


/**
 * 退出
 * @description 注销session和cookie的token
 */
App.logoutAction = function() {
    var self = this;

    return self.session('user_name', null).then(function() {
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


    return self.session('user_name', user_name).then(function() {
        return user_name; //因为session返回的没有参数， 这里为了方便做了下hack
    });
}



/**
 * 登录
 * @param {string} user_name 用户名
 * @param {boolean|string} auto 是否记住密码, 如果为cookie则绕过cookie设置
 */
App.user_loginAction = function(user_name, auto) {
    var self = this;

    if (user_name !== (F('user_info') || {}).user_name) {
        return null;
    }

    //写入session
    return self.user_set_sessionAction(user_name, auto).then(function() {
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
        return self.session('user_name').then(function(data) {

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
App.get_list_content = function(str) {
    var content,
        index = str.indexOf(C('list_mark'));

    //如果有标识
    if (index > -1) {
        content = str.substr(0, index);
    } else {
        if (str.length < 300) {
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
 * @param {int} id 文章id
 */
App.editArticleAction = function() {
    var self = this;

    var id = parseInt(self.get('id'), 10) || 0;

    if (!id) {
        return self.error_msg('ID为空');
    }

    return D('Article').get({
        where: {
            id: id
        },
        field: 'id, title, content, update_date, hit, list_id, url',
        one: true
    }).then(function(data) {
        if (isEmpty(data)) {
            return self.error_msg('没有该文章');
        }

        data.update_date = Date.elapsedDate(data.update_date, 'yyyy-M-d');

        self.assign('data', data);
        self.assign('type', 'edit');

        self.assign('title', '修改文章_学习吧');

        return self.display();
    });
}


/**
 * 通用保存文章
 * @type GET
 * @param {int} id 文章id
 *
 * @type POST
 * @param {int} hit 文章点击数
 * @param {int} list_id 文章分类id
 * @param {string} url 文章url
 * @param {string} title 文章标题
 * @param {string} content 文章内容
 */
App.updateArticleAction = function() {
    var self = this,
        type = 'create',
        marked, id, temp, data;

    // 如果不是POST
    if (!self.isPost()) {
        return self.__404Action();
    }

    data = self.post();

    // 如果有id表示为编辑
    id = parseInt(self.get('id'), 10) || 0;
    if (id) {
        type = 'edit';
    }

    // 数据处理
    data.hit = parseInt(data['hit'].trim(), 10) || 0;
    data.url = data['url'].trim();
    data.title = data['title'].trim();
    data.list_id = parseInt(data['list_id'], 10) || 0;

    // 验证
    if (data.title === '') {
        return self.error_msg('标题为空');
    } else if (!data.list_id) {
        return self.error_msg('分类为空');
    } else if (data.content === '') {
        return self.error_msg('内容为空');
    }

    // 转成md
    marked = require('marked');
    temp = data.content.replace(new RegExp(C('list_mark'), 'g'), ''); //替换列表标识为空
    data.markdown_content = marked(xss_html(temp)); //去标签

    // 列表用内容字段
    data.markdown_content_list = App.get_list_content(data.content.replace(new RegExp(C('view_page'), 'g'), ''));

    // 更新时间
    data.update_date = new Date() - 0;

    // 如果为创建则有创建时间
    if (type === 'create') {
        data.create_date = data.update_date;

        temp = {
            title: data.title,
            _logic: 'OR'
        }

        if (data.url) {
            temp.url = data.url;
        }

        return D('Article').thenAdd(data, temp, true).then(function(res) {
            if (res.type !== 'add') {
                return self.error_msg('文章标题或者链接已存在');
            }
            return self.success_msg('创建成功');
        }).catch(function() {
            return self.error_msg('创建失败');
        });
    }

    // 这里只能是编辑了
    return D('Article').where({
        id: id
    }).update(data).then(function() {
        return self.success_msg('保存成功');
    }).catch(function() {
        return self.error_msg('保存失败');
    });
}


/**
 * 删除文章
 * @param {int} id 文章id
 */
App.delArticleAction = function() {
    var self = this,
        id = parseInt(self.get('id'), 10) || 0,
        arr;


    if (!id) {
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


    return Promise.all(arr).then(function() {
        return self.success_msg('删除成功');
    }).catch(function(err) {
        console.log(err)
        return self.error_msg('删除失败');
    });
}

/**
 * 发布文章
 */
App.createArticleAction = function() {
    var self = this;
    self.assign('data', {});
    self.assign('type', 'create');
    return self.display('Home:admin:editarticle');
}


/**
 * 登录
 */
App.loginAction = function() {
    var self = this;

    // F('user_info', {
    //     user_name: 'xuexb',
    //     user_pass: 'xieliang'
    // })

    if (self.isPost()) {
        return self.loginPost();
    }

    self.assign('title', '登录_学习吧');
    return self.display();
}


/**
 * 登录提交
 * @param {string} user_name 用户名
 * @param {string} user_pass 用户密码
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

    if (user_name !== user_info.user_name || user_pass !== user_info.user_pass) {
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
    if (App.no_login.indexOf(self.http.action) > -1) {
        return self;
    }

    return self.user_checkAction().then(function(data) {
        if (isEmpty(data)) {
            return self.redirect(Url.admin.login());
        } else {
            self.user_name = data;
        }

        self.assign('user_name', data);
        return self;
    });
}


/**
 * 生成站点地图
 * @description 现在先使用笨方法生成吧，后期要换成模板生成
 */
App.createSitemapAction = function() {
    var self = this,
        sql = [];


    //查分类
    sql.push(D('List').get({
        cache: true,
        field: 'url, name'
    }));

    //查文章
    sql.push(D('Article').get({
        limit: 150,
        cache: true,
        field: 'id, url, update_date, title, markdown_content_list'
    }));

    //查搜索
    sql.push(D('Search').get({
        cache: true,
        field: 'name',
        limit: 10
    }));

    return Promise.all(sql).then(function(data) {
        var res = {};
        res.home = {
            title: '学习吧',
            url: 'http://www.xuexb.com'
        }

        res.list = data[0];
        res.article = data[1];
        res.search = data[2];

        //生成xml
        App.createXml(res);

        // 生成txt
        App.createTxt(res);

        // 生成html
        App.createHtml(res);

        // 生成rss
        App.createRss(res);

        return self.success_msg('生成成功！');
    });
}


/**
 * 生成xml地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
App.createXml = function(data) {
    var arr = [],
        fs = require('fs'),
        path = require('path'),
        now = Date.formatDate(new Date(), 'yyyy-MM-dd');

    arr.push('<?xml version="1.0" encoding="UTF-8"?>');
    arr.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');


    // 添加主页
    arr.push('<url>');
    arr.push('<loc>' + data.home.url + '</loc>');
    arr.push('<lastmod>' + now + '</lastmod>');
    arr.push('<changefreq>always</changefreq>');
    arr.push('<priority>1.0</priority>');
    arr.push('</url>');


    //添加列表
    data.list.forEach(function(val) {
        arr.push('<url>');
        arr.push('<loc>' + data.home.url + Url.article.list(val.id, val.url) + '</loc>');
        arr.push('<lastmod>' + now + '</lastmod>');
        arr.push('<changefreq>always</changefreq>');
        arr.push('<priority>0.9</priority>');
        arr.push('</url>');
    });

    //添加文章
    data.article.forEach(function(val) {
        arr.push('<url>');
        arr.push('<loc>' + data.home.url + Url.article.view(val.id, val.url) + '</loc>');
        arr.push('<lastmod>' + Date.formatDate(val.update_date, 'yyyy-MM-dd') + '</lastmod>');
        arr.push('<changefreq>always</changefreq>');
        arr.push('<priority>0.8</priority>');
        arr.push('</url>');
    });

    //添加文章
    data.search.forEach(function(val) {
        arr.push('<url>');
        arr.push('<loc>' + data.home.url + Url.article.search(val.name) + '</loc>');
        arr.push('<lastmod>' + now + '</lastmod>');
        arr.push('<changefreq>always</changefreq>');
        arr.push('<priority>0.7</priority>');
        arr.push('</url>');
    });

    arr.push('</urlset>');

    fs.writeFileSync(path.resolve(APP_PATH, '../www/sitemap.xml'), arr.join('\n'));
}


/**
 * 生成rss地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
App.createRss = function(data) {
    var arr = [],
        fs = require('fs'),
        path = require('path'),
        now = Date.formatDate(new Date(), 'yyyy-MM-dd');

    arr.push('<?xml version="1.0" encoding="UTF-8"?>');
    arr.push('<rss version="2.0">');
    arr.push('<channel>');
    arr.push('<title>' + data.home.title + '</title>');
    arr.push('<link>' + data.home.url + '</link>');
    arr.push('<description>专注计算机基础知识，web前端发展</description>');
    arr.push('<language>zh-cn</language>');
    arr.push('<generator>谢亮</generator>');
    arr.push('<pubDate>2011-09-11</pubDate>');
    arr.push('<lastBuildDate>' + now + '</lastBuildDate>');

    //添加文章
    data.article.length = 50;
    data.article.forEach(function(val) {
        arr.push('<item>');
        arr.push('<link>' + data.home.url + Url.article.view(val.id, val.url) + '</link>');
        arr.push('<pubDate>' + Date.formatDate(val.update_date, 'yyyy-MM-dd') + '</pubDate>');
        arr.push('<title>' + val.title + '</title>');
        arr.push('<author>谢亮</author>');
        arr.push('<description><![CDATA[' + val.markdown_content_list + ']]></description>');
        arr.push('</item>');
    });


    arr.push('</channel></rss>');

    fs.writeFileSync(path.resolve(APP_PATH, '../www/rss.xml'), arr.join('\n'));
}


/**
 * 生成txt地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
App.createTxt = function(data) {
    var arr = [],
        fs = require('fs'),
        path = require('path');



    // 添加主页
    arr.push(data.home.url);


    //添加列表
    data.list.forEach(function(val) {
        arr.push(data.home.url + Url.article.list(val.id, val.url));
    });

    //添加文章
    data.article.forEach(function(val) {
        arr.push(data.home.url + Url.article.view(val.id, val.url));
    });

    //添加文章
    data.search.forEach(function(val) {
        arr.push(data.home.url + Url.article.search(val.name));
    });


    fs.writeFileSync(path.resolve(APP_PATH, '../www/sitemap.txt'), arr.join('\n'));
}


/**
 * 生成html地图
 * @param  {object} data 数据包 {article: [], list: [], search: []}
 */
App.createHtml = function(data) {
    var arr = [],
        fs = require('fs'),
        path = require('path');


    var get = function(url, title) {
        return '<li><a href="' + url + '">' + title + '</a></li>';
    }

    arr.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>网站地图_学习吧</title></head><body>');

    arr.push('<h1>网站地图</h1>', '<p>生成于 ' + Date.formatDate(new Date(), 'yyyy-MM-dd HH:m:ss') + '</p>');

    // 添加主页
    arr.push(get(data.home.url, data.home.title));


    arr.push(get('/rss.xml', 'rss订阅'));
    arr.push(get('/sitemap.xml', 'XML地图'));

    //添加列表
    data.list.forEach(function(val) {
        arr.push(get(data.home.url + Url.article.list(val.id, val.url), val.name));
    });

    //添加文章
    data.article.forEach(function(val) {
        arr.push(get(data.home.url + Url.article.view(val.id, val.url), val.title));
    });

    //添加文章
    data.search.forEach(function(val) {
        arr.push(get(data.home.url + Url.article.search(val.name), '搜索 ' + val.name));
    });


    arr.push('</body></html>');

    fs.writeFileSync(path.resolve(APP_PATH, '../www/sitemap.html'), arr.join('\n'));
}


/**
 * 更新程序
 */
App.updateAction = function() {
    var self = this,
        Child_process = require('child_process');

    return Child_process.exec('git pull', function(a, b) {
        console.log(a, b);
        return self.success_msg('更新成功');
    });


}


module.exports = Controller("Home/BaseController", function() {
    return App;
});