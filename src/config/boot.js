const errorManager = require('../utils/ErrorManager');

module.exports = (app) => {
  app.use((error, req, res, next) => {
    errorManager(error, req, res, next);
  });

  app.listen(app.get('port'), () => {
    console.log(`Server running in port ${app.get('port')}`);
  });
};
