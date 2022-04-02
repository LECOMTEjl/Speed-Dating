const { sign, verify } = require('jsonwebtoken');

exports.verifyAuthToken = (token) => {
  return verify(
    token,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
}

exports.generateAuthToken = (user) => {
  return sign(
    user,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};
