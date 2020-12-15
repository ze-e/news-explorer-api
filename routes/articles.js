const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// returns all articles saved by the user
// GET /articles
router.get('/articles',
  celebrate({
    headers: Joi.object().keys({
      Authorization: Joi.string().alphanum(),
    }).unknown(true),
  }),
  auth, getArticles);

// creates an article with the passed
// keyword, title, text, date, source, link, and image in the body
// POST /articles
router.post('/articles',
  celebrate({
    headers: Joi.object().keys({
      Authorization: Joi.string().alphanum(),
    }).unknown(true),
    body: Joi.object().keys({
      keyword: Joi.string().min(2).max(30).required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date(),
      source: Joi.string().required(),
      link: Joi.string().uri().pattern(/^http:\/\/|https:\/\//).required(),
      image: Joi.string().uri().pattern(/^http:\/\/|https:\/\//).required(),
      owner: Joi.string().hex(),
    }),
  }),
  auth, createArticle);

// deletes the stored article by _id
// DELETE /articles/articleId
router.delete('/articles/:articleId',
  celebrate({
    headers: Joi.object().keys({
      Authorization: Joi.string().alphanum(),
    }).unknown(true),
    params: Joi.object().keys({
      articleId: Joi.string().alphanum().length(24),
    }),
  }),
  auth, deleteArticle);

module.exports = router;