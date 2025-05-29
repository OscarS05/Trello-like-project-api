const GetAllUseCase = require('../../../api/src/application/use-cases/card/GetAllUseCase');
const CardDto = require('../../../api/src/application/dtos/card.dto');
const { createCard } = require('../../fake-data/fake-entities');

describe('GetAllUseCase', () => {
  let listId;
  let dbResponse;
  let mockCardRepository;
  let getAllUseCase;

  beforeEach(() => {
    listId = createCard().listId;
    dbResponse = [createCard(), createCard()];

    mockCardRepository = {
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllUseCase = new GetAllUseCase({
      cardRepository: mockCardRepository,
    });
  });

  test('It should return a card', async () => {
    const result = await getAllUseCase.execute(listId);

    expect(mockCardRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(dbResponse.map((card) => new CardDto(card)));
  });

  test('It should return an error because the listId was not provided', async () => {
    await expect(getAllUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockCardRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockCardRepository.findAll.mockResolvedValue([]);

    const result = await getAllUseCase.execute(listId);
    expect(mockCardRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
