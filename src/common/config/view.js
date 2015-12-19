'use strict';

import Util from '../util';

/**
 * template config
 */
export default {
    type: "nunjucks",
    root_path: think.ROOT_PATH + '/view',
    adapter: {
        nunjucks: {
            prerender: function (nunjucks, env) {
                // 美化时间
                env.addFilter('elapsed', (date, str) => {
                    return Util.parseDate.elapsed(date, str);
                });

                // 日期格式化
                env.addFilter('format', (date, str) => {
                    return Util.parseDate.format(date, str);
                });
            }
        }
    }
};
