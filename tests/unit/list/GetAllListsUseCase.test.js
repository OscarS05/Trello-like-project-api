const GetAllListsUseCase = require('../../../api/src/application/use-cases/list/GetAllListsUseCase');
const ListDto = require('../../../api/src/application/dtos/list.dto');
const { createList } = require('../../fake-data/fake-entities');

describe('GetAllListsUseCase', () => {
  let projectId;
  let dbResponse;
  let mockListRepository;
  let getAllListsUseCase;

  beforeEach(() => {
    projectId = createList().projectId;
    dbResponse = [createList(), createList()];

    mockListRepository = {
      findAll: jest.fn().mockResolvedValue(dbResponse),
    };

    getAllListsUseCase = new GetAllListsUseCase({
      listRepository: mockListRepository,
    });
  });

  test('It should return a list', async () => {
    const result = await getAllListsUseCase.execute(projectId);

    expect(mockListRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(dbResponse.map((list) => new ListDto(list)));
  });

  test('It should return an error because the projectId was not provided', async () => {
    await expect(getAllListsUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockListRepository.findAll).not.toHaveBeenCalled();
  });

  test('It should return an empty array because the operation db did not find anything', async () => {
    mockListRepository.findAll.mockResolvedValue(0);

    const result = await getAllListsUseCase.execute(projectId);
    expect(mockListRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
