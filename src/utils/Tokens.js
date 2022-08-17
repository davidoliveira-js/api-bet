const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const moment = require('moment');
const GenericMsgs = require('../constants/GenericMsgs');

const verifyBlackListAccessToken = async (accessToken, blacklist) => {
  if (!blacklist) {
    return;
  }
  const containsAccessToken = await blacklist.containsAccessToken(
    accessToken
  );
  if (containsAccessToken) {
    throw new jwt.JsonWebTokenError(GenericMsgs.NotAuth);
  }
  return;
};

module.exports = {
  createAccessToken(user, [quantityUnit, timeUnit]) {
    const payload = { user };
    return (accsessToken = jwt.sign(
      {
        payload,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: quantityUnit + timeUnit }
    ));
  },

  async verifyAccessToken(accessToken, blackList) {
    await verifyBlackListAccessToken(accessToken, blackList);
    const { payload } = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY
    );
    return payload.user.id;
  },

  invalidateAccessToken(accessToken, blackList) {
    return blackList.addAccessToken(accessToken);
  },

  async createOpaqueToken(id, [quantityUnit, timeUnit], whiteList) {
    try {
      const opaqueToken = randomBytes(24).toString('hex');
      const expirationDate = moment()
        .add(quantityUnit, timeUnit)
        .unix();
      await whiteList.add(opaqueToken, id, expirationDate);
      return opaqueToken;
    } catch (error) {
      return false;
    }
  },
  async verifyOpaqueToken(refreshToken, whiteList) {
    if (!refreshToken) {
      return false;
    }
    const id = await whiteList.getValue(refreshToken);
    if (!id) {
      return false;
    }
    return id;
  },

  async invalidateOpaqueToken(refreshToken, whiteList) {
    await whiteList.delele(refreshToken);
  },

  createEmailVerifyToken(id, [quantityUnit, timeUnit]) {
    return this.createAccessToken({ id: id }, [
      quantityUnit,
      timeUnit,
    ]);
  },
  async verifyEmailVerifyToken(token) {
    const id = this.verifyAccessToken(token, undefined);
    return id;
  },
};
