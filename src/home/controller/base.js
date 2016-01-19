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

        // 添加thinkjs当前版本变量，在foot copyright里使用
        this.assign('think_version', think.version);
    }

    /**
     * 设置当前位置
     *
     * @param {Object} data 数据 {url, name}
     */
    set_location(...data) {
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
     * 设置导航类型
     *
     * @param {string} type 大类型
     * @param {number} id   小类id
     */
    set_nav_type(type, id = null) {
        this.assign('nav_type', type);

        if (id) {
            this.assign('nav_type_id', id);
        }
    }

    /**
     * 前置方法
     */
    async __before(http){
        // 布局
        let auto = this.get('auto');
        if (auto) {
            this.cookie('auto', auto);
        }
        this.assign('auto', auto || this.cookie('auto'));

        this.set_nav_type('home');

        // 列表数据
        this.config('list_data', await this.model('list').getCacheList());

        // 默认的title
        this.assign('title', '前端小武--前端开发小武专注计算机基础和WEB前端开发知识');

        // 列表数据设置到模板中
        this.assign('list_data', this.config('list_data'));

        // 随机标签
        this.assign('rand_tags_data', await this.model('tags').getCacheRandList());

        // 点击排行
        this.assign('search_hit_data', await this.model('search').getCacheHitTopList());
    }
}
