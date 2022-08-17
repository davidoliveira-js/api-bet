const validator = require('validator');
const GenericMsgs = require('../../constants/GenericMsgs');
const { InvalidArgumentError } = require('../../utils/Errors');

module.exports = {
  idValidate(id) {
    const idType = validator.isInt(id.toString(), {
      gt: 0,
      lt: 999999999,
    });

    if (!idType) {
      throw new InvalidArgumentError(GenericMsgs.FieldError);
    }
    return true;
  },

  numberBetsValidate(number) {
    const numberValidate = validator.isInt(number.toString(), {
      gt: 0,
      lt: 9999,
    });
    return numberValidate ? true : false;
  },

  textValidate(text) {
    const textValidate = validator.matches('^[\x20-\x7E]+');
    console.log(textValidate);
    if (!textValidate) {
      throw new InvalidArgumentError(GenericMsgs.FieldError);
    }
    return true;
  },
};
