const jwt = require('jsonwebtoken');

const { config } = require('../../../../config/config');

class SendEmailConfirmationUseCase{
  constructor({ AuthRedis }, { emailQueueService }){
    this.AuthRedis = AuthRedis;
    this.emailQueueService = emailQueueService;
  }

  async execute(user){
    const payload = { sub: user.id, role: user.role};
    const token = jwt.sign(payload, config.jwtSecretVerifyEmail, { expiresIn: '30min' });

    await this.AuthRedis.saveTokenInRedis(user.id, token);

    await this.emailQueueService.sendVerificationEmail({
      email: user.email,
      name: user.name,
      token,
    });

    return { message: 'Email queued', token };
  }
}

module.exports = SendEmailConfirmationUseCase;
