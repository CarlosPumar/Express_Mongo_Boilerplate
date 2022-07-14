const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errorHandler = (error, request, response, next) => {
  if (
    error.name === 'ValidationError' ||
    error.name === 'UserValidation' ||
    error.name === 'JsonWebTokenError'
  ) {
    return response.status(400).json({ error: error.message });
  }

  return next(error);
};

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');
  let token = '';
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }

  if (!token) {
    response.locals.user = null;
    return next();
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    response.locals.user = null;
    return next();
  }

  const user = await User.findById(decodedToken.id);
  response.locals.user = user;

  return next();
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
};
