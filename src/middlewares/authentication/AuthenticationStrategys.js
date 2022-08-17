const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const bcrypt = require('bcryptjs');
const tokens = require('../../utils/Tokens');
const GenericMsgs = require('../../constants/GenericMsgs');
const User = require('../../models/User');
const BlackListAccessToken = require('../../../redis/BlackListAccessToken');
const { NotAuthenticated } = require('../../utils/Errors');
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({
          where: { username: username },
        });

        if (!user) {
          throw new NotAuthenticated(GenericMsgs.IncorrectLogin);
        }
        const passwordValidation = await bcrypt.compare(
          password,
          user.password
        );
        if (!passwordValidation) {
          throw new NotAuthenticated(GenericMsgs.IncorrectLogin);
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (accessToken, done) => {
    try {
      const id = await tokens.verifyAccessToken(
        accessToken,
        BlackListAccessToken
      );
      const user = await User.findByPk(id, {
        attributes: ['id', 'email', 'username', 'role'],
      });
      done(null, user, { accessToken });
    } catch (error) {
      done(error);
    }
  })
);

module.exports = passport;
