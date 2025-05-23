const boom = require('@hapi/boom');

class UpdateUserUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(userId, changes) {
    const user = await this.userRepository.findById(userId);
    if (!user?.id) throw boom.notFound('User not found');

    return this.userRepository.update(userId, changes);
  }
}

module.exports = UpdateUserUseCase;
