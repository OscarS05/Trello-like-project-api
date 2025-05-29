const GetLabelsByCardUseCase = require('../../../api/src/application/use-cases/label/GetLabelsByCardUseCase');
const LabelDto = require('../../../api/src/application/dtos/label.dto');
const {
  createLabel,
  createCard,
  createLabelByCard,
} = require('../../fake-data/fake-entities');

describe('GetLabelsByCardUseCase', () => {
  let cardId;
  let dbResponse;
  let mockLabelRepository;
  let getLabelsByCardUseCase;

  beforeEach(() => {
    cardId = createCard().id;

    dbResponse = {
      ...createCard(),
      labels: [
        createLabel({ cardLabel: createLabelByCard() }),
        createLabel({ cardLabel: createLabelByCard() }),
      ],
    };

    mockLabelRepository = {
      findLabelsByCard: jest.fn().mockResolvedValue(dbResponse),
    };

    getLabelsByCardUseCase = new GetLabelsByCardUseCase({
      labelRepository: mockLabelRepository,
    });
  });

  test('It should return a label with visibily', async () => {
    const result = await getLabelsByCardUseCase.execute(cardId);

    expect(mockLabelRepository.findLabelsByCard).toHaveBeenCalledTimes(1);

    expect(result).toMatchObject(
      dbResponse.labels.map((label) => new LabelDto(label)),
    );
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(getLabelsByCardUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockLabelRepository.findLabelsByCard).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation of create label with visibily in card failed', async () => {
    mockLabelRepository.findLabelsByCard.mockResolvedValue({});

    const result = await getLabelsByCardUseCase.execute(cardId);

    expect(mockLabelRepository.findLabelsByCard).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
