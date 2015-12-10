/**
 * @file 前端小武博客移动端js
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

(function () {
    'use strict';

    var loading = false;
    var page = 1;
    var empty = false;

    var load = function (type) {
        if (loading || empty) {
            return;
        }

        if (type === 'append') {
            page += 1;
        }
        else {
            page = 1;
        }

        // 设置flag
        loading = true;

        $.ajax({
            type: 'POST',
            data: {
                page: page
            },
            dataType: 'json',
            complete: function () {
                loading = false;
                $.hideIndicator();
            },
            success: function (res) {
                var html;
                if (!res || !res.data || !res.data.length) {
                    $.detachInfiniteScroll('.infinite-scroll');
                    $.attachInfiniteScroll('.infinite-scroll');
                    $('.infinite-scroll-preloader').remove();
                    empty = true;
                    return;
                }

                html = '';
                $.each(res.data, function (index, val) {
                    html += '<li class="item-content">';
                    html += '<div class="item-inner">';
                    html += '<a class="item-title" href="/html/' + (val.url || val.id) + '.html">' + val.title + '</a>';
                    html += '</div>';
                    html += '</li>';
                });
                if (type !== 'append') {
                    $('.list-container').empty();
                }

                $('.list-container').append(html);
                $.refreshScroller();
            },
            error: function () {
                $.toast('加载失败');
            }
        });
    };

    $(document).on('infinite', '.infinite-scroll', function () {
        load('append');
    });

    // 添加'refresh'监听器
    $(document).on('refresh', '.pull-to-refresh-content', function (e) {
        $.showIndicator();
        setTimeout(function () {
            empty = false;
            load();
            $.pullToRefreshDone('.pull-to-refresh-content');
        }, 1000);
    });

    $(window).on('load', function () {
        $('#J-form').on('submit', function () {
            var key = $('#J-search').val().trim();
            if (key) {
                $.router.loadPage('?key=' + key);
                $('#J-search').blur();
            }

            return false;
        });
    });

})();

$.init();
