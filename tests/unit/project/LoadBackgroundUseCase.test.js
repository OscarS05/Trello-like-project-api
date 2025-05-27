const LoadBackgroundImageUseCase = require('../../../api/src/application/use-cases/project/LoadBackgroundImageUseCase');
const { createProject } = require('../../fake-data/fake-entities');
const { PROJECT_BACKGROUND_FOLDER } = require('../../../api/utils/constants');

describe('LoadBackgroundImageUseCase', () => {
  let projectId;
  let fileData;
  let folder;
  let addedJob;
  let mockQueueService;
  let loadBackgroundImageUseCase;

  beforeEach(() => {
    projectId = createProject().id;
    fileData = {
      originalName: 'test.jpg',
      size: 4242880, // 5242880 = Max file size in bytes (5MB)
      buffer: Buffer.from('test data'),
    };
    folder = PROJECT_BACKGROUND_FOLDER;
    addedJob = { id: 1, name: 'loadBackgroundImage' };

    mockQueueService = {
      loadBackgroundImage: jest.fn().mockResolvedValue(addedJob),
    };

    loadBackgroundImageUseCase = new LoadBackgroundImageUseCase(
      {
        projectRepository: null, // Mocked in the test setup, not used in this case
      },
      {
        attachmentQueueService: mockQueueService,
      },
    );
  });

  test('It should correctly return an addedJob', async () => {
    const result = await loadBackgroundImageUseCase.execute(
      fileData,
      folder,
      projectId,
    );

    expect(mockQueueService.loadBackgroundImage).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(addedJob);
  });

  test('It should return an error due to the size of the image', async () => {
    fileData.size = 6000000;
    try {
      await loadBackgroundImageUseCase.execute(fileData, folder, projectId);

      expect(mockQueueService.loadBackgroundImage).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/too large/);
    }
  });

  test('It should return an error because fileData was not provided', async () => {
    try {
      await loadBackgroundImageUseCase.execute(null, folder, projectId);

      expect(mockQueueService.loadBackgroundImage).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because projectId was not provided', async () => {
    try {
      await loadBackgroundImageUseCase.execute(fileData, folder, null);

      expect(mockQueueService.loadBackgroundImage).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because folder was not provided', async () => {
    try {
      await loadBackgroundImageUseCase.execute(fileData, null, projectId);

      expect(mockQueueService.loadBackgroundImage).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/was not provided/);
    }
  });

  test('It should return an error because the queueService failed to add the job', async () => {
    mockQueueService.loadBackgroundImage.mockResolvedValue({
      id: null,
      name: null,
    });

    try {
      await loadBackgroundImageUseCase.execute(fileData, folder, projectId);

      expect(mockQueueService.loadBackgroundImage).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
