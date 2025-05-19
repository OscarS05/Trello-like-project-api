/* eslint-disable class-methods-use-this */
const boom = require('@hapi/boom');

class IAuthCacheRepository {
  async saveRefreshToken() {
    throw boom.notImplemented(
      'The saveRefreshToken() method is not implemented',
    );
  }

  async verifyRefreshTokenInRedis() {
    throw boom.notImplemented(
      'The verifyRefreshTokenInRedis() method is not implemented',
    );
  }

  async removeRefreshToken() {
    throw boom.notImplemented(
      'The removeRefreshTokens() method is not implemented',
    );
  }

  async saveAccessToken() {
    throw boom.notImplemented(
      'The saveAccessToken() method is not implemented',
    );
  }

  async verifyAccessTokenInRedis() {
    throw boom.notImplemented(
      'The verifyAccessTokenInRedis() method is not implemented',
    );
  }

  async removeAccessToken() {
    throw boom.notImplemented(
      'The saveAccessToken() method is not implemented',
    );
  }

  async saveTokenInRedis() {
    throw boom.notImplemented(
      'The saveTokenInRedis() method is not implemented',
    );
  }

  async verifyTokenInRedis() {
    throw boom.notImplemented(
      'The verifyTokenInRedis() method is not implemented',
    );
  }

  async removeToken() {
    throw boom.notImplemented('The removeToken() method is not implemented');
  }
}

module.exports = IAuthCacheRepository;
