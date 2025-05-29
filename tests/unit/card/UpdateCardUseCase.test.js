const UpdateCardUseCase = require('../../../api/src/application/use-cases/card/UpdateCardUseCase');
const CardDto = require('../../../api/src/application/dtos/card.dto');
const { createCard } = require('../../fake-data/fake-entities');

describe('UpdateCardUseCase', () => {
  let cardId;
  let cardData;
  let dbResponse;
  let mockCardRepository;
  let updateCardUseCase;

  beforeEach(() => {
    cardId = createCard().id;
    cardData = { ...createCard(), newName: 'newName' };
    dbResponse = createCard();

    mockCardRepository = {
      update: jest.fn().mockResolvedValue([1, [dbResponse]]),
    };

    updateCardUseCase = new UpdateCardUseCase({
      cardRepository: mockCardRepository,
    });
  });

  test('It should return a updated card', async () => {
    const result = await updateCardUseCase.execute(cardId, cardData);

    expect(mockCardRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new CardDto(dbResponse));
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(updateCardUseCase.execute(null, cardData)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because newName is not a string', async () => {
    cardData.newName = 213;

    await expect(updateCardUseCase.execute(cardId, cardData)).rejects.toThrow(
      /non-empty string/,
    );
    expect(mockCardRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the newName exceed 80 characters', async () => {
    cardData.newName =
      'jjjjjjjjjjjjjjjjjjjjjdddddddddddjjjjjjjjjjjjjjjjjjjjjjjjjjjjjdddddddddjjjjjjjjjdd';

    await expect(updateCardUseCase.execute(cardId, cardData)).rejects.toThrow(
      /exceed 80 characters/,
    );
    expect(mockCardRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because description is not a string', async () => {
    cardData.description = 213;

    await expect(updateCardUseCase.execute(cardId, cardData)).rejects.toThrow(
      /non-empty string/,
    );
    expect(mockCardRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockCardRepository.update.mockResolvedValue([0, []]);

    await expect(updateCardUseCase.execute(cardId, cardData)).rejects.toThrow(
      /Something went wrong|Zero rows updated/,
    );
    expect(mockCardRepository.update).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
