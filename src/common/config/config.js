'use strict';
/**
 * config
 */
export default {
    tatic_prefix: '/static/',
    static_type: 'src/',
    get_static: function get_static(path) {
        return this.static_prefix + this.static_type + path;
    }
};
