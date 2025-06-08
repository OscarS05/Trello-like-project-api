const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for list endpoints', () => {
  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let accessTokenUser4 = null;
  let project = null;
  let card = null;
  let labels = null;

  let app = null;
  let server = null;
  let api = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);

    await upSeed();

    const userData = {
      email: 'user1@email.com',
      password: 'Admin123@',
    };
    const { body } = await api.post('/api/v1/auth/login').send(userData);
    accessTokenUser1 = body.accessToken;

    project = await models.Project.findByPk(
      '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
    );
    card = await models.Card.findByPk('4600a009-a471-4416-bf24-e857d23d2ab3');
    labels = await models.Label.findAll({ where: { projectId: project.id } });

    const { body: authLogin } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user2@email.com', password: 'Customer123@' });
    accessTokenUser2 = authLogin.accessToken;

    const { body: authLogin4 } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user4@email.com', password: 'Customer123@' });

    accessTokenUser4 = authLogin4.accessToken;
  });

  describe('GET /projects/{projectId}/labels', () => {
    test('It should return all the labels from a specific project', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/projects/${project.id}/labels`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.labels[0].id).toBe(labels[0].id);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .get(`/api/v1/projects/${project.id}/labels`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('GET /cards/{cardId}/labels', () => {
    test('It should return all the labels from a specific card', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/cards/${card.id}/labels`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.visibleLabels[0].isVisible).toBeTruthy();
      expect(body.visibleLabels[0].projectId).toBe(project.id);
    });

    test('It should return an error because the card does not exist', async () => {
      const { statusCode } = await api
        .get(`/api/v1/cards/09e69ee8-ffe7-48bf-9767-7f1adb533f2a/labels`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });
  });

  describe('POST /projects/{projectId}/cards/{cardId}/labels', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'list 4',
        color: '#FF0000',
      };
    });

    test('It should return a created label', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/projects/${project.id}/cards/${card.id}/labels`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(201);
      expect(body.newLabel.id).toBeTruthy();
      expect(body.newLabel.name).toEqual(inputBody.name);
      expect(body.newLabel.color).toEqual(inputBody.color);
    });

    test('It should return an error because the name is invalid', async () => {
      inputBody.name = 'New name 15 @!**';

      const { statusCode } = await api
        .post(`/api/v1/projects/${project.id}/cards/${card.id}/labels`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the color is invalid', async () => {
      inputBody.color = 'Rojo';

      const { statusCode } = await api
        .post(`/api/v1/projects/${project.id}/cards/${card.id}/labels`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });

    test('It should return an error because this color is not allowed', async () => {
      inputBody.color = '#ffffff';

      const { statusCode } = await api
        .post(`/api/v1/projects/${project.id}/cards/${card.id}/labels`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /projects/{projectId}/labels/{labelId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'In progress 199',
        color: '#0000FF',
      };
    });

    test('It should return an updated label', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/projects/${project.id}/labels/${labels[0].id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedLabel.id).toBe(labels[0].id);
      expect(body.updatedLabel.name).not.toEqual(labels[0].name);
      expect(body.updatedLabel.name).toEqual(inputBody.name);
    });

    test('It should return an error because the label does not exist', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/projects/${project.id}/labels/bc9cd69a-d646-4ce6-b6ab-36823a60b93c`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /cards/{cardId}/labels/{labelId}/visibility', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        isVisible: false,
      };
    });

    test('It should return an updated label', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/cards/${card.id}/labels/${labels[0].id}/visibility`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedLabel.labelId).toBe(labels[0].id);
      expect(body.updatedLabel.isVisible).toEqual(inputBody.isVisible);
    });

    test('It should return an error because the label does not exist', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/cards/${card.id}/labels/bc9cd69a-d646-4ce6-b6ab-36823a60b93c/visibility`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(400);
    });
  });

  describe('DELETE /projects/{projectId}/labels/{labelId}', () => {
    test('It should return an error because the label was not found', async () => {
      const mockConsoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { statusCode } = await api
        .delete(
          `/api/v1/projects/${project.id}/labels/bc9cd69a-d646-4ce6-b6ab-36823a60b93c`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(500);
      mockConsoleError.mockRestore();
    });

    test('It should return a success message', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/projects/${project.id}/labels/${labels[0].id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.deletedLabel).toBe(1);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
