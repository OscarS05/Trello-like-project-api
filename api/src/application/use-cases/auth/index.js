const dbRepositories = require('../../../infrastructure/repositories/db/index');
const redisServices = require('../../../infrastructure/repositories/cache/index');
const queueServices = require('../../../infrastructure/queues/index');

const LoginUseCase = require('./loginUseCase');
const GenerateTokensUseCase = require('./generateTokensUseCase');
const SendEmailConfirmationUseCase = require('./sendEmailConfirmationUseCase');
const VerifyEmailByTokenUseCase = require('./verifyEmailByTokenUseCase');

const loginUseCase = new LoginUseCase(dbRepositories, queueServices);
const generateTokensUsecase = new GenerateTokensUseCase(redisServices);
const sendEmailConfirmationUseCase = new SendEmailConfirmationUseCase(
  redisServices,
  queueServices,
);
const verifyEmailByTokenUseCase = new VerifyEmailByTokenUseCase(
  redisServices,
  dbRepositories,
);

module.exports = {
  loginUseCase,
  generateTokensUsecase,
  sendEmailConfirmationUseCase,
  verifyEmailByTokenUseCase,
};
