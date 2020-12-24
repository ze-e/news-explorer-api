const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: 'keyword is required',
  },
  title: {
    type: String,
    required: 'title is required',
  },
  text: {
    type: String,
    required: 'text is required',
  },
  source: {
    type: String,
    required: 'source is required',
  },
  link: {
    type: String,
    required: 'link is required',
    validate: {
      validator(str) {
        const regex = /^http:\/\/|https:\/\//;
        return regex.test(str);
      },
      message: 'please enter a valid url',
    },
  },
  image: {
    type: String,
    required: 'image is required',
    validate: {
      validator(str) {
        const regex = /^http:\/\/|https:\/\//;
        return regex.test(str);
      },
      message: 'please enter a valid url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    select: false,
  },
  date: {
    type: Date,
    required: 'date is required',
  },
});

articleSchema.statics.doesUserOwn = function (articleId, ownerId) {
  return this.findById(articleId).select('+owner')
    // using === here will throw an error
    .then((article) => (article.owner._id == ownerId ? article : Promise.reject(new Error('User does not own article'))))// eslint-disable-line eqeqeq
    .catch(() => Promise.reject(new Error('User does not own article')));
};

module.exports = mongoose.model('article', articleSchema);
