/**
 * @file 编辑文章
 * @author xiaowu
 */

define(function (require) {
    var $ = require('../common/jquery');
    // 选中标签
    $('.mod-form-tags').on('click', 'label', function () {
        $(this).toggleClass('checked');
    });

    var xhr = null;
    var timer = null;
    $('#J-title').on('input propertychange', function(){
        if (xhr) {
            xhr.abort();
        }

        clearTimeout(timer);

        timer = setTimeout(function(){
            xhr = $.ajax({
                type: 'POST',
                url: '/admin/transliteration',
                dataType: 'json',
                data: {
                    word: $('#J-title').val()
                },
                success: function(res){
                    if (!res.errcode) {
                        $('#J-url').val(res.url);
                    }
                },
                compile: function(){
                    xhr = null;
                }
            });
        }, 500);
    });
});
