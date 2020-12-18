const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { NODE_ENV, JWT_SECRET } = process.env;

// errors
const NotFoundError = require('../config/errors/NotFoundError');
const RequestError = require('../config/errors/RequestError');
const ConflictError = require('../config/errors/ConflictError');

module.exports.getUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if(!user){
      throw new NotFoundError('No user found');
    }
    res.status(200).send(user);
  })
  .catch(() => next(new NotFoundError(`Could not get user`)));

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      })
      .then((user) => {
        //for some reason, select:false does not work when creating users
        //temporary fix until I can figure out this bug
        const userData = {};
        userData.email = user.email;
        userData.name = user.name;
        res.send(userData);
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          next(new ConflictError(`User ${err.keyValue.email} already exists`));
        }
        next(new Error(`Could not create user`));
      });
    })
    .catch(() => next(new RequestError(`Could not create user:`)));
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User unavailable');
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(() => next(new RequestError(`Could not login:`)));
};
