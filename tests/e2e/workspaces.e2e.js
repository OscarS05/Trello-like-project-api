const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for /workspaces path', () => {
  let accessTokenUser1 = null;

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
  });

  describe('GET /workspaces/:workspaceId', () => {
    test('It should return a workspace with its projects', async () => {
      const workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );

      const { statusCode, body } = await api
        .get(`/api/v1/workspaces/${workspace.id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.workspace.id).toEqual(workspace.id);
      expect(body.workspace).toHaveProperty('projects');
      expect(Array.isArray(body.workspace.projects)).toBe(true);
      expect(body.workspace.projects.length).toBeGreaterThan(0);

      body.workspace.projects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project.workspaceId).toBe(workspace.id);
      });
    });

    test('It should return an error because the workspaceId provided was not found', async () => {
      const { statusCode } = await api
        .get(`/api/v1/workspaces/8bc9b526-4c33-4b88-af81-0fd6a7c05188`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('GET /workspaces/', () => {
    test('It should return a workspaces with its projects', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/workspaces`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.workspacesAndProjects.length).toBeGreaterThan(0);
      expect(body.workspacesAndProjects[0]).toHaveProperty('projects');
      expect(body.workspacesAndProjects[0].projects.length).toBeGreaterThan(0);

      body.workspacesAndProjects[0].projects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project.workspaceId).toBe(body.workspacesAndProjects[0].id);
      });
    });

    test('It should return an error because the accessToken is wrong', async () => {
      const { statusCode } = await api
        .get(`/api/v1/workspaces`)
        .set({ Authorization: `Bearer wrong-token-123` });

      expect(statusCode).toEqual(401);
    });
  });

  describe('POST /workspaces/', () => {
    const inputBody = {
      name: 'workspace 4',
    };

    test('It should return a created workspace without description', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/workspaces`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.workspace).toHaveProperty('id');
      expect(body.workspace.name).toEqual(inputBody.name);
      expect(body.workspace.description).toBeNull();
    });

    test('It should create a workspace with description', async () => {
      inputBody.description = 'This is a description';

      const { statusCode, body } = await api
        .post(`/api/v1/workspaces`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.workspace.name).toEqual(inputBody.name);
      expect(body.workspace.description).toEqual(inputBody.description);
    });

    test('It should return an error because the description is invalid', async () => {
      inputBody.description = 'This is a description @!**';

      const { statusCode } = await api
        .post(`/api/v1/workspaces`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the name is invalid', async () => {
      inputBody.name = 'name @!**';

      const { statusCode } = await api
        .post(`/api/v1/workspaces`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /workspaces/:workspaceId', () => {
    let workspace = null;
    const inputBody = {
      name: 'workspace 4',
    };

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    test('It should return an updated workspace without description', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/workspaces/${workspace.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.workspace).toHaveProperty('id');
      expect(body.workspace.name).not.toEqual(workspace.name);
    });

    test('It should return an updated workspace with description', async () => {
      inputBody.description = 'description was updated';

      const { statusCode, body } = await api
        .patch(`/api/v1/workspaces/${workspace.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.workspace).toHaveProperty('id');
      expect(body.workspace.name).not.toEqual(workspace.name);
      expect(body.workspace.description).not.toEqual(workspace.description);
    });

    test('It should return an error because the user does not have permissions to perform this action.', async () => {
      inputBody.description = 'description was updated';

      const { statusCode } = await api
        .patch(`/api/v1/workspaces/08a78a8e-5aa5-4f12-a055-deb2055abf0e`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('DELETE /workspaces/:workspaceId', () => {
    let workspace = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    test('It should return an success message', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/workspaces/${workspace.id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|deleted/);
    });

    test('It should return an error because the user(member role) does not have permissions to delete the workspace', async () => {
      const { statusCode } = await api
        .delete(`/api/v1/workspaces/08a78a8e-5aa5-4f12-a055-deb2055abf0e`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
