const { sign, verify } = require('jsonwebtoken');

exports.verifyAuthToken = (token) => {
  token = token.replace('Bearer ', '')
  return verify(
    token,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
}

exports.generateAuthToken = (id, role, password) => {
  return sign(
    { id, role, password },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};
