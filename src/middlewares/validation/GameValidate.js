const validator = require('validator');

module.exports = {
  gameValidate({ name, description, slug, price, reward }) {
    const nameValidate = validator.matches(
      name,
      '^[a-zA-Z0-9 ]{4,20}$'
    );
    const descriptionValidate = validator.matches(
      description,
      '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ .,:!]{10,200}$'
    );
    const slugValidate = validator.matches(slug, '^[A-Z0-9_]{5,20}$');
    const priceValidate = validator.isInt(price.toString(), {
      gt: 0,
      lt: 99999,
    });
    const rewardValidate = validator.isInt(reward.toString(), {
      gt: 0,
      lt: 99999,
    });
    return nameValidate &&
      descriptionValidate &&
      slugValidate &&
      priceValidate &&
      rewardValidate
      ? true
      : false;
  },
};
