/**
 * @file hook配置
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

export default {
    route_parse: ['append', 'think-auto-mobile'],
    view_filter: ['prepend', 'think-ls'],
    view_parse: ['append', 'think-compress-html']
}