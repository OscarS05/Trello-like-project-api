const GetChecklistUseCase = require('../../../api/src/application/use-cases/checklist/GetChecklistUseCase');
const ChecklistDto = require('../../../api/src/application/dtos/checklist.dto');
const { createChecklist } = require('../../fake-data/fake-entities');

describe('GetChecklistUseCase', () => {
  let checklistId;
  let dbResponse;
  let mockChecklistRepository;
  let getChecklistUseCase;

  beforeEach(() => {
    checklistId = createChecklist().id;

    dbResponse = createChecklist();

    mockChecklistRepository = {
      findOne: jest.fn().mockResolvedValue(dbResponse),
    };

    getChecklistUseCase = new GetChecklistUseCase({
      checklistRepository: mockChecklistRepository,
    });
  });

  test('It should return a checklist', async () => {
    const result = await getChecklistUseCase.execute(checklistId);

    expect(mockChecklistRepository.findOne).toHaveBeenCalledWith(checklistId);
    expect(result).toMatchObject(new ChecklistDto(dbResponse));
  });

  test('It should return an error because checklist was not provided', async () => {
    checklistId = null;

    await expect(getChecklistUseCase.execute(checklistId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistRepository.findOne).not.toHaveBeenCalled();
  });

  test('It should return an error because the create operation failed', async () => {
    mockChecklistRepository.findOne.mockResolvedValue({});

    const result = await getChecklistUseCase.execute(checklistId);

    expect(mockChecklistRepository.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
