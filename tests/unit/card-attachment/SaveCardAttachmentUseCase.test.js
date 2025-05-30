jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const SaveCardAttachmentUseCase = require('../../../api/src/application/use-cases/card-attachment/SaveCardAttachmentUseCase');
const CardAttachmentDto = require('../../../api/src/application/dtos/card-attachment.dto');
const { createCardAttachment } = require('../../fake-data/fake-entities');

describe('SaveCardAttachmentUseCase', () => {
  let cardAttachmentData;
  let dbResponse;
  let mockCardAttachmentRepository;
  let saveCardAttachmentUseCase;

  beforeEach(() => {
    cardAttachmentData = createCardAttachment();
    dbResponse = { ...cardAttachmentData };
    uuid.mockReturnValue(cardAttachmentData.id);

    mockCardAttachmentRepository = {
      create: jest.fn().mockResolvedValue(dbResponse),
    };

    saveCardAttachmentUseCase = new SaveCardAttachmentUseCase({
      cardAttachmentRepository: mockCardAttachmentRepository,
    });
  });

  test('It should return an created attachment', async () => {
    const result = await saveCardAttachmentUseCase.execute(cardAttachmentData);

    expect(mockCardAttachmentRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new CardAttachmentDto(dbResponse));
  });

  test('It should return an error because cardAttachmentData was not provided', async () => {
    cardAttachmentData = {};

    await expect(
      saveCardAttachmentUseCase.execute(cardAttachmentData),
    ).rejects.toThrow(/was not provided/);
    expect(mockCardAttachmentRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentData.cardId was not provided', async () => {
    cardAttachmentData.cardId = null;

    await expect(
      saveCardAttachmentUseCase.execute(cardAttachmentData),
    ).rejects.toThrow(/was not provided/);
    expect(mockCardAttachmentRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentData.publicId or .type was not provided', async () => {
    cardAttachmentData.publicId = null;

    await expect(
      saveCardAttachmentUseCase.execute(cardAttachmentData),
    ).rejects.toThrow(/does not contain the data of the saved attachment/);
    expect(mockCardAttachmentRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentDataData does not contain a filename', async () => {
    cardAttachmentData.filename = null;

    await expect(
      saveCardAttachmentUseCase.execute(cardAttachmentData),
    ).rejects.toThrow(/non-empty string/);

    expect(mockCardAttachmentRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentDataData does not contain a valid filename', async () => {
    cardAttachmentData.filename = 'document.pvp';

    await expect(
      saveCardAttachmentUseCase.execute(cardAttachmentData),
    ).rejects.toThrow(/Invalid extension/);

    expect(mockCardAttachmentRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentDataData does not contain a valid url', async () => {
    cardAttachmentData.type = 'external-link';
    cardAttachmentData.url = 'url.com';

    await expect(
      saveCardAttachmentUseCase.execute(cardAttachmentData),
    ).rejects.toThrow(/Invalid card attachment URL/);

    expect(mockCardAttachmentRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation failed', async () => {
    mockCardAttachmentRepository.create.mockResolvedValue({});

    await expect(
      saveCardAttachmentUseCase.execute(cardAttachmentData),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockCardAttachmentRepository.create).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
