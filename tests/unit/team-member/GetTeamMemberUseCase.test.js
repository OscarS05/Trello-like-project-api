const GetTeamMemberUseCase = require('../../../api/src/application/use-cases/team-member/GetTeamMemberUseCase');
const TeamMemberDto = require('../../../api/src/application/dtos/teamMember.dto');
const {
  createTeamMember,
  createWorkspaceMember,
  createTeam,
} = require('../../fake-data/fake-entities');

describe('GetTeamMemberUseCase', () => {
  let userId;
  let workspaceId;
  let teamId;
  let dbResponse;
  let mockTeamMemberRepository;
  let getTeamMemberUseCase;

  beforeEach(() => {
    userId = createTeamMember().userId;
    workspaceId = createTeam().workspaceId;
    teamId = createTeamMember().teamId;

    dbResponse = {
      ...createTeamMember(),
      workspaceMember: createWorkspaceMember(),
    };

    mockTeamMemberRepository = {
      findOneByUserId: jest.fn().mockResolvedValue(dbResponse),
    };

    getTeamMemberUseCase = new GetTeamMemberUseCase({
      teamMemberRepository: mockTeamMemberRepository,
    });
  });

  test('It should return a team member', async () => {
    const result = await getTeamMemberUseCase.execute(
      userId,
      workspaceId,
      teamId,
    );

    expect(mockTeamMemberRepository.findOneByUserId).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new TeamMemberDto(dbResponse));
  });

  test('It should return an error because userId was not provided', async () => {
    await expect(
      getTeamMemberUseCase.execute(null, workspaceId, teamId),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.findOneByUserId).not.toHaveBeenCalled();
  });

  test('It should return an error because workspaceId was not provided', async () => {
    await expect(
      getTeamMemberUseCase.execute(userId, null, teamId),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.findOneByUserId).not.toHaveBeenCalled();
  });

  test('It should return an error because the teamId was not provided', async () => {
    await expect(
      getTeamMemberUseCase.execute(userId, workspaceId, null),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.findOneByUserId).not.toHaveBeenCalled();
  });

  test('It should return an error because the findOneByUserId teamMember operation did not find anything', async () => {
    mockTeamMemberRepository.findOneByUserId.mockResolvedValue({});

    await expect(
      getTeamMemberUseCase.execute(userId, workspaceId, teamId),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockTeamMemberRepository.findOneByUserId).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
