const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for list endpoints', () => {
  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let accessTokenUser4 = null;
  let card = null;
  let cardMembers = null;
  const projectMemberId1 = 'a1e1bc70-01a0-4e19-91f1-df1c5e5a01a1';
  const projectMemberId2 = 'b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2';

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
    cardMembers = await models.CardMember.findAll({
      where: { cardId: card.id },
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

  describe('GET /cards/{cardId}/members', () => {
    test('It should return all card members that belong to a specific card', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/cards/${card.id}/members`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(Array.isArray(body.cardMembers)).toBeTruthy();
      expect(body.cardMembers[0].id).toBe(cardMembers[0].id);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .get(`/api/v1/cards/${card.id}/members`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /cards/{cardId}/members/{projectMemberId}', () => {
    test('It should return a new member', async () => {
      await models.CardMember.destroy({
        where: { projectMemberId: projectMemberId1, cardId: card.id },
      });

      const { statusCode, body } = await api
        .post(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.newMember.id).toBeTruthy();
      expect(body.newMember.projectMemberId).toBe(projectMemberId1);
    });

    test('It should return an error because the cardMember already belongs to the card', async () => {
      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });

    test('Case: It should return an error because the requester does not have permissions to do so', async () => {
      await models.CardMember.destroy({
        where: { projectMemberId: projectMemberId1, cardId: card.id },
      });

      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(403);
    });

    test('Case: A project member adds another project member to the card. It should return a new member.', async () => {
      await models.CardMember.destroy({
        where: { projectMemberId: projectMemberId1, cardId: card.id },
      });
      await models.ProjectMember.update(
        { role: 'admin' },
        { where: { id: projectMemberId2 } },
      );

      const { statusCode, body } = await api
        .post(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(201);
      expect(body.newMember.id).toBeTruthy();
      expect(body.newMember.projectMemberId).toBe(projectMemberId1);

      await models.ProjectMember.update(
        { role: 'member' },
        { where: { id: projectMemberId2 } },
      );
    });
  });

  describe('DELETE /cards/{cardId}/members/{projectMemberId}', () => {
    test('It should return an error because the member was not found', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/cards/${card.id}/members/f8ac2de0-e7b4-45c7-86fa-b745825af97d`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
      expect(body.message).toMatch(
        /The member to be removed to the card was not found/,
      );
    });

    test('case 1: projectMember wants to remove himself/herself to the card', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.deletedCard).toBe(1);
    });

    test('case 2: projectMember wants to remove another projectMember to the card', async () => {
      await models.CardMember.create({
        id: cardMembers[0].id,
        projectMemberId: cardMembers[0].projectMemberId,
        cardId: cardMembers[0].cardId,
      });
      await models.ProjectMember.update(
        { role: 'admin' },
        { where: { id: projectMemberId2 } },
      );

      const { statusCode, body } = await api
        .delete(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.deletedCard).toBe(1);
    });

    test('case 2: projectMember wants to remove another projectMember to the card. It should return an error because the projectMember already was removed', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/cards/${card.id}/members/${projectMemberId1}`)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(409);
      expect(body.message).toMatch(/does not exist on the card/);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
