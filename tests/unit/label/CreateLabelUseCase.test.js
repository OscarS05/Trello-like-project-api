const CreateLabelUseCase = require('../../../api/src/application/use-cases/label/CreateLabelUseCase');
const LabelDto = require('../../../api/src/application/dtos/label.dto');
const {
  createList,
  createCard,
  createLabel,
} = require('../../fake-data/fake-entities');

describe('CreateLabelUseCase', () => {
  let projectId;
  let cardId;
  let labelData;
  let newLabelDbResponse;
  let cardLabelDbResponse;
  let mockLabelRepository;
  let createLabelUseCase;

  beforeEach(() => {
    projectId = createList().projectId;
    cardId = createCard();
    labelData = { name: createLabel().name, color: createLabel().color };
    newLabelDbResponse = createLabel();
    cardLabelDbResponse = {
      cardId,
      labelId: newLabelDbResponse.id,
      isVisible: true,
    };

    mockLabelRepository = {
      create: jest.fn().mockResolvedValue(newLabelDbResponse),
      createVisibilityOfLabel: jest.fn().mockResolvedValue(cardLabelDbResponse),
    };

    createLabelUseCase = new CreateLabelUseCase({
      labelRepository: mockLabelRepository,
    });
  });

  test('It should return a label with visibily', async () => {
    const result = await createLabelUseCase.execute(
      projectId,
      cardId,
      labelData,
    );

    expect(mockLabelRepository.create).toHaveBeenCalledTimes(1);
    expect(mockLabelRepository.createVisibilityOfLabel).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toMatchObject(
      new LabelDto({
        ...newLabelDbResponse,
        isVisible: cardLabelDbResponse.isVisible,
      }),
    );
  });

  test('It should return an error because the projectId was not provided', async () => {
    await expect(
      createLabelUseCase.execute(null, cardId, labelData),
    ).rejects.toThrow(/was not provided/);
    expect(mockLabelRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the cardId was not provided', async () => {
    await expect(
      createLabelUseCase.execute(projectId, null, labelData),
    ).rejects.toThrow(/was not provided/);
    expect(mockLabelRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because name is not a string', async () => {
    labelData.name = 213;

    await expect(
      createLabelUseCase.execute(projectId, cardId, labelData),
    ).rejects.toThrow(/non-empty string/);
    expect(mockLabelRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the name exceed 80 characters', async () => {
    labelData.name =
      'jjjjjjjjjjjjjjjjjjjjjdddddddddddjjjjjjjjjjjjjjjjjjjjjjjjjjjjjdddddddddjjjjjjjjjdd';

    await expect(
      createLabelUseCase.execute(projectId, cardId, labelData),
    ).rejects.toThrow(/exceed 80 characters/);
    expect(mockLabelRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because color is not valid', async () => {
    labelData.color = '#AAAAAA';

    await expect(
      createLabelUseCase.execute(projectId, cardId, labelData),
    ).rejects.toThrow(/Invalid label color/);
    expect(mockLabelRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation of create label failed', async () => {
    mockLabelRepository.create.mockResolvedValue(0);

    await expect(
      createLabelUseCase.execute(projectId, cardId, labelData),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockLabelRepository.create).toHaveBeenCalledTimes(1);
    expect(mockLabelRepository.createVisibilityOfLabel).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation of create label with visibily in card failed', async () => {
    mockLabelRepository.createVisibilityOfLabel.mockResolvedValue(0);

    await expect(
      createLabelUseCase.execute(projectId, cardId, labelData),
    ).rejects.toThrow(/Something went wrong/);
    expect(mockLabelRepository.createVisibilityOfLabel).toHaveBeenCalledTimes(
      1,
    );
    expect(mockLabelRepository.createVisibilityOfLabel).toHaveBeenCalledTimes(
      1,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
