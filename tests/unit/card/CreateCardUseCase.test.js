const CreateCardUseCase = require('../../../api/src/application/use-cases/card/CreateCardUseCase');
const CardDto = require('../../../api/src/application/dtos/card.dto');
const { createList, createCard } = require('../../fake-data/fake-entities');

describe('CreateCardUseCase', () => {
  let listId;
  let cardData;
  let dbResponse;
  let mockCardRepository;
  let createCardUseCase;

  beforeEach(() => {
    listId = createList().id;
    cardData = createCard();
    dbResponse = createCard();

    mockCardRepository = {
      create: jest.fn().mockResolvedValue(dbResponse),
    };

    createCardUseCase = new CreateCardUseCase({
      cardRepository: mockCardRepository,
    });
  });

  test('It should return a card', async () => {
    const result = await createCardUseCase.execute(listId, cardData);

    expect(mockCardRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new CardDto(dbResponse));
  });

  test('It should return an error because the listId was not provided', async () => {
    await expect(createCardUseCase.execute(null, cardData)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because name is not a string', async () => {
    cardData.name = 213;

    await expect(createCardUseCase.execute(listId, cardData)).rejects.toThrow(
      /non-empty string/,
    );
    expect(mockCardRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the name exceed 80 characters', async () => {
    cardData.name =
      'jjjjjjjjjjjjjjjjjjjjjdddddddddddjjjjjjjjjjjjjjjjjjjjjjjjjjjjjdddddddddjjjjjjjjjdd';

    await expect(createCardUseCase.execute(listId, cardData)).rejects.toThrow(
      /exceed 80 characters/,
    );
    expect(mockCardRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because description is not a string', async () => {
    cardData.description = 213;

    await expect(createCardUseCase.execute(listId, cardData)).rejects.toThrow(
      /non-empty string/,
    );
    expect(mockCardRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockCardRepository.create.mockResolvedValue(0);

    await expect(createCardUseCase.execute(listId, cardData)).rejects.toThrow(
      /Something went wrong/,
    );
    expect(mockCardRepository.create).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
