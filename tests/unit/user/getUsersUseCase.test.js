const GetUsersUserCase = require('../../../api/src/application/use-cases/user/getUsersUserCase');

const mockFindAllUsers = jest.fn();

describe('getUsersUserCase', () => {
  let queries = {};
  let userData;
  let getUsersUserCase;
  let mockUserRepository;

  beforeEach(() => {
    userData = [
      {
        id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
        email: 'John@email.com',
        name: 'John Doe',
        role: 'basic',
        createdAt: new Date(),
      },
    ];

    mockUserRepository = {
      findAll: mockFindAllUsers,
    };

    getUsersUserCase = new GetUsersUserCase({
      userRepository: mockUserRepository,
    });
    jest.clearAllMocks();
  });

  test('should find all users', async () => {
    mockUserRepository.findAll.mockResolvedValue(userData);

    const result = await getUsersUserCase.execute(queries);
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(queries);
    expect(result).toHaveLength(1);
    expect(result).toEqual(userData);
  });

  test('should not find the users', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    const result = await getUsersUserCase.execute(queries);
    expect(result).toEqual([]);
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(queries);
  });

  test('should throw an error by the invalid query', async () => {
    queries = { limit: 'not-a-number', unknownField: 'xxx' };

    await expect(getUsersUserCase.execute(queries)).rejects.toThrow(
      'Unknown query parameters: unknownField',
    );
    expect(mockUserRepository.findAll).not.toHaveBeenCalled();
  });

  test('should throw an error by the invalid query isVerified', async () => {
    queries = { isVerified: 'not-a-boolean' };

    await expect(getUsersUserCase.execute(queries)).rejects.toThrow(
      'Invalid isVerified',
    );
    expect(mockUserRepository.findAll).not.toHaveBeenCalled();
  });
});
