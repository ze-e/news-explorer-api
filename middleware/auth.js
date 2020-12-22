const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// errors
const errorMessage = require('../config/errors/errorMessage');
const AuthError = require('../config/errors/AuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError(errorMessage.token_notFound));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthError(errorMessage.token_notFound));
  }

  req.user = payload;

  return next();
};
