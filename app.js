const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/user');
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);
app.use('/api/logins', loginRouter);
app.use('/api/users', usersRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
