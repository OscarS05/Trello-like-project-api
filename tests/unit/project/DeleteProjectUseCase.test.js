const DeleteProjectUseCase = require('../../../api/src/application/use-cases/project/DeleteProjectUseCase');
const { createProject } = require('../../fake-data/fake-entities');

describe('DeleteProjectUseCase', () => {
  let projectData;
  let mockProjectRepository;
  let mockCloudinaryStorageRepository;
  let deleteProjectUseCase;

  beforeEach(() => {
    projectData = createProject();

    mockProjectRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    mockCloudinaryStorageRepository = {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    };

    deleteProjectUseCase = new DeleteProjectUseCase(
      {
        projectRepository: mockProjectRepository,
      },
      {
        cloudinaryStorageRepository: mockCloudinaryStorageRepository,
      },
    );
  });

  test('case 1: The backgroundImg does not belong to Cloudinary. It should correctly return a 1', async () => {
    const result = await deleteProjectUseCase.execute(projectData);

    expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
    expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectData.id);
    expect(result).toBe(1);
  });

  test('case 2: The backgroundImg belongs to Cloudinary. It should correctly return a 1', async () => {
    projectData.backgroundUrl =
      'https://res.cloudinary.com/test/image/upload/v1234567890/test.jpg';
    const result = await deleteProjectUseCase.execute(projectData);

    expect(mockCloudinaryStorageRepository.destroy).toHaveBeenCalledTimes(1);
    expect(mockCloudinaryStorageRepository.destroy).toHaveBeenCalledWith(
      'v1234567890/test',
    );
    expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectData.id);
    expect(result).toBe(1);
  });

  test('It should return an error because projectId was not provided', async () => {
    projectData.id = undefined;

    try {
      await deleteProjectUseCase.execute(projectData);

      expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because backgroundUrl was not provided', async () => {
    projectData.backgroundUrl = undefined;

    try {
      await deleteProjectUseCase.execute(projectData);

      expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
      expect(mockProjectRepository.delete).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the db operation failed', async () => {
    mockProjectRepository.delete.mockResolvedValue(0);

    try {
      await deleteProjectUseCase.execute(projectData);

      expect(mockProjectRepository.delete).toHaveBeenCalled(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
