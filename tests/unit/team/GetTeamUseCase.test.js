const GetTeamUseCase = require('../../../api/src/application/use-cases/team/GetTeamUseCase');
const TeamDto = require('../../../api/src/application/dtos/team.dto');
const {
  createProject,
  createWorkspace,
} = require('../../fake-data/fake-entities');

describe('GetTeamUseCase', () => {
  let teamId;
  let workspaceId;
  let dbResponse;
  let mockTeamRepository;
  let getTeamUseCase;

  beforeEach(() => {
    teamId = createProject().id;
    workspaceId = createWorkspace().id;
    dbResponse = createProject();

    mockTeamRepository = {
      findById: jest.fn().mockResolvedValue(dbResponse),
    };

    getTeamUseCase = new GetTeamUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should correctly return an team', async () => {
    const result = await getTeamUseCase.execute(teamId, workspaceId);

    expect(mockTeamRepository.findById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new TeamDto(dbResponse));
  });

  test('It should return an error because teamId was not provided', async () => {
    expect(getTeamUseCase.execute(undefined, workspaceId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamRepository.findById).not.toHaveBeenCalled();
  });

  test('It should return an error because workspaceId was not provided', async () => {
    expect(getTeamUseCase.execute(teamId, null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamRepository.findById).not.toHaveBeenCalled();
  });

  test('It should return an empty object because teamId was not exist in db', async () => {
    mockTeamRepository.findById.mockResolvedValueOnce({});

    const result = await getTeamUseCase.execute(teamId, workspaceId);

    expect(mockTeamRepository.findById).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
