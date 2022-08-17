const express = require('express');
const consign = require('consign');

const app = express();

consign()
  .include('/src/models/index.js')
  .then('/src/config/middlewares.js')
  .then('/src/routes')
  .then('/src/middlewares/authentication/AuthenticationStrategys.js')
  .then('/src/controllers')
  .then('./redis/BlackListAccessToken.js')
  .then('./redis/WhiteListRefreshToken.js')
  .then('/src/config/boot.js')
  .into(app);
