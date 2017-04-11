# 前端小武博客

基于 [firekylin](https://github.com/firekylin/firekylin) 上扩展开发搭建，服务器运行于阿里云，域名为 [xuexb.com](https://xuexb.com/)。

### 进度

- [ ] 前端样式编译: ls、压缩
- [ ] 打包上线流程: 搞个 Jenkins ? 哈哈哈
- [ ] nginx缓存的设置: 过期时间、反向代理缓存、Etag
- [ ] MIP页开发
- [ ] AMP页开发
- [ ] PWA
- [ ] 主动推送Google Analytics
- [ ] 应用Elasticsearch做站内切词搜索: 搜索摘要、搜索词高亮

### 历史版本

#### asp版本 - 2011-2012

1. 动态页面+后台
1. 主页、详情页生成静态化
1. 列表页生成静态化、一键网站静态化，一键生成`sitemap`
1. iis全站伪静态
    1. 无刷新评论 - 基于jquery
    1. 无刷新弹出层登录
    1. 第三方登录接入（腾讯qq、新浪微博）

#### php版本 - 2013-2014

1. 纯原生php实现
    1. 全站原生js完成`pjax`、评论
1. 基于 [CodeIgniter](http://www.codeigniter.com/) 重构

#### node版本 - 2014-至今

1. 基于 [thinkjs1.x](https://thinkjs.org/) 重构博客
    1. 自动`localStorage`缓存
    1. nginx重定向
1. 基于 [thinkjs2.x](https://thinkjs.org/) 重构博客
    1. nginx前置缓存
    1. nginx负载均衡
    1. nginx日志分析
1. 升级到 [firekylin](https://github.com/75team/firekylin) 
    1. 开启全站CDN - 20170408
    2. -