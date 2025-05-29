const GetTeamMemberByIdUseCase = require('../../../api/src/application/use-cases/team-member/GetTeamMemberByIdUseCase');
const TeamMemberDto = require('../../../api/src/application/dtos/teamMember.dto');
const {
  createTeamMember,
  createWorkspaceMember,
  createTeam,
  createUser,
} = require('../../fake-data/fake-entities');

describe('GetTeamMemberByIdUseCase', () => {
  let teamId;
  let teamMemberId;
  let dbResponse;
  let mockTeamMemberRepository;
  let getTeamMemberByIdUseCase;

  beforeEach(() => {
    teamId = createTeam().id;
    teamMemberId = createTeamMember().id;

    dbResponse = {
      ...createTeamMember(),
      workspaceMember: { ...createWorkspaceMember(), user: createUser() },
    };

    mockTeamMemberRepository = {
      findOneById: jest.fn().mockResolvedValue(dbResponse),
    };

    getTeamMemberByIdUseCase = new GetTeamMemberByIdUseCase({
      teamMemberRepository: mockTeamMemberRepository,
    });
  });

  test('It should return a team member', async () => {
    const result = await getTeamMemberByIdUseCase.execute(teamId, teamMemberId);

    expect(mockTeamMemberRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new TeamMemberDto(dbResponse));
  });

  test('It should return an error because teamMemberId was not provided', async () => {
    await expect(
      getTeamMemberByIdUseCase.execute(teamId, null),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.findOneById).not.toHaveBeenCalled();
  });

  test('It should return an error because teamId was not provided', async () => {
    await expect(
      getTeamMemberByIdUseCase.execute(null, teamMemberId),
    ).rejects.toThrow(/was not provided/);
    expect(mockTeamMemberRepository.findOneById).not.toHaveBeenCalled();
  });

  test('It should return an error because the findOneById teamMember operation did not find anything', async () => {
    mockTeamMemberRepository.findOneById.mockResolvedValue({});

    const result = await getTeamMemberByIdUseCase.execute(teamId, teamMemberId);
    expect(mockTeamMemberRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
