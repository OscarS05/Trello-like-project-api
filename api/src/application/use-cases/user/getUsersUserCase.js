/* eslint-disable no-param-reassign */
const QueryVO = require('../../../domain/value-objects/queries');
const UserDto = require('../../dtos/user.dto');

class GetUsersUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(query) {
    const queryVO = new QueryVO(query);
    if (queryVO.isVerified === 'false') queryVO.isVerified = false;
    if (queryVO.isVerified === 'true') queryVO.isVerified = true;

    const users = await this.userRepository.findAll(queryVO.toObject());
    return users.map((user) => new UserDto(user));
  }
}

module.exports = GetUsersUseCase;
