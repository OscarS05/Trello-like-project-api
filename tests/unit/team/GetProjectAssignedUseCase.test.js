const GetProjectAssignedUseCase = require('../../../api/src/application/use-cases/team/GetProjectAssignedUseCase');
const { createTeam, createProject } = require('../../fake-data/fake-entities');

describe('GetProjectAssignedUseCase', () => {
  let teamId;
  let projectId;
  let dbResponse;
  let mockTeamRepository;
  let getProjectAssignedUseCase;

  beforeEach(() => {
    teamId = createTeam().id;
    projectId = createProject().id;
    dbResponse = { teamId, projectId };

    mockTeamRepository = {
      findProjectAssigned: jest.fn().mockResolvedValue(dbResponse),
    };

    getProjectAssignedUseCase = new GetProjectAssignedUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should correctly return a project assigned', async () => {
    const result = await getProjectAssignedUseCase.execute(teamId, projectId);

    expect(mockTeamRepository.findProjectAssigned).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(dbResponse);
  });

  test('It should return an error because teamId was not provided', async () => {
    expect(getProjectAssignedUseCase.execute(null, projectId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamRepository.findProjectAssigned).not.toHaveBeenCalled();
  });

  test('It should return an error because projectId was not provided', async () => {
    expect(getProjectAssignedUseCase.execute(teamId, null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamRepository.findProjectAssigned).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the db did not find anything', async () => {
    mockTeamRepository.findProjectAssigned.mockResolvedValueOnce({});

    const result = await getProjectAssignedUseCase.execute(teamId, projectId);

    expect(mockTeamRepository.findProjectAssigned).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
