jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const bcrypt = require('bcrypt');

const SignUpUseCase = require('../../../api/src/application/use-cases/user/signUpUseCase');

const mockGetUserByEmail = jest.fn();
const mockCreateUser = jest.fn();

describe('signUpUseCase', () => {
  let userData;
  let hashedPassword;
  let userCreated;
  let signUpUseCase;
  let mockUserRepository;

  beforeEach(() => {
    userData = {
      email: 'John@email.com',
      name: 'John Doe',
      password: 'O123456@k',
    };

    hashedPassword = 'Hashed123@';

    userCreated = {
      ...userData,
      id: 'f81625ba-cee1-4b48-92a8-3f3065d219fb',
      role: 'basic',
      password: hashedPassword,
      createdAt: new Date(),
    };

    mockUserRepository = {
      findByEmail: mockGetUserByEmail,
      create: mockCreateUser,
    };

    signUpUseCase = new SignUpUseCase({ userRepository: mockUserRepository });
    jest.clearAllMocks();
  });

  describe('Password validation', () => {
    test('should throw an error when the password length is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, password: '123' }),
      ).rejects.toThrow('Password must be at least 8 characters long');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test('should throw error if password has no uppercase letters', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, password: '12346789' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test('should throw an error because must contain one number', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, password: 'UnoDsTres' }),
      ).rejects.toThrow('Password must contain at least one number');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test('should throw an error when a special character is missing', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, password: 'O1235678' }),
      ).rejects.toThrow(
        'Password must contain at least one special character (!@#$%^&*)',
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Email validation', () => {
    test('should throw an error when the email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue('johnDoe@email.com');

      await expect(
        signUpUseCase.execute({ ...userData, password: 'O1235678' }),
      ).rejects.toThrow('User already exists');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test('should throw an error when the email has spaces', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, email: 'joh nDoe@ema il.com' }),
      ).rejects.toThrow('The email must not contain spaces');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test('should throw an error when the email has two or more @', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, email: 'john@Doe@email.com' }),
      ).rejects.toThrow('The email must contain only one @');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test('should throw an error when the email start or end with . or @', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, email: '.johnDoe@email.com' }),
      ).rejects.toThrow('The email must not start or end with . or @');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    test('should throw an error when the email has not the correct format', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, email: 'johnDoe@email-com' }),
      ).rejects.toThrow('The email domain is not valid');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Name validation', () => {
    test('should throw an error when the name is empty', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, name: '' }),
      ).rejects.toThrow('The name must contain at least 3 letters');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test('should throw an error when the name has less than 3 letters', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signUpUseCase.execute({ ...userData, name: 'Jo' }),
      ).rejects.toThrow('The name must contain at least 3 letters');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  test('should create a new user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue(userCreated);

    const result = await signUpUseCase.execute(userData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      }),
    );
    expect(result.name).toEqual(userData.name);
    expect(result.email).toEqual(userData.email);
  });
});
