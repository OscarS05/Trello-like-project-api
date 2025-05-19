class GetUserByEmailToLoginUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(email) {
    return this.userRepository.findByEmailToLogin(email);
  }
}

module.exports = GetUserByEmailToLoginUseCase;
