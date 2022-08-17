const UserControl = require('../controllers/UserControl');
const AuthenticationMiddlewares = require('../middlewares/authentication/AuthenticationMiddlewares');
const Authorization = require('../middlewares/authorization/Authorization');
const authorization = require('../middlewares/authorization/Authorization');

module.exports = (app) => {
  app.post('/users/create', UserControl.store);

  app.get(
    '/users/verify_email/:token',
    AuthenticationMiddlewares.emailVerify,
    UserControl.verifyEmail
  );

  app.get(
    '/users/:user_id',
    [AuthenticationMiddlewares.bearer, authorization('user', 'read')],
    UserControl.findById
  );

  app.put(
    '/users/:user_id/update',
    [
      AuthenticationMiddlewares.bearer,
      Authorization('user', 'update'),
    ],
    UserControl.update
  );

  app.delete(
    '/users/:user_id/delete',
    [
      AuthenticationMiddlewares.bearer,
      AuthenticationMiddlewares.local,
      Authorization('user', 'delete'),
    ],
    UserControl.delete
  );

  app.post(
    '/auth',
    AuthenticationMiddlewares.local,
    UserControl.login
  );

  app.post(
    '/users/refresh_token',
    AuthenticationMiddlewares.refresh,
    UserControl.login
  );

  app.post(
    '/users/:user_id/logout',
    [
      AuthenticationMiddlewares.refresh,
      AuthenticationMiddlewares.bearer,
    ],
    UserControl.logout
  );

  //admin
  app.get(
    '/admin/:user_id/users',
    [AuthenticationMiddlewares.bearer, authorization('user', 'read')],
    UserControl.index
  );
};
