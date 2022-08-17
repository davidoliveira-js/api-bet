const Plan = require('../models/Plan');
const GenericMsgs = require('../constants/GenericMsgs');
const {
  planValidate,
} = require('../middlewares/validation/PlanValidate');
const {
  idValidate,
} = require('../middlewares/validation/GenericValidate');

module.exports = {
  async store(req, res) {
    try {
      const {
        name,
        description,
        slug,
        price,
        credits,
        expirationDays,
      } = req.body;

      if (
        !planValidate({
          name,
          description,
          slug,
          price,
          credits,
          expirationDays,
        })
      ) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const plan = await Plan.create({
        name,
        description,
        slug,
        price,
        credits,
        expirationDays,
      });
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.DataSuccessCreate,
          data: plan,
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
      const plans = await Plan.findAll({
        attributes: [
          'id',
          'name',
          'description',
          'price',
          'credits',
          'expiration_days',
        ],
      });
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.DataFound,
          data: plans,
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
      const { plan_id } = req.params;
      if (!idValidate(plan_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const plan = await Plan.findByPk(plan_id, {
        attributes: [
          'id',
          'name',
          'description',
          'price',
          'credits',
          'expiration_days',
        ],
      });
      return res.json({
        success: plan ? true : false,
        return: {
          message: plan
            ? GenericMsgs.DataFound
            : GenericMsgs.DataNotFound,
          data: plan ? plan : [],
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
      const { plan_id } = req.params;
      const {
        name,
        description,
        slug,
        price,
        credits,
        expirationDays,
      } = req.body;

      if (
        !planValidate({
          name,
          description,
          slug,
          price,
          credits,
          expirationDays,
        })
      ) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }

      const plan = await Plan.update(
        {
          name,
          description,
          slug,
          price,
          credits,
          expirationDays,
        },
        { where: { id: plan_id } }
      );

      return res.json({
        success: plan[0] ? true : false,
        return: {
          message: plan[0]
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
      const { plan_id } = req.params;
      if (!idValidate(plan_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const plan = await Plan.destroy({ where: { id: plan_id } });
      return res.json({
        success: plan ? true : false,
        return: {
          message: plan
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
