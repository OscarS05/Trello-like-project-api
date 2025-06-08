const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for list endpoints', () => {
  let accessTokenUser1 = null;
  let accessTokenUser2 = null;
  let workspace = null;
  let project = null;
  let list = null;

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

    workspace = await models.Workspace.findByPk(
      'f4bbaf96-10d4-468e-b947-40e64f473cb6',
    );
    project = await models.Project.findByPk(
      '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
    );
    list = await models.List.findByPk('7f210809-184f-449d-8cb6-7bdca222201a');

    const { body: authLogin } = await api
      .post('/api/v1/auth/login')
      .send({ email: 'user4@email.com', password: 'Customer123@' });
    accessTokenUser2 = authLogin.accessToken;
  });

  describe('GET /workspaces/{workspaceId}/projects/{projectId}/lists', () => {
    test('It should return a list of lists with its cards', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/workspaces/${workspace.id}/projects/${project.id}/lists`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(Array.isArray(body.lists)).toBeTruthy();
      expect(body.lists[0]).toHaveProperty('cards');
      expect(Array.isArray(body.lists[0].cards)).toBe(true);
      expect(body.lists[0].cards.length).toBeGreaterThan(0);
      expect(body.lists[0].projectId).toBe(project.id);

      body.lists[0].cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
      });
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { body: authLogin } = await api
        .post('/api/v1/auth/login')
        .send({ email: 'user4@email.com', password: 'Customer123@' });

      const { statusCode } = await api
        .get(`/api/v1/workspaces/8bc9b526-4c33-4b88-af81-0fd6a7c05188`)
        .set({ Authorization: `Bearer ${authLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /workspaces/{workspaceId}/projects/{projectId}/lists', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        name: 'list 4',
      };
    });

    test('It should return a created list', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/workspaces/${workspace.id}/projects/${project.id}/lists`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.newList).toHaveProperty('id');
      expect(body.newList.name).toEqual(inputBody.name);
    });

    test('It should return an error because the name is invalid', async () => {
      inputBody.name = 'New name 15 @!**';

      const { statusCode } = await api
        .post(`/api/v1/workspaces/${workspace.id}/projects/${project.id}/lists`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /workspaces/{workspaceId}/projects/{projectId}/lists/{listId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = {
        newName: 'In progress 4',
      };
    });

    test('It should return an updated list', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/lists/${list.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedList.id).toBe(list.id);
      expect(body.updatedList.name).not.toEqual(list.name);
    });

    test('It should return an error because the user does not have permissions to perform this action.', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/lists/${list.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('DELETE /workspaces/{workspaceId}/projects/{projectId}/lists/{listId}', () => {
    test('It should return an error because the user(member role) does not have permissions to delete the list', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/lists/${list.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser2}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/lists/${list.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|deleted/);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
