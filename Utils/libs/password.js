const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const comparePassword = (requestPassword, dbPassword) => {
  return bcrypt.compareSync(requestPassword, dbPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
}
