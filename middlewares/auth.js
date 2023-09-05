const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secretKey');
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
