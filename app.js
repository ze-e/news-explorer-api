// routes
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// middleware
const helmet = require('helmet');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middleware/logger');

// config
const { DATABASE } = require('./config/db_config');
const errorHandler = require('./middleware/errorHandler');

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

// middleware for handling security headers
app.use(helmet());

// limiter middleware
app.use(require('./middleware/limiter'));

// routes
app.use('/api/', require('./routes/index'));

// celebrate errors
app.use(errors());
// normal errors
app.use(errorHandler);

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
