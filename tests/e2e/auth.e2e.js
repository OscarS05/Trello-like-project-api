const request = require('supertest');
const jwt = require('jsonwebtoken');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for /auth path', () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);

    await upSeed();
  });

  describe('POST /auth/login', () => {
    test('Should return an accessToken.', async () => {
      const user = await models.User.findOne({
        where: { email: 'user1@email.com' },
      });
      const inputData = {
        email: user.email,
        password: 'Admin123@',
      };

      const { statusCode, body } = await api
        .post('/api/v1/auth/login')
        .send(inputData);

      expect(statusCode).toBe(200);
      expect(body.accessToken).toBeTruthy();
    });

    test('should return 404 if email does not exist', async () => {
      const inputData = {
        email: 'nonexistent@example.com',
        password: 'doesNotMatter123',
      };

      const { statusCode, body } = await api
        .post('/api/v1/auth/login')
        .send(inputData);

      expect(statusCode).toBe(404);
      expect(body.message).toMatch(/not found/);
    });

    test('should return 401 if password is incorrect', async () => {
      const inputData = {
        email: 'user1@email.com',
        password: 'wr0ngPassword@',
      };

      const { statusCode, body } = await api
        .post('/api/v1/auth/login')
        .send(inputData);

      expect(statusCode).toBe(401);
      expect(body.message).toMatch(/password is incorrect/);
    });

    test('should return 400 if email format is invalid', async () => {
      const inputData = {
        email: 'not-an-email',
        password: 'anypass123',
      };

      const { statusCode } = await api
        .post('/api/v1/auth/login')
        .send(inputData);

      expect(statusCode).toBe(400);
    });
  });

  describe('POST /auth/send-verification-email', () => {
    test('It should return a statusCode 200 and message.', async () => {
      const user = await models.User.findOne({
        where: { email: 'user1@email.com' },
      });

      const inputData = {
        email: user.email,
      };

      const { statusCode, body } = await api
        .post('/api/v1/auth/send-verification-email')
        .send(inputData);

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/was sent successfully/);
    });

    test('It should return an error because the email does not exist.', async () => {
      const inputData = {
        email: 'user100@email.com',
      };

      const { statusCode } = await api
        .post('/api/v1/auth/send-verification-email')
        .send(inputData);

      expect(statusCode).toBe(404);
    });
  });

  describe('POST /auth/resend-verification-email', () => {
    let cookieVerifyEmail = null;

    beforeAll(async () => {
      const inputData = {
        email: 'user4@email.com',
        name: 'user4',
        password: 'Admin123@',
        confirmPassword: 'Admin123@',
      };

      const res = await api.post(`/api/v1/users`).send(inputData);

      const setCookie = res.headers['set-cookie'];
      const verifyEmailCookieString = setCookie.find((cookie) =>
        cookie.startsWith('verifyEmail='),
      );
      const [, cookieValue] = verifyEmailCookieString.split(';')[0].split('=');
      cookieVerifyEmail = cookieValue;
    });

    test('It should return a statusCode 200 and message', async () => {
      const { statusCode, body } = await api
        .post('/api/v1/auth/resend-verification-email')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`);

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/was send successfully/);
    });

    test('It should return an error because the token is not valid', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const { statusCode } = await api
        .post('/api/v1/auth/resend-verification-email')
        .set('Cookie', `verifyEmail=invalid-token-123`);

      expect(statusCode).toBe(500);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('POST /auth/verify-email', () => {
    let cookieVerifyEmail = null;

    beforeAll(async () => {
      const inputData = {
        email: 'user5@email.com',
        name: 'user5',
        password: 'Admin123@',
        confirmPassword: 'Admin123@',
      };

      const res = await api.post(`/api/v1/users`).send(inputData);

      const setCookie = res.headers['set-cookie'];
      const verifyEmailCookieString = setCookie.find((cookie) =>
        cookie.startsWith('verifyEmail='),
      );
      const [, cookieValue] = verifyEmailCookieString.split(';')[0].split('=');
      cookieVerifyEmail = cookieValue;
    });

    test('It should return a statusCode 200 and session tokens', async () => {
      const { statusCode, body } = await api
        .post('/api/v1/auth/verify-email')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`)
        .set({
          Authorization: `Bearer ${cookieVerifyEmail}`,
        });

      expect(statusCode).toBe(200);
      expect(body.accessToken).toBeTruthy();
    });

    test('It should return an error because the token is wrong', async () => {
      const { statusCode, body } = await api
        .post('/api/v1/auth/verify-email')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`)
        .set({
          Authorization: `Bearer wrong-token-123`,
        });

      expect(statusCode).toBe(401);
      expect(body.accessToken).not.toBeTruthy();
    });

    test('It should return an error because the token was not provided', async () => {
      const { statusCode, body } = await api
        .post('/api/v1/auth/verify-email')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`);

      expect(statusCode).toBe(401);
      expect(body.message).toMatch(/was not provided/);
      expect(body.accessToken).not.toBeTruthy();
    });
  });

  describe('POST /auth/verify-email-to-recover-password', () => {
    let cookieVerifyEmail = null;

    beforeAll(async () => {
      const inputData = {
        email: 'user2@email.com',
      };

      const res = await api
        .post(`/api/v1/auth/send-verification-email`)
        .send(inputData);

      const setCookie = res.headers['set-cookie'];
      const verifyEmailCookieString = setCookie.find((cookie) =>
        cookie.startsWith('verifyEmail='),
      );
      const [, cookieValue] = verifyEmailCookieString.split(';')[0].split('=');
      cookieVerifyEmail = cookieValue;
    });

    test('It should return a statusCode 200 and success message', async () => {
      const { statusCode, body } = await api
        .post('/api/v1/auth/verify-email-to-recover-password')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`)
        .set({
          Authorization: `Bearer ${cookieVerifyEmail}`,
        });

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/successfully/);
    });

    test('It should return an error because the token was not provided', async () => {
      const { statusCode } = await api
        .post('/api/v1/auth/verify-email-to-recover-password')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`);

      expect(statusCode).toBe(401);
    });

    test('It should return an error because the some token is not valid', async () => {
      const { statusCode } = await api
        .post('/api/v1/auth/verify-email-to-recover-password')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`)
        .set({
          Authorization: `Bearer wrong-token-123`,
        });

      expect(statusCode).toBe(401);
    });
  });

  describe('PATCH /auth/password', () => {
    let cookieVerifyEmail = null;

    beforeAll(async () => {
      const user = await models.User.findOne({
        where: { email: 'user1@email.com' },
      });
      const inputData = {
        email: user.email,
      };

      const res = await api
        .post(`/api/v1/auth/send-verification-email`)
        .send(inputData);

      const setCookie = res.headers['set-cookie'];
      const verifyEmailCookieString = setCookie.find((cookie) =>
        cookie.startsWith('verifyEmail='),
      );
      const [, cookieValue] = verifyEmailCookieString.split(';')[0].split('=');
      cookieVerifyEmail = cookieValue;
    });

    test('It should return a statusCode 200 and success message', async () => {
      const password = 'Admin123@';
      const inputBody = {
        newPassword: password,
        confirmNewPassword: password,
      };

      const { statusCode, body, headers } = await api
        .patch('/api/v1/auth/password')
        .set('Cookie', `verifyEmail=${cookieVerifyEmail}`)
        .send(inputBody);

      const setCookie = headers['set-cookie'];
      const verifyEmailCookieString = setCookie.find((cookie) =>
        cookie.startsWith('verifyEmail='),
      );
      const refreshTokenCookieString = setCookie.find((cookie) =>
        cookie.startsWith('refreshToken='),
      );
      const [, verifyEmailToken] = verifyEmailCookieString
        .split(';')[0]
        .split('=');
      const [, refreshToken] = refreshTokenCookieString
        .split(';')[0]
        .split('=');

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/successfully/);
      expect(verifyEmailToken).not.toBeTruthy();
      expect(refreshToken).not.toBeTruthy();
    });

    test('It should return an error because the token provided is wrong', async () => {
      const password = 'Admin123@';
      const inputBody = {
        newPassword: password,
        confirmNewPassword: password,
      };

      const { statusCode } = await api
        .patch('/api/v1/auth/password')
        .set('Cookie', `verifyEmail=wrong-token-123`)
        .send(inputBody);

      expect(statusCode).toBe(500);
    });

    test('It should return an error because the confirmNewPassword was not provided', async () => {
      const password = 'Admin123@';
      const inputBody = {
        newPassword: password,
      };

      const { statusCode } = await api
        .patch('/api/v1/auth/password')
        .set('Cookie', `verifyEmail=wrong-token-123`)
        .send(inputBody);

      expect(statusCode).toBe(400);
    });
  });

  describe('POST /auth/refresh-tokens', () => {
    let refreshTokenCookie = null;
    let accessTokenCookie = null;

    beforeAll(async () => {
      const user = await models.User.findOne({
        where: { email: 'user2@email.com' },
      });
      const inputData = {
        email: user.email,
        password: 'Customer123@',
      };

      const res = await api.post(`/api/v1/auth/login`).send(inputData);

      const setCookie = res.headers['set-cookie'];
      const refreshTokenCookieString = setCookie.find((cookie) =>
        cookie.startsWith('refreshToken='),
      );
      const [, cookieValue] = refreshTokenCookieString.split(';')[0].split('=');

      refreshTokenCookie = cookieValue;
      accessTokenCookie = res.body.accessToken;
    });

    test('It should return a statusCode 200, access and refresh Token', async () => {
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        const error = new Error('TokenExpiredError');
        error.name = 'TokenExpiredError';
        throw error;
      });

      const { statusCode, body, headers } = await api
        .post('/api/v1/auth/refresh-tokens')
        .set('Cookie', `refreshToken=${refreshTokenCookie}`)
        .set({ Authorization: `Bearer ${accessTokenCookie}` });

      const setCookie = headers['set-cookie'];
      const refreshTokenCookieString = setCookie.find((cookie) =>
        cookie.startsWith('refreshToken='),
      );
      const [, refreshToken] = refreshTokenCookieString
        .split(';')[0]
        .split('=');

      expect(statusCode).toBe(200);
      expect(body.accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();

      jest.clearAllMocks();
    });

    test('It should return a statusCode 200 and only accessToken', async () => {
      const { statusCode, body, headers } = await api
        .post('/api/v1/auth/refresh-tokens')
        .set('Cookie', `refreshToken=${refreshTokenCookie}`)
        .set({ Authorization: `Bearer ${accessTokenCookie}` });

      const setCookie = headers['set-cookie'];

      expect(statusCode).toBe(200);
      expect(body.accessToken).toBeTruthy();
      expect(setCookie).not.toBeTruthy();

      jest.clearAllMocks();
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
