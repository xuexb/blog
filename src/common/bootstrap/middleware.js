'use strict';

import compress from 'think-compress-html';
import ls from 'think-ls';

think.middleware('think-compress-html', compress);
think.middleware('think-ls', ls);
