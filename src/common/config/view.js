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
                env.addFilter('elapsed', (date, str) => {
                    return Util.parseDate.elapsed(date, str);
                });
            }
        }
    }
};
