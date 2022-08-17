function InvalidArgumentError(message) {
  this.name = 'InvalidArgumentError';
  this.message = message;
}
function InternalServerError(message) {
  this.name = 'InternalServerError';
  this.message = message;
}

function NotFound(message) {
  this.name = 'NotFound';
  this.message = message;
}

function NotAuthenticated(message) {
  this.name = 'NotAuthenticated';
  this.message = message;
}

function NotAuthorized(message) {
  this.name = 'NotAuthorized';
  this.message = message;
}

function EmailFailedVerify(message) {
  this.name = 'EmailFailedVerify';
  this.message = message;
}

function DataFailedUpdate(message) {
  this.name = 'DataFailedUpdate';
  this.message = message;
}

module.exports = {
  InvalidArgumentError,
  EmailFailedVerify,
  NotFound,
  NotAuthenticated,
  NotAuthorized,
  InternalServerError,
  DataFailedUpdate,
};
