const CheckProjectMembershipByListUseCase = require('../../../api/src/application/use-cases/list/CheckProjectMembershipByListUseCase');
const ListDto = require('../../../api/src/application/dtos/list.dto');
const { createList, createUser } = require('../../fake-data/fake-entities');

describe('CheckProjectMembershipByListUseCase', () => {
  let userId;
  let listId;
  let dbResponse;
  let mockListRepository;
  let checkProjectMembershipByListUseCase;

  beforeEach(() => {
    userId = createUser().id;
    listId = createList().id;
    dbResponse = createList();

    mockListRepository = {
      checkProjectMembershipByList: jest.fn().mockResolvedValue(dbResponse),
    };

    checkProjectMembershipByListUseCase =
      new CheckProjectMembershipByListUseCase({
        listRepository: mockListRepository,
      });
  });

  test('It should return a list with its project', async () => {
    const result = await checkProjectMembershipByListUseCase.execute(
      userId,
      listId,
    );

    expect(
      mockListRepository.checkProjectMembershipByList,
    ).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(new ListDto(dbResponse));
  });

  test('It should return an error because the userId was not provided', async () => {
    await expect(
      checkProjectMembershipByListUseCase.execute(null, listId),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockListRepository.checkProjectMembershipByList,
    ).not.toHaveBeenCalled();
  });

  test('It should return an error because the listId was not provided', async () => {
    await expect(
      checkProjectMembershipByListUseCase.execute(userId, null),
    ).rejects.toThrow(/was not provided/);
    expect(
      mockListRepository.checkProjectMembershipByList,
    ).not.toHaveBeenCalled();
  });

  test('It should return an empty object because the operation db did not find anything', async () => {
    mockListRepository.checkProjectMembershipByList.mockResolvedValue(0);

    const result = await checkProjectMembershipByListUseCase.execute(
      userId,
      listId,
    );
    expect(
      mockListRepository.checkProjectMembershipByList,
    ).toHaveBeenCalledTimes(1);
    expect(result).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
