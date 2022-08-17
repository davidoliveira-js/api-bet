const Bet = require('../models/Bet');
const User = require('../models/User');
const Game = require('../models/Game');

const GenericMsgs = require('../constants/GenericMsgs');
const {
  idValidate,
  numberBetsValidate,
} = require('../middlewares/validation/GenericValidate');

module.exports = {
  async store(req, res) {
    try {
      const { user_id } = req.params;
      const { game_id, num_bets, won } = req.body;
      if (
        !idValidate(game_id) ||
        !idValidate(user_id) ||
        !numberBetsValidate(num_bets)
      ) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const user = await User.findByPk(user_id);
      const game = await Game.findByPk(game_id);
      if (user.credits >= game.price * num_bets) {
        if (won) {
          const reward = num_bets * game.reward;
          const userUpdateCredits = await User.update(
            {
              credits: (user.credits += reward),
            },
            {
              where: {
                id: user.id,
              },
            }
          );

          const bet = await Bet.create({
            user_id,
            game_id,
            num_bets,
            total_cost: game.price * num_bets,
            won,
            reward,
          });
          return res.json({
            success: userUpdateCredits[0] ? true : false,
            return: {
              message: userUpdateCredits[0]
                ? GenericMsgs.UserWonBet
                : GenericMsgs.DataFailedUpdate,
              data: userUpdateCredits
                ? {
                    betCost: num_bets * game.price,
                    reward: reward,
                  }
                : [],
            },
          });
        }
      }
      return res.json({
        success: false,
        return: {
          message: GenericMsgs.UserNoCredits,
        },
      });
    } catch (error) {
      return res.json({
        success: false,
        return: {
          message: GenericMsgs.StatusError,
        },
      });
    }
  },

  async index(req, res) {
    try {
      const bet = await Bet.findAll({});
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.DataFound,
          data: bet,
        },
      });
    } catch (error) {
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.StatusError,
          error,
        },
      });
    }
  },

  async findById(req, res) {
    try {
      const { bet_id } = req.params;
      if (!idValidate(bet_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const bet = await Bet.findByPk(bet_id, {});
      return res.json({
        success: bet ? true : false,
        return: {
          message: bet
            ? GenericMsgs.DataFound
            : GenericMsgs.DataNotFound,
          data: bet ? bet : [],
        },
      });
    } catch (error) {
      return res.json({
        success: false,
        return: {
          message: GenericMsgs.StatusError,
        },
      });
    }
  },

  /*

  async update(req, res) {
  },

  */

  async delete(req, res) {
    try {
      const { bet_id } = req.params;
      if (!idValidate(bet_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const bet = await Bet.destroy({ where: { id: bet_id } });
      return res.json({
        success: bet ? true : false,
        return: {
          message: bet
            ? GenericMsgs.DataSuccessDelete
            : GenericMsgs.DataFailedDelete,
        },
      });
    } catch (error) {
      return res.json({
        success: false,
        return: {
          message: GenericMsgs.StatusError,
        },
      });
    }
  },
};
