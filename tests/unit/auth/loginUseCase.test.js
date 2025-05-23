jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const bcrypt = require('bcrypt');

const LoginUseCase = require('../../../api/src/application/use-cases/auth/loginUseCase');
const { createUser } = require('../../fake-data/fake-entities');

describe('LoginUseCase', () => {
  const hashedPassword = 'hashed-password';
  const randomPassword = 'Hashed-passw0rd@';
  let userDataInDb;
  let userDataDTO;
  let passwordReceivedAtLogin;
  let loginUseCase;

  beforeEach(() => {
    userDataInDb = createUser();
    userDataInDb.password = hashedPassword;
    userDataDTO = createUser();

    loginUseCase = new LoginUseCase({ userRepository: jest.fn() });
  });

  test("It should return the user's data. This indicates successful login", async () => {
    bcrypt.compare.mockResolvedValue(true);
    passwordReceivedAtLogin = randomPassword;

    const result = await loginUseCase.execute(
      userDataInDb,
      passwordReceivedAtLogin,
    );
    expect(result).toEqual(userDataDTO);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      passwordReceivedAtLogin,
      userDataInDb.password,
    );
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
  });

  test('It should return an error by incorrect password', async () => {
    bcrypt.compare.mockResolvedValue(false);
    passwordReceivedAtLogin = 'Inc0rrect-password@';
    try {
      await loginUseCase.execute(userDataInDb, passwordReceivedAtLogin);
    } catch (error) {
      expect(error.message).toEqual('The password is incorrect');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        passwordReceivedAtLogin,
        userDataInDb.password,
      );
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    }
  });

  describe('Password validation', () => {
    test('It should throw an error when the password length is invalid', async () => {
      passwordReceivedAtLogin = '123';
      try {
        await loginUseCase.execute(userDataInDb, passwordReceivedAtLogin);
      } catch (error) {
        expect(error.message).toEqual(
          'Password must be at least 8 characters long',
        );
        expect(bcrypt.compare).not.toHaveBeenCalled();
      }
    });

    test('It should throw error if password has no uppercase letters', async () => {
      passwordReceivedAtLogin = '12346789';
      try {
        await loginUseCase.execute(userDataInDb, passwordReceivedAtLogin);
      } catch (error) {
        expect(error.message).toEqual(
          'Password must contain at least one uppercase letter',
        );
        expect(bcrypt.compare).not.toHaveBeenCalled();
      }
    });

    test('It should throw an error because must contain one number', async () => {
      passwordReceivedAtLogin = 'UnoDsTres';
      try {
        await loginUseCase.execute(userDataInDb, passwordReceivedAtLogin);
      } catch (error) {
        expect(error.message).toEqual(
          'Password must contain at least one number',
        );
        expect(bcrypt.compare).not.toHaveBeenCalled();
      }
    });

    test('It should throw an error when a special character is missing', async () => {
      passwordReceivedAtLogin = 'O1235678';
      try {
        await loginUseCase.execute(userDataInDb, passwordReceivedAtLogin);
      } catch (error) {
        expect(error.message).toEqual(
          'Password must contain at least one special character (!@#$%^&*)',
        );
        expect(bcrypt.compare).not.toHaveBeenCalled();
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
