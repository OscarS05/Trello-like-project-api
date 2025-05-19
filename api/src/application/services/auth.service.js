const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const { config } = require('../../../config/config');

class AuthService {
  constructor(
    {
      loginUseCase,
      generateTokensUsecase,
      sendEmailConfirmationUseCase,
      verifyEmailByTokenUseCase,
    },
    {
      getUserByEmailUseCase,
      getUserByEmailToLoginUseCase,
      updateUserUseCase,
      changePasswordUseCase,
    },
  ) {
    // auth use-cases
    this.loginUseCase = loginUseCase;
    this.generateTokensUsecase = generateTokensUsecase;
    this.sendEmailConfirmationUseCase = sendEmailConfirmationUseCase;
    this.verifyEmailByTokenUseCase = verifyEmailByTokenUseCase;

    // user use-cases
    this.getUserByEmailToLoginUseCase = getUserByEmailToLoginUseCase;
    this.getUserByEmailUseCase = getUserByEmailUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.changePasswordUseCase = changePasswordUseCase;
  }

  async getUserByEmail(email) {
    return this.getUserByEmailUseCase.execute(email);
  }

  async login(email, password) {
    const user = await this.getUserByEmailToLoginUseCase.execute(email);

    if (!user?.id) throw boom.notFound('Incorrect email or password');
    if (user.isVerified === false)
      throw boom.forbidden(`The user has not verified their email`);

    return this.loginUseCase.execute(user, password);
  }

  async generateTokens(user) {
    return this.generateTokensUsecase.execute(user);
  }

  async sendEmailConfirmation(user) {
    if (!user?.id) throw boom.notFound('User not found');
    return this.sendEmailConfirmationUseCase.execute(user);
  }

  async verifyEmailByToken(token) {
    return this.verifyEmailByTokenUseCase.execute(token);
  }

  async activateAccount(user) {
    await this.updateUserUseCase.execute(user.id, {
      isVerified: true,
      recoveryToken: null,
    });
    return this.generateTokens(user);
  }

  async changePassword(token, newPassword) {
    const { user } = await this.verifyEmailByToken(token);
    return this.changePasswordUseCase.execute(user.id, newPassword);
  }

  // eslint-disable-next-line class-methods-use-this
  validateAccessToken(accessToken) {
    const decodedAccessToken = jwt.verify(accessToken, config.jwtAccessSecret);
    return decodedAccessToken;
  }

  // eslint-disable-next-line class-methods-use-this
  validateRefreshToken(refreshToken) {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      config.jwtRefreshSecret,
    );
    return decodedRefreshToken;
  }
}

module.exports = AuthService;
