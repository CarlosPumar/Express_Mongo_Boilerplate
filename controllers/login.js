const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          description: existing username
 *        password:
 *          type: string
 *          description: secret password of the user
 *      required:
 *        - username
 *        - password
 *      example:
 *        username: carlos5
 *        password: '12345678'
 */

/**
 * @swagger
 * /api/login:
 *  post:
 *    summary: login with an user
 *    tags: [Login]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      200:
 *        description: login success, response with a JWT token
 *      401:
 *        description: invalid username or password
 */
loginRouter.post('/', async (request, response) => {
  const { body } = request;

  const user = await User.findOne({ username: body.username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    name: user.name,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: '10m',
  });

  return response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

module.exports = loginRouter;
