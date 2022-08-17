const BetControl = require('../controllers/BetControl');

module.exports = (app) => {
  app.get('/users/:user_id/bets/:bet_id', BetControl.findById);
  app.post('/users/:user_id/bets/create', BetControl.store);

  //admin
  app.get('/admin/:user_id/bets', BetControl.index);
  app.delete(
    '/admin/:user_id/bets/:bet_id/delete',
    BetControl.delete
  );
};
