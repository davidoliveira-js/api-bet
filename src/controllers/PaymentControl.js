const Payment = require('../models/Payment');
const Plan = require('../models/Plan');
const User = require('../models/User');

const Gerencianet = require('../services/gerencianet/Gerencianet');

const GenericMsgs = require('../constants/GenericMsgs');
const {
  idValidate,
} = require('../middlewares/validation/GenericValidate');
const { convertCurrency } = require('../utils/Functions');

module.exports = {
  async store(req, res) {
    try {
      const { user_id } = req.params;
      const { plan_id } = req.body;

      if (!idValidate(user_id) || !idValidate(plan_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }

      const plan = await Plan.findByPk(plan_id);

      if (plan) {
        const amount = convertCurrency(plan.price);
        const reqGNAlready = await Gerencianet.GNRequest();
        const reqGN = await reqGNAlready;
        let dataCob = req.body.dataCob;

        dataCob.valor.original = `${amount}`;
        const cobResponse = await reqGN.post('v2/cob', dataCob);
        const qrcodeResponse = await reqGN.get(
          `/v2/loc/${cobResponse.data.loc.id}/qrcode`
        );

        const payment = await Payment.create({
          gn_cob_id: cobResponse.data.txid,
          user_id: user_id,
          plan_id: plan_id,
          amount: plan.price,
          status: 'PAGAMENTO PENDENTE',
          qrcode: qrcodeResponse.data.qrcode,
        });

        return res.json({
          success: true,
          return: {
            message: GenericMsgs.DataSuccessCreate,
            payment: payment,
          },
        });
      }
      return res.json({
        success: false,
        return: { message: GenericMsgs.StatusError },
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        return: { message: GenericMsgs.StatusError },
      });
    }
  },

  async index(req, res) {
    try {
      const payments = await Payment.findAll({});
      return res.json({
        success: true,
        return: {
          message: GenericMsgs.DataFound,
          data: payments,
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
      const { payment_id } = req.params;
      if (!idValidate(payment_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const payment = await Payment.findByPk(payment_id);
      return res.json({
        success: payment ? true : false,
        return: {
          message: payment
            ? GenericMsgs.DataFound
            : GenericMsgs.DataNotFound,
          data: payment ? payment : [],
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
      const { payment_id } = req.params;
      if (!idValidate(payment_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const payment = await Payment.destroy({
        where: { id: payment_id },
      });
      return res.json({
        success: payment ? true : false,
        return: {
          message: payment
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

  async pay(req, res) {
    try {
      const { user_id, payment_id } = req.params;
      if (!idValidate(user_id) || !idValidate(payment_id)) {
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.FieldError,
          },
        });
      }
      const payment = await Payment.findByPk(payment_id);
      if (payment) {
        if (payment.user_id == user_id) {
          const reqGNAlready = await Gerencianet.GNRequest();
          const reqGN = await reqGNAlready;
          const GnPayment = await reqGN.get(
            `/v2/cob/${payment.gn_cob_id}`
          );

          if (GnPayment.data.status == 'CONCLUIDA') {
            const plan = await Plan.findByPk(payment.plan_id);
            const user = await User.findByPk(payment.user_id);
            const paymentUpdate = await payment.update(
              { status: 'PAGAMENTO CONFIRMADO' },
              { where: { id: payment.id } }
            );
            const userUpdate = await User.update(
              { credits: (user.credits += plan.credits) },
              { where: { id: payment.user_id } }
            );

            return res.json({
              success: paymentUpdate && userUpdate ? true : false,
              return:
                paymentUpdate & userUpdate
                  ? {
                      message: GenericMsgs.PaymentSuccess,
                      data: {
                        username: user.username,
                        previusCredits: user.credits,
                        addedCredits: plan.credits,
                        actualCredits: user.credits + plan.credits,
                        plan: plan.description,
                      },
                    }
                  : { message: GenericMsgs.PaymentFailed },
            });
          }
          return res.json({
            success: false,
            return: {
              message: GenericMsgs.PaymentFailed,
            },
          });
        }
        return res.json({
          success: false,
          return: {
            message: GenericMsgs.StatusError,
          },
        });
      }
      return res.json({
        success: false,
        return: {
          message: GenericMsgs.StatusError,
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
