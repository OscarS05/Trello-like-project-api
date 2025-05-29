jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const { v4: uuidv4 } = require('uuid');

const CreateListUseCase = require('../../../api/src/application/use-cases/list/CreateListUseCase');
const ListDto = require('../../../api/src/application/dtos/list.dto');
const { createList } = require('../../fake-data/fake-entities');

describe('CreateListUseCase', () => {
  let listData;
  let dbResponse;
  let mockListRepository;
  let createListUseCase;

  beforeEach(() => {
    dbResponse = createList();
    listData = dbResponse;
    uuidv4.mockReturnValue(dbResponse.id);

    mockListRepository = {
      create: jest.fn().mockResolvedValue(dbResponse),
    };

    createListUseCase = new CreateListUseCase({
      listRepository: mockListRepository,
    });
  });

  test('It should return a successfully created list', async () => {
    const result = await createListUseCase.execute(listData);

    expect(uuidv4).toHaveBeenCalledTimes(1);
    expect(mockListRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ListDto(dbResponse));
  });

  test('It should return an error because projectId was not provided', async () => {
    listData.projectId = null;

    await expect(createListUseCase.execute(listData)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockListRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the provided name is not valid', async () => {
    listData.name = 123;

    await expect(createListUseCase.execute(listData)).rejects.toThrow(
      /must be a non-empty string/,
    );
    expect(mockListRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the provided name contains invalid characters', async () => {
    listData.name =
      'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';

    await expect(createListUseCase.execute(listData)).rejects.toThrow(
      /cannot exceed 80 characters/,
    );
    expect(mockListRepository.create).not.toHaveBeenCalled();
  });

  test('It should return an error because the operation db failed', async () => {
    mockListRepository.create.mockResolvedValue({});

    await expect(createListUseCase.execute(listData)).rejects.toThrow(
      /Something went wrong/,
    );
    expect(mockListRepository.create).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
