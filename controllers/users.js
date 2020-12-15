const User = require('../models/User');

// errors
const NotFoundError = require('../config/errors/NotFoundError');4

module.exports.getUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    res.status(200).send(user);
  })
  .catch((err) => next(new NotFoundError(`Could not get user: ${err.message}`)));