import Alt from 'alt';
var alt = new Alt();

if (NODE_ENV == 'development') {
  // Alt debug toolbar https://github.com/goatslacker/alt-devtool
  let chromeDebug = require('alt/utils/chromeDebug');
  chromeDebug(alt)
}

export default alt;
