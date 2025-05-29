const UpdateLabelUseCase = require('../../../api/src/application/use-cases/label/UpdateLabelUseCase');
const LabelDto = require('../../../api/src/application/dtos/label.dto');
const { createLabel } = require('../../fake-data/fake-entities');

describe('UpdateLabelUseCase', () => {
  let labelId;
  let labelData;
  let dbResponse;
  let mockLabelRepository;
  let createLabelUseCase;

  beforeEach(() => {
    labelId = createLabel().id;
    labelData = { name: 'new name', color: '#FF0000' };
    dbResponse = { ...createLabel(), ...labelData };

    mockLabelRepository = {
      update: jest.fn().mockResolvedValue([1, [dbResponse]]),
    };

    createLabelUseCase = new UpdateLabelUseCase({
      labelRepository: mockLabelRepository,
    });
  });

  test('It should return a updated visibility', async () => {
    const result = await createLabelUseCase.execute(labelId, labelData);

    expect(mockLabelRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new LabelDto(dbResponse));
  });

  test('It should return an error because the labelId was not provided', async () => {
    await expect(createLabelUseCase.execute(null, labelData)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockLabelRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because name is not a string', async () => {
    labelData.name = 213;

    await expect(
      createLabelUseCase.execute(labelId, labelData),
    ).rejects.toThrow(/non-empty string/);
    expect(mockLabelRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the name exceed 80 characters', async () => {
    labelData.name =
      'jjjjjjjjjjjjjjjjjjjjjdddddddddddjjjjjjjjjjjjjjjjjjjjjjjjjjjjjdddddddddjjjjjjjjjdd';

    await expect(
      createLabelUseCase.execute(labelId, labelData),
    ).rejects.toThrow(/exceed 80 characters/);
    expect(mockLabelRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because color is not valid', async () => {
    labelData.color = '#AAAAAA';

    await expect(
      createLabelUseCase.execute(labelId, labelData),
    ).rejects.toThrow(/Invalid label color/);
    expect(mockLabelRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation of update label failed', async () => {
    mockLabelRepository.update.mockResolvedValue([0, []]);

    const result = await createLabelUseCase.execute(labelId, labelData);
    expect(mockLabelRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
