const User = require('../models/User');
const genericMsgs = require('../constants/GenericMsgs');
const bcrypt = require('bcryptjs');
const blackListAccessToken = require('../../redis/BlackListAccessToken');
const tokens = require('../utils/Tokens');
const whiteListRefreshToken = require('../../redis/WhiteListRefreshToken');
const emails = require('../utils/Emails');
const {
  NotFound,
  InternalServerError,
  EmailFailedVerify,
  DataFailedUpdate,
  NotAuthorized,
  InvalidArgumentError,
} = require('../utils/Errors');

const {
  usernameValidate,
  passwordValidate,
} = require('../middlewares/validation/UserValidate');
const {
  idValidate,
} = require('../middlewares/validation/genericValidate');
const GenericMsgs = require('../constants/GenericMsgs');

function generateAddress(route, token) {
  const baseURL = process.env.BASE_URL;
  return `${baseURL}${route}${token}`;
}

module.exports = {
  async store(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const hash = await bcrypt.hash(password, 12);
      const user = await User.create({
        email,
        username,
        password: hash,
      });
      const token = tokens.createEmailVerifyToken(user.id, [1, 'h']);
      const address = generateAddress('/users/verify_email/', token);
      console.log(address);
      emails.sendEmail(user.email, address).catch(console.log);

      return res.json({
        success: true,
        return: {
          message: genericMsgs.DataSuccessCreate,
          data: user,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const user_id = req.user.id;
      const user = await User.findByPk(user_id);
      if (user && user.email_verified == false) {
        const userUpdate = await User.update(
          { email_verified: true },
          { where: { id: user_id } }
        );

        if (!userUpdate[0]) {
          throw new EmailFailedVerify(GenericMsgs.EmailFailedVerify);
        }

        return res.json({
          success: true,
          return: {
            message: genericMsgs.EmailVerifiedSuccess,
          },
        });
      }
      throw new EmailFailedVerify(GenericMsgs.EmailAlreadyVerified);
    } catch (error) {
      next(error);
    }
  },

  async index(req, res, next) {
    try {
      if (!req.access.any.allowed) {
        throw new NotAuthorized(GenericMsgs.NotAuth);
      }
      const users = await User.findAll({});
      return res.json({
        success: true,
        return: {
          message: genericMsgs.DataFound,
          data: users,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      let user_id;
      if (req.access.any.allowed) {
        user_id = req.params.user_id;
      } else if (
        req.access.own.allowed &&
        req.user.id == req.params.user_id
      ) {
        user_id = req.params.user_id;
      } else {
        throw new NotFound(GenericMsgs.DataNotFound);
      }

      idValidate(user_id);

      const user = await User.findByPk(user_id);
      if (!user) {
        throw new NotFound(GenericMsgs.DataNotFound);
      }

      return res.json({
        success: true,
        return: {
          message: genericMsgs.DataFound,
          data: user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      let user;
      if (req.access.any.allowed) {
        const { user_id } = req.params;
        const {
          email,
          username,
          email_verified,
          role,
          have_plan,
          plan_id,
          credits,
        } = req.body;
        user = await User.update(
          {
            email: email,
            username: username,
            email_verified: email_verified,
            role: role,
            have_plan: have_plan,
            plan_id: plan_id,
            credits: credits,
          },
          {
            where: {
              id: user_id,
            },
          }
        );
      } else if (
        req.access.own.allowed &&
        req.user.id == req.params.user_id &&
        Object.keys(req.body).length === 1
      ) {
        const { user_id } = req.params;
        const { username } = req.body;
        user = await User.update(
          {
            username: username,
          },
          {
            where: {
              id: user_id,
            },
          }
        );
      } else {
        throw new NotAuthorized(GenericMsgs.NotAuth);
      }

      if (!user[0]) {
        throw new InvalidArgumentError(GenericMsgs.FieldError);
      }
      return res.json({
        success: true,
        return: {
          message: genericMsgs.DataSuccessUpdate,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    let user_id;
    try {
      if (req.access.any.allowed === true) {
        user_id = req.params.user_id;
      } else if (
        req.access.own.allowed === true &&
        req.user.id == req.params.user_id
      ) {
        user_id = req.user.id;
      }
      console.log('id ', user_id);
      const user = await User.destroy({ where: { id: user_id } });
      if (!user) {
        throw new InvalidArgumentError(GenericMsgs.DataFailedDelete);
      }
      return res.json({
        success: true,
        return: { message: GenericMsgs.DataSuccessDelete },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const accessToken = tokens.createAccessToken(
        { id: req.user.id, role: req.user.role },
        [5, 'h']
      );
      const refreshToken = await tokens.createOpaqueToken(
        req.user.id,
        [5, 'd'],
        whiteListRefreshToken
      );
      res.set('Authorization', accessToken);
      return res.status(200).json({
        success: true,
        return: {
          message: genericMsgs.UserSuccessLogin,
          data: {
            user: {
              username: req.user.username,
            },
            accessToken,
            refreshToken,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const accessToken = req.accessToken;
      const result = await tokens.invalidateAccessToken(
        accessToken,
        blackListAccessToken
      );

      if (!result) {
        throw new InternalServerError(GenericMsgs.StatusError);
      }

      return res.status(200).json({
        success: true,
        return: { message: genericMsgs.UserLogout },
      });
    } catch (error) {
      next(error);
    }
  },
};
