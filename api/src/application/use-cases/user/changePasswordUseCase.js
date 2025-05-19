const bcrypt = require('bcrypt');
const Password = require('../../../domain/value-objects/password');

class ChangePasswordUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(userId, newPassword) {
    const password = new Password(newPassword).value;

    const hash = await bcrypt.hash(password, 10);
    await this.userRepository.update(userId, {
      recoveryToken: null,
      password: hash,
      isVerified: true,
    });
    return { message: 'Password was successfully changed. Please, sign in!' };
  }
}

module.exports = ChangePasswordUseCase;
