const DeleteCardUseCase = require('../../../api/src/application/use-cases/card/DeleteCardUseCase');
const { createCard } = require('../../fake-data/fake-entities');

describe('DeleteCardUseCase', () => {
  let cardId;
  let mockCardRepository;
  let deleteCardUseCase;

  beforeEach(() => {
    cardId = createCard().id;

    mockCardRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteCardUseCase = new DeleteCardUseCase({
      cardRepository: mockCardRepository,
    });
  });

  test('It should return a 1', async () => {
    const result = await deleteCardUseCase.execute(cardId);

    expect(mockCardRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(deleteCardUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockCardRepository.delete.mockResolvedValue(0);

    await expect(deleteCardUseCase.execute(cardId)).rejects.toThrow(
      /Something went wrong|Zero rows deleted/,
    );
    expect(mockCardRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
