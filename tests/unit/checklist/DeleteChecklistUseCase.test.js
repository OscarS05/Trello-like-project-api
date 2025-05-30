const DeleteChecklistUseCase = require('../../../api/src/application/use-cases/checklist/DeleteChecklistUseCase');

describe('DeleteChecklistUseCase', () => {
  let checklistId;
  let mockChecklistRepository;
  let deleteChecklistUseCase;

  beforeEach(() => {
    checklistId = 'fake-card-uuid';

    mockChecklistRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteChecklistUseCase = new DeleteChecklistUseCase({
      checklistRepository: mockChecklistRepository,
    });
  });

  test('It should return a list of checklist its items', async () => {
    const result = await deleteChecklistUseCase.execute(checklistId);

    expect(mockChecklistRepository.delete).toHaveBeenCalledWith(checklistId);
    expect(result).toBe(1);
  });

  test('It should return an error because checklistId was not provided', async () => {
    checklistId = null;

    await expect(deleteChecklistUseCase.execute(checklistId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the find operation failed', async () => {
    mockChecklistRepository.delete.mockResolvedValue(0);

    await expect(deleteChecklistUseCase.execute(checklistId)).rejects.toThrow(
      /Something went wrong/,
    );

    expect(mockChecklistRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
