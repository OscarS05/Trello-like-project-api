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
  let checklistItem2 = null;

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

    [checklistItem1, checklistItem2] = checklists[0].items;

    const { body: authLogin } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user2@email.com', password: 'Customer123@' });
    accessTokenUser2 = authLogin.accessToken;

    const { body: authLogin4 } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user4@email.com', password: 'Customer123@' });

    accessTokenUser4 = authLogin4.accessToken;
  });

  describe('GET /cards/{cardId}/checklists/{checklistId}/checklist-items', () => {
    test('It should return all the checklist items with its members from a specific checklist', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(Array.isArray(body.checklistItems)).toBeTruthy();
      expect(Array.isArray(body.checklistItems[0].members)).toBeTruthy();
      expect(body.checklistItems[0].id).toBe(checklistItem1.id);
      expect(body.checklistItems[0].members.length).toBeGreaterThan(0);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .get(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /cards/{cardId}/checklists/{checklistId}/checklist-items', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'checklist item 1',
        assignedProjectMemberIds: [
          'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
          'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        ], // user1 and user2
        dueDate: '2080-06-09T00:57:42.275Z',
      };
    });

    test('It should return a created checklist item with members assigned', async () => {
      const { statusCode, body } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(201);
      expect(body.newChecklistItem.id).toBeTruthy();
      expect(body.newChecklistItem.name).toEqual(inputBody.name);
      expect(Array.isArray(body.newChecklistItem.assignedMembers)).toBeTruthy();
      expect(body.newChecklistItem.assignedMembers.length).toBe(2);

      body.newChecklistItem.assignedMembers.forEach((newMember) => {
        expect(
          inputBody.assignedProjectMemberIds.includes(
            newMember.projectMemberId,
          ),
        ).toBeTruthy();
        expect(
          inputBody.assignedProjectMemberIds.includes(
            newMember.projectMemberId,
          ),
        ).toBeTruthy();
      });
    });

    test('It should return an error because the dueDate is in the past', async () => {
      inputBody.dueDate = '2025-04-09T00:57:42.275Z';

      const { statusCode, body } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/must be in the future/);
    });

    test('It should return an error because the projectMembers to be assigned does not belong to the project', async () => {
      inputBody.assignedProjectMemberIds = [
        '9eac6780-c53d-4c26-92f2-3bc04e57d525',
        '380be1a0-432b-49b9-9111-a18bd9b8e104',
      ];

      const { statusCode, body } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(422);
      expect(body.message).toMatch(/do not belong to the project/);
    });

    test('It should return an error because the name is invalid', async () => {
      inputBody.name = 'New name 15 @!**';

      const { statusCode } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return a created checklist item without dueDate', async () => {
      delete inputBody.dueDate;

      const { statusCode, body } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(201);
      expect(body.newChecklistItem.id).toBeTruthy();
      expect(body.newChecklistItem.name).toEqual(inputBody.name);
      expect(body.newChecklistItem.dueDate).toEqual(null);
    });

    test('It should return a created checklist item without new members', async () => {
      delete inputBody.assignedProjectMemberIds;

      const { statusCode, body } = await api
        .post(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(201);
      expect(body.newChecklistItem.id).toBeTruthy();
      expect(body.newChecklistItem.name).toEqual(inputBody.name);
      expect(body.newChecklistItem.assignedMembers.length).toBe(0);
    });
  });

  describe('PATCH /cards/{cardId}/checklists/{checklistId}/checklist-items/{checklistItemId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'checklist item 1.1',
        assignedProjectMemberIds: [
          'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1',
          'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2',
        ], // user1 and user2
        dueDate: '2080-06-09T00:57:42.275Z',
      };
    });

    test('It should return a updated checklist item with zero members assigned and dueDate', async () => {
      delete inputBody.assignedProjectMemberIds;
      delete inputBody.dueDate;

      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedItem.id).toBe(checklistItem1.id);
      expect(body.updatedItem.name).toEqual(inputBody.name);
      expect(Array.isArray(body.updatedItem.assignedMembers)).toBeTruthy();
      expect(body.updatedItem.assignedMembers.length).toBe(0);
      expect(body.updatedItem.dueDate).toBe(null);
    });

    test('It should return a updated checklist item with one member assigned', async () => {
      await models.ChecklistItemMember.destroy({
        where: {
          projectMemberId: 'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2', // user2
          checklistItemId: checklistItem1.id,
        },
      });

      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedItem.id).toBe(checklistItem1.id);
      expect(body.updatedItem.name).toEqual(inputBody.name);
      expect(Array.isArray(body.updatedItem.assignedMembers)).toBeTruthy();
      expect(body.updatedItem.assignedMembers.length).toBe(1);
      expect(body.updatedItem.assignedMembers[0].projectMemberId).toBe(
        inputBody.assignedProjectMemberIds[1],
      );
    });

    test('It should return a updated checklist item with zero members assigned', async () => {
      delete inputBody.assignedProjectMemberIds;

      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedItem.id).toBe(checklistItem1.id);
      expect(body.updatedItem.name).toEqual(inputBody.name);
      expect(Array.isArray(body.updatedItem.assignedMembers)).toBeTruthy();
      expect(body.updatedItem.assignedMembers.length).toBe(0);
    });

    test('It should return an error because the checklistItem does not belong to the project.', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/b5f939cf-5a23-45bc-9fda-12183cafc073`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toBe(422);
      expect(body.message).toMatch(/does not belong to the project/);
    });

    test('It should return an error because the requester does not belong to the project.', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toBe(403);
    });
  });

  describe('PATCH /cards/{cardId}/checklists/{checklistId}/checklist-items/{checklistItemId}/check', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        isChecked: true,
      };
    });

    test('It should return a updated checklist item with zero members assigned and dueDate', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/check`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedItem.id).toBe(checklistItem1.id);
      expect(body.updatedItem.isChecked).toEqual(inputBody.isChecked);
      expect(body.updatedItem.isChecked).not.toEqual(checklistItem1.isChecked);
    });

    test('It should return a updated checklist item with zero members assigned and dueDate', async () => {
      inputBody.isChecked = 'false';

      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/check`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(200);
      expect(body.updatedItem.id).toBe(checklistItem1.id);
      expect(body.updatedItem.isChecked).toBe(false);
    });

    test('It should return a updated checklist item with zero members assigned and dueDate', async () => {
      inputBody.isChecked = 'yes';

      const { statusCode, body } = await api
        .patch(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}/check`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/must be a boolean/);
    });
  });

  describe('DELETE /cards/{cardId}/checklists/{checklistId}/checklist-items/{checklistItemId}', () => {
    test('It should return an error because the checklistItem was not found', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/b5f939cf-5a23-45bc-9fda-12183cafc073`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser2}` });
      expect(statusCode).toEqual(422);
      expect(body.message).toMatch(/does not belong to the project/);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem1.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/cards/${card.id}/checklists/${checklists[0].id}/checklist-items/${checklistItem2.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.deletedItem).toBe(1);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
