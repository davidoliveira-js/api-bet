const bodyParser = require('body-parser');

module.exports = (app) => {
  app.set('port', 7880);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};
