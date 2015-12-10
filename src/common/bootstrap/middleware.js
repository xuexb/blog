'use strict';

import compress from 'think-compress-html';
import ls from 'think-ls';

think.middleware('think-compress-html', compress);
think.middleware('think-ls', ls);

think.middleware('think-auto-mobile', http => {
    console.log(http.module, '这', think.module, think.mode);

    if (http.module !== 'home') {
        return;
    }


    // 如果为手机端
    if (http.header('user-agent').toLowerCase().match(/applewebkit.*mobile.*/)) {
        http.module = 'wise';
    } 
});