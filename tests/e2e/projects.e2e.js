const request = require('supertest');
const path = require('path');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for projects endpoints', () => {
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

  describe('GET /workspaces/projects/:projectId/board', () => {
    test('It should return a all the project information', async () => {
      const project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );

      const { statusCode, body } = await api
        .get(`/api/v1/workspaces/projects/${project.id}/board`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.projectData.id).toEqual(project.id);
      expect(Array.isArray(body.projectData.lists)).toBe(true);
      expect(body.projectData.lists.length).toBeGreaterThan(0);

      body.projectData.lists.forEach((list) => {
        expect(list).toHaveProperty('id');
        expect(list).toHaveProperty('name');
        expect(Array.isArray(list.cards)).toBe(true);

        list.cards.forEach((card) => {
          expect(card).toHaveProperty('id');
          expect(card).toHaveProperty('name');
          expect(Array.isArray(card.cardMembers)).toBe(true);
          expect(card.cardMembers.length).toBeGreaterThan(0);
          expect(Array.isArray(card.labels)).toBe(true);
          expect(card.labels.length).toBeGreaterThan(0);
          expect(card).toHaveProperty('attachmentsCount');
          expect(card.checklistProgress).toHaveProperty('total');
          expect(card.checklistProgress).toHaveProperty('checked');
        });
      });
    });

    test('It should return an error', async () => {
      const { statusCode } = await api
        .get(
          `/api/v1/workspaces/projects/f4bbaf96-10d4-468e-b947-40e64f473cb6/board`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('GET /workspaces/:workspaceId/projects/', () => {
    let workspace = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    test('It should return a mew project', async () => {
      const project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );

      const { statusCode, body } = await api
        .get(`/api/v1/workspaces/${workspace.id}/projects`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.projects[0].id).toEqual(project.id);
      expect(body.projects[0]).toHaveProperty('backgroundUrl');
      expect(body.projects[0]).toHaveProperty('workspaceMemberId');
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user4@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .get(`/api/v1/workspaces/${workspace.id}/projects`)
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /workspaces/:workspaceId/projects/', () => {
    let workspace = null;
    const inputBody = {
      name: 'project 5',
      visibility: 'private',
      backgroundUrl:
        'https://images.unsplash.com/photo-1741812191037-96bb5f12010a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDJ8MzE3MDk5fHx8fHwyfHwxNzQ1MjY2MTIzfA&ixlib=rb-4.0.3&q=80&w=400',
    };

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    test('It should return a workspace with its projects', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/workspaces/${workspace.id}/projects`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.projectCreated.name).toEqual(inputBody.name);
      expect(body.projectCreated.visibility).toEqual(inputBody.visibility);
    });

    test('It should return an error because the requester does not belong to the project', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user4@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .get(`/api/v1/workspaces/${workspace.id}/projects`)
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because inputBody is invalid', async () => {
      inputBody.visibility = 'public';

      const { statusCode } = await api
        .post(`/api/v1/workspaces/${workspace.id}/projects`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /workspaces/:workspaceId/projects/:projectId', () => {
    let workspace = null;
    let project = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );
    });

    beforeEach(() => {
      inputBody = {
        name: 'project 5',
        visibility: 'workspace',
      };
    });

    test('It should return an updated project updating name and visibility', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/workspaces/${workspace.id}/projects/${project.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedProject.name).not.toEqual(project.name);
      expect(body.updatedProject.visibility).not.toEqual(project.visibility);
    });

    test('It should return an updated project updating only the visibility', async () => {
      delete inputBody.visibility;

      const { statusCode, body } = await api
        .patch(`/api/v1/workspaces/${workspace.id}/projects/${project.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedProject.name).not.toEqual(project.name);
      expect(body.updatedProject.visibility).not.toEqual(project.visibility);
    });

    test('It should return an error because the requester does not have permissions to update the project', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .patch(`/api/v1/workspaces/${workspace.id}/projects/${project.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('PATCH /workspaces/:workspaceId/projects/:projectId/background', () => {
    let workspace = null;
    let project = null;
    let imagePath = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );
      imagePath = path.join(__dirname, '../fake-data/fixtures/landscape.jpeg');
    });

    test('It should return an enqued background image', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/background`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .attach('background-image', imagePath);

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/queued successfully/);
      expect(body.job).toBeTruthy();
    });

    test('It should return an error because the file extension is invalid', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      imagePath = path.join(__dirname, '../fake-data/fixtures/file.txt');

      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/background`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` })
        .attach('background-image', imagePath);

      expect(statusCode).toEqual(500);
      expect(body.stack).toMatch(/Invalid file type/);
    });

    test('It should return an error because the requester does not have permissions to update the project', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/background`,
        )
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` })
        .attach('background-image', imagePath);

      expect(statusCode).toEqual(403);
    });
  });

  describe('DELETE /workspaces/:workspaceId/projects/:projectId', () => {
    let workspace = null;
    let project = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );
    });

    test('It should return an error because the requester does not have permissions to update the project', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .delete(`/api/v1/workspaces/${workspace.id}/projects/${project.id}`)
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the projectId was not found', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/projects/b2f2cd71-02b1-4f2a-82f2-e11d6f6b02b2`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return a success message', async () => {
      const { statusCode, body } = await api
        .delete(`/api/v1/workspaces/${workspace.id}/projects/${project.id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/deleted successfully/);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
