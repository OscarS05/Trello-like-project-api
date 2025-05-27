const UpdateBackgroundProjectUseCase = require('../../../api/src/application/use-cases/project/UpdateBackgroundProjectUseCase');
const ProjectDto = require('../../../api/src/application/dtos/project.dto');
const { createProject } = require('../../fake-data/fake-entities');

describe('UpdateBackgroundProjectUseCase', () => {
  let projectData;
  let url;
  let urlCloudinaryImage;
  let updatedProject;
  let mockProjectRepository;
  let mockCloudinaryStorageRepository;
  let updateBackgroundProjectUseCase;

  beforeEach(() => {
    projectData = createProject();
    url = projectData.backgroundUrl;
    urlCloudinaryImage =
      'https://res.cloudinary.com/test/image/upload/v1234567890/test.jpg';
    updatedProject = { ...projectData, backgroundUrl: url };

    mockProjectRepository = {
      update: jest.fn().mockResolvedValue([1, [projectData]]),
    };

    mockCloudinaryStorageRepository = {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    };

    updateBackgroundProjectUseCase = new UpdateBackgroundProjectUseCase(
      {
        projectRepository: mockProjectRepository,
      },
      {
        cloudinaryStorageRepository: mockCloudinaryStorageRepository,
      },
    );
  });

  test('case 1: The backgroundUrl does not belong to Cloudinary. It should correctly return a project', async () => {
    const result = await updateBackgroundProjectUseCase.execute(
      projectData,
      url,
    );

    expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
    expect(mockProjectRepository.update).toHaveBeenCalledWith(projectData.id, {
      backgroundUrl: url,
    });
    expect(result).toMatchObject(new ProjectDto(updatedProject));
  });

  test('case 2: The NEW backgroundUrl belongs to Cloudinary and current url does not belong to Cloudinary. It should correctly return a project', async () => {
    updatedProject.backgroundUrl = urlCloudinaryImage;
    mockProjectRepository.update.mockResolvedValue([1, [updatedProject]]);

    const result = await updateBackgroundProjectUseCase.execute(
      projectData,
      urlCloudinaryImage,
    );

    expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
    expect(mockProjectRepository.update).toHaveBeenCalledWith(projectData.id, {
      backgroundUrl: urlCloudinaryImage,
    });
    expect(result).toEqual(new ProjectDto(updatedProject));
  });

  test('case 3: The NEW backgroundUrl belongs to Cloudinary and current url also belongs to Cloudinary. It should correctly return a project', async () => {
    projectData.backgroundUrl = urlCloudinaryImage;
    updatedProject.backgroundUrl = urlCloudinaryImage;
    mockProjectRepository.update.mockResolvedValue([1, [updatedProject]]);

    const result = await updateBackgroundProjectUseCase.execute(
      projectData,
      urlCloudinaryImage,
    );

    expect(mockCloudinaryStorageRepository.destroy).toHaveBeenCalledTimes(1);
    expect(mockProjectRepository.update).toHaveBeenCalledTimes(2);
    expect(mockProjectRepository.update).toHaveBeenCalledWith(projectData.id, {
      backgroundUrl: urlCloudinaryImage,
    });
    expect(result).toEqual(new ProjectDto(updatedProject));
  });

  test('It should return an error because backgroundUrl was not provided', async () => {
    projectData.backgroundUrl = undefined;

    try {
      await updateBackgroundProjectUseCase.execute(projectData, url);

      expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|is required/);
    }
  });

  test('It should return an error because NEW backgroundUrl was not provided', async () => {
    try {
      await updateBackgroundProjectUseCase.execute(projectData, 123);

      expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|is required/);
    }
  });

  test('It should return an error because project was not provided', async () => {
    try {
      await updateBackgroundProjectUseCase.execute(null, url);

      expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
      expect(mockProjectRepository.update).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided|is required/);
    }
  });

  test('It should return an error because the db operation failed', async () => {
    mockProjectRepository.update.mockResolvedValue([0, []]);

    try {
      await updateBackgroundProjectUseCase.execute(projectData, url);

      expect(mockProjectRepository.update).toHaveBeenCalled(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  test('It should return an error because the cloudinary operation failed', async () => {
    projectData.backgroundUrl = urlCloudinaryImage;
    mockCloudinaryStorageRepository.destroy.mockResolvedValue({
      result: 'error',
    });

    try {
      await updateBackgroundProjectUseCase.execute(
        projectData,
        urlCloudinaryImage,
      );

      expect(mockCloudinaryStorageRepository.destroy).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toEqual('Failed to delete file from Cloudinary');
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
