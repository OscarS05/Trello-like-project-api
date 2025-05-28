const UpdateTeamUseCase = require('../../../api/src/application/use-cases/team/UpdateTeamUseCase');
const TeamDto = require('../../../api/src/application/dtos/team.dto');
const { createTeam } = require('../../fake-data/fake-entities');

describe('UpdateTeamUseCase', () => {
  let teamId;
  let teamName;
  let dbResponse;
  let mockTeamRepository;
  let updateTeamUseCase;

  beforeEach(() => {
    teamId = createTeam().id;
    teamName = 'new name';

    dbResponse = createTeam({ name: 'new-name' });

    mockTeamRepository = {
      update: jest.fn().mockResolvedValue([1, [dbResponse]]),
    };

    updateTeamUseCase = new UpdateTeamUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should return a successfully updated team', async () => {
    const result = await updateTeamUseCase.execute(teamId, teamName);

    expect(mockTeamRepository.update).toHaveBeenCalledWith(teamId, {
      name: teamName,
    });
    expect(result).toMatchObject(new TeamDto(dbResponse));
  });

  test('It should return an error because teamId was not provided', async () => {
    try {
      await updateTeamUseCase.execute(null, teamName);

      expect(mockTeamRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because name was not provided', async () => {
    try {
      await updateTeamUseCase.execute(teamId, null);

      expect(mockTeamRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/Team name must be a non-empty string/);
    }
  });

  test('It should return an error because name is invalid', async () => {
    teamName = 'new-name*';

    try {
      await updateTeamUseCase.execute(teamId, teamName);

      expect(mockTeamRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/invalid characters/);
    }
  });

  test('It should return an error because the db operation failed', async () => {
    mockTeamRepository.update.mockResolvedValue([0, []]);

    try {
      await updateTeamUseCase.execute(teamId, teamName);

      expect(mockTeamRepository.update).toHaveBeenCalled(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong|updated zero rows/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
