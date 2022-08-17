const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

const login = async (user) => {
  const result = await api.post('/api/login').send(user).expect(200);
  return result.body.token;
};

const initialUser = {
  username: 'admin',
  name: 'admin',
  password: '1234',
};

beforeAll(async () => {
  await User.deleteMany();

  const user = await new User(initialUser);
  const saltRounds = 10;
  const password = await bcrypt.hash(user.password, saltRounds);
  user.password = password;
  await user.save();
});

describe('post users', () => {
  test('post correct user', async () => {
    const token = await login(initialUser);
    const user = {
      username: 'carluntux',
      name: 'Carlos Pumar',
      password: '1234',
    };

    const newUser = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(200);
    expect(user.name).toBe(newUser.body.name);
    expect(user.username).toBe(newUser.body.username);
  });

  test('post without name', async () => {
    const token = await login(initialUser);
    const user = {
      username: 'carluntux',
      password: '1234',
    };

    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
