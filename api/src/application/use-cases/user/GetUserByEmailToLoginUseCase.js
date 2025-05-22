const boom = require('@hapi/boom');

const EmailVO = require('../../../domain/value-objects/email');

class GetUserByEmailToLoginUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(email) {
    const emailVO = new EmailVO(email).value;
    const user = await this.userRepository.findByEmailToLogin(emailVO);
    if (!user?.id) {
      throw boom.notFound('User not found');
    }
    return user;
  }
}

module.exports = GetUserByEmailToLoginUseCase;
