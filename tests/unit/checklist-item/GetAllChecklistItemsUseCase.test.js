const GetAllChecklistItemsUseCase = require('../../../api/src/application/use-cases/checklist-item/GetAllChecklistItemsUseCase');
const ChecklistItemDto = require('../../../api/src/application/dtos/checklist-item.dto');
const { createChecklistItem } = require('../../fake-data/fake-entities');

describe('GetAllChecklistItemsUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;

  let dbResponse;
  let mockChecklistItemRepository;
  let getAllChecklistItemsUseCase;

  beforeEach(() => {
    dbResponse = [
      createChecklistItem(),
      createChecklistItem(),
      createChecklistItem(),
    ];

    mockChecklistItemRepository = {
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllChecklistItemsUseCase = new GetAllChecklistItemsUseCase({
      checklistItemRepository: mockChecklistItemRepository,
    });
  });

  test('It should return a checklist item', async () => {
    const result =
      await getAllChecklistItemsUseCase.execute(fakeChecklistItemId);

    expect(mockChecklistItemRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(
      dbResponse.map((item) => new ChecklistItemDto(item)),
    );
  });

  test('It should return an error because checklistId was not provided', async () => {
    await expect(getAllChecklistItemsUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistItemRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation did not find anything', async () => {
    mockChecklistItemRepository.findAll.mockResolvedValue([]);

    const result =
      await getAllChecklistItemsUseCase.execute(fakeChecklistItemId);

    expect(mockChecklistItemRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
