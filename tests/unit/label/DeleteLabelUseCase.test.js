const DeleteLabelUseCase = require('../../../api/src/application/use-cases/label/DeleteLabelUseCase');

describe('DeleteLabelUseCase', () => {
  let labelId;
  let mockLabelRepository;
  let deleteLabelUseCase;

  beforeEach(() => {
    labelId = 'false';

    mockLabelRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteLabelUseCase = new DeleteLabelUseCase({
      labelRepository: mockLabelRepository,
    });
  });

  test('It should return a 1', async () => {
    const result = await deleteLabelUseCase.execute(labelId);

    expect(mockLabelRepository.delete).toHaveBeenCalledWith(labelId);
    expect(result).toBe(1);
  });

  test('It should return an error because the labelId was not provided', async () => {
    await expect(deleteLabelUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockLabelRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the db operation of delete label failed', async () => {
    mockLabelRepository.delete.mockResolvedValue(0);

    await expect(deleteLabelUseCase.execute(labelId)).rejects.toThrow(
      /Something went wrong/,
    );
    expect(mockLabelRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
