const CountTeamsUseCase = require('../../../api/src/application/use-cases/team/CountTeamsUseCase');
const { createWorkspaceMember } = require('../../fake-data/fake-entities');

describe('CountTeamsUseCase', () => {
  let workspaceMemberId;
  let mockTeamRepository;
  let countTeamsUseCase;

  beforeEach(() => {
    workspaceMemberId = createWorkspaceMember().id;

    mockTeamRepository = {
      countTeams: jest.fn().mockResolvedValue(3),
    };

    countTeamsUseCase = new CountTeamsUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should return a count of projects successfully', async () => {
    const result = await countTeamsUseCase.execute(workspaceMemberId);

    expect(mockTeamRepository.countTeams).toHaveBeenCalledWith(
      workspaceMemberId,
    );

    expect(result).toEqual(3);
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    try {
      await countTeamsUseCase.execute(undefined);

      expect(mockTeamRepository.countTeams).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
