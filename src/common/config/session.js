'use strict';

/**
 * session configs
 */
export default {
  name: 'thinkjs',
  type: 'db',
  secret: '!N71PV5J',
  timeout: 24 * 3600,
  cookie: { // cookie options
    length: 32,
    httponly: true
  },
};
