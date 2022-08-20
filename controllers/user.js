const userRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          description: Unique username
 *        name:
 *          type: string
 *          description: user name
 *        password:
 *          type: string
 *          description: secret password of the user with a minLenght of 8
 *      required:
 *        - username
 *        - name
 *        - password
 *      example:
 *        username: carlos5
 *        name: Carlos
 *        password: '12345678'
 */

/**
 * @swagger
 * /api/users:
 *  post:
 *    summary: create new user with an encrypted password
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: user created
 *      400:
 *        description: invalid user or user already created
 */
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
