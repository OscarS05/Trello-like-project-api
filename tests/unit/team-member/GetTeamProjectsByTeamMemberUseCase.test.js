const GetTeamProjectsByTeamMemberUseCase = require('../../../api/src/application/use-cases/team-member/GetTeamProjectsByTeamMemberUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const {
  createTeamMember,
  createTeam,
  createProject,
} = require('../../fake-data/fake-entities');

describe('GetTeamProjectsByTeamMemberUseCase', () => {
  let teamId;
  let projectId;

  let teamMember;
  let projectTeams;
  let dbResponse;
  let mockTeamMemberRepository;
  let getTeamProjectsByTeamMemberUseCase;

  beforeEach(() => {
    teamId = createTeamMember().teamId;
    projectId = createProject().id;

    teamMember = createTeamMember();
    projectTeams = [
      { teamId, projectId },
      { teamId, projectId },
    ];

    dbResponse = [
      {
        ...createProject(),
        teams: [createTeam(), createTeam()],
      },
      {
        ...createProject(),
        teams: [createTeam(), createTeam()],
      },
    ];

    mockTeamMemberRepository = {
      findProjectsByTeamMember: jest.fn().mockResolvedValue(dbResponse),
    };

    getTeamProjectsByTeamMemberUseCase = new GetTeamProjectsByTeamMemberUseCase(
      {
        teamMemberRepository: mockTeamMemberRepository,
      },
    );
  });

  test('It should return a team member', async () => {
    const result = await getTeamProjectsByTeamMemberUseCase.execute(
      teamMember,
      projectTeams,
    );

    expect(
      mockTeamMemberRepository.findProjectsByTeamMember,
    ).toHaveBeenCalledWith([projectId, projectId], teamMember);
    expect(result).toMatchObject(
      dbResponse.map((project) => new ProjectDto(project)),
    );
  });

  test('It should return an error because projectTeams is not an array', async () => {
    await expect(
      getTeamProjectsByTeamMemberUseCase.execute(teamMember, null),
    ).rejects.toThrow(/is not an array/);
    expect(
      mockTeamMemberRepository.findProjectsByTeamMember,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because teamMember was not provided', async () => {
    await expect(
      getTeamProjectsByTeamMemberUseCase.execute(null, projectTeams),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockTeamMemberRepository.findProjectsByTeamMember,
    ).not.toHaveBeenCalled();
  });

  test('It should return an empty array because the findProjectsByTeamMember operation did not find anything', async () => {
    mockTeamMemberRepository.findProjectsByTeamMember.mockResolvedValue([]);

    const result = await getTeamProjectsByTeamMemberUseCase.execute(
      teamMember,
      projectTeams,
    );
    expect(
      mockTeamMemberRepository.findProjectsByTeamMember,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
