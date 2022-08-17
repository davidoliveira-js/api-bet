const validator = require('validator');

module.exports = {
  planValidate({
    name,
    description,
    slug,
    price,
    credits,
    expirationDays,
  }) {
    const nameValidate = validator.matches(name, '^[a-zA-Z0-9 ]*$');
    const descriptionValidate = validator.matches(
      description,
      '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ .,:!]*$'
    );
    const slugValidate = validator.matches(slug, '^[A-Z0-9_]*$');
    const priceValidate = validator.isInt(price.toString(), {
      gt: 0,
      lt: 99999,
    });
    const creditsValidate = validator.isInt(credits.toString(), {
      gt: 0,
      lt: 999999999,
    });
    const expirationDaysValidate = validator.isInt(
      expirationDays.toString(),
      {
        gt: 0,
        lt: 999999999,
      }
    );

    return nameValidate &&
      descriptionValidate &&
      slugValidate &&
      priceValidate &&
      creditsValidate &&
      expirationDaysValidate
      ? true
      : false;
  },
};
