const request = require('supertest');

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

  describe('GET /workspaces/:workspaceId/teams', () => {
    let workspace = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    test('It should return the teams with members and projects to which the teams belong', async () => {
      const teams = await models.Team.findAll({
        where: { workspaceId: 'f4bbaf96-10d4-468e-b947-40e64f473cb6' },
      });

      const { statusCode, body } = await api
        .get(`/api/v1/workspaces/${workspace.id}/teams`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.teams[0].id).toEqual(teams[0].id);
      expect(Array.isArray(body.teams[0].members)).toBe(true);
      expect(body.teams[0].members.length).toBeGreaterThan(0);
      expect(Array.isArray(body.teams[0].projects)).toBe(true);
      expect(body.teams[0].projects.length).toBeGreaterThan(0);

      body.teams[0].members.forEach((member) => {
        expect(member).toHaveProperty('id');
        expect(member).toHaveProperty('name');
        expect(member.workspaceId).toBe(workspace.id);
      });
    });

    test('It should return an error because the requester does not belong to the workspace', async () => {
      const { body: bodyAuth } = await api
        .post('/api/v1/auth/login')
        .send({ email: 'user4@email.com', password: 'Customer123@' });

      const { statusCode } = await api
        .get(`/api/v1/workspaces/${workspace.id}/teams`)
        .set({ Authorization: `Bearer ${bodyAuth.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('POST /workspaces/{workspaceId}/teams', () => {
    let workspace = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
    });

    beforeEach(() => {
      inputBody = {
        name: 'team 5',
      };
    });

    test('It should return the new team', async () => {
      const { statusCode, body } = await api
        .post(`/api/v1/workspaces/${workspace.id}/teams`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.teamCreated.name).toEqual(inputBody.name);
    });

    test('It should return an error because the requester does not belong to the team', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user4@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .post(`/api/v1/workspaces/${workspace.id}/teams`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because inputBody is invalid', async () => {
      inputBody.visibility = 'proyect 5 **!!';

      const { statusCode } = await api
        .post(`/api/v1/workspaces/${workspace.id}/teams`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });
  });

  describe('POST /workspaces/{workspaceId}/teams/{teamId}/projects/{projectId}', () => {
    let workspace = null;
    let project = null;
    let team = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );
      team = await models.Team.findByPk('a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0');
    });

    test('It should return a success message', async () => {
      await models.ProjectTeam.destroy({
        where: { projectId: project.id, teamId: team.id },
      });

      const { statusCode, body } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(201);
      expect(body.message).toMatch(/successfully assigned/);
      expect(body.result.assignedProject.teamId).toBe(team.id);
      expect(body.result.assignedProject.projectId).toBe(project.id);
    });

    test('It should return an error because the assignation already exists', async () => {
      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toBe(409);
    });

    test('It should return an error because the requester does not belong to the team', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user4@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the project to be assigned does not belong to the workspace', async () => {
      const { statusCode } = await api
        .post(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/74a0f3ff-6f9b-49c5-a9ea-2297dd15e1d3`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toBe(400);
    });
  });

  describe('PATCH /workspaces/{workspaceId}/teams/{teamId}', () => {
    let workspace = null;
    let team = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      team = await models.Team.findByPk('a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0');
    });

    beforeEach(() => {
      inputBody = {
        name: 'new name 5',
      };
    });

    test('It should return an updated team', async () => {
      const { statusCode, body } = await api
        .patch(`/api/v1/workspaces/${workspace.id}/teams/${team.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.updatedTeam.name).not.toEqual(team.name);
      expect(body.updatedTeam.name).toEqual(inputBody.name);
      expect(body.updatedTeam.id).toBe(team.id);
    });

    test('It should return an error because the name is invalid', async () => {
      inputBody.name = 'new name **!!';

      const { statusCode } = await api
        .patch(`/api/v1/workspaces/${workspace.id}/teams/${team.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the requester does not have permissions to update the team', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });

      const { statusCode } = await api
        .patch(`/api/v1/workspaces/${workspace.id}/teams/${team.id}`)
        .send(inputBody)
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });
  });

  describe('DELETE /workspaces/{workspaceId}/teams/{teamId}/projects/{projectId}', () => {
    let workspace = null;
    let team = null;
    let project = null;
    let inputBody = null;

    beforeAll(async () => {
      workspace = await models.Workspace.findByPk(
        'f4bbaf96-10d4-468e-b947-40e64f473cb6',
      );
      team = await models.Team.findByPk('a1e1a080-90e7-4fd4-8d6a-22b59b7eb6d0');
      project = await models.Project.findByPk(
        '8f6e2597-057c-4d84-9851-ae6d7ca9a392',
      );
    });

    beforeEach(() => {
      inputBody = {
        removeTeamMembersFromProject: true,
      };
    });

    test('It should return an error because the requester does not have permissions to unassign the team to the project', async () => {
      const { body: bodyLogin } = await api.post('/api/v1/auth/login').send({
        email: 'user2@email.com',
        password: 'Customer123@',
      });
      await models.WorkspaceMember.update(
        { role: 'member' },
        {
          where: { id: '8bc9b526-4c33-4b88-af81-0fd6a7c05188' },
        },
      );

      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${bodyLogin.accessToken}` });

      expect(statusCode).toEqual(403);
    });

    test('It should return an error because the inputBody is wrong', async () => {
      inputBody.removeTeamMembersFromProject = 'no';

      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the inputBody is wrong', async () => {
      delete inputBody.removeTeamMembersFromProject;
      inputBody.name = 'newName 5';

      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the projectId does not belong to the workspace', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/798995af-266b-4322-8cce-a8ab9c821d12`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(400);
    });

    test('It should return an error because the all team members to be unassigned are project members', async () => {
      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(403);
      expect(body.message).toMatch(
        /cannot be removed from the project because all project members are part of the team/,
      );
    });

    test('case 1: unassigned the team(with members) to the project with more members. It should return a success message', async () => {
      const { body: addWMBody } = await api
        .post(`/api/v1/workspaces/${workspace.id}/members`)
        .send({
          userId: '5bd33955-b470-434c-8d5a-4528f759dc9f',
        })
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      await api
        .post(
          `/api/v1/workspaces/${workspace.id}/projects/${project.id}/members`,
        )
        .send({
          workspaceMemberId: addWMBody.addedMember.id,
        })
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully unassigned/);
      expect(body.result.unassignedProject).toBe(1);
      expect(body.result.removedMembers).toEqual([1, 1]); // There are only 2 team members in the seeders so this test should remove them.
    });

    test('It should return an error because the assignment between the project and the provided team does not exist', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team.id}/projects/${project.id}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });

    test('case 2: unassigned the team(but not unassign members) to the project with more members. It should return a success message', async () => {
      inputBody.removeTeamMembersFromProject = false;

      const team2 = 'b2e2b190-1234-4aaa-8bbb-33c48d8fc7d1';
      const project2 = 'cba6445a-9bf3-4181-9b0a-60ab44ae746d';

      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/${workspace.id}/teams/${team2}/projects/${project2}`,
        )
        .send(inputBody)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully unassigned/);
      expect(body.result).toBe(1);
      expect(body.result.unassignedProject).not.toBeDefined();
      expect(body.result.removedMembers).not.toBeDefined();
    });
  });

  describe('DELETE /workspaces/{workspaceId}/teams/{teamId}', () => {
    let workspace2 = null;
    let team2 = null;

    beforeAll(async () => {
      workspace2 = await models.Workspace.findByPk(
        '07d523b0-9a9d-4d7f-a615-56205f0399c6',
      );
      team2 = await models.Team.findByPk(
        'c3f3c2a0-2345-4bbb-9ccc-44d59e9fd8e2',
      );
    });

    test('It should return an error because the teamId was not found', async () => {
      const { statusCode } = await api
        .delete(
          `/api/v1/workspaces/${workspace2.id}/teams/101a6e10-aaaa-4f00-91a0-aaa111111111`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(404);
    });

    test('It should transfer the ownership in projects and delete the team. It should return a success message.', async () => {
      const resultAddedWM = await models.WorkspaceMember.create({
        id: '8e89f010-f7d0-42d3-8b87-c75979b3485f',
        userId: '5bd33955-b470-434c-8d5a-4528f759dc9f',
        workspaceId: workspace2.id,
        role: 'admin',
        added_at: '2025-04-02T23:03:49.253Z',
      });
      if (!resultAddedWM?.id) throw new Error('WM was not added');
      const resultAddedPMs = await models.ProjectMember.bulkCreate([
        {
          id: '803fcbd1-ffc4-424a-8829-b909ed101a61',
          workspaceMemberId: resultAddedWM.id,
          projectId: '798995af-266b-4322-8cce-a8ab9c821d12',
          role: 'admin',
          added_at: '2025-04-02T23:03:49.253Z',
        },
        {
          id: '70339947-b8cd-466d-804e-0343aa124189',
          workspaceMemberId: resultAddedWM.id,
          projectId: '3a81c842-3ecd-465f-89a0-20bb61e7070d',
          role: 'admin',
          added_at: '2025-04-02T23:03:49.253Z',
        },
      ]);
      if (resultAddedPMs.length !== 2) throw new Error('PMs was not added');
      const resultAssignment = await models.ProjectTeam.create({
        projectId: '3a81c842-3ecd-465f-89a0-20bb61e7070d',
        teamId: team2.id,
      });
      if (!resultAssignment?.projectId) throw new Error('PMs was not added');

      const { statusCode, body } = await api
        .delete(`/api/v1/workspaces/${workspace2.id}/teams/${team2.id}`)
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully deleted/);
      expect(body.result.teamDeleted).toBe(1);
      expect(body.result.teamMembersDeletedFromProjects).toBe(4); // There 2 team members in 2 projects that have been assigned to the team
    });

    test('delete the team(this team does not have any assignment to projects). It should return a success message', async () => {
      const deletedAssignment = await models.ProjectTeam.destroy({
        where: {
          teamId: '0eaf9f08-84af-449e-ab36-eebc90b7521a',
          projectId: '1faf6252-df1d-48b8-b734-53c35e3083af',
        },
      });
      if (!deletedAssignment === 0) throw new Error('Team was not created');

      const { statusCode, body } = await api
        .delete(
          `/api/v1/workspaces/08a78a8e-5aa5-4f12-a055-deb2055abf0e/teams/0eaf9f08-84af-449e-ab36-eebc90b7521a`,
        )
        .set({ Authorization: `Bearer ${accessTokenUser1}` });

      expect(statusCode).toEqual(200);
      expect(body.message).toMatch(/successfully deleted/);
      expect(body.result.teamDeleted).toBe(1);
      expect(body.result.teamMembersDeletedFromProjects).toBe(0); // 0 because the team has not project assignments
    });
  });

  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
