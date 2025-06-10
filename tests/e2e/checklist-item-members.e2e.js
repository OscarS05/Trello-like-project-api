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
  let checklistItem1 = null;
  let checklistItemMembers = null;
  let checklistItemMember1 = null;

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

    [checklistItem1, ,] = checklists[0].items;

    checklistItemMembers = await models.ChecklistItemMember.findAll({
      where: { checklistItemId: checklistItem1.id },
    });

    [checklistItemMember1, ,] = checklistItemMembers;

    const { body: authLogin } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user2@email.com', password: 'Customer123@' });
    accessTokenUser2 = authLogin.accessToken;

    const { body: authLogin4 } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user4@email.com', password: 'Customer123@' });

    accessTokenUser4 = authLogin4.accessToken;
  });

  describe('GET /checklists/{checklistId}/checklist-items/{checklistItemId}/members', () => {
    test('It should return all the checklist item members from a specific checklist item', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(200);
      expect(body.checklistItemMembers[0].id).toBe(checklistItemMember1.id);
      expect(body.checklistItemMembers[0].projectMemberId).toBe(
        checklistItemMember1.projectMemberId,
      );
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser4}` });
      expect(statusCode).toEqual(403);
      expect(body.message).toMatch(/not belong to the project/);
    });
  });

  describe('POST /checklists/{checklistId}/checklist-items/{checklistItemId}/members', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        projectMemberIds: [
          'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
          'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        ], // user1 and user2
      };
    });

    test('It should return a created checklist item member. Adding one member', async () => {
      await models.ChecklistItemMember.destroy({
        where: {
          projectMemberId: inputBody.projectMemberIds[1],
          checklistItemId: checklistItem1.id,
        },
      });

      const { statusCode, body } = await api
        .post(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(201);
      expect(Array.isArray(body.checklistItemMemberAdded)).toBeTruthy();
      expect(body.checklistItemMemberAdded.length).toBe(1);
      expect(body.checklistItemMemberAdded[0].projectMemberId).toBe(
        inputBody.projectMemberIds[1],
      );
    });

    test('It should return a created checklist item member. Adding one member', async () => {
      await models.ChecklistItemMember.destroy({
        where: {
          projectMemberId: inputBody.projectMemberIds[1],
          checklistItemId: checklistItem1.id,
        },
      });

      const { statusCode, body } = await api
        .post(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(201);
      expect(Array.isArray(body.checklistItemMemberAdded)).toBeTruthy();
      expect(body.checklistItemMemberAdded.length).toBe(1);
      expect(body.checklistItemMemberAdded[0].projectMemberId).toBe(
        inputBody.projectMemberIds[1],
      );
    });

    test('It should return an error because the projectMembers to be assigned does not belong to the project', async () => {
      inputBody.projectMemberIds = [
        '9eac6780-c53d-4c26-92f2-3bc04e57d525',
        '380be1a0-432b-49b9-9111-a18bd9b8e104',
      ];

      const { statusCode, body } = await api
        .post(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(422);
      expect(body.message).toMatch(/do not belong to the project/);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .post(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('DELETE /checklists/{checklistId}/checklist-items/{checklistItemId}/members/{projectMemberId}', () => {
    test('It should return an error because the checklistItemMember was not found', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members/${checklistItemMember1.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(422);
      expect(body.message).toMatch(/does not belong to the project/);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members/${checklistItemMember1.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/members/${checklistItemMember1.projectMemberId}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.deletedMember).toBe(1);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
