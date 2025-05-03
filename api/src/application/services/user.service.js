const boom = require('@hapi/boom');

class UserService {
  constructor({ getUserByEmailUseCase, getUserUseCase, signUpUseCase, deleteAccountUseCase }) {
    this.getUserByEmailUseCase = getUserByEmailUseCase;
    this.getUserUseCase = getUserUseCase;
    this.signUpUseCase = signUpUseCase;
    this.deleteAccountUseCase = deleteAccountUseCase;
  }

  async getUserByEmail(email) {
    const user = await this.getUserByEmailUseCase.execute(email);
    return user;
  }

  async getUsers(query = {}) {
    return await this.getUserUseCase.execute(query);
  }

  async signUp(userData) {
    return await this.signUpUseCase.execute(userData);
  }

  async deleteAccount(userId) {
    return await this.deleteAccountUseCase.execute(userId);
  }
}

module.exports = UserService;
