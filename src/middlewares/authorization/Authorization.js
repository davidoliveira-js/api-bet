const accessControl = require('../../accesscontrol/accessControl');

const methods = {
  read: {
    any: 'readAny',
    own: 'readOwn',
  },
  create: {
    any: 'createAny',
    own: 'createOwn',
  },
  delete: {
    any: 'deleteAny',
    own: 'deleteOwn',
  },
  update: {
    any: 'updateAny',
    own: 'updateOwn',
  },
};

module.exports = (entity, action) => (req, res, next) => {
  if (
    req.user.role === 'USER' &&
    action === 'delete' &&
    req.user.id != req.params.user_id
  ) {
    console.log('id diferente');
    res.status(403).end();
    return;
  }

  const rolePermissions = accessControl.can(req.user.role);
  const actions = methods[action];
  const permissionAny = rolePermissions[actions.any](entity);
  const permissioOwn = rolePermissions[actions.own](entity);

  if (
    permissionAny.granted === false &&
    permissioOwn.granted === false
  ) {
    console.log('rota bloqueada');
    res.status(403).end();
    return;
  }

  req.access = {
    any: {
      allowed: permissionAny.granted,
      attributes: permissionAny.attributes,
    },
    own: {
      allowed: permissioOwn.granted,
      attributes: permissioOwn.attributes,
    },
  };

  next();
};
