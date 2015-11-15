'use strict';

// 扩展blog基础
import Base from '../../common/controller/blog';

export default class extends Base {
    /**
     * 初始化
     *
     * @param  {Object} http http
     */
    init(http){
        super.init(http); //调用父类的init方法 
    }

    /**
     * 设置当前位置
     *
     * @param {Object} data 数据 {url, name}
     */
    setLocation(...data) {
        let arr = [
            {
                url: '/',
                name: '主页'
            }
        ];

        arr.push(...data);

        arr = arr.map((val) => val.url ? `<a href="${val.url}">${val.name}</a>` : val.name);

        this.assign('location_data', arr.join(' > '));
    }

    /**
     * 前置方法
     */
    async __before(){
        // 列表数据
        this.config('list', await this.model('list').getCacheList());

        // 默认的TDK
        this.assign('title', '前端小武--前端开发小武专注计算机基础和WEB前端开发知识');
        this.assign('keywords', '前端小武  谢耀武  小武  计算机基础   前端开发');
        this.assign('description', '谢耀武，网名前端小武，喜欢各种折腾, 喜欢研究源, 对美好的代码有极强的透视症, 崇尚有强烈技术氛围的UED...');

        // 列表数据设置到模板中
        this.assign('list_data', this.config('list'));

        // 最新文章
        this.assign('rand_tags_data', await this.model('tags').getCacheRandList());

        // 点击排行
        this.assign('search_hit_data', await this.model('search').getCacheHitTopList());
    }
}
