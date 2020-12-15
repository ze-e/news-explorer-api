const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// errors
const AuthError = require('../config/errors/AuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('No authorization token found'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthError('Invalid token'));
  }

  req.user = payload;

  return next();
};
