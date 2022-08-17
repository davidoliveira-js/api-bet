const validator = require('validator');
const GenericMsgs = require('../../constants/GenericMsgs');
const { InvalidArgumentError } = require('../../utils/Errors');

module.exports = {
  usernameValidate(username) {
    const usernameLength = validator.isLength(username, [
      { min: 6, max: 12 },
    ]);
    const usernameChars = validator.matches(
      username,
      '^[a-zA-Z0-9_.-]*$'
    );

    if (!usernameLength || !usernameChars) {
      throw new InvalidArgumentError(GenericMsgs.FieldError);
    }
    return true;
  },

  passwordValidate(password) {
    const passwordIsStrong = validator.isStrongPassword(password, [
      {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      },
    ]);
    if (!passwordIsStrong) {
      throw new InvalidArgumentError(GenericMsgs.FieldError);
    }
    return true;
  },
};
