const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for /users path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);

    await upSeed();
  });

  describe('GET /users/:email', () => {
    test('Should return a user', async () => {
      const user = await models.User.findOne({
        where: { email: 'user1@email.com' },
      });

      const { statusCode, body } = await api.get(`/api/v1/users/${user.email}`);

      expect(statusCode).toEqual(200);
      expect(body.user.email).toEqual(user.email);
    });

    test('Should return an error by invalid email', async () => {
      const email = '@email.com';

      const { statusCode } = await api.get(`/api/v1/users/${email}`);

      expect(statusCode).toEqual(400);
    });

    test('Should return an error by invalid email', async () => {
      const email = 'user1@emailcom';

      const { statusCode } = await api.get(`/api/v1/users/${email}`);

      expect(statusCode).toEqual(400);
    });

    test('Should return an error by invalid email', async () => {
      const email = 'us@er1@emailcom';

      const { statusCode } = await api.get(`/api/v1/users/${email}`);

      expect(statusCode).toEqual(400);
    });

    test('Should return an error by invalid email', async () => {
      const email = 'user1 @emailcom';

      const { statusCode } = await api.get(`/api/v1/users/${email}`);

      expect(statusCode).toEqual(400);
    });
  });

  describe('GET /users/', () => {
    test('Should return a list of user', async () => {
      const { statusCode, body } = await api.get(`/api/v1/users`);

      expect(statusCode).toEqual(200);
      expect(body.length).toBe(3);
      expect(body[1].email).toEqual('user2@email.com');
    });

    test('Should return an error because the limit is invalid', async () => {
      const limit = -1;
      const offset = 1;

      const { statusCode } = await api.get(
        `/api/v1/users?limit=${limit}&offset=${offset}`,
      );

      expect(statusCode).toEqual(400);
    });

    test('Should return a list of user using limit and offset', async () => {
      const limit = 1;
      const offset = 1;

      const { statusCode, body } = await api.get(
        `/api/v1/users?limit=${limit}&offset=${offset}`,
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toBe(limit);
      expect(body[0].email).toEqual('user2@email.com');
    });

    test('Should return filtered users by role and verification status', async () => {
      const role = 'basic';
      const isVerified = false;

      const { statusCode, body } = await api.get(
        `/api/v1/users?role=${role}&isVerified=${isVerified}`,
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toBe(2);
      expect(body[0].email).toEqual('user2@email.com');
    });

    test('Should return an error because the role is not valid', async () => {
      const role = 'free';
      const isVerified = false;

      const { statusCode } = await api.get(
        `/api/v1/users?role=${role}&isVerified=${isVerified}`,
      );

      expect(statusCode).toEqual(400);
    });

    test('Should return 200 and empty array when no users match filters', async () => {
      const role = 'premium';
      const isVerified = false;
      const userWithPremiumRole = await models.User.findByPk(
        'f81625ba-cee1-4b48-92a8-3f3065d219fb',
      );
      await models.User.update(
        {
          role: 'basic',
        },
        { where: { id: userWithPremiumRole.id } },
      );

      const { statusCode, body } = await api.get(
        `/api/v1/users?role=${role}&isVerified=${isVerified}`,
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toBe(0);
    });

    test('Should return 200 and empty array when limit is 0', async () => {
      const limit = 0;
      const offset = 0;

      const { statusCode, body } = await api.get(
        `/api/v1/users?limit=${limit}&offset=${offset}`,
      );

      expect(statusCode).toEqual(200);
      expect(body.length).toBe(0);
    });
  });

  describe('POST /users/', () => {
    test('Should return the created user', async () => {
      const inputData = {
        email: 'user4@email.com',
        name: 'user4',
        password: 'Admin123@',
        confirmPassword: 'Admin123@',
      };

      const { statusCode, body } = await api
        .post(`/api/v1/users`)
        .send(inputData);

      expect(statusCode).toBe(201);
      expect(body.user.email).toEqual(inputData.email);
    });

    test('Should return an error because the name is invalid', async () => {
      const inputData = {
        email: 'user3@email.com',
        name: 'user3**~',
        password: 'Admin123@',
        confirmPassword: 'Admin123@',
      };

      const { statusCode } = await api.post(`/api/v1/users`).send(inputData);

      expect(statusCode).toBe(400);
    });

    test('Should return an error because the password must have at least 8 characters', async () => {
      const inputData = {
        email: 'user3@email.com',
        name: 'user3',
        password: 'admin123',
        confirmPassword: 'admin123',
      };

      const { statusCode } = await api.post(`/api/v1/users`).send(inputData);

      expect(statusCode).toBe(409);
    });

    test('Should return an error because the password must contain at least one uppercase letter', async () => {
      const inputData = {
        email: 'user3@email.com',
        name: 'user3',
        password: 'admin123@',
        confirmPassword: 'admin123@',
      };

      const { statusCode } = await api.post(`/api/v1/users`).send(inputData);

      expect(statusCode).toBe(409);
    });

    test('Should return an error because the password Password must contain at least one number', async () => {
      const inputData = {
        email: 'user3@email.com',
        name: 'user3',
        password: 'Adminnnn@',
        confirmPassword: 'Adminnnn@',
      };

      const { statusCode } = await api.post(`/api/v1/users`).send(inputData);

      expect(statusCode).toBe(409);
    });

    test('Should return an error because the password Password must contain at least one special character', async () => {
      const inputData = {
        email: 'user3@email.com',
        name: 'user3',
        password: 'Admin1234',
        confirmPassword: 'Admin1234',
      };

      const { statusCode } = await api.post(`/api/v1/users`).send(inputData);

      expect(statusCode).toBe(409);
    });
  });

  describe('DELETE /users/:userId', () => {
    let accessTokenUser1 = null;
    let accessTokenUser2 = null;

    beforeAll(async () => {
      const user = await models.User.findOne({
        where: { email: 'user1@email.com' },
      });
      const inputData = {
        email: user.email,
        password: 'Admin123@',
      };

      const { body } = await api.post('/api/v1/auth/login').send(inputData);
      accessTokenUser1 = body.accessToken;
    });

    beforeAll(async () => {
      const user = await models.User.findOne({
        where: { email: 'user2@email.com' },
      });
      const inputData = {
        email: user.email,
        password: 'Customer123@',
      };

      const { body } = await api.post('/api/v1/auth/login').send(inputData);
      accessTokenUser2 = body.accessToken;
    });

    test('User1 wants to delete her account. Should return a 1.', async () => {
      const user = await models.User.findOne({
        where: { email: 'user1@email.com' },
      });

      const { statusCode, body } = await api
        .delete(`/api/v1/users/${user.id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toBe(200);
      expect(body.rowsDeleted).toBe(1);
    });

    test('User2 wants to delete his account. Should return a 1.', async () => {
      const user = await models.User.findOne({
        where: { email: 'user2@email.com' },
      });

      const { statusCode, body } = await api
        .delete(`/api/v1/users/${user.id}`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      const deletedUser = await models.User.findOne({
        where: { email: 'user2@email.com' },
      });

      expect(statusCode).toBe(200);
      expect(body.rowsDeleted).toBe(1);
      expect(deletedUser).toEqual(null);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
