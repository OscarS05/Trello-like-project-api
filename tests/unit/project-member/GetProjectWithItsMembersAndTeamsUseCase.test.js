const GetProjectWithItsMembersAndTeamsUseCase = require('../../../api/src/application/use-cases/project-member/GetProjectWithItsMembersAndTeamsUseCase');
const ProjectMemberDto = require('../../../api/src/application/dtos/projectMember.dto');
const TeamDto = require('../../../api/src/application/dtos/team.dto');
const {
  createAnotherProjectMember,
  createProjectMember,
  createProject,
  createWorkspaceMember,
  createUser,
  createAnotherWorkspaceMember,
  createAnotherUser,
  createTeam,
  createTeamMember,
} = require('../../fake-data/fake-entities');

describe('GetProjectWithItsMembersAndTeamsUseCase', () => {
  let projectId;
  let projectWithData;
  let useCaseResponse;
  let mockProjectMemberRepository;
  let getProjectWithItsMembersAndTeamsUseCase;

  beforeEach(() => {
    projectId = createProjectMember().projectId;
    projectWithData = {
      ...createProject(),
      projectMembers: [
        {
          ...createProjectMember(),
          workspaceMember: createWorkspaceMember({ user: createUser() }),
        },
        {
          ...createAnotherProjectMember(),
          workspaceMember: createAnotherWorkspaceMember({
            user: createAnotherUser(),
          }),
        },
      ],
      teams: [
        {
          ...createTeam(),
          teamMembers: [
            createTeamMember({
              workspaceMember: createWorkspaceMember({ user: createUser() }),
            }),
          ],
        },
      ],
    };
    useCaseResponse = {
      projectMembers: projectWithData.projectMembers.map((pm) =>
        ProjectMemberDto.fromModel(pm, projectWithData.teams),
      ),
      teams: projectWithData.teams.map((team) =>
        TeamDto.fromModel(team, projectWithData.projectMembers),
      ),
    };

    mockProjectMemberRepository = {
      findProjectWithItsMembersAndTeams: jest
        .fn()
        .mockResolvedValue(projectWithData),
    };

    getProjectWithItsMembersAndTeamsUseCase =
      new GetProjectWithItsMembersAndTeamsUseCase({
        projectMemberRepository: mockProjectMemberRepository,
      });
  });

  test('It should return a list of project members', async () => {
    const result =
      await getProjectWithItsMembersAndTeamsUseCase.execute(projectId);

    expect(
      mockProjectMemberRepository.findProjectWithItsMembersAndTeams,
    ).toHaveBeenCalledWith(projectId);
    expect(result).toMatchObject(useCaseResponse);
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await getProjectWithItsMembersAndTeamsUseCase.execute(null);
    } catch (error) {
      expect(
        mockProjectMemberRepository.findProjectWithItsMembersAndTeams,
      ).not.toHaveBeenCalled();
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty array because the findProjectWithItsMembersAndTeams operation to the db does not find anything', async () => {
    projectWithData.projectMembers = [];
    projectWithData.teams = [];

    mockProjectMemberRepository.findProjectWithItsMembersAndTeams.mockResolvedValue(
      projectWithData,
    );

    const result =
      await getProjectWithItsMembersAndTeamsUseCase.execute(projectId);

    expect(
      mockProjectMemberRepository.findProjectWithItsMembersAndTeams,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ projectMembers: [], teams: [] });
  });

  test('It should return an empty object because the findProjectWithItsMembersAndTeams operation to the db does not find any project', async () => {
    mockProjectMemberRepository.findProjectWithItsMembersAndTeams.mockResolvedValue(
      {},
    );

    const result =
      await getProjectWithItsMembersAndTeamsUseCase.execute(projectId);

    expect(
      mockProjectMemberRepository.findProjectWithItsMembersAndTeams,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
