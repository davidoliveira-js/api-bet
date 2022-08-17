const { promisify } = require('util');

module.exports = (list) => {
  const setAsync = promisify(list.set).bind(list);
  const existsAsync = promisify(list.exists).bind(list);
  const getAsync = promisify(list.get).bind(list);
  const delAsync = promisify(list.del).bind(list);

  return {
    async add(key, value, expirationDate) {
      try {
        const result = await setAsync(key, value);
        list.expireat(key, expirationDate);
        return result === 'OK';
      } catch (error) {
        return false;
      }
    },

    async getValue(key) {
      try {
        return getAsync(key);
      } catch (error) {
        return false;
      }
    },

    async contains(key) {
      try {
        return await existsAsync(key);
      } catch (error) {
        return false;
      }
    },

    async delele(key) {
      try {
        return await delAsync(key);
      } catch (error) {
        return false;
      }
    },
  };
};
