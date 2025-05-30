const CheckListItemByIdAndProjectUseCase = require('../../../api/src/application/use-cases/checklist-item/CheckListItemByIdAndProjectUseCase');
const ChecklistItemDto = require('../../../api/src/application/dtos/checklist-item.dto');
const {
  createChecklistItem,
  createProject,
  createCard,
  createList,
  createChecklist,
} = require('../../fake-data/fake-entities');

describe('CheckListItemByIdAndProjectUseCase', () => {
  const fakeChecklistItemId = createChecklistItem().id;
  const fakeProjectId = createProject().id;

  let dbResponse;
  let mockChecklistItemRepository;
  let checkListItemByIdAndProjectUseCase;

  beforeEach(() => {
    dbResponse = {
      ...createChecklistItem(),
      checklist: {
        ...createChecklist(),
        card: { ...createCard(), list: createList() },
      },
    };

    mockChecklistItemRepository = {
      findOneByIdAndProject: jest.fn().mockResolvedValue(dbResponse),
    };

    checkListItemByIdAndProjectUseCase = new CheckListItemByIdAndProjectUseCase(
      {
        checklistItemRepository: mockChecklistItemRepository,
      },
    );
  });

  test('It should return a checklist item', async () => {
    const result = await checkListItemByIdAndProjectUseCase.execute(
      fakeChecklistItemId,
      fakeProjectId,
    );

    expect(
      mockChecklistItemRepository.findOneByIdAndProject,
    ).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ChecklistItemDto(dbResponse));
  });

  test('It should return an error because checklistItemId was not provided', async () => {
    await expect(
      checkListItemByIdAndProjectUseCase.execute(null, fakeProjectId),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockChecklistItemRepository.findOneByIdAndProject,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because projectId was not provided or not is a boolean', async () => {
    await expect(
      checkListItemByIdAndProjectUseCase.execute(fakeChecklistItemId, null),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockChecklistItemRepository.findOneByIdAndProject,
    ).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation did not find anything', async () => {
    mockChecklistItemRepository.findOneByIdAndProject.mockResolvedValue({});

    const result = await checkListItemByIdAndProjectUseCase.execute(
      fakeChecklistItemId,
      fakeProjectId,
    );

    expect(
      mockChecklistItemRepository.findOneByIdAndProject,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
