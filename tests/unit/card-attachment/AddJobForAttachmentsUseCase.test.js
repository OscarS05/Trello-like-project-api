const AddJobForAttachmentsUseCase = require('../../../api/src/application/use-cases/card-attachment/AddJobForAttachmentsUseCase');
const { createCard } = require('../../fake-data/fake-entities');
const { PROJECT_BACKGROUND_FOLDER } = require('../../../api/utils/constants');

describe('AddJobForAttachmentsUseCase', () => {
  let cardId;
  let fileData;
  let folder;
  let addedJob;
  let mockQueueService;
  let addJobForAttachmentsUseCase;

  beforeEach(() => {
    cardId = createCard().id;
    fileData = {
      originalName: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 4242880, // 5242880 = Max file size in bytes (5MB)
      buffer: Buffer.from('test data'),
    };
    folder = PROJECT_BACKGROUND_FOLDER;
    addedJob = { id: 1, name: 'loadCardAttachment' };

    mockQueueService = {
      loadCardAttachment: jest.fn().mockResolvedValue(addedJob),
    };

    addJobForAttachmentsUseCase = new AddJobForAttachmentsUseCase(
      {
        cardAttachmentRepository: null, // Mocked in the test setup, not used in this case
      },
      {
        attachmentQueueService: mockQueueService,
      },
    );
  });

  test('It should correctly return an addedJob', async () => {
    const result = await addJobForAttachmentsUseCase.execute({
      fileData,
      folder,
      cardId,
    });

    expect(mockQueueService.loadCardAttachment).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(addedJob);
  });

  test('It should return an error due to the size of the image', async () => {
    fileData.size = 6000000;

    await expect(
      addJobForAttachmentsUseCase.execute({ fileData, folder, cardId }),
    ).rejects.toThrow(/too large/);

    expect(mockQueueService.loadCardAttachment).not.toHaveBeenCalled();
  });

  test('It should return an error because fileData was not provided', async () => {
    fileData = {};

    await expect(
      addJobForAttachmentsUseCase.execute({ fileData, folder, cardId }),
    ).rejects.toThrow(/was not provided/);
    expect(mockQueueService.loadCardAttachment).not.toHaveBeenCalled();
  });

  test('It should return an error because cardId was not provided', async () => {
    cardId = null;

    await expect(
      addJobForAttachmentsUseCase.execute({ fileData, folder, cardId }),
    ).rejects.toThrow(/was not provided/);

    expect(mockQueueService.loadCardAttachment).not.toHaveBeenCalled();
  });

  test('It should return an error because folder was not provided', async () => {
    folder = 123;

    await expect(
      addJobForAttachmentsUseCase.execute({ fileData, folder, cardId }),
    ).rejects.toThrow(/was not provided/);
    expect(mockQueueService.loadCardAttachment).not.toHaveBeenCalled();
  });

  test('It should return an error because the queueService failed to add the job', async () => {
    mockQueueService.loadCardAttachment.mockResolvedValue({
      id: null,
      name: null,
    });

    await expect(
      addJobForAttachmentsUseCase.execute({ fileData, folder, cardId }),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockQueueService.loadCardAttachment).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
