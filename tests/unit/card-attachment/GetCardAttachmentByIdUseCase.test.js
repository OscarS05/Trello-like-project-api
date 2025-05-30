const GetCardAttachmentByIdUseCase = require('../../../api/src/application/use-cases/card-attachment/GetCardAttachmentByIdUseCase');
const { createCardAttachment } = require('../../fake-data/fake-entities');

describe('GetCardAttachmentByIdUseCase', () => {
  let cardId;
  let cardAttachmentId;
  let dbResponse;
  let mockCardAttachmentRepository;
  let getCardAttachmentByIdUseCase;

  beforeEach(() => {
    cardId = createCardAttachment().cardId;
    cardAttachmentId = createCardAttachment().id;
    dbResponse = createCardAttachment();

    mockCardAttachmentRepository = {
      findOne: jest.fn().mockResolvedValue(dbResponse),
    };

    getCardAttachmentByIdUseCase = new GetCardAttachmentByIdUseCase({
      cardAttachmentRepository: mockCardAttachmentRepository,
    });
  });

  test('It should return an attachment', async () => {
    const result = await getCardAttachmentByIdUseCase.execute(
      cardId,
      cardAttachmentId,
    );

    expect(mockCardAttachmentRepository.findOne).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(dbResponse);
  });

  test('It should return an error because cardId was not provided', async () => {
    await expect(
      getCardAttachmentByIdUseCase.execute(null, cardAttachmentId),
    ).rejects.toThrow(/was not provided/);
    expect(mockCardAttachmentRepository.findOne).not.toHaveBeenCalled();
  });

  test('It should return an error because cardId was not provided', async () => {
    await expect(
      getCardAttachmentByIdUseCase.execute(cardId, null),
    ).rejects.toThrow(/was not provided/);
    expect(mockCardAttachmentRepository.findOne).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation failed', async () => {
    mockCardAttachmentRepository.findOne.mockResolvedValue({});

    const result = await getCardAttachmentByIdUseCase.execute(
      cardId,
      cardAttachmentId,
    );

    expect(mockCardAttachmentRepository.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
