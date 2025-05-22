const QueryVO = require('../../../domain/value-objects/queries');
const UserDto = require('../../dtos/user.dto');

class GetUsersUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(query) {
    const queryVO = new QueryVO(query);
    const users = await this.userRepository.findAll(queryVO);
    return users.map((user) => new UserDto(user));
  }
}

module.exports = GetUsersUseCase;
