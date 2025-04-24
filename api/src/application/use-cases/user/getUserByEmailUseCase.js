const UserDto = require('../../dtos/user.dto');

class GetUserByEmailUseCase {
  constructor({ userRepository }){
    this.userRepository = userRepository;
  }

  async execute(email){
    const user = await this.userRepository.findByEmail(email);
    return new UserDto(user);
  }
}

module.exports = GetUserByEmailUseCase;
