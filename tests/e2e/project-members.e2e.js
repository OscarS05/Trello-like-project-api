const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for project-members endpoints', () => {
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

  describe('GET /workspaces/:workspaceId/projects/:projectId/members', () => {
    let workspace = null;
    let projectWithItsMembers = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      projectWithItsMembers = await models.Project.findOne({
        where: { id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392' },
        include: [{ model: models.ProjectMember, as: 'projectMembers' }],
      });
    });

    test('It should return a project members with its teams', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.projectMembers[0].id).toEqual(
        projectWithItsMembers.projectMembers[0].id,
      );
      expect(body.projectMembers[0]).toHaveProperty('teams');
      expect(Array.isArray(body.projectMembers[0].teams)).toBe(true);
      expect(body.projectMembers[0].teams.length).toBeGreaterThan(0);

      body.projectMembers[0].teams.forEach((teams) => {
        expect(teams).toHaveProperty('id');
        expect(teams).toHaveProperty('name');
      });
    });

    test('It should return an error because the workspaceId provided was not found', async () => {
      const { statusCode } = await api
        .get(
          `/api/v1/workspaces/1068e492-9398-40f8-a715-c81e0787e64d/projects/${projectWithItsMembers.id}/members`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the workspaceId exist but user does not belong', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user4@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .get(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members`,
        )
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /workspaces/:workspaceId/projects/:projectId/members', () => {
    let workspace = null;
    let projectWithItsMembers = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      projectWithItsMembers = await models.Project.findOne({
        where: { id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392' },
        include: [{ model: models.ProjectMember, as: 'projectMembers' }],
      });

      const { body } = await api
        .post(`/api/v1/workspaces/${workspace.id}/members`)
        .send({ userId: '66c8699e-84b5-4c2a-b277-a15dc839428d' }) // user3
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      inputBody = {
        workspaceMemberId: body.addedMember.id,
      };
    });

    test('It should return the new project member', async () => {
      const { statusCode, body } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.addedMember.workspaceMemberId).toEqual(
        inputBody.workspaceMemberId,
      );
    });

    test('It should return an error because the User is already a member of this project', async () => {
      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);

      await models.ProjectMember.destroy({
        where: {
          workspaceMemberId: inputBody.workspaceMemberId,
          projectId: projectWithItsMembers.id,
        },
      });
    });

    test('It should return an error because the user to be added does not exist', async () => {
      const consoleErrorMock = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      inputBody.workspaceMemberId = '1241b008-6bd8-4856-b551-1c6e1cc5894e';

      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(500);

      consoleErrorMock.mockRestore();
    });

    test('It should return an error because the user adding the new member does not have permissions to do so.', async () => {
      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/projects/3a81c842-3ecd-465f-89a0-20bb61e7070d/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the workspaceMemebeId provided was not found', async () => {
      const consoleErrorMock = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      inputBody.workspaceMemberId = 'a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0';

      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(500);
      consoleErrorMock.mockRestore();
    });
  });

  describe('PATCH /workspaces/:workspaceId/projects/:projectId/members/:projectMemberId', () => {
    let workspace = null;
    let projectWithItsMembers = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      projectWithItsMembers = await models.Project.findOne({
        where: { id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392' },
        include: [{ model: models.ProjectMember, as: 'projectMembers' }],
      });
    });

    beforeEach(() => {
      inputBody = { newRole: 'admin' };
    });

    test('It should return an error because the member to be updated already has the same role', async () => {
      inputBody.newRole = 'member';

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[1].id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
    });

    test('It should return the workspace member with the new role', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[1].id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedMember.role).toEqual(inputBody.newRole);
      expect(body.updatedMember.role).not.toEqual(
        projectWithItsMembers.projectMembers[1].role,
      );
      expect(body.updatedMember.id).toEqual(
        projectWithItsMembers.projectMembers[1].id,
      );
      expect(body.message).toMatch(/successfully/);
    });

    test('It should return an error because the member updating the role does not have permissions to change it', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/3a81c842-3ecd-465f-89a0-20bb61e7070d/members/003dd93b-50f8-4fed-9920-7a48155d0a14`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the member to be updated is the same one making the request', async () => {
      const workspaceMemberUser1 = projectWithItsMembers.projectMembers[0].id;

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${workspaceMemberUser1}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the new role is not valid', async () => {
      inputBody.newRole = 'viewer';

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[1].id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /workspaces/:workspaceId/projects/:projectId/members/:projectMemberId/ownership', () => {
    let workspace = null;
    let projectWithItsMembers = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      projectWithItsMembers = await models.Project.findOne({
        where: { id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392' },
        include: [{ model: models.ProjectMember, as: 'projectMembers' }],
      });
    });

    test('It should return an error because the member to be updated was not found', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });

    test('It should return an error because the member updating the role does not have permissions to change it', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/3a81c842-3ecd-465f-89a0-20bb61e7070d/members/003dd93b-50f8-4fed-9920-7a48155d0a14/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the member to be updated is the same one making the request', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[0].id}/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
    });

    test('It should return the workspace member with the new role', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[1].id}/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successful|updated/);
      expect(body.updatedRows).toEqual([2]);
    });

    test('It should return the workspace member with the new role', async () => {
      const { body: bodyAuth } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });

      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[0].id}/ownership`,
        )
        .set({ Authorization: `Bearer ${bodyAuth.accessToken}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successful|updated/);
      expect(body.updatedRows).toEqual([2]);
    });
  });

  describe('DELETE /workspaces/:workspaceId/members/:workspaceMemberId', () => {
    let workspace = null;
    let projectWithItsMembers = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      projectWithItsMembers = await models.Project.findOne({
        where: { id: '8f6e2597-057c-4d84-9851-ae6d7ca9a392' },
        include: [{ model: models.ProjectMember, as: 'projectMembers' }],
      });
    });

    test('case 1: user2(admin role) was removed by the owner. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[1].id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
    });

    test('case 2: the owner wants to leaving the project without members. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/projects/${projectWithItsMembers.id}/members/${projectWithItsMembers.projectMembers[0].id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
    });

    test('case 3: the owner wants to leaving the workspace with members. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/projects/cba6445a-9bf3-4181-9b0a-60ab44ae746d/members/9eac6780-c53d-4c26-92f2-3bc04e57d525`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
    });

    test('It should return an error because the requester(member role) cannot remove the owner', async () => {
      const { body: bodyLogin } = await api
        .post('/api/v1/auth/login')
        .send({ email: 'user2@email.com', password: 'Customer123@' });

      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/07d523b0-9a9d-4d7f-a615-56205f0399c6/projects/798995af-266b-4322-8cce-a8ab9c821d12/members/873e1c7e-75d4-46a5-bfb2-58a91845799b`,
        )
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
