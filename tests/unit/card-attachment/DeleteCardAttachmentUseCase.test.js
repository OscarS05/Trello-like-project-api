const DeleteCardAttachmentUseCase = require('../../../api/src/application/use-cases/card-attachment/DeleteCardAttachmentUseCase');
const { createCardAttachment } = require('../../fake-data/fake-entities');

describe('DeleteCardAttachmentUseCase', () => {
  let cardAttachment;
  let mockCardAttachmentRepository;
  let mockCloudinaryStorageRepository;
  let deleteCardAttachmentUseCase;

  beforeEach(() => {
    cardAttachment = createCardAttachment();

    mockCardAttachmentRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    mockCloudinaryStorageRepository = {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    };

    deleteCardAttachmentUseCase = new DeleteCardAttachmentUseCase(
      {
        cardAttachmentRepository: mockCardAttachmentRepository,
      },
      {
        cloudinaryStorageRepository: mockCloudinaryStorageRepository,
      },
    );
  });

  test('case 1: The attachment is NOT an external-link. It should return a 1', async () => {
    cardAttachment.type = 'external-link';

    const result = await deleteCardAttachmentUseCase.execute(cardAttachment);

    expect(mockCardAttachmentRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockCloudinaryStorageRepository.destroy).not.toHaveBeenCalled();
    expect(result).toBe(1);
  });

  test('case 2: The attachment IS an external-link. It should return a 1', async () => {
    const result = await deleteCardAttachmentUseCase.execute(cardAttachment);

    expect(mockCloudinaryStorageRepository.destroy).toHaveBeenCalledTimes(1);
    expect(mockCardAttachmentRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  test('case 3: The attachment IS an external-link cloudinary failed. It should return an error', async () => {
    mockCloudinaryStorageRepository.destroy.mockResolvedValue({
      result: 'error',
    });

    await expect(
      deleteCardAttachmentUseCase.execute(cardAttachment),
    ).rejects.toThrow('Failed to delete file from Cloudinary');

    expect(mockCloudinaryStorageRepository.destroy).toHaveBeenCalledTimes(1);
    expect(mockCardAttachmentRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachment was not provided', async () => {
    await expect(deleteCardAttachmentUseCase.execute({})).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardAttachmentRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation failed', async () => {
    mockCardAttachmentRepository.delete.mockResolvedValue(0);

    await expect(
      deleteCardAttachmentUseCase.execute(cardAttachment),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockCardAttachmentRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
