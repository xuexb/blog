/**
 * @file mip-base控制器
 * @author xuexb <fe.xiaowu@gmail.com>
 */

import Base from '../../common/controller/base';

export default class extends Base {

    /**
     * 初始化
     *
     * @param  {Object} http http对象
     */
    init(http) {
        super.init(http);
    }

    /**
     * 前置方法
     */
    async __before() {
        await super.__before();
    }
}
