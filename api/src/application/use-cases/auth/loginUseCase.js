const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const UserDto = require('../../dtos/user.dto');

class LoginUseCase {
  constructor({ userRepository }){
    this.userRepository = userRepository;
  }

  async execute(email, password){
    const user = await this.userRepository.findByEmailToLogin(email);
    if(!user) throw boom.unauthorized('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw boom.unauthorized('The password is incorrect');

    return new UserDto(user);
  }
}

module.exports = LoginUseCase;
