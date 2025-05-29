const UpdateListUseCase = require('../../../api/src/application/use-cases/list/UpdateListUseCase');
const ListDto = require('../../../api/src/application/dtos/list.dto');
const { createList } = require('../../fake-data/fake-entities');

describe('UpdateListUseCase', () => {
  let listId;
  let newName;
  let dbResponse;
  let mockListRepository;
  let updateListUseCase;

  beforeEach(() => {
    listId = createList().id;
    newName = 'new name';
    dbResponse = { ...createList(), name: newName };

    mockListRepository = {
      update: jest.fn().mockResolvedValue([1, [dbResponse]]),
    };

    updateListUseCase = new UpdateListUseCase({
      listRepository: mockListRepository,
    });
  });

  test('It should return a successfully updated list', async () => {
    const result = await updateListUseCase.execute(listId, newName);

    expect(mockListRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ListDto(dbResponse));
  });

  test('It should return an error because the newName is not valid', async () => {
    newName = 123;

    await expect(updateListUseCase.execute(listId, newName)).rejects.toThrow(
      /must be a non-empty string/,
    );
    expect(mockListRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the newName contains invalid characters', async () => {
    newName =
      'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';

    await expect(updateListUseCase.execute(listId, newName)).rejects.toThrow(
      /cannot exceed 80 characters/,
    );
    expect(mockListRepository.update).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockListRepository.update.mockResolvedValue([0, [{}]]);

    await expect(updateListUseCase.execute(listId, newName)).rejects.toThrow(
      /Something went wrong/,
    );
    expect(mockListRepository.update).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
