const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middleware/auth');
const { getUser } = require('../controllers/users');


//returns information about the logged-in user (email and name)
//GET /users/me
router.get('/users/me',
  celebrate({
    headers: Joi.object().keys({
      Authorization: Joi.string().alphanum(),
    }).unknown(true),
  }),
  auth, getUser);

module.exports = router;