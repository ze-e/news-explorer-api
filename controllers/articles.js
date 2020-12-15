const Article = require('../models/Article');

// errors
const NotFoundError = require('../config/errors/NotFoundError');
const RequestError = require('../config/errors/RequestError');
const PermissionError = require('../config/errors/PermissionError');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError('Could not get articles for this user');
      }
      res.status(200).send(articles);
    })
    .catch((err) => next(new RequestError(`Could not get articles: ${err.message}`)));
};

module.exports.createArticle = (req, res, next) => {
  Article.create({
    keyword: req.body.keyword,
    title: req.body.title,
    text: req.body.text,
    date: req.body.date,
    source: req.body.source,
    link: req.body.link,
    image: req.body.image,
    owner: req.user._id,
  })
    .then((article) => res.status(200).send(article))
    .catch((err) => next(new RequestError(`Could not create article: ${err.message}`)));
};

module.exports.deleteArticle = (req, res, next) => {
  Article.doesUserOwn(req.params.articleId, req.user._id)
    .then((article) => {
      Article.findByIdAndRemove(article._id)
        .then((deletedArticle) => {
          res.status(200).send({ deletedArticle });
        })
        .catch(() => next(new NotFoundError('Article unavailable')));
    })
    .catch(() => next(new PermissionError('User does not own article')));
};
