const ListDto = require('../../../api/src/application/dtos/list.dto');
const GetListUseCase = require('../../../api/src/application/use-cases/list/GetListUseCase');
// const ListDto = require('../../../api/src/application/dtos/list.dto');
const { createList } = require('../../fake-data/fake-entities');

describe('GetListUseCase', () => {
  let projectId;
  let listId;
  let dbResponse;
  let mockListRepository;
  let getListUseCase;

  beforeEach(() => {
    projectId = createList().projectId;
    listId = createList().id;
    dbResponse = createList();

    mockListRepository = {
      findOneById: jest.fn().mockResolvedValue(dbResponse),
    };

    getListUseCase = new GetListUseCase({
      listRepository: mockListRepository,
    });
  });

  test('It should return a list', async () => {
    const result = await getListUseCase.execute(projectId, listId);

    expect(mockListRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ListDto(dbResponse));
  });

  test('It should return an error because the listId is not valid', async () => {
    await expect(getListUseCase.execute(projectId, null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockListRepository.findOneById).not.toHaveBeenCalled();
  });

  test('It should return an error because the projectId is not valid', async () => {
    await expect(getListUseCase.execute(null, listId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockListRepository.findOneById).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation db did not find anything', async () => {
    mockListRepository.findOneById.mockResolvedValue(0);

    const result = await getListUseCase.execute(projectId, listId);
    expect(mockListRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
