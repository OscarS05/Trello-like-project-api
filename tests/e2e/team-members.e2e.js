const request = require('supertest');

const createApp = require('../../api/app');
const { models } = require('../../api/src/infrastructure/store/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('tests for project-members endpoints', () => {
  let accessTokenUser1 = null;
  let workspace = null;
  let teamWithItsMembers = null;
  let teamMember1 = null;
  let teamMember2 = null;

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
    teamWithItsMembers = await models.Team.findOne({
      where: { id: 'a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0' },
      include: [{ model: models.TeamMember, as: 'teamMembers' }],
    });
    [teamMember1, teamMember2] = teamWithItsMembers.teamMembers;
  });

  describe('GET /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}/projects', () => {
    test('It should return projects to which specific team member belong', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember1.id}/projects`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.ProjectsTeamMemberBelongs[0].teams[0].id).toEqual(
        teamWithItsMembers.id,
      );
      expect(body.ProjectsTeamMemberBelongs[0]).toHaveProperty('teams');
      expect(Array.isArray(body.ProjectsTeamMemberBelongs[0].teams)).toBe(true);
      expect(body.ProjectsTeamMemberBelongs[0].teams.length).toBeGreaterThan(0);

      body.ProjectsTeamMemberBelongs[0].teams.forEach((team) => {
        expect(team.id).toEqual(teamWithItsMembers.id);
        expect(team.name).toEqual(teamWithItsMembers.name);
      });
    });

    test('It should return an error because the teamId provided was not found', async () => {
      const { statusCode } = await api
        .get(
          `/api/v1/workspaces/${workspace.id}/teams/3a81c842-3ecd-465f-89a0-20bb61e7070d/members/${teamMember1.id}/projects`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });

    test('It should return an error because the teamId exist but user does not belong', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user4@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .get(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember1.id}/projects`,
        )
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(404);
    });
  });

  describe('GET /workspaces/{workspaceId}/teams/{teamId}/members', () => {
    test('It should return a list of team members', async () => {
      const { statusCode, body } = await api
        .get(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.teamMembers[0].id).toEqual(teamMember1.id);
      expect(body.teamMembers[1].id).toEqual(teamMember2.id);
    });

    test('It should return an error because the teamId provided was not found', async () => {
      const { statusCode } = await api
        .get(
          `/api/v1/workspaces/${workspace.id}/teams/3a81c842-3ecd-465f-89a0-20bb61e7070d/members`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });
  });

  describe('POST /workspaces/{workspaceId}/teams/{teamId}/members', () => {
    let inputBody = null;

    beforeAll(async () => {
      const { body } = await api
        .post(`/api/v1/workspaces/${workspace.id}/members`)
        .send({ userId: '5bd33955-b470-434c-8d5a-4528f759dc9f' }) // user4
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      inputBody = {
        workspaceMemberId: body.addedMember.id,
      };
    });

    test('It should return the new project member', async () => {
      const { statusCode, body } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members`,
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
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);

      await models.TeamMember.destroy({
        where: {
          workspaceMemberId: inputBody.workspaceMemberId,
          teamId: teamWithItsMembers.id,
        },
      });
    });

    test('It should return an error because the workspaceMember to be added does not exist', async () => {
      const consoleErrorMock = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      inputBody.workspaceMemberId = '1241b008-6bd8-4856-b551-1c6e1cc5894e';

      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(500);

      consoleErrorMock.mockRestore();
    });

    test('It should return an error because the requester does not have permissions to do so.', async () => {
      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/teams/b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1/members`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('PATCH /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}', () => {
    let inputBody = null;

    beforeEach(() => {
      inputBody = { newRole: 'admin' };
    });

    test('It should return an error because the requester cannot change the role to the owner', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember1.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the new role is not valid', async () => {
      inputBody.newRole = 'viewer';

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember2.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the member to be updated already has the same role', async () => {
      inputBody.newRole = 'member';

      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember2.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
    });

    test('It should return the workspace member with the new role', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember2.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedMember.role).toEqual(inputBody.newRole);
      expect(body.updatedMember.role).not.toEqual(teamMember2.role);
      expect(body.updatedMember.id).toEqual(teamMember2.id);
      expect(body.message).toMatch(/updated successfully/);
    });

    test('It should return an error because the member updating the role does not have permissions to change it', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1/members/104d9020-dddd-4f33-94d3-ddd444444444`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('PATCH /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}/ownership', () => {
    test('It should return an error because the member to be updated was not found', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/3a81c842-3ecd-465f-89a0-20bb61e7070d/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });

    test('It should return an error because the requester is not the owner', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1/members/103c8010-cccc-4f22-93c2-ccc333333333/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the member to be updated is the same one making the request', async () => {
      const { statusCode } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember1.id}/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(409);
    });

    test('It should return the workspace member with the new role', async () => {
      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember2.id}/ownership`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|updated/);
      expect(body.updatedRows).toEqual([2]);
    });

    test('It should return the workspace member with the new role', async () => {
      const { body: bodyAuth } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });

      const { statusCode, body } = await api
        .patch(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember1.id}/ownership`,
        )
        .set({ Authorization: `Bearer ${bodyAuth.accessToken}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successful|updated/);
      expect(body.updatedRows).toEqual([2]);
    });
  });

  describe('DELETE /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}', () => {
    let workspace2 = null;
    let team2WithItsMembers = null;
    let team2Member1 = null;

    beforeAll(async () => {
      workspace2 = await models.Workspace.findByPk(
        '07d523b0-9a9d-4d7f-a615-56205f0399c6',
      );
      team2WithItsMembers = await models.Team.findOne({
        where: { id: 'c3f3c2a0-2345-4bbb-9ccc-44d59e9fd8e2' },
        include: [{ model: models.TeamMember, as: 'teamMembers' }],
      });
      [team2Member1, ,] = team2WithItsMembers.teamMembers;
    });

    test('case 1: user2(admin role) was removed by the owner. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember2.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.removedRows).toBe(1);
    });

    test('case 2: the owner wants to leaving the team without members. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${teamWithItsMembers.id}/members/${teamMember1.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });
      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.removedRows).toBe(1);
    });

    test('It should return an error because the requester(member role) cannot remove the owner', async () => {
      const { body: bodyLogin } = await api
        .post('/api/v1/auth/login')
        .send({ email: 'user2@email.com', password: 'Customer123@' });

      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace2.id}/teams/${team2WithItsMembers.id}/members/${team2Member1.id}`,
        )
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });

    test('case 3: the owner wants to leaving the workspace with members. It should return the success message', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace2.id}/teams/${team2WithItsMembers.id}/members/${team2Member1.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully|removed/);
      expect(body.removedRows).toBe(1);
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
