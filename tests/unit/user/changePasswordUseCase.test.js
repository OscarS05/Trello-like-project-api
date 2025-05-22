jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

const bcrypt = require('bcrypt');

const ChangePasswordUseCase = require('../../../api/src/application/use-cases/user/changePasswordUseCase');

const mockUpdateUser = jest.fn();

describe('changePasswordUseCase', () => {
  let userId;
  let newPassword;
  let hashedPassword;
  let PasswordUpdateMessage;
  let changePasswordUseCase;
  let mockUserRepository;

  beforeEach(() => {
    userId = 'f81625ba-cee1-4b48-92a8-3f3065d219fb';
    newPassword = 'Passw0rd@';
    hashedPassword = 'hashed-password';
    PasswordUpdateMessage = {
      message: 'Password was successfully changed. Please, sign in!',
    };

    mockUserRepository = {
      update: mockUpdateUser,
    };

    changePasswordUseCase = new ChangePasswordUseCase({
      userRepository: mockUserRepository,
    });
    jest.clearAllMocks();
  });

  test('should update the password', async () => {
    mockUserRepository.update.mockResolvedValue(1);
    bcrypt.hash.mockResolvedValue(hashedPassword);

    const result = await changePasswordUseCase.execute(userId, newPassword);
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        recoveryToken: null,
        password: hashedPassword,
        isVerified: true,
      }),
    );
    expect(result).toEqual(PasswordUpdateMessage);
  });

  describe('Password validation', () => {
    test('should throw an error when the password length is invalid', async () => {
      await expect(
        changePasswordUseCase.execute(userId, '123'),
      ).rejects.toThrow('Password must be at least 8 characters long');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    test('should throw error if password has no uppercase letters', async () => {
      await expect(
        changePasswordUseCase.execute(userId, '12346789'),
      ).rejects.toThrow('Password must contain at least one uppercase letter');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    test('should throw an error because must contain one number', async () => {
      await expect(
        changePasswordUseCase.execute(userId, 'UnoDsTres'),
      ).rejects.toThrow('Password must contain at least one number');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    test('should throw an error when a special character is missing', async () => {
      await expect(
        changePasswordUseCase.execute(userId, 'O1235678'),
      ).rejects.toThrow(
        'Password must contain at least one special character (!@#$%^&*)',
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
