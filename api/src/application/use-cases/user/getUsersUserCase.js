const UserDto = require('../../dtos/user.dto');

class GetUsersUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(query) {
    const users = await this.userRepository.findAll(query);
    return users.map(user => new UserDto(user));
  }

}

module.exports = GetUsersUseCase;
