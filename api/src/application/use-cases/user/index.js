const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetUserByEmailToLoginUseCase = require('./GetUserByEmailToLoginUseCase');
const GetUserByEmailUseCase = require('./getUserByEmailUseCase');
const GetUserUseCase = require('./getUsersUserCase');
const SignUpUseCase = require('./signUpUseCase');
const UpdateUserUseCase = require('./updateUserUseCase');
const ChangePasswordUseCase = require('./changePasswordUseCase');
const DeleteAccountUseCase = require('./DeleteAccountUseCase');

const getUserByEmailToLoginUseCase = new GetUserByEmailToLoginUseCase(dbRepositories);
const getUserByEmailUseCase = new GetUserByEmailUseCase(dbRepositories);
const getUserUseCase = new GetUserUseCase(dbRepositories);
const signUpUseCase = new SignUpUseCase(dbRepositories);
const updateUserUseCase = new UpdateUserUseCase(dbRepositories);
const changePasswordUseCase = new ChangePasswordUseCase(dbRepositories);
const deleteAccountUseCase = new DeleteAccountUseCase(dbRepositories);

module.exports = {
  getUserByEmailToLoginUseCase,
  getUserByEmailUseCase,
  getUserUseCase,
  signUpUseCase,
  updateUserUseCase,
  changePasswordUseCase,
  deleteAccountUseCase,
};
