const UpdateTheCheckOfItemUseCase = require('../../../api/src/application/use-cases/checklist-item/UpdateTheCheckOfItemUseCase');
const ChecklistItemDto = require('../../../api/src/application/dtos/checklist-item.dto');
const { createChecklistItem } = require('../../fake-data/fake-entities');

describe('UpdateTheCheckOfItemUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;

  let isChecked;
  let updatedChecklistItem;
  let mockChecklistItemRepository;
  let updateTheCheckOfItemUseCase;

  beforeEach(() => {
    isChecked = true;

    updatedChecklistItem = createChecklistItem({
      isChecked: true,
    });

    mockChecklistItemRepository = {
      update: jest.fn().mockResolvedValue([1, [updatedChecklistItem]]),
    };

    updateTheCheckOfItemUseCase = new UpdateTheCheckOfItemUseCase({
      checklistItemRepository: mockChecklistItemRepository,
    });
  });

  test('It should return an updated checklist item', async () => {
    const result = await updateTheCheckOfItemUseCase.execute(
      fakeChecklistItemId,
      isChecked,
    );

    expect(mockChecklistItemRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ChecklistItemDto(updatedChecklistItem));
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    await expect(
      updateTheCheckOfItemUseCase.execute(null, isChecked),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because isChecked was not provided or not is a boolean', async () => {
    await expect(
      updateTheCheckOfItemUseCase.execute(fakeChecklistItemId, 'false'),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistItemRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the update operation failed', async () => {
    mockChecklistItemRepository.update.mockResolvedValue([0, []]);

    await expect(
      updateTheCheckOfItemUseCase.execute(fakeChecklistItemId, isChecked),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockChecklistItemRepository.update).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
