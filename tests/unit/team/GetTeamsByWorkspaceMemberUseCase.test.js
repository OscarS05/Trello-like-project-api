const GetTeamsByWorkspaceMemberUseCase = require('../../../api/src/application/use-cases/team/GetTeamsByWorkspaceMemberUseCase');
const TeamDto = require('../../../api/src/application/dtos/team.dto');
const {
  createWorkspaceMember,
  createTeam,
  createTeamMember,
  createAnotherTeamMember,
} = require('../../fake-data/fake-entities');

describe('GetTeamsByWorkspaceMemberUseCase', () => {
  let workspaceMemberId;
  let dbResponse;
  let mockTeamRepository;
  let getTeamsByWorkspaceMemberUseCase;

  beforeEach(() => {
    workspaceMemberId = createWorkspaceMember().id;
    dbResponse = [
      {
        ...createTeam(),
        teamMembers: [createTeamMember(), createAnotherTeamMember()],
      },
      {
        ...createTeam(),
        teamMembers: [createTeamMember(), createAnotherTeamMember()],
      },
    ];

    mockTeamRepository = {
      findAllByWorkspaceMember: jest.fn().mockResolvedValue(dbResponse),
    };

    getTeamsByWorkspaceMemberUseCase = new GetTeamsByWorkspaceMemberUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should correctly return teams with data', async () => {
    const result =
      await getTeamsByWorkspaceMemberUseCase.execute(workspaceMemberId);

    expect(mockTeamRepository.findAllByWorkspaceMember).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toMatchObject(
      dbResponse.map((team) => TeamDto.withMembers(team)),
    );
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    expect(getTeamsByWorkspaceMemberUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamRepository.findAllByWorkspaceMember).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the db did not find anything', async () => {
    mockTeamRepository.findAllByWorkspaceMember.mockResolvedValueOnce([]);

    const result =
      await getTeamsByWorkspaceMemberUseCase.execute(workspaceMemberId);

    expect(mockTeamRepository.findAllByWorkspaceMember).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
