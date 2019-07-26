const bcrypt = require("bcryptjs");

module.exports = {
    hashPassword,
  };

function hashPassword(password) {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);

}