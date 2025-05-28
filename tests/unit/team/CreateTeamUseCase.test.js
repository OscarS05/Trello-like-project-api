jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuidv4 } = require('uuid');

const CreateTeamUseCase = require('../../../api/src/application/use-cases/team/CreateTeamUseCase');
const TeamDto = require('../../../api/src/application/dtos/team.dto');
const { createTeam } = require('../../fake-data/fake-entities');

describe('CreateTeamUseCase', () => {
  let teamData;
  let dbResponse;
  let useCaseResponse;
  let mockTeamRepository;
  let createTeamUseCase;

  beforeEach(() => {
    dbResponse = createTeam();
    teamData = dbResponse;
    uuidv4.mockReturnValue(dbResponse.id);
    useCaseResponse = { ...dbResponse };

    mockTeamRepository = {
      create: jest.fn().mockResolvedValue(dbResponse),
    };

    createTeamUseCase = new CreateTeamUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should return a successfully created project', async () => {
    const result = await createTeamUseCase.execute(teamData);

    expect(uuidv4).toHaveBeenCalledTimes(2);
    expect(mockTeamRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new TeamDto(useCaseResponse));
  });

  test('It should return an error because workspaceId was not provided', async () => {
    teamData.workspaceId = null;

    try {
      await createTeamUseCase.execute(teamData);

      expect(mockTeamRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because workspaceMemberId was not provided', async () => {
    teamData.workspaceMemberId = null;

    try {
      await createTeamUseCase.execute(teamData);

      expect(mockTeamRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the provided name is not valid', async () => {
    try {
      await createTeamUseCase.execute({
        ...teamData,
        name: ' ja     ',
      });

      expect(mockTeamRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(
        'Team name must be between 3 and 50 characters long.',
      );
    }
  });

  test('It should return an error because the provided name contains invalid characters', async () => {
    try {
      await createTeamUseCase.execute({
        ...teamData,
        name: 'name*@$%',
      });

      expect(mockTeamRepository.create).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/invalid characters/);
    }
  });

  test('It should return an error because the operation db failed', async () => {
    mockTeamRepository.create.mockResolvedValue({});
    try {
      await createTeamUseCase.execute(teamData);

      expect(mockTeamRepository.create).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
