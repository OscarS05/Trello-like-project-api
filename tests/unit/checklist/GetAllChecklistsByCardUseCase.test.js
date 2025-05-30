const GetAllChecklistsByCardUseCase = require('../../../api/src/application/use-cases/checklist/GetAllChecklistsByCardUseCase');
const ChecklistDto = require('../../../api/src/application/dtos/checklist.dto');
const {
  createChecklist,
  createChecklistItem,
} = require('../../fake-data/fake-entities');

describe('GetAllChecklistsByCardUseCase', () => {
  let cardId;
  let dbResponse;
  let mockChecklistRepository;
  let getAllChecklistsByCardUseCase;

  beforeEach(() => {
    cardId = 'fake-card-uuid';

    dbResponse = [
      {
        ...createChecklist(),
        items: [createChecklistItem(), createChecklistItem()],
      },
      {
        ...createChecklist(),
        items: [createChecklistItem(), createChecklistItem()],
      },
    ];

    mockChecklistRepository = {
      findChecklistsByCard: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllChecklistsByCardUseCase = new GetAllChecklistsByCardUseCase({
      checklistRepository: mockChecklistRepository,
    });
  });

  test('It should return a list of checklist its items', async () => {
    const result = await getAllChecklistsByCardUseCase.execute(cardId);

    expect(mockChecklistRepository.findChecklistsByCard).toHaveBeenCalledWith(
      cardId,
    );
    expect(result).toMatchObject(
      dbResponse.map((checklist) => new ChecklistDto(checklist)),
    );
  });

  test('It should return an error because cardId was not provided', async () => {
    cardId = null;

    await expect(getAllChecklistsByCardUseCase.execute(cardId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockChecklistRepository.findChecklistsByCard).not.toHaveBeenCalled();
  });

  test('It should return an error because the find operation failed', async () => {
    mockChecklistRepository.findChecklistsByCard.mockResolvedValue([]);

    const result = await getAllChecklistsByCardUseCase.execute(cardId);

    expect(mockChecklistRepository.findChecklistsByCard).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
