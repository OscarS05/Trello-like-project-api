const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for workspace-members endpoints', () => {
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

  describe('GET /workspaces/:workspaceId/members', () => {
    let workspaceWithItsMembers = null;

    beforeAll(async () => {
      workspaceWithItsMembers = await models.Workspace.findOne({
        where: { id: 'f4bbaf96-10d4-468e-b947-40e64f473cb6' },
        include: { model: models.WorkspaceMember, as: 'workspaceMembers' },
      });
    });

    test('It should return a workspace members with its teams and projects', async () => {
      const { statusCode, body } = await api
        .get(`/api/v1/workspaces/${workspaceWithItsMembers.id}/members`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.workspaceMembers[0].id).toEqual(
        workspaceWithItsMembers.workspaceMembers[0].id,
      );
      expect(body.workspaceMembers[0]).toHaveProperty('teams');
      expect(body.workspaceMembers[0]).toHaveProperty('projects');
      expect(Array.isArray(body.workspaceMembers[0].projects)).toBe(true);
      expect(Array.isArray(body.workspaceMembers[0].teams)).toBe(true);
      expect(body.workspaceMembers[0].projects.length).toBeGreaterThan(0);
      expect(body.workspaceMembers[0].teams.length).toBeGreaterThan(0);

      body.workspaceMembers[0].projects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
      });

      body.workspaceMembers[0].teams.forEach((teams) => {
        expect(teams).toHaveProperty('id');
        expect(teams).toHaveProperty('name');
      });
    });

    test('It should return an error because the workspaceId provided was not found', async () => {
      const { statusCode } = await api
        .get(`/api/v1/workspaces/8bc9b526-4c33-4b88-af81-0fd6a7c05188/members`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the workspaceId exist but user does not belong', async () => {
      const { body } = await api.post('/api/v1/auth/login').send({
        email: 'user4@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .get(`/api/v1/workspaces/${workspaceWithItsMembers.id}/members`)
        .set({ Authorization: `Bearer ${body.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /workspaces/:workspaceId/members', () => {
    let workspace = null;
    const inputBody = { userId: '5bd33955-b470-434c-8d5a-4528f759dc9f' };

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    test('It should return the new workspace member', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/workspaces/${workspace.id}/members`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.addedMember.userId).toEqual(inputBody.userId);
    });

    test('It should return an error because the User is already a member of this workspace', async () => {
      inputBody.userId = '81f72543-69d9-4764-9b73-57e0cf785731';

      const { statusCode } = await api
        .post(`/api/v1/workspaces/${workspace.id}/members`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
    });

    test('It should return an error because the user to be added does not exist', async () => {
      const consoleErrorMock = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      inputBody.userId = '1241b008-6bd8-4856-b551-1c6e1cc5894e';

      const { statusCode } = await api
        .post(`/api/v1/workspaces/${workspace.id}/members`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(500);

      consoleErrorMock.mockRestore();
    });

    test('It should return an error because the user adding the new member does not have permissions to do so.', async () => {
      const { statusCode } = await api
        .post(`/api/v1/workspaces/08a78a8e-5aa5-4f12-a055-deb2055abf0e/members`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('PATCH /workspaces/:workspaceId/members/:workspaceMemberId', () => {
    let workspace = null;
    let workspaceMemberUser2 = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      workspaceMemberUser2 = await models.WorkspaceMember.findByPk(
        '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
      );
    });

    beforeEach(() => {
      inputBody = { newRole: 'member' };
    });

    test('It should return an error because the member to be updated already has the same role', async () => {
      inputBody.newRole = 'admin';

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/${workspaceMemberUser2.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
    });

    test('It should return the workspace member with the new role', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/${workspaceMemberUser2.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedMember.role).toEqual(inputBody.newRole);
      expect(body.updatedMember.id).toEqual(workspaceMemberUser2.id);
      expect(body.updatedMember.role).not.toEqual(workspaceMemberUser2.role);
      expect(body.message).toMatch(/successfully/);
    });

    test('It should return an error because the member updating the role does not have permissions to change it', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/08a78a8e-5aa5-4f12-a055-deb2055abf0e/members/4ac99e60-0de2-493e-a04e-7284e35aa21d`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the member to be updated is the same one making the request', async () => {
      const workspaceMemberUser1 = '0c6650a2-59d4-411d-8709-3719030ee96b';

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/${workspaceMemberUser1}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the new role is not valid', async () => {
      inputBody.newRole = 'viewer';

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/${workspaceMemberUser2.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });
  });

  describe('PATCH /workspaces/:workspaceId/members/:workspaceMemberId/ownership', () => {
    let workspace = null;
    let workspaceMemberUser2 = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      workspaceMemberUser2 = await models.WorkspaceMember.findByPk(
        '8bc9b526-4c33-4b88-af81-0fd6a7c05188',
      );
    });

    beforeEach(() => {
      inputBody = { newRole: 'member' };
    });

    test('It should return an error because the member to be updated already has the same role', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/0c6650a2-59d4-411d-8709-3719030ee96b/ownership`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the member updating the role does not have permissions to change it', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/08a78a8e-5aa5-4f12-a055-deb2055abf0e/members/${workspaceMemberUser2.id}/ownership`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the workspaceMemberId is wrong', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/1241b008-6bd8-4856-b551-1c6e1cc5894e/ownership`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });

    test('It should return the workspace member with the new role', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/${workspaceMemberUser2.id}/ownership`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|updated/);
    });

    test('It should return the workspace member with the new role', async () => {
      const { body: bodyAuth } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });
      const workspaceMemberUser1 = '0c6650a2-59d4-411d-8709-3719030ee96b';

      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/members/${workspaceMemberUser1}/ownership`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${bodyAuth.accessToken}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|updated/);
    });
  });

  describe('DELETE /workspaces/:workspaceId/members/:workspaceMemberId', () => {
    let workspace = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    test('case 1: user2(member role) was removed by the owner. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/07d523b0-9a9d-4d7f-a615-56205f0399c6/members/5ad6d9ba-7f86-47e3-a984-c00541d44c2b`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
    });

    test('case 2: the owner wants to leaving the workspace without members. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/07d523b0-9a9d-4d7f-a615-56205f0399c6/members/484c8f02-4308-44f9-9a33-c93aab1482c4`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
    });

    test('case 3: the owner wants to leaving the workspace with members. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/members/0c6650a2-59d4-411d-8709-3719030ee96b`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
    });

    test('It should return an error because the requester(member role) cannot remove the owner', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/08a78a8e-5aa5-4f12-a055-deb2055abf0e/members/4ac99e60-0de2-493e-a04e-7284e35aa21d`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
