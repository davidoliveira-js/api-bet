const {
  InvalidArgumentError,
  NotFound,
  NotAuthenticated,
  EmailFailedVerify,
  NotAuthorized,
} = require('../utils/Errors');
const {
  JsonWebTokenError,
  TokenExpiredError,
} = require('jsonwebtoken');
const GenericMsgs = require('../constants/GenericMsgs');

const errorManager = (error, req, res, next) => {
  let status = 500;
  let body = {
    success: false,
    return: { message: GenericMsgs.StatusError },
  };

  if (error instanceof InvalidArgumentError) {
    status = 400;
    body.return.message = GenericMsgs.FieldError;
  }

  if (
    error instanceof JsonWebTokenError ||
    error instanceof TokenExpiredError
  ) {
    status = 401;
    body.return.message = GenericMsgs.NotAuth;
  }
  if (error instanceof NotAuthenticated) {
    status = 401;
    body.return.message = error.message;
  }
  if (error instanceof NotAuthorized) {
    status = 403;
    body.return.message = error.message;
  }

  if (error instanceof NotFound) {
    status = 404;
    body.return.message = GenericMsgs.DataNotFound;
  }

  if (error instanceof EmailFailedVerify) {
    status = 404;
    body.return.message = error.message;
  }

  res.status(status);
  res.json(body);

  return next();
};

module.exports = errorManager;
