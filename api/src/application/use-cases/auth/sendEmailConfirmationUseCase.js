const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const { config } = require('../../../../config/config');

class SendEmailConfirmationUseCase {
  constructor({ AuthRedis }, { emailQueueService }) {
    this.AuthRedis = AuthRedis;
    this.emailQueueService = emailQueueService;
  }

  async execute(user) {
    if (!user?.id) throw Boom.notFound('User not found');

    const payload = { sub: user.id, role: user.role };
    const token = jwt.sign(payload, config.jwtSecretVerifyEmail, {
      expiresIn: '30min',
    });

    const result = await this.AuthRedis.saveTokenInRedis(user.id, token);
    if (result !== 'OK') {
      throw Boom.internal('Something went wrong saving the token in Redis');
    }

    const addedJob = await this.emailQueueService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      token,
    });

    if (!addedJob?.id || !addedJob?.name) {
      throw Boom.internal('Something went wrong queuing the email');
    }

    return { message: 'Email queued', token };
  }
}

module.exports = SendEmailConfirmationUseCase;
