const GetTeamMembersByIdUseCase = require('../../../api/src/application/use-cases/team-member/GetTeamMembersByIdUseCase');
const TeamMemberDto = require('../../../api/src/application/dtos/teamMember.dto');
const {
  createTeamMember,
  createWorkspaceMember,
  createTeam,
  createUser,
  createAnotherTeamMember,
  createAnotherWorkspaceMember,
  createAnotherUser,
} = require('../../fake-data/fake-entities');

describe('GetTeamMembersByIdUseCase', () => {
  let workspaceId;
  let teamId;
  let dbResponse;
  let mockTeamMemberRepository;
  let getTeamMembersByIdUseCase;

  beforeEach(() => {
    workspaceId = createTeam().workspaceId;
    teamId = createTeamMember().teamId;

    dbResponse = [
      {
        ...createTeamMember(),
        workspaceMember: { ...createWorkspaceMember(), user: createUser() },
      },
      {
        ...createAnotherTeamMember(),
        workspaceMember: {
          ...createAnotherWorkspaceMember(),
          user: createAnotherUser(),
        },
      },
    ];

    mockTeamMemberRepository = {
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getTeamMembersByIdUseCase = new GetTeamMembersByIdUseCase({
      teamMemberRepository: mockTeamMemberRepository,
    });
  });

  test('It should return team members', async () => {
    const result = await getTeamMembersByIdUseCase.execute(workspaceId, teamId);

    expect(mockTeamMemberRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      dbResponse.map((team) => new TeamMemberDto(team)),
    );
  });

  test('It should return an error because teamId was not provided', async () => {
    await expect(
      getTeamMembersByIdUseCase.execute(workspaceId, null),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an error because workspaceId was not provided', async () => {
    await expect(
      getTeamMembersByIdUseCase.execute(null, teamId),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an error because the findAll teamMember operation did not find anything', async () => {
    mockTeamMemberRepository.findAll.mockResolvedValue([]);

    const result = await getTeamMembersByIdUseCase.execute(workspaceId, teamId);
    expect(mockTeamMemberRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
