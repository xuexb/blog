/**
 * 主页
 * @author xieliang
 */
(function() {
    'use strict';

    /**
     * 每个功能为一个fn
     * @type {Object}
     */
    var App = {};

    /**
     * 列表分页对象，使用ajaxpage.js生成
     */
    App.Ajax = null;

    /**
     * 初始化
     */
    App.init = function() {
        var data = {};

        data.key = $('#J-key').val() || '';

        data.list_id = $('.topbar-sort-more .current').eq(0).data('id') || 0;

        App.Ajax = new AjaxPage({
            url: '/api/index',
            data: data,
            elem: '#J-list', //列表元素ul
            empty: function() {
                App.Ajax.$loading.text(App.Ajax.config('page') === 1 ? '没有文章!' : '亲，看完了！');
                return false;
            }
        });

        //排序
        App.sort();

        //搜索
        App.search();
    }

    /**
     * 搜索
     */
    App.search = function() {
        var $search = $('#J-search'),
            $key = $search.find('.key');

        $key.on('focus', function() {
            $search.addClass('is-text is-focus');
        }).on('blur mm', function() {
            if (!this.value) {
                $search.removeClass('is-text');
            }
            $search.removeClass('is-focus');
        });

        // 绑定点击取消按钮
        $search.find('.ui-search-btn').on('touchstart', function(event) {
            var list_id = App.Ajax.config('data').list_id || 0;
            if (!$search.hasClass('is-focus')) { //如果在页面上点击取消则需要重置ajax列表
                App.Ajax.config('data', null).config('data', {
                    list_id: list_id
                }).config('page', 0).empty().reset();
            }

            $key.val('').blur().trigger('mm'); //清空文本框，并触发逻辑状态
            event.preventDefault();
        });

        //绑定搜索
        $search.find('form').on('submit', function() {
            var key = $.trim($key.val());

            if (key) {
                App.Ajax.config('data', {
                    key: key
                }).config('page', 0).empty().reset();

                $key.blur();
            }

            return false;
        });
    }

    /**
     * 排序，会追加以前的条件，比如搜索后排序
     */
    App.sort = function() {
        var $topbar = $('#J-topbar');

        $topbar.find('.topbar-sort').on('tap', function() {
            $topbar.toggleClass('show-sort');
        });
        $topbar.find('.topbar-sort-mask').on('touchstart', function(event) {
            event.preventDefault();
        }).on('tap', function() {
            $topbar.removeClass('show-sort');
        });

        //这里是点击排序时
        $topbar.find('.topbar-sort-more').on('tap', 'li', function() {
            //高亮
            $(this).addClass('current').siblings().removeClass('current');

            //隐藏
            $topbar.removeClass('show-sort');

            $topbar.find('h1').text($(this).text());

            App.Ajax.config('data', {
                list_id: $(this).data('id') || 0
            }).config('page', 0).empty().reset();

            return false;
        }).on('touchstart', function(event) {
            event.preventDefault();
        });
    }

    App.init();
})();