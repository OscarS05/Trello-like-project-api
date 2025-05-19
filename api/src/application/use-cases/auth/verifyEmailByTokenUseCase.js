const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

const { config } = require('../../../../config/config');

class VerifyEmailByTokenUseCase {
  constructor({ AuthRedis }, { userRepository }) {
    this.AuthRedis = AuthRedis;
    this.userRepository = userRepository;
  }

  async execute(token) {
    const payload = jwt.verify(token, config.jwtSecretVerifyEmail);

    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw boom.notFound('User not found');

    const tokenInRedis = await this.AuthRedis.verifyTokenInRedis(
      user.id,
      token,
    );
    if (tokenInRedis !== token) throw boom.unauthorized('Invalid token');

    return { message: 'Email verified', user };
  }
}

module.exports = VerifyEmailByTokenUseCase;
