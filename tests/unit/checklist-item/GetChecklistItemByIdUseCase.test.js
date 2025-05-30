const GetChecklistItemByIdUseCase = require('../../../api/src/application/use-cases/checklist-item/GetChecklistItemByIdUseCase');
const ChecklistItemDto = require('../../../api/src/application/dtos/checklist-item.dto');
const { createChecklistItem } = require('../../fake-data/fake-entities');

describe('GetChecklistItemByIdUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;

  let dbResponse;
  let mockChecklistItemRepository;
  let getChecklistItemByIdUseCase;

  beforeEach(() => {
    dbResponse = createChecklistItem();

    mockChecklistItemRepository = {
      findOne: jest.fn().mockResolvedValue(dbResponse),
    };

    getChecklistItemByIdUseCase = new GetChecklistItemByIdUseCase({
      checklistItemRepository: mockChecklistItemRepository,
    });
  });

  test('It should return a checklist item', async () => {
    const result =
      await getChecklistItemByIdUseCase.execute(fakeChecklistItemId);

    expect(mockChecklistItemRepository.findOne).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ChecklistItemDto(dbResponse));
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    await expect(getChecklistItemByIdUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistItemRepository.findOne).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation did not find anything', async () => {
    mockChecklistItemRepository.findOne.mockResolvedValue({});

    const result =
      await getChecklistItemByIdUseCase.execute(fakeChecklistItemId);

    expect(mockChecklistItemRepository.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
