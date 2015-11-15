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

});
