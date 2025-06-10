const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for list endpoints', () => {
  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let accessTokenUser4 = null;
  let card = null;
  let checklists = null;

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

    card = await models.Card.findByPk('4600a009-a471-4416-bf24-e857d23d2ab3');
    checklists = await models.Checklist.findAll({
      where: { cardId: card.id },
      include: [{ model: models.ChecklistItem, as: 'items' }],
    });

    const { body: authLogin } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user2@email.com', password: 'Customer123@' });
    accessTokenUser2 = authLogin.accessToken;

    const { body: authLogin4 } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user4@email.com', password: 'Customer123@' });

    accessTokenUser4 = authLogin4.accessToken;
  });

  describe('GET /projects/{projectId}/checklists', () => {
    let project = null;

    beforeAll(async () => {
      project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );
    });

    test('It should return all the checklist from a specific project', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/projects/${project.id}/checklists`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(Array.isArray(body.cards)).toBeTruthy();
      expect(Array.isArray(body.cards[0].checklists)).toBeTruthy();
      expect(body.cards[0].cardId).toBe(card.id);
      expect(body.cards[0].checklists[0].id).toBe(checklists[0].id);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .get(`/api/v1/projects/${project.id}/checklists`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('GET /cards/{cardId}/checklists', () => {
    test('It should return all the checklist from a specific card', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/cards/${card.id}/checklists`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(Array.isArray(body.checklists)).toBeTruthy();
      expect(Array.isArray(body.checklists[0].items)).toBeTruthy();
      expect(body.checklists[0].id).toBe(checklists[0].id);
      expect(body.checklists[0].items[0].id).toBe(checklists[0].items[0].id);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .get(`/api/v1/cards/${card.id}/checklists`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /cards/{cardId}/checklists', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'checklist 1.1',
      };
    });

    test('It should return a created card', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/cards/${card.id}/checklists`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(201);
      expect(body.newChecklist.id).toBeTruthy();
      expect(body.newChecklist.name).toEqual(inputBody.name);
    });

    test('It should return an error because the name is invalid', async () => {
      inputBody.name = 'New name 15 @!**';

      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/checklists`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/checklists`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /cards/{cardId}/checklists/{checklistId}/copy', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'checklist 1.2',
      };
    });

    test('It should return a created checklist', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/cards/${card.id}/checklists/${checklists[0].id}/copy`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.newChecklist.id).toBeTruthy();
      expect(body.newChecklist.name).toEqual(inputBody.name);
      expect(Array.isArray(body.newChecklist.items)).toBeTruthy();
      expect(body.newChecklist.items[0].name).toEqual(
        checklists[0].items[0].name,
      );
    });

    test('It should return an error because the checklist does not belong to the card', async () => {
      const { statusCode, body } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/661bb319-96ad-4af8-b127-61b686019066/copy`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/does not belong to the project/);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/checklists/${checklists[0].id}/copy`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });
      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the checklist provided does not have items to copy', async () => {
      const listOfChecklists = await models.Checklist.findAll({
        where: { cardId: card.id }, // Including the new checklist created in the last test of type "describe POST"
        include: [{ model: models.ChecklistItem, as: 'items' }],
      });
      const checklistWithoutItems = listOfChecklists?.find(
        (checklist) => checklist.items.length === 0,
      );

      const { statusCode, body } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklistWithoutItems.id}/copy`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
      expect(body.message).toMatch(/checklist has no items to copy/);
    });
  });

  describe('PATCH /cards/{cardId}/checklists/{checklistId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        newName: 'In progress 4',
      };
    });

    test('It should return an updated checklist', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/cards/${card.id}/checklists/${checklists[0].id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedChecklist.id).toBe(checklists[0].id);
      expect(body.updatedChecklist.name).not.toEqual(checklists[0].name);
      expect(body.updatedChecklist.name).toEqual(inputBody.newName);
    });

    test('It should return an error because the checklist does not belong to the project.', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/b5f939cf-5a23-45bc-9fda-12183cafc073`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/does not belong to the project/);
    });

    test('It should return an error because the requester does not belong to the project.', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/b5f939cf-5a23-45bc-9fda-12183cafc073`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toBe(403);
    });
  });

  describe('DELETE /cards/{cardId}/checklists/{checklistId}', () => {
    test('It should return an error because the checklist was not found', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/cards/${card.id}/checklists/b5f939cf-5a23-45bc-9fda-12183cafc073`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/does not belong to the project/);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/cards/${card.id}/checklists/${checklists[0].id}`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an success message', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/cards/${card.id}/checklists/${checklists[0].id}`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.deletedCard).toBe(1);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
