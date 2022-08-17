const redis = require('redis');
const blacklist = redis.createClient({
  prefix: 'blacklist-access-token:',
});
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

const listManipulator = require('./ListManipulator');
const blackListManipulator = listManipulator(blacklist);

const generateHashedAccessToken = (accessToken) => {
  return createHash('sha256').update(accessToken).digest('hex');
};

module.exports = {
  addAccessToken: async (accessToken) => {
    try {
      const expirationDate = jwt.decode(accessToken).exp;
      const hashedAccessToken =
        generateHashedAccessToken(accessToken);
      return await blackListManipulator.add(
        hashedAccessToken,
        '',
        expirationDate
      );
    } catch (error) {
      return false;
    }
  },
  containsAccessToken: async (accessToken) => {
    try {
      const hashedAccessToken =
        generateHashedAccessToken(accessToken);
      return blackListManipulator.contains(hashedAccessToken);
    } catch (error) {
      return false;
    }
  },
};
