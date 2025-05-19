const boom = require('@hapi/boom');

const IAuthCacheRepository = require('../../../domain/repositories/cache/IAuthRepository');

class AuthRedisRepository extends IAuthCacheRepository {
  constructor(redisClient) {
    super();
    this.redis = redisClient;
  }

  refreshTokenKey(userId, refreshToken) {
    return `refresh_token:${userId}:${refreshToken.slice(-10)}`;
  }

  accessTokenKey(userId, accessToken) {
    return `access_token:${userId}:${accessToken.slice(-10)}`;
  }

  tokenToVerifyEmail(userId, token) {
    return `token:${userId}:${token.slice(-10)}`;
  }

  async saveRefreshToken(userId, refreshToken) {
    const response = await this.redis.set(
      this.refreshTokenKey(userId, refreshToken),
      refreshToken,
      'EX',
      15 * 24 * 60 * 60,
    );
    if (response !== 'OK')
      throw boom.badRequest('Failed to save refresh token in Redis');

    return response;
  }

  async verifyRefreshTokenInRedis(userId, refreshToken) {
    return this.redis.get(this.refreshTokenKey(userId, refreshToken));
  }

  async removeRefreshToken(userId, refreshToken) {
    const response = await this.redis.del(
      this.refreshTokenKey(userId, refreshToken),
    );
    if (response === 0)
      throw boom.badRequest(
        'Failed to remove refresh token in Redis (The key might not exist)',
      );

    return response;
  }

  async saveAccessToken(userId, accessToken) {
    const response = await this.redis.set(
      this.accessTokenKey(userId, accessToken),
      accessToken,
      'EX',
      15 * 24 * 60 * 60,
    );
    if (response !== 'OK')
      throw boom.badRequest('Failed to save Access token in Redis');

    return response;
  }

  async verifyAccessTokenInRedis(userId, accessToken) {
    return this.redis.get(this.accessTokenKey(userId, accessToken));
  }

  async removeAccessToken(userId, accessToken) {
    const response = await this.redis.del(
      this.accessTokenKey(userId, accessToken),
    );
    if (response === 0)
      throw boom.badRequest(
        'Failed to remove access token in Redis (The key might not exist)',
      );

    return response;
  }

  async saveTokenInRedis(userId, token) {
    const result = await this.redis.set(
      this.tokenToVerifyEmail(userId, token),
      token,
      'EX',
      15 * 60,
    );
    if (result !== 'OK') throw boom.badRequest('Failed to save token in Redis');

    return result;
  }

  async verifyTokenInRedis(userId, token) {
    const storedToken = await this.redis.get(
      this.tokenToVerifyEmail(userId, token),
    );
    if (storedToken === null) throw boom.badRequest('Key does not exist');
    if (storedToken !== token) throw boom.unauthorized();

    return storedToken;
  }

  async removeToken(userId, token) {
    const result = await this.redis.del(this.tokenToVerifyEmail(userId, token));
    if (result === 0)
      throw boom.badRequest(
        'Failed to remove token in Redis. (The key might not exist)',
      );

    return result;
  }
}

module.exports = AuthRedisRepository;
