const UpdateCardAttachmentUseCase = require('../../../api/src/application/use-cases/card-attachment/UpdateCardAttachmentUseCase');
const CardAttachmentDto = require('../../../api/src/application/dtos/card-attachment.dto');
const { createCardAttachment } = require('../../fake-data/fake-entities');

describe('UpdateCardAttachmentUseCase', () => {
  let cardAttachment;
  let cardAttachmentData;
  let dbResponse;
  let mockCardAttachmentRepository;
  let updateCardAttachmentUseCase;

  beforeEach(() => {
    cardAttachment = createCardAttachment();
    cardAttachmentData = {
      url: 'https://some-new-url.com',
      filename: cardAttachment.filename,
    };

    mockCardAttachmentRepository = {
      update: jest.fn(),
    };

    updateCardAttachmentUseCase = new UpdateCardAttachmentUseCase({
      cardAttachmentRepository: mockCardAttachmentRepository,
    });
  });

  test('case 1: the attachment to be updated IS an external link. It should correctly return an updated attachment', async () => {
    cardAttachment.type = 'external-link';
    cardAttachmentData = {
      url: 'https://some-new-url.com',
      filename: cardAttachment.filename,
    };
    dbResponse = { ...createCardAttachment(), url: cardAttachmentData.url };

    mockCardAttachmentRepository.update.mockResolvedValue([1, [dbResponse]]);

    const result = await updateCardAttachmentUseCase.execute(
      cardAttachment,
      cardAttachmentData,
    );

    expect(mockCardAttachmentRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      new CardAttachmentDto({
        ...dbResponse,
        url: cardAttachmentData.url,
      }),
    );
  });

  test('case 2: the attachment to be updated is NOT an external link. It should correctly return an updated attachment', async () => {
    cardAttachment.type = 'image/jpg';
    cardAttachmentData = {
      url: 'https://some-new-url.com',
      filename: cardAttachment.filename,
    };
    dbResponse = {
      ...createCardAttachment(),
      filename: cardAttachmentData.filename,
    };

    mockCardAttachmentRepository.update.mockResolvedValue([1, [dbResponse]]);

    const result = await updateCardAttachmentUseCase.execute(
      cardAttachment,
      cardAttachmentData,
    );

    expect(mockCardAttachmentRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new CardAttachmentDto(dbResponse));
  });

  test('It should return an error because cardAttachment was not provided', async () => {
    cardAttachment = {};

    await expect(
      updateCardAttachmentUseCase.execute(cardAttachment, cardAttachmentData),
    ).rejects.toThrow(/was not provided/);
    expect(mockCardAttachmentRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentData does not contain a filename', async () => {
    cardAttachmentData.filename = null;

    await expect(
      updateCardAttachmentUseCase.execute(cardAttachment, cardAttachmentData),
    ).rejects.toThrow(/filename was not provided/);

    expect(mockCardAttachmentRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentData does not contain a valid filename', async () => {
    cardAttachmentData.filename = 'document.pvp';

    await expect(
      updateCardAttachmentUseCase.execute(cardAttachment, cardAttachmentData),
    ).rejects.toThrow(/Invalid extension/);

    expect(mockCardAttachmentRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because cardAttachmentData does not contain a valid url', async () => {
    cardAttachment.type = 'external-link';
    cardAttachmentData.url = 'url.com';

    await expect(
      updateCardAttachmentUseCase.execute(cardAttachment, cardAttachmentData),
    ).rejects.toThrow(/Invalid card attachment URL/);

    expect(mockCardAttachmentRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation failed', async () => {
    mockCardAttachmentRepository.update.mockResolvedValue([0, []]);

    await expect(
      updateCardAttachmentUseCase.execute(cardAttachment, cardAttachmentData),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockCardAttachmentRepository.update).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
