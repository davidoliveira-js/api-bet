const redis = require('redis');
const ListManipulator = require('./ListManipulator');
const whiteList = redis.createClient({
  prefix: 'WhiteListRefreshToken:',
});

module.exports = ListManipulator(whiteList);
