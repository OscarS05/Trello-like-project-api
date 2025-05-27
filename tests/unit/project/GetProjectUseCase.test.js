const GetProjectUseCase = require('../../../api/src/application/use-cases/project/GetProjectUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const { createProject } = require('../../fake-data/fake-entities');

describe('GetProjectUseCase', () => {
  let projectId;
  let useCaseResponse;
  let mockProjectRepository;
  let getProjectUseCase;

  beforeEach(() => {
    projectId = createProject().id;
    useCaseResponse = createProject();

    mockProjectRepository = {
      findById: jest.fn().mockResolvedValue(useCaseResponse),
    };

    getProjectUseCase = new GetProjectUseCase({
      projectRepository: mockProjectRepository,
    });
  });

  test('It should correctly return an project', async () => {
    const result = await getProjectUseCase.execute(projectId);

    expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
    expect(result).toMatchObject(new ProjectDto(useCaseResponse));
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await getProjectUseCase.execute(null);

      expect(mockProjectRepository.findById).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an empty object because projectId was not exist in db', async () => {
    mockProjectRepository.findById.mockResolvedValueOnce({});

    const result = await getProjectUseCase.execute(projectId);

    expect(mockProjectRepository.findById).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
