const GetUserByEmailUseCase = require('../../../api/src/application/use-cases/user/getUserByEmailUseCase');

const mockFindByEmail = jest.fn();

describe('getUserByEmailUseCase', () => {
  let email;
  let userData;
  let getUserByEmailUseCase;
  let mockUserRepository;

  beforeEach(() => {
    userData = {
      id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
      email: 'John@email.com',
      name: 'John Doe',
      role: 'basic',
      createdAt: new Date(),
    };
    email = userData.email;

    mockUserRepository = {
      findByEmail: mockFindByEmail,
    };

    getUserByEmailUseCase = new GetUserByEmailUseCase({
      userRepository: mockUserRepository,
    });
    jest.clearAllMocks();
  });

  test('should find the user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(userData);

    const result = await getUserByEmailUseCase.execute(email);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(userData);
  });

  test('should not find the user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(getUserByEmailUseCase.execute(email)).rejects.toMatchObject({
      output: { statusCode: 404 },
      message: 'User not found',
    });
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  test('should not find the user if id is missing', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({});

    await expect(getUserByEmailUseCase.execute(email)).rejects.toMatchObject({
      output: { statusCode: 404 },
      message: 'User not found',
    });
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  describe('Email validation', () => {
    test('should throw an error when the email has spaces', async () => {
      await expect(
        getUserByEmailUseCase.execute('joh nDoe@ema il.com'),
      ).rejects.toThrow('The email must not contain spaces');
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    test('should throw an error when the email has two or more @', async () => {
      await expect(
        getUserByEmailUseCase.execute('john@Doe@email.com'),
      ).rejects.toThrow('The email must contain only one @');
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    test('should throw an error when the email start or end with . or @', async () => {
      await expect(
        getUserByEmailUseCase.execute('.johnDoe@email.com'),
      ).rejects.toThrow('The email must not start or end with . or @');
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    test('should throw an error when the email has not the correct format', async () => {
      await expect(
        getUserByEmailUseCase.execute('johnDoe@email-com'),
      ).rejects.toThrow('The email domain is not valid');
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });
  });
});
