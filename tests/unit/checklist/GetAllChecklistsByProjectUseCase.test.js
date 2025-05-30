const GetAllChecklistsByProjectUseCase = require('../../../api/src/application/use-cases/checklist/GetAllChecklistsByProjectUseCase');
const CardDto = require('../../../api/src/application/dtos/card.dto');
const {
  createChecklist,
  createProject,
  createList,
  createCard,
} = require('../../fake-data/fake-entities');

describe('GetAllChecklistsByProjectUseCase', () => {
  let projectId;
  let dbResponse;
  let mockChecklistRepository;
  let getChecklistUseCase;

  beforeEach(() => {
    projectId = createChecklist().id;

    dbResponse = {
      ...createProject,
      lists: [
        {
          ...createList(),
          cards: [
            {
              ...createCard(),
              checklists: [createChecklist(), createChecklist()],
            },
            {
              ...createCard(),
              checklists: [createChecklist(), createChecklist()],
            },
          ],
        },
        {
          ...createList(),
          cards: [{ ...createCard(), checklists: [createChecklist()] }],
        },
      ],
    };

    mockChecklistRepository = {
      findChecklistsByProject: jest.fn().mockResolvedValue(dbResponse),
    };

    getChecklistUseCase = new GetAllChecklistsByProjectUseCase({
      checklistRepository: mockChecklistRepository,
    });
  });

  test('It should return a list of checklist', async () => {
    const useCaseResponse = dbResponse.lists.flatMap((list) => {
      if (!list.cards) return [];

      return list.cards
        .filter((card) => card.checklists && card.checklists.length > 0)
        .map((card) => CardDto.withChecklists(card));
    });

    const result = await getChecklistUseCase.execute(projectId);

    expect(
      mockChecklistRepository.findChecklistsByProject,
    ).toHaveBeenCalledWith(projectId);
    expect(result).toMatchObject(useCaseResponse);
  });

  test('It should return an error because projectId was not provided', async () => {
    projectId = null;

    await expect(getChecklistUseCase.execute(projectId)).rejects.toThrow(
      /was not provided/,
    );
    expect(
      mockChecklistRepository.findChecklistsByProject,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because the find operation failed', async () => {
    mockChecklistRepository.findChecklistsByProject.mockResolvedValue({});

    const result = await getChecklistUseCase.execute(projectId);

    expect(
      mockChecklistRepository.findChecklistsByProject,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
