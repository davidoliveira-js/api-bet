const passport = require('passport');
const GenericMsgs = require('../../constants/GenericMsgs');
const User = require('../../models/User');
const whiteListRefreshToken = require('../../../redis/WhiteListRefreshToken');
const tokens = require('../../utils/Tokens');
const BlackListAccessToken = require('../../../redis/BlackListAccessToken');

module.exports = {
  local(req, res, next) {
    passport.authenticate(
      'local',
      { session: false },
      (error, user, info) => {
        if (error) {
          next(error);
        }
        req.user = user;
        return next();
      }
    )(req, res, next);
  },

  bearer(req, res, next) {
    passport.authenticate(
      'bearer',
      { session: false },
      (error, user, info) => {
        if (error) {
          return next(error);
        }

        req.accessToken = info.accessToken;
        req.user = user;
        return next();
      }
    )(req, res, next);
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const id = await tokens.verifyOpaqueToken(
        refreshToken,
        whiteListRefreshToken
      );
      if (!id) {
        return res.status(401).json({
          success: false,
          return: { message: GenericMsgs.NotAuth },
        });
      }
      await tokens.invalidateOpaqueToken(
        refreshToken,
        whiteListRefreshToken
      );
      await tokens.invalidateAccessToken(
        refreshToken,
        BlackListAccessToken
      );
      req.user = await User.findByPk(id);
      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        return: { message: GenericMsgs.StatusError },
      });
    }
  },

  async emailVerify(req, res, next) {
    try {
      const { token } = req.params;
      const id = await tokens.verifyEmailVerifyToken(token);
      const user = await User.findByPk(id);
      req.user = user;
      return next();
    } catch (error) {
      next(error);
    }
  },
};
