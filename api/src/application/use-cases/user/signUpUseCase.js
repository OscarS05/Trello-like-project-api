const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const UserDto = require('../../dtos/user.dto');
const UserEntity = require('../../../domain/entities/UserEntity');

class SignUpUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const userAlreadyExists = await this.userRepository.findByEmail(
      userData.email,
    );
    if (userAlreadyExists) throw boom.conflict('User already exists');

    const user = new UserEntity(userData).toPlainObject();

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const userCreated = await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    return new UserDto(userCreated);
  }
}

module.exports = SignUpUseCase;
