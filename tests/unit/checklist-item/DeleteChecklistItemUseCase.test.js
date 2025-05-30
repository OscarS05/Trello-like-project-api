const DeleteChecklistItemUseCase = require('../../../api/src/application/use-cases/checklist-item/DeleteChecklistItemUseCase');
const { createChecklistItem } = require('../../fake-data/fake-entities');

describe('DeleteChecklistItemUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;

  let mockChecklistItemRepository;
  let deleteChecklistItemUseCase;

  beforeEach(() => {
    mockChecklistItemRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteChecklistItemUseCase = new DeleteChecklistItemUseCase({
      checklistItemRepository: mockChecklistItemRepository,
    });
  });

  test('It should return a checklist item', async () => {
    const result =
      await deleteChecklistItemUseCase.execute(fakeChecklistItemId);

    expect(mockChecklistItemRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  test('It should return an error because checklistId was not provided', async () => {
    await expect(deleteChecklistItemUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistItemRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation did not find anything', async () => {
    mockChecklistItemRepository.delete.mockResolvedValue(0);

    await expect(
      deleteChecklistItemUseCase.execute(fakeChecklistItemId),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockChecklistItemRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
