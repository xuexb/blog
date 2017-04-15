/**
 * @file 前台base主控制器
 * @author xuexb <fe.xiaowu@gmail.com>
 */

export default class extends think.controller.base {

    /**
     * init
     * @param  {[type]} http [description]
     * @return {[type]}      [description]
     */
    init(http) {
        super.init(http);
    }

    /**
     * some base method in here
     */
    async __before() {
        let model = this.model('options');
        let options = await model.getOptions();
        this.options = options;
        this.assign('options', options);

        // 网站地址
        let siteUrl = this.options.site_url;
        if (!siteUrl) {
            siteUrl = 'http://' + this.http.host;
        }
        this.assign('site_url', siteUrl);

        let {navigation, themeConfig} = this.options;
        try {
            navigation = JSON.parse(navigation);
        }
        catch (e) {
            navigation = [];
        }
        try {
            themeConfig = JSON.parse(themeConfig);
        }
        catch (e) {
            themeConfig = {};
        }

        this.assign('navigation', navigation);
        this.assign('themeConfig', themeConfig);

        // 所有的分类
        let categories = await this.model('cate').getCateArchive();
        this.assign('categories', categories);

        this.assign('currentYear', (new Date()).getFullYear());
    }
}
