const UpdateChecklistUseCase = require('../../../api/src/application/use-cases/checklist/UpdateChecklistUseCase');
const ChecklistDto = require('../../../api/src/application/dtos/checklist.dto');
const { createChecklist } = require('../../fake-data/fake-entities');

describe('UpdateChecklistUseCase', () => {
  let checklistId;
  let checklistData;
  let createdChecklist;
  let mockChecklistRepository;
  let updateChecklistUseCase;

  beforeEach(() => {
    checklistId = createChecklist().id;
    checklistData = {
      newName: 'checklist name',
    };

    createdChecklist = createChecklist({ name: checklistData.newName });

    mockChecklistRepository = {
      update: jest.fn().mockResolvedValue([1, [createdChecklist]]),
    };

    updateChecklistUseCase = new UpdateChecklistUseCase({
      checklistRepository: mockChecklistRepository,
    });
  });

  test('It should return an updated checklist', async () => {
    const result = await updateChecklistUseCase.execute(
      checklistId,
      checklistData,
    );

    expect(mockChecklistRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ChecklistDto(createdChecklist));
  });

  test('It should return an error because cardId was not provided', async () => {
    checklistId = null;

    await expect(
      updateChecklistUseCase.execute(checklistId, checklistData),
    ).rejects.toThrow(/was not provided/);
    expect(mockChecklistRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the checklist name was not provided', async () => {
    checklistData.newName = 123;

    await expect(
      updateChecklistUseCase.execute(checklistId, checklistData),
    ).rejects.toThrow(/non-empty string/);
    expect(mockChecklistRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the create operation failed', async () => {
    mockChecklistRepository.update.mockResolvedValue([0, []]);

    await expect(
      updateChecklistUseCase.execute(checklistId, checklistData),
    ).rejects.toThrow(/Something went wrong/);

    expect(mockChecklistRepository.update).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
