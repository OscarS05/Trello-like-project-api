/* eslint-disable no-param-reassign */
const QueryVO = require('../../../domain/value-objects/queries');
const UserDto = require('../../dtos/user.dto');

class GetUsersUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(query) {
    if (query.isVerified === 'false') query.isVerified = false;
    if (query.isVerified === 'true') query.isVerified = true;

    const queryVO = new QueryVO(query);
    const users = await this.userRepository.findAll(queryVO.toObject());
    return users.map((user) => new UserDto(user));
  }
}

module.exports = GetUsersUseCase;
