# 前端小武博客

基于 [Firekylin](https://github.com/firekylin/firekylin) 上扩展开发搭建，服务器运行于阿里云，域名为 [xuexb.com](https://xuexb.com/)。

<img width="734" alt="image" src="https://user-images.githubusercontent.com/3872051/158399150-a5d336d8-6c9c-473e-82b5-7d2ec1799b5d.png">


## 历史版本

#### 2011.08.09 - v0

DIV+CSS 静态页面，刚注册完成

#### ASP 版本 - 2011-2012 - v1.1

- 动态页面+后台、主页、详情页生成静态化
- 列表页生成静态化、一键网站静态化，一键生成 Sitemap
- IIS 全站伪静态
    1. 无刷新评论 - 基于 jQuery
    1. 无刷新弹出层登录
    1. 第三方登录接入（腾讯QQ、新浪微博）

#### PHP 版本 - 2013-2014 - v1.5

- v3.1：纯原生 PHP 实现
    1. 全站原生 JS 完成 Ajax 、评论
- v3.2：基于 [CodeIgniter](http://www.codeigniter.com/) 重构

#### Node.js 版本 - 2014-2015 - v2.x

- 基于 [ThinkJS 1.x](https://thinkjs.org/zh-cn/doc/1.2/index.html) 开发

#### Node.js 版本 - 2015-2016 - v3.x

- 基于 [ThinkJS 2.x](https://thinkjs.org/zh-cn/doc/2.0/index.html) 开发

#### Node.js 版本 - 2017-2021 - v4.x

- 基于 [Firekylin](https://github.com/firekylin/firekylin) v0.15.6 上扩展开发搭建
- Nginx 前置缓存
- MIP 、AMP

#### Node.js 版本 - 2022 - v5.x

- [x] Service Worker
- [x] CDN
- [ ] WebP
- [x] GitHub Actions CI/CD（测试环境+生产环境）
- [x] 多地区部署
- [x] Docker
    ```bash
    docker run \
        -d \
        --env BLOG_ENV="`hostname`" \
        --name blog-node \
        --rm \
        -it \
        ghcr.io/xuexb/blog:node-latest

    docker run \
        -d \
        --env BLOG_ENV="`hostname`" \
        -p 8080:8080 \
        -it \
        --name blog-nginx \
        --rm \
        --link blog-node:blog \
        ghcr.io/xuexb/blog:nginx-latest
    ```
