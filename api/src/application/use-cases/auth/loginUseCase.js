const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const PasswordVO = require('../../../domain/value-objects/password');
const UserDto = require('../../dtos/user.dto');

class LoginUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(user, password) {
    const passwordReceivedInLoginVO = new PasswordVO(password).value;
    const isMatch = await bcrypt.compare(
      passwordReceivedInLoginVO,
      user.password,
    );
    if (!isMatch) throw boom.unauthorized('The password is incorrect');

    return new UserDto(user);
  }
}

module.exports = LoginUseCase;
