const DeleteListUseCase = require('../../../api/src/application/use-cases/list/DeleteListUseCase');
// const ListDto = require('../../../api/src/application/dtos/list.dto');
const { createList } = require('../../fake-data/fake-entities');

describe('DeleteListUseCase', () => {
  let projectId;
  let listId;
  // let dbResponse;
  let mockListRepository;
  let deleteListUseCase;

  beforeEach(() => {
    projectId = createList().projectId;
    listId = createList().id;
    // dbResponse = { ...createList(), name: listId };

    mockListRepository = {
      delete: jest.fn().mockResolvedValue(1),
    };

    deleteListUseCase = new DeleteListUseCase({
      listRepository: mockListRepository,
    });
  });

  test('It should return a successfully deleted list', async () => {
    const result = await deleteListUseCase.execute(projectId, listId);

    expect(mockListRepository.delete).toHaveBeenCalledTimes(1);
    expect(result).toBe(1);
  });

  test('It should return an error because the listId is not valid', async () => {
    listId = 123;

    await expect(deleteListUseCase.execute(projectId, null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockListRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the projectId contains invalid characters', async () => {
    await expect(deleteListUseCase.execute(undefined, listId)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockListRepository.delete).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockListRepository.delete.mockResolvedValue(0);

    await expect(deleteListUseCase.execute(projectId, listId)).rejects.toThrow(
      /Something went wrong/,
    );
    expect(mockListRepository.delete).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
