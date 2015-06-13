/**
 * 博客标签表模块
 * @author fe_xiaowu@gmail.com
 */
module.exports = Model(function() {
    'use strict';
    return {
        get: function(options) {
            var self = this,
                sql;

            //合并参数
            options = extend({
                page: 1,
                limit: 10,
                order: 'id DESC',
                isPage: false,
                cache: false,
                where: null,
                field: 'id, name, create_date, update_date, hit, url',
                one: false
            }, options || {});


            //查字段
            sql = self.field(options.field);

            //如果不是一个才查分页
            if (!options.one) {
                if (options.limit !== 'all') {
                    sql.page(options.page, options.limit);
                }

                sql.order(options.order);
            }


            //如果有附加条件
            if (options.where) {
                sql.where(options.where);
            }

            //是否开启缓存
            if (options.cache) {
                sql.cache(true);
            }


            //如果要查分页
            if (options.isPage) {
                return sql.countSelect({}, false);
            }

            //如果是单个模式返回 ｛｝， 否则返回 [{}]
            return options.one ? sql.find() : sql.select();
        }
    }
});