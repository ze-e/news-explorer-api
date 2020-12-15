const express = require('express');

const router = express.Router();

// controller
const { celebrate, Joi } = require('celebrate');
const {
  loginUser, createUser, getUser,
} = require('../controllers/users');

// middleware
const auth = require('../middleware/auth');

// returns information about the logged-in user (email and name)
// GET /users/me
router.get('/users/me',
  celebrate({
    headers: Joi.object().keys({
      Authorization: Joi.string().alphanum(),
    }).unknown(true),
  }),
  auth, getUser);

// creates a new user
// POST /signup
// PUBLIC
router.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().token().required(),
      name: Joi.string().token().required(),
    }),
  }),
  createUser);

// logs in user
// POST /signin
// PUBLIC
router.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().token().required(),
    }),
  }),
  loginUser);

module.exports = router;
