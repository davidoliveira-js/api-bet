const PaymentControl = require('../controllers/PaymentControl');

module.exports = (app) => {
  app.get(
    '/users/:user_id/payments/:payment_id',
    PaymentControl.findById
  );
  app.post('/users/:user_id/payments/create', PaymentControl.store);
  app.get(
    '/users/:user_id/payments/:payment_id/pay',
    PaymentControl.pay
  );

  //admin
  app.get('/admin/:user_id/payments', PaymentControl.index);
  app.delete(
    '/admin/:user_id/payments/:payment_id/delete',
    PaymentControl.delete
  );
};
