const Boom = require('@hapi/boom');
const EmailVO = require('../../../domain/value-objects/email');
const UserDto = require('../../dtos/user.dto');

class GetUserByEmailUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(email) {
    const emailVO = new EmailVO(email).value;
    const user = await this.userRepository.findByEmail(emailVO);
    if (!user?.id) throw Boom.notFound('User not found');
    return new UserDto(user);
  }
}

module.exports = GetUserByEmailUseCase;
