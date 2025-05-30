jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const CreateChecklistByCopyingItemsUseCase = require('../../../api/src/application/use-cases/checklist/CreateChecklistByCopyingItemsUseCase');
const ChecklistDto = require('../../../api/src/application/dtos/checklist.dto');
const {
  createChecklistItem,
  createChecklist,
} = require('../../fake-data/fake-entities');

describe('CreateChecklistByCopyingItemsUseCase', () => {
  const fakeChecklistId = 'fake-checklist-uuid';
  const fakeChecklistItemId = 'fake-checklist-item-uuid';

  let checklistData;
  let checklistWithItems;
  let createdChecklist;
  let createdChecklistItems;
  let mockChecklistRepository;
  let mockChecklistItemRepository;
  let createChecklistByCopyingItemsUseCase;

  beforeAll(() => {
    uuid
      .mockReturnValueOnce(fakeChecklistId)
      .mockReturnValueOnce(fakeChecklistItemId);
  });

  beforeEach(() => {
    checklistData = {
      name: 'checklist name',
      cardId: createChecklist().cardId,
    };
    checklistWithItems = {
      ...createChecklist(),
      items: [createChecklistItem(), createChecklistItem()],
    };
    createdChecklist = createChecklist({ id: fakeChecklistId });
    createdChecklistItems = [
      createChecklistItem({ id: fakeChecklistItemId }),
      createChecklistItem({ id: fakeChecklistItemId }),
    ];

    mockChecklistRepository = {
      create: jest.fn().mockResolvedValue(createdChecklist),
    };

    mockChecklistItemRepository = {
      bulkCreate: jest.fn().mockResolvedValue(createdChecklistItems),
    };

    createChecklistByCopyingItemsUseCase =
      new CreateChecklistByCopyingItemsUseCase({
        checklistRepository: mockChecklistRepository,
        checklistItemRepository: mockChecklistItemRepository,
      });
  });

  test('It should return a checklist with the items copied', async () => {
    const dbResponse = { ...createdChecklist, items: createdChecklistItems };

    const result = await createChecklistByCopyingItemsUseCase.execute(
      checklistData,
      checklistWithItems,
    );

    expect(mockChecklistRepository.create).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemRepository.bulkCreate).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ChecklistDto(dbResponse));
  });

  test('It should return an error because cardId was not provided', async () => {
    checklistData.cardId = null;

    await expect(
      createChecklistByCopyingItemsUseCase.execute(
        checklistData,
        checklistWithItems,
      ),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the checklist name was not provided', async () => {
    checklistData.name = null;

    await expect(
      createChecklistByCopyingItemsUseCase.execute(
        checklistData,
        checklistWithItems,
      ),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because checklistWithItems to be copied was not provided', async () => {
    await expect(
      createChecklistByCopyingItemsUseCase.execute(checklistData, {}),
    ).rejects.toThrow(
      'The checklist does not exist or does not belong to the card',
    );
    expect(mockChecklistRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the checklistWithItems to be copied have not items', async () => {
    checklistWithItems.items = [];

    await expect(
      createChecklistByCopyingItemsUseCase.execute(
        checklistData,
        checklistWithItems,
      ),
    ).rejects.toThrow(/has no items to copy/);
    expect(mockChecklistRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the create operation failed', async () => {
    mockChecklistRepository.create.mockResolvedValue({});

    await expect(
      createChecklistByCopyingItemsUseCase.execute(
        checklistData,
        checklistWithItems,
      ),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockChecklistRepository.create).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemRepository.bulkCreate).not.toHaveBeenCalled();
  });

  test('It should return an error because the bulkCreate operation failed', async () => {
    mockChecklistItemRepository.bulkCreate.mockResolvedValue([]);

    await expect(
      createChecklistByCopyingItemsUseCase.execute(
        checklistData,
        checklistWithItems,
      ),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockChecklistRepository.create).toHaveBeenCalledTimes(1);
    expect(mockChecklistItemRepository.bulkCreate).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
