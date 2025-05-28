const GetAllProjectsAssignedUseCase = require('../../../api/src/application/use-cases/team/GetAllProjectsAssignedUseCase');
const { createTeam, createProject } = require('../../fake-data/fake-entities');

describe('GetAllProjectsAssignedUseCase', () => {
  let teamId;
  let projectId;
  let dbResponse;
  let mockTeamRepository;
  let getAllProjectsAssignedUseCase;

  beforeEach(() => {
    teamId = createTeam().id;
    projectId = createProject().id;
    dbResponse = [
      { teamId, projectId },
      { teamId, projectId },
    ];

    mockTeamRepository = {
      findAllProjectsAssigned: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllProjectsAssignedUseCase = new GetAllProjectsAssignedUseCase({
      teamRepository: mockTeamRepository,
    });
  });

  test('It should correctly return a project assigned', async () => {
    const result = await getAllProjectsAssignedUseCase.execute(teamId);

    expect(mockTeamRepository.findAllProjectsAssigned).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(dbResponse);
  });

  test('It should return an error because teamId was not provided', async () => {
    expect(getAllProjectsAssignedUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockTeamRepository.findAllProjectsAssigned).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the db did not find anything', async () => {
    mockTeamRepository.findAllProjectsAssigned.mockResolvedValueOnce([]);

    const result = await getAllProjectsAssignedUseCase.execute(teamId);

    expect(mockTeamRepository.findAllProjectsAssigned).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
