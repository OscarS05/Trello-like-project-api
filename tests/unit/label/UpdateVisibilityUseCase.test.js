const UpdateVisibilityUseCase = require('../../../api/src/application/use-cases/label/UpdateVisibilityUseCase');
const LabelDto = require('../../../api/src/application/dtos/label.dto');
const { createLabel, createCard } = require('../../fake-data/fake-entities');

describe('UpdateVisibilityUseCase', () => {
  let isVisible;
  let labelData;
  let dbResponse;
  let mockLabelRepository;
  let updateVisibilityUseCase;

  beforeEach(() => {
    isVisible = 'false';
    labelData = { cardId: createCard().id, labelId: createLabel().id };
    dbResponse = {
      cardId: createCard().id,
      labelId: createLabel().id,
      isVisible,
    };

    mockLabelRepository = {
      updateVisibility: jest.fn().mockResolvedValue([1, [dbResponse]]),
    };

    updateVisibilityUseCase = new UpdateVisibilityUseCase({
      labelRepository: mockLabelRepository,
    });
  });

  test('It should return a updated visibility', async () => {
    const result = await updateVisibilityUseCase.execute(isVisible, labelData);

    expect(mockLabelRepository.updateVisibility).toHaveBeenCalledWith(
      labelData,
      { isVisible },
    );
    expect(result).toMatchObject(
      new LabelDto(dbResponse).updateVisibility(dbResponse),
    );
  });

  test('It should return an error because the isVisible was not provided', async () => {
    await expect(
      updateVisibilityUseCase.execute(null, labelData),
    ).rejects.toThrow(/was not provided/);
    expect(mockLabelRepository.updateVisibility).not.toHaveBeenCalled();
  });

  test('It should return an error because cardId is not a string', async () => {
    labelData.cardId = null;

    await expect(
      updateVisibilityUseCase.execute(isVisible, labelData),
    ).rejects.toThrow(/was not provided/);
    expect(mockLabelRepository.updateVisibility).not.toHaveBeenCalled();
  });

  test('It should return an error because cardId is not a string', async () => {
    labelData.labelId = null;

    await expect(
      updateVisibilityUseCase.execute(isVisible, labelData),
    ).rejects.toThrow(/was not provided/);
    expect(mockLabelRepository.updateVisibility).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation of update label failed', async () => {
    mockLabelRepository.updateVisibility.mockResolvedValue([0, []]);

    const result = await updateVisibilityUseCase.execute(isVisible, labelData);
    expect(mockLabelRepository.updateVisibility).toHaveBeenCalledTimes(1);
    expect(result).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
