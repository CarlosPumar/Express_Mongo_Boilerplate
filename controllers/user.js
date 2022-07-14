const userRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

userRouter.post('/', async (request, response) => {
  const { body } = request;

  const saltRounds = 10;
  const password = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    password,
  });

  let savedUser;

  try {
    savedUser = await user.save();
  } catch (error) {
    return response.status(400).json({
      error: 'invalid',
    });
  }

  return response.json(savedUser);
});

module.exports = userRouter;
