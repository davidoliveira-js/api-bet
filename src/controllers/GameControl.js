const Game = require('../models/Game');
const GenericMsgs = require('../constants/GenericMsgs');

const {
  idValidate,
} = require('../middlewares/validation/GenericValidate');

const {
  gameValidate,
} = require('../middlewares/validation/GameValidate');

module.exports = {
  async store(req, res) {
    try {
      const { name, description, slug, price, reward } = req.body;
      if (!gameValidate({ name, description, slug, price, reward })) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const game = await Game.create({
        name,
        description,
        slug,
        price,
        reward,
      });
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.DataSuccessCreate,
          data: game,
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
      const games = await Game.findAll({});
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.DataFound,
          data: games,
        },
      });
    } catch (error) {
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.StatusError,
        },
      });
    }
  },

  async findById(req, res) {
    try {
      const { game_id } = req.params;
      if (!idValidate(game_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const game = await Game.findByPk(game_id, {
        attributes: ['id', 'name', 'description', 'price'],
      });
      return res.json({
        success: game ? true : false,
        return: {
          message: game
            ? GenericMsgs.DataFound
            : GenericMsgs.DataNotFound,
          data: game ? game : [],
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

  async update(req, res) {
    try {
      const { game_id } = req.params;
      const { name, description, slug, price, reward } = req.body;
      if (
        !gameValidate({ name, description, slug, price, reward }) ||
        !idValidate(game_id)
      ) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const game = await Game.update(
        {
          name,
          description,
          slug,
          price,
        },
        { where: { id: game_id } }
      );

      return res.json({
        success: game[0] ? true : false,
        return: {
          message: game[0]
            ? GenericMsgs.DataSuccessUpdate
            : GenericMsgs.DataFailedUpdate,
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

  async delete(req, res) {
    try {
      const { game_id } = req.params;
      if (!idValidate(game_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const game = await Game.destroy({ where: { id: game_id } });
      return res.json({
        success: game ? true : false,
        return: {
          message: game
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
