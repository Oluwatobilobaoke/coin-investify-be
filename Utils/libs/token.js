const jwt = require('jsonwebtoken');

const secret = process.env.COIN_INVESTIFY_JWT_SECRET;

const signJWT = (data, time = '1h') => {
  return jwt.sign(data, secret, { expiresIn: time });
};

const verifyJWT = async (token) => {
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return err;
    }
    return decoded;
  });
};

module.exports = {
  signJWT,
  verifyJWT,
};
