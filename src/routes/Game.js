const GameControl = require('../controllers/GameControl');

module.exports = (app) => {
  app.get('/games', GameControl.index);
  app.get('/games/:game_id', GameControl.findById);

  //admin
  app.post('/admin/:user_id/games/create', GameControl.store);
  app.put(
    '/admin/:user_id/games/:game_id/update',
    GameControl.update
  );
  app.delete(
    '/admin/:user_id/games/:game_id/delete',
    GameControl.delete
  );
};
