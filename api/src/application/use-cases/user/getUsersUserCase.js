const UserDto = require('../../dtos/user.dto');

class GetUsersUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute() {
    const users = await this.userRepository.findAll();
    return users.map(user => new UserDto(user));
  }

}

module.exports = GetUsersUseCase;
