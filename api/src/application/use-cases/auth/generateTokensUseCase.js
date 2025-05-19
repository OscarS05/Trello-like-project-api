const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');

class GenerateTokensUseCase {
  constructor({ AuthRedis }) {
    this.AuthRedis = AuthRedis;
  }

  async execute(user) {
    if (!user) throw boom.badRequest('User not provided');

    const payload = {
      sub: user.id || user.sub,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: '60m',
    });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: '15d',
    });

    try {
      const results = await Promise.allSettled([
        this.AuthRedis.saveAccessToken(payload.sub, accessToken),
        this.AuthRedis.saveRefreshToken(payload.sub, refreshToken),
      ]);

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const tokenType = index === 0 ? 'accessToken' : 'refreshToken';
          logger.warn(
            `❗Failed to save ${tokenType} in Redis: `,
            result.reason,
          );
        }
      });
    } catch (error) {
      logger.warn('❗Failed to save tokens in Redis by error: ', error);
    }

    return { accessToken, refreshToken };
  }
}

module.exports = GenerateTokensUseCase;
