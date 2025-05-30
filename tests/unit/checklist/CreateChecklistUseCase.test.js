jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuid } = require('uuid');

const CreateChecklistUseCase = require('../../../api/src/application/use-cases/checklist/CreateChecklistUseCase');
const ChecklistDto = require('../../../api/src/application/dtos/checklist.dto');
const { createChecklist } = require('../../fake-data/fake-entities');

describe('CreateChecklistUseCase', () => {
  const fakeChecklistId = 'fake-checklist-uuid';

  let checklistData;
  let createdChecklist;
  let mockChecklistRepository;
  let createChecklistUseCase;

  beforeAll(() => {
    uuid.mockReturnValueOnce(fakeChecklistId);
  });

  beforeEach(() => {
    checklistData = {
      name: 'checklist name',
      cardId: createChecklist().cardId,
    };

    createdChecklist = createChecklist({ id: fakeChecklistId });

    mockChecklistRepository = {
      create: jest.fn().mockResolvedValue(createdChecklist),
    };

    createChecklistUseCase = new CreateChecklistUseCase({
      checklistRepository: mockChecklistRepository,
    });
  });

  test('It should return a created checklist', async () => {
    const result = await createChecklistUseCase.execute(checklistData);

    expect(mockChecklistRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ChecklistDto(createdChecklist));
  });

  test('It should return an error because cardId was not provided', async () => {
    checklistData.cardId = null;

    await expect(createChecklistUseCase.execute(checklistData)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the checklist name was not provided', async () => {
    checklistData.name = null;

    await expect(createChecklistUseCase.execute(checklistData)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the create operation failed', async () => {
    mockChecklistRepository.create.mockResolvedValue({});

    await expect(createChecklistUseCase.execute(checklistData)).rejects.toThrow(
      /Something went wrong/,
    );

    expect(mockChecklistRepository.create).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
