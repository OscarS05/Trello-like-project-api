const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for list endpoints', () => {
  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let accessTokenUser4 = null;
  let list = null;
  let card = null;

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

    list = await models.List.findByPk('7f210809-184f-449d-8cb6-7bdca222201a');
    card = await models.Card.findByPk('4600a009-a471-4416-bf24-e857d23d2ab3');

    const { body: authLogin } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user2@email.com', password: 'Customer123@' });
    accessTokenUser2 = authLogin.accessToken;

    const { body: authLogin4 } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user4@email.com', password: 'Customer123@' });

    accessTokenUser4 = authLogin4.accessToken;
  });

  describe('GET /lists/{listId}/cards/{cardId}/information', () => {
    test('It should return all the information that belongs to a specific card', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/lists/${list.id}/cards/${card.id}/information`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(Array.isArray(body.card.labels)).toBeTruthy();
      expect(Array.isArray(body.card.cardMembers)).toBeTruthy();
      expect(Array.isArray(body.card.attachments)).toBeTruthy();
      expect(Array.isArray(body.card.checklists)).toBeTruthy();
      expect(body.card.listId).toBe(list.id);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .get(`/api/v1/lists/${list.id}/cards/${card.id}/information`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('GET /lists/{listId}/cards', () => {
    test('It should return all the cards from a specific list', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/lists/${list.id}/cards`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.cards[0].listId).toBe(list.id);
    });

    test('It should return an error because the list does not exist', async () => {
      const { statusCode } = await api
        .get(`/api/v1/lists/4600a009-a471-4416-bf24-e857d23d2ab3/cards`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });
  });

  describe('POST /lists/{listId}/cards', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'list 4',
      };
    });

    test('It should return a created card', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/lists/${list.id}/cards`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.newCard.id).toBeTruthy();
      expect(body.newCard.name).toEqual(inputBody.name);
    });

    test('It should return an error because the name is invalid', async () => {
      inputBody.name = 'New name 15 @!**';

      const { statusCode } = await api
        .post(`/api/v1/lists/${list.id}/cards`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /lists/{listId}/cards/{cardId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        newName: 'In progress 4',
      };
    });

    test('It should return an updated card', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/lists/${list.id}/cards/${card.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(200);
      expect(body.updatedCard.id).toBe(card.id);
      expect(body.updatedCard.name).not.toEqual(card.name);
    });

    test('It should return an error because the cardId does not belong to the list.', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/lists/${list.id}/cards/57f74c73-e129-4d18-a319-cceae505ce47`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(404);
    });
  });

  describe('DELETE /lists/{listId}/cards/{cardId}', () => {
    test('It should return an error because the card was not found', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/lists/${list.id}/cards/57f74c73-e129-4d18-a319-cceae505ce47`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(404);
    });

    test('It should return an success message', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/lists/${list.id}/cards/${card.id}`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|deleted/);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
