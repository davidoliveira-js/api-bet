const AccessControl = require('accesscontrol');
const accessControl = new AccessControl();

accessControl
  .grant('ADMIN')
  .readAny('user')
  .updateAny('user')
  .deleteAny('user');

accessControl
  .grant('USER')
  .readOwn('user')
  .updateOwn('user')
  .deleteOwn('user');

module.exports = accessControl;
