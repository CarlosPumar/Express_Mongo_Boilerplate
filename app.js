const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDOC = require('swagger-jsdoc');
const path = require('path');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/user');
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');

const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      tittle: 'Express boilerplate server',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development enviroment',
      },
    ],
  },
  apis: [`${path.join(__dirname, './controllers/*.js')}`],
};

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
app.use(
  '/api-doc',
  swaggerUI.serve,
  swaggerUI.setup(swaggerJSDOC(swaggerSpec)),
);

app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
