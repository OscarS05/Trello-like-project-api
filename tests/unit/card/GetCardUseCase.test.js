const GetCardUseCase = require('../../../api/src/application/use-cases/card/GetCardUseCase');
const CardDto = require('../../../api/src/application/dtos/card.dto');
const { createCard } = require('../../fake-data/fake-entities');

describe('GetCardUseCase', () => {
  let cardId;
  let dbResponse;
  let mockCardRepository;
  let getCardUseCase;

  beforeEach(() => {
    cardId = createCard().id;
    dbResponse = createCard();

    mockCardRepository = {
      findOneById: jest.fn().mockResolvedValue(dbResponse),
    };

    getCardUseCase = new GetCardUseCase({
      cardRepository: mockCardRepository,
    });
  });

  test('It should return a card', async () => {
    const result = await getCardUseCase.execute(cardId);

    expect(mockCardRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new CardDto(dbResponse));
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(getCardUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardRepository.findOneById).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockCardRepository.findOneById.mockResolvedValue({});

    const result = await getCardUseCase.execute(cardId);
    expect(mockCardRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
