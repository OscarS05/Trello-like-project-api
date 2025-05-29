const GetProjectByListUseCase = require('../../../api/src/application/use-cases/list/GetProjectByListUseCase');
// const ListDto = require('../../../api/src/application/dtos/list.dto');
const { createList, createProject } = require('../../fake-data/fake-entities');

describe('GetProjectByListUseCase', () => {
  let projectId;
  let dbResponse;
  let mockListRepository;
  let getProjectByListUseCase;

  beforeEach(() => {
    projectId = createList().projectId;
    dbResponse = {
      ...createList(),
      project: createProject(),
    };

    mockListRepository = {
      getProjectByList: jest.fn().mockResolvedValue(dbResponse),
    };

    getProjectByListUseCase = new GetProjectByListUseCase({
      listRepository: mockListRepository,
    });
  });

  test('It should return a list with its project', async () => {
    const result = await getProjectByListUseCase.execute(projectId);

    expect(mockListRepository.getProjectByList).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(dbResponse);
  });

  test('It should return an error because the projectId was not provided', async () => {
    await expect(getProjectByListUseCase.execute(null)).rejects.toThrow(
      /was not provided/,
    );
    expect(mockListRepository.getProjectByList).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation db did not find anything', async () => {
    mockListRepository.getProjectByList.mockResolvedValue(0);

    const result = await getProjectByListUseCase.execute(projectId);
    expect(mockListRepository.getProjectByList).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
