const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const UserDto = require('../../dtos/user.dto');

class LoginUseCase {
  constructor({ userRepository }, { emailQueueService }) {
    this.userRepository = userRepository;
    this.emailQueueService = emailQueueService;
  }

  // eslint-disable-next-line class-methods-use-this
  async execute(user, password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw boom.unauthorized('The password is incorrect');

    return new UserDto(user);
  }
}

module.exports = LoginUseCase;
