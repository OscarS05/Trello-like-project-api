jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../../../api/utils/logger/logger', () => ({
  warn: jest.fn(),
}));

const jwt = require('jsonwebtoken');

const logger = require('../../../api/utils/logger/logger');
const GenerateTokensUseCase = require('../../../api/src/application/use-cases/auth/generateTokensUseCase');
const { createUser } = require('../../fake-data/fake-entities');

describe('GenerateTokensUseCase', () => {
  const messageErrorBySaveAccessTokenInRedis =
    'Failed to save access token in Redis';
  const messageErrorBySaveRefreshTokenInRedis =
    'Failed to save access token in Redis';
  let userData;
  let generateTokensUseCase;
  let mockAuthRedis;
  let payload;
  let fakeAccessToken;
  let fakeRefreshToken;

  beforeEach(() => {
    userData = createUser();
    fakeAccessToken = 'fake-access-token';
    fakeRefreshToken = 'fake-refresh-token';
    payload = {
      sub: userData.id,
      role: userData.role,
    };

    mockAuthRedis = {
      saveAccessToken: jest.fn(),
      saveRefreshToken: jest.fn(),
    };

    generateTokensUseCase = new GenerateTokensUseCase({
      AuthRedis: mockAuthRedis,
    });
  });

  test('It should return the jwt tokens. This indicates successful login', async () => {
    jwt.sign
      .mockReturnValueOnce(fakeAccessToken)
      .mockReturnValueOnce(fakeRefreshToken);
    mockAuthRedis.saveAccessToken.mockResolvedValue('OK');
    mockAuthRedis.saveRefreshToken.mockResolvedValue('OK');

    const { accessToken, refreshToken } =
      await generateTokensUseCase.execute(userData);

    expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
      expiresIn: '60m',
    });
    expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
      expiresIn: '15d',
    });
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(mockAuthRedis.saveAccessToken).toHaveBeenCalledWith(
      payload.sub,
      accessToken,
    );
    expect(mockAuthRedis.saveRefreshToken).toHaveBeenCalledWith(
      payload.sub,
      refreshToken,
    );
    expect(accessToken).toBe(fakeAccessToken);
    expect(refreshToken).toBe(fakeRefreshToken);
  });

  test('It should return an error because user was not provided', async () => {
    try {
      await generateTokensUseCase.execute({});
    } catch (error) {
      expect(error.message).toEqual('User not provided');
    }
  });

  test('It should return JWT tokens even if one of the Redis operations fails.', async () => {
    jwt.sign
      .mockReturnValueOnce(fakeAccessToken)
      .mockReturnValueOnce(fakeRefreshToken);
    mockAuthRedis.saveAccessToken.mockResolvedValue(
      messageErrorBySaveAccessTokenInRedis,
    );
    mockAuthRedis.saveRefreshToken.mockResolvedValue('OK');
    logger.warn.mockReturnValueOnce(messageErrorBySaveAccessTokenInRedis);

    try {
      const { accessToken, refreshToken } =
        await generateTokensUseCase.execute(userData);
      expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
        expiresIn: '60m',
      });
      expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
        expiresIn: '15d',
      });
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockAuthRedis.saveAccessToken).toHaveBeenCalledWith(
        payload.sub,
        accessToken,
      );
      expect(mockAuthRedis.saveRefreshToken).toHaveBeenCalledWith(
        payload.sub,
        refreshToken,
      );
      expect(accessToken).toBe(fakeAccessToken);
      expect(refreshToken).toBe(fakeRefreshToken);
    } catch (error) {
      expect(error.message).toEqual(messageErrorBySaveAccessTokenInRedis);
      expect(logger.warn).toEqual(messageErrorBySaveAccessTokenInRedis);
    }
  });

  test('It should return JWT tokens even if both Redis operations fails.', async () => {
    jwt.sign
      .mockReturnValueOnce(fakeAccessToken)
      .mockReturnValueOnce(fakeRefreshToken);
    mockAuthRedis.saveAccessToken.mockResolvedValue(
      messageErrorBySaveAccessTokenInRedis,
    );
    mockAuthRedis.saveRefreshToken.mockResolvedValue(
      messageErrorBySaveRefreshTokenInRedis,
    );
    logger.warn
      .mockReturnValueOnce(messageErrorBySaveAccessTokenInRedis)
      .mockReturnValueOnce(messageErrorBySaveRefreshTokenInRedis);

    try {
      const { accessToken, refreshToken } =
        await generateTokensUseCase.execute(userData);
      expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
        expiresIn: '60m',
      });
      expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
        expiresIn: '15d',
      });
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockAuthRedis.saveAccessToken).toHaveBeenCalledWith(
        payload.sub,
        accessToken,
      );
      expect(mockAuthRedis.saveRefreshToken).toHaveBeenCalledWith(
        payload.sub,
        refreshToken,
      );
      expect(accessToken).toBe(fakeAccessToken);
      expect(refreshToken).toBe(fakeRefreshToken);
    } catch (error) {
      expect(error.message).toEqual(messageErrorBySaveAccessTokenInRedis);
      expect(error.message).toEqual(messageErrorBySaveRefreshTokenInRedis);
      expect(logger.warn).toEqual(messageErrorBySaveAccessTokenInRedis);
      expect(logger.warn).toEqual(messageErrorBySaveRefreshTokenInRedis);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
