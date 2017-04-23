# 前端小武博客

基于 [firekylin](https://github.com/firekylin/firekylin) 上扩展开发搭建，服务器运行于阿里云，域名为 [xuexb.com](https://xuexb.com/)。

### 进度

- [x] 前端样式编译: ls、压缩 - 使用`npm run build`产出`/output/`运行时文件
- [x] 打包上线流程 - 线上在`blog.src`编译后, 把`blog.src/output`复制到`blog`里, 执行`npm i --product`安装线上依赖
- [ ] nginx缓存的设置: 过期时间、反向代理缓存、Etag、清除缓存
- [x] MIP页开发
- [x] AMP页开发
- [ ] PWA
- [ ] 主动推送Google Analytics
- [ ] 应用Elasticsearch做站内切词搜索: 搜索摘要、搜索词高亮
- [x] Webp图片优化

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
1. 基于 [firekylin](https://github.com/75team/firekylin)  扩展, 有diff的点:
    1. 开始 `admin.xuexb.com` 后台二级地址, 修改后台的异步接口链接 - <https://github.com/xuexb/blog/commit/a5e94f6fe1f97a88725c0a037e265a91054196e6>
    2. 模板迁移到 `/view/home/` 内 - <https://github.com/xuexb/blog/commit/8e4c42fe3b6fee5e88de18e77abcaa1cb0626134>
    3. 前端样式迁移到 `/www/static/home/` 内, 后台样式迁移到 `/www/static/admin/` 内 - <https://github.com/xuexb/blog/commit/8e4c42fe3b6fee5e88de18e77abcaa1cb0626134>
    4. 废弃合作者投稿功能 - <https://github.com/xuexb/blog/commit/8e4c42fe3b6fee5e88de18e77abcaa1cb0626134#diff-46b1eac03dd592fd52fe74b5d12833fe>
    5. 废弃 `/post/*.json` 返回`JSON`数据接口 - <https://github.com/xuexb/blog/commit/8e4c42fe3b6fee5e88de18e77abcaa1cb0626134#diff-994ceef3d30bf80450c58b926d132b4e>
    6. 错误请求时(如404), 设置 http 状态码 - <https://github.com/xuexb/blog/commit/8e4c42fe3b6fee5e88de18e77abcaa1cb0626134#diff-af08c97c810131e3004e1780fa8c453d>
    7. 修改文章表格在小窗口时左右间距 - <https://github.com/xuexb/blog/commit/17e39fe38dc1e890d8f8ef8c2f364d28e8aaba9f#diff-4c41888d6f3998ce8a69f2e3c6e3e4ae>
    8. 支持MIP, AMP - <https://github.com/xuexb/blog/commit/28f831b4bfb5333f85fa4814a1347de98c45d77f>
    9. 支持图片自适应, 添加上传后图片宽高的属性 - <https://github.com/xuexb/blog/commit/67c0341872904983f902ed3f9c8f9884c947ccde>
    10. 支持Webp图片适配 - <https://github.com/xuexb/blog/pull/54>
    11. 支持`*.md`访问原markdown内容 - <https://github.com/xuexb/blog/pull/52>
