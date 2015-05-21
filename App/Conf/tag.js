'use strict';

module.exports = {
    app_begin: [function(http) { //会传递一个包装的http对象
        if (http.group !== 'Home') {
            return;
        }

        // 如果为手机端
        if (http.getHeader('user-agent').toLowerCase().match(/applewebkit.*mobile.*/)) {
            http.group = "Touch";
        }
    }]
}