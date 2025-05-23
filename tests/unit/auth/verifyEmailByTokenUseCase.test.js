jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');

const VerifyEmailByTokenUseCase = require('../../../api/src/application/use-cases/auth/verifyEmailByTokenUseCase');
const { createUser } = require('../../fake-data/fake-entities');

describe('VerifyEmailByTokenUseCase', () => {
  let userData;
  let payload;
  let fakeToken;
  let mockAuthRedis;
  let mockUserRepository;
  let verifyEmailByTokenUseCase;
  let successfulResponse;

  beforeEach(() => {
    userData = createUser();
    payload = {
      sub: userData.id,
      role: userData.role,
    };
    fakeToken = 'fake-token';
    successfulResponse = 'Email verified';

    mockAuthRedis = {
      verifyTokenInRedis: jest.fn(),
    };

    mockUserRepository = {
      findById: jest.fn(),
    };

    verifyEmailByTokenUseCase = new VerifyEmailByTokenUseCase(
      {
        AuthRedis: mockAuthRedis,
      },
      {
        userRepository: mockUserRepository,
      },
    );
  });

  test('It should return a successful message', async () => {
    jwt.verify.mockReturnValue(payload);
    mockUserRepository.findById.mockResolvedValue(userData);
    mockAuthRedis.verifyTokenInRedis.mockResolvedValue(fakeToken);

    const result = await verifyEmailByTokenUseCase.execute(fakeToken);

    expect(jwt.verify).toHaveBeenCalledWith(fakeToken, expect.any(String));
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userData.id);
    expect(mockAuthRedis.verifyTokenInRedis).toHaveBeenCalledWith(
      userData.id,
      fakeToken,
    );
    expect(result.message).toEqual(successfulResponse);
    expect(result.user).toEqual(userData);
  });

  test('It should return an error because user was not found', async () => {
    jwt.verify.mockReturnValue(payload);
    mockUserRepository.findById.mockResolvedValue({});

    try {
      await verifyEmailByTokenUseCase.execute(fakeToken);

      expect(jwt.verify).toHaveBeenCalledWith(fakeToken, expect.any(String));
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userData.id);
      expect(mockAuthRedis.verifyTokenInRedis).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/User not found/);
    }
  });

  test('It should return an error because the provided token does not match the stored token.', async () => {
    jwt.verify.mockReturnValue(payload);
    mockUserRepository.findById.mockResolvedValue(userData);
    mockAuthRedis.verifyTokenInRedis.mockResolvedValue(`123-${fakeToken}`);

    try {
      await verifyEmailByTokenUseCase.execute(fakeToken);

      expect(jwt.verify).toHaveBeenCalledWith(fakeToken, expect.any(String));
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userData.id);
      expect(mockAuthRedis.verifyTokenInRedis).toHaveBeenCalledWith(
        userData.id,
        fakeToken,
      );
    } catch (error) {
      expect(error.message).toMatch(
        /Invalid token. The provided token does not match the stored token./,
      );
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
