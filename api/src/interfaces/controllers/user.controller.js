const boom = require('@hapi/boom');

const {
  userService,
  authService,
} = require('../../application/services/index');
const { setTokenCookieToVerifyEmail } = require('../../../utils/cookieHelper');

const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const user = await userService.getUserByEmail(email);
    if (!user) throw boom.notFound('User not found');

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();

    res.json(users);
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    const { body } = req;

    const newUser = await userService.signUp(body);
    const { send, token } = await authService.sendEmailConfirmation(newUser);

    setTokenCookieToVerifyEmail(res, 'verifyEmail', token);
    res.status(201).json({ user: newUser, send });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const rowsDeleted = await userService.deleteAccount(userId);
    if (rowsDeleted === 0) throw boom.notFound('User not found');

    res
      .status(201)
      .json({ message: 'The user was successfully deleted', rowsDeleted });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserByEmail,
  getUsers,
  signUp,
  deleteAccount,
};
