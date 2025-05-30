const GetAllCardAttachmentsUseCase = require('../../../api/src/application/use-cases/card-attachment/GetAllCardAttachmentsUseCase');
const CardAttachmentDto = require('../../../api/src/application/dtos/card-attachment.dto');
const { createCardAttachment } = require('../../fake-data/fake-entities');

describe('GetAllCardAttachmentsUseCase', () => {
  let cardId;
  let dbResponse;
  let mockCardAttachmentRepository;
  let getAllCardAttachmentsUseCase;

  beforeEach(() => {
    cardId = createCardAttachment();
    dbResponse = [createCardAttachment(), createCardAttachment()];

    mockCardAttachmentRepository = {
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllCardAttachmentsUseCase = new GetAllCardAttachmentsUseCase({
      cardAttachmentRepository: mockCardAttachmentRepository,
    });
  });

  test('It should return a list of attachment', async () => {
    const result = await getAllCardAttachmentsUseCase.execute(cardId);

    expect(mockCardAttachmentRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      dbResponse.map((attachment) => new CardAttachmentDto(attachment)),
    );
  });

  test('It should return an error because cardId was not provided', async () => {
    await expect(getAllCardAttachmentsUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardAttachmentRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation failed', async () => {
    mockCardAttachmentRepository.findAll.mockResolvedValue([]);

    const result = await getAllCardAttachmentsUseCase.execute(cardId);

    expect(mockCardAttachmentRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
