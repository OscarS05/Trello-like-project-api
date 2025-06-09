const request = require('supertest');
const path = require('path');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for list endpoints', () => {
  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let accessTokenUser4 = null;
  let card = null;
  let attachments = null;

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
    attachments = await models.CardAttachment.findAll({
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

  describe('GET /cards/{cardId}/attachments', () => {
    test('It should return all the attachments from a specific card', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/cards/${card.id}/attachments`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(Array.isArray(body.cardAttachments)).toBeTruthy();
      expect(body.cardAttachments[0].id).toBe(attachments[0].id);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .get(`/api/v1/cards/${card.id}/attachments`)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('GET /cards/{cardId}/attachments/{attachmentId}/download', () => {
    // This test was successful, but it is commented on because it depends on an external service(Cloudinary) with free plan.
    // test('It should return the attachment file succesfully', async () => {
    //   const { statusCode, body, headers } = await api
    //     .get(
    //       `/api/v1/cards/${card.id}/attachments/${attachments[0].id}/download`,
    //     )
    //     .set({ Authorization: `Bearer ${accessTokenUser1}` });

    //   expect(statusCode).toEqual(200);
    //   expect(headers['content-type']).toBeDefined();
    //   expect(headers['content-disposition']).toMatch(
    //     /attachment; filename=".*"/,
    //   );
    //   expect(body).toBeInstanceOf(Buffer);
    //   expect(body.length).toBeGreaterThan(0);
    // });

    test('It should return an error because the attachment is an external link', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/cards/${card.id}/attachments/${attachments[1].id}/download`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/Cannot download external links/);
    });

    test('It should return an error because the attachment does not exist or does not belong to the card', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/cards/${card.id}/attachments/2741ab6d-5444-4112-8dd7-1fd0de7da37a/download`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
      expect(body.message).toMatch(/not found/);
    });
  });

  describe('POST /cards/{cardId}/attachments', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        filename: 'Project repository on Github',
        url: 'https://github.com/OscarS05/Trello-like-project-api',
      };
    });

    test('case 1: The new attachment is a link. It should return a new attachment', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/cards/${card.id}/attachments`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.newAttachment.id).toBeTruthy();
      expect(body.newAttachment.filename).toEqual(inputBody.filename);
      expect(body.newAttachment.url).toEqual(inputBody.url);
      expect(body.job).not.toBeDefined();
    });

    test('case 1: It should return an error if the filename is missing in inputBody', async () => {
      delete inputBody.filename;

      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/attachments`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });

    test('case 1: It should return an error if the url is missing in inputBody', async () => {
      delete inputBody.url;

      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/attachments`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });

    test('case 1: It should return an error if the filename is invalid in inputBody', async () => {
      inputBody.filename = '..invalidName **!!';

      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/attachments`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });

    test('case 2: The new attachment is a file. It should return an added job', async () => {
      const pathFile = path.join(
        __dirname,
        '../fake-data/fixtures/landscape.jpeg',
      );

      const { statusCode, body } = await api
        .post(`/api/v1/cards/${card.id}/attachments`)
        .attach('file', pathFile)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.newAttachment).not.toBeDefined();
      expect(body.job).toBeDefined();
      expect(body.job.name).toEqual('loadCardAttachment');
    });

    test('case 2: It should return an error because the file is invalid', async () => {
      const pathFile = path.join(__dirname, '../fake-data/fixtures/file.txt');

      const { statusCode, body } = await api
        .post(`/api/v1/cards/${card.id}/attachments`)
        .attach('file', pathFile)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/Invalid file type/);
    });

    test('case 2: It should return an error because the input-name is not "file"', async () => {
      const pathFile = path.join(
        __dirname,
        '../fake-data/fixtures/landscape.jpeg',
      );
      await expect(
        api
          .post(`/api/v1/cards/${card.id}/attachments`)
          .attach('card-attachment', pathFile)
          .set({ Authorization: `Bearer ${accessTokenUser1}` }),
      ).rejects.toMatchObject({ code: 'EPIPE' });
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { statusCode } = await api
        .post(`/api/v1/cards/${card.id}/attachments`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser4}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('PATCH /cards/{cardId}/attachments/{attachmentId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        filename: 'new name 5',
        url: 'https://github.com/OscarS05?tab=repositories',
      };
    });

    test('case 1: Updating a file. It should return a file name updated', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/cards/${card.id}/attachments/${attachments[0].id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.upatedCard.id).toBe(attachments[0].id);
      expect(body.upatedCard.filename).not.toEqual(attachments[0].filename);
      expect(body.upatedCard.filename).toEqual(inputBody.filename);
      expect(body.upatedCard.url).toEqual(attachments[0].url);
      expect(body.upatedCard.url).not.toEqual(inputBody.url);
    });

    test('case 2: Updating only the url to a link. It should return an url updated', async () => {
      delete inputBody.filename;

      const { statusCode, body } = await api
        .patch(`/api/v1/cards/${card.id}/attachments/${attachments[1].id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.upatedCard.id).toBe(attachments[1].id);
      expect(body.upatedCard.filename).toEqual(attachments[1].filename);
      expect(body.upatedCard.url).not.toEqual(attachments[1].url);
      expect(body.upatedCard.url).toEqual(inputBody.url);
    });

    test('case 2: Updating only the filename to a link. It should return a file name updated', async () => {
      delete inputBody.url;

      await models.CardAttachment.update(
        { url: attachments[1].url },
        { where: { id: attachments[1].id } },
      );

      const { statusCode, body } = await api
        .patch(`/api/v1/cards/${card.id}/attachments/${attachments[1].id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.upatedCard.id).toBe(attachments[1].id);
      expect(body.upatedCard.filename).not.toEqual(attachments[1].filename);
      expect(body.upatedCard.filename).toEqual(inputBody.filename);
      expect(body.upatedCard.url).toEqual(attachments[1].url);
      expect(body.upatedCard.url).not.toEqual(inputBody.url);
    });

    test('case 2: Updating a link. It should return a file name and link updated', async () => {
      await models.CardAttachment.update(
        { url: attachments[1].url, filename: attachments[1].filename },
        { where: { id: attachments[1].id } },
      );

      const { statusCode, body } = await api
        .patch(`/api/v1/cards/${card.id}/attachments/${attachments[1].id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.upatedCard.id).toBe(attachments[1].id);
      expect(body.upatedCard.filename).not.toEqual(attachments[1].filename);
      expect(body.upatedCard.filename).toEqual(inputBody.filename);
      expect(body.upatedCard.url).not.toEqual(attachments[1].url);
      expect(body.upatedCard.url).toEqual(inputBody.url);
    });

    test('It should return an error because the attachment does not exist', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/cards/${card.id}/attachments/2741ab6d-5444-4112-8dd7-1fd0de7da37a`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(404);
    });

    test('It should return an error because neither the filename nor the url to update was provided', async () => {
      delete inputBody.filename;
      delete inputBody.url;

      const { statusCode, body } = await api
        .patch(`/api/v1/cards/${card.id}/attachments/${attachments[1].id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(400);
      expect(body.message).toMatch(/At least one of them must be provided/);
    });
  });

  describe('DELETE /cards/{cardId}/attachments/{attachmentId}', () => {
    test('It should return an error because the attachment was not found', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/cards/${card.id}/attachments/2741ab6d-5444-4112-8dd7-1fd0de7da37a`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });

    test('case 1: Deleting attachment that is a file. It should return a success message', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/cards/${card.id}/attachments/${attachments[0].id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.deletedCard).toBe(1);
    });

    test('case 1: Deleting attachment that is a link. It should return a success message', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/cards/${card.id}/attachments/${attachments[1].id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

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
