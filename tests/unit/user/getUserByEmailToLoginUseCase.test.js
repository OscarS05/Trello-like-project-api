const GetUserByEmailToLoginUseCase = require('../../../api/src/application/use-cases/user/GetUserByEmailToLoginUseCase');

const mockFindByEmail = jest.fn();

describe('getUserByEmailToLoginUseCase', () => {
  let email;
  let userData;
  let getUserByEmailToLoginUseCase;
  let mockUserRepository;

  beforeEach(() => {
    userData = {
      id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
      email: 'John@email.com',
      name: 'John Doe',
      role: 'basic',
      isVerified: false,
      createdAt: new Date(),
    };
    email = userData.email;

    mockUserRepository = {
      findByEmailToLogin: mockFindByEmail,
    };

    getUserByEmailToLoginUseCase = new GetUserByEmailToLoginUseCase({
      userRepository: mockUserRepository,
    });
    jest.clearAllMocks();
  });

  test('should find the user', async () => {
    mockUserRepository.findByEmailToLogin.mockResolvedValue(userData);

    const result = await getUserByEmailToLoginUseCase.execute(email);
    expect(mockUserRepository.findByEmailToLogin).toHaveBeenCalledWith(email);
    expect(result).toEqual(userData);
  });

  test('should not find the user', async () => {
    mockUserRepository.findByEmailToLogin.mockResolvedValue(null);

    await expect(
      getUserByEmailToLoginUseCase.execute(email),
    ).rejects.toMatchObject({
      output: { statusCode: 404 },
      message: 'User not found',
    });
    expect(mockUserRepository.findByEmailToLogin).toHaveBeenCalledWith(email);
  });

  test('should not find the user if id is missing', async () => {
    mockUserRepository.findByEmailToLogin.mockResolvedValue({});

    await expect(
      getUserByEmailToLoginUseCase.execute(email),
    ).rejects.toMatchObject({
      output: { statusCode: 404 },
      message: 'User not found',
    });
    expect(mockUserRepository.findByEmailToLogin).toHaveBeenCalledWith(email);
  });

  describe('Email validation', () => {
    test('should throw an error when the email has spaces', async () => {
      await expect(
        getUserByEmailToLoginUseCase.execute('joh nDoe@ema il.com'),
      ).rejects.toThrow('The email must not contain spaces');
      expect(mockUserRepository.findByEmailToLogin).not.toHaveBeenCalled();
    });

    test('should throw an error when the email has two or more @', async () => {
      await expect(
        getUserByEmailToLoginUseCase.execute('john@Doe@email.com'),
      ).rejects.toThrow('The email must contain only one @');
      expect(mockUserRepository.findByEmailToLogin).not.toHaveBeenCalled();
    });

    test('should throw an error when the email start or end with . or @', async () => {
      await expect(
        getUserByEmailToLoginUseCase.execute('.johnDoe@email.com'),
      ).rejects.toThrow('The email must not start or end with . or @');
      expect(mockUserRepository.findByEmailToLogin).not.toHaveBeenCalled();
    });

    test('should throw an error when the email has not the correct format', async () => {
      await expect(
        getUserByEmailToLoginUseCase.execute('johnDoe@email-com'),
      ).rejects.toThrow('The email domain is not valid');
      expect(mockUserRepository.findByEmailToLogin).not.toHaveBeenCalled();
    });
  });
});
