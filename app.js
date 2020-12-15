// routes
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// middleware
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middleware/logger');

// config
require('dotenv').config({ path: '../' });
const { DATABASE } = require('./config/db_config');

// connect to database
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(requestLogger);

// user routes
app.use('/api/', require('./routes/users'));

// card routes
app.use('/api/', require('./routes/articles'));

// celebrate errors
app.use(errors());
// normal errors
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(
    {
      message: statusCode === 500
        ? `An error occurred on the server ${err}`
        : message,
    },
  );
  next();
});

// errorlogger
app.use(errorLogger);

// server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  const message = !process.env.NODE_ENV
    ? 'environment variables failed to load. Using default config settings'
    : 'environment variables loaded';
  console.log(message);
});
