const passport = require('passport');
const boom = require('@hapi/boom');

const {
  setCookieRefreshToken,
  setTokenCookieToVerifyEmail,
  clearCookie,
} = require('../../../utils/cookieHelper');
const { authService } = require('../../application/services/index');

const login = async (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate(
    'local',
    { session: false },
    // eslint-disable-next-line no-unused-vars
    async (err, user, info) => {
      try {
        if (err) return next(err);
        if (!user?.id) throw boom.unauthorized('Incorrect email or password');

        const { accessToken, refreshToken } =
          await authService.generateTokens(user);

        setCookieRefreshToken(res, 'refreshToken', refreshToken);
        return res.status(200).json({ accessToken });
      } catch (error) {
        return next(error);
      }
    },
  )(req, res, next);
};

const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await authService.getUserByEmail(email);
    const { token } = await authService.sendEmailConfirmation(user);

    if (token) setTokenCookieToVerifyEmail(res, 'verifyEmail', token);
    res
      .status(200)
      .json({ message: 'The verification email was sent successfully!' });
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const tokenToVerifyEmail = req.cookies.verifyEmail;
    if (!tokenToVerifyEmail) throw boom.unauthorized('Token not provided');

    const { user } = await authService.verifyEmailByToken(tokenToVerifyEmail);
    const { token } = await authService.sendEmailConfirmation(user);

    if (token) setTokenCookieToVerifyEmail(res, 'verifyEmail', token);
    res
      .status(200)
      .json({ message: 'The verification email was send successfully!' });
  } catch (error) {
    next(error);
  }
};

const verifyEmailToActivateAccount = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const tokenInCookies = req.cookies.verifyEmail;

    if (!token || !tokenInCookies)
      throw boom.unauthorized('Tokens not provided');
    if (tokenInCookies !== token)
      throw boom.unauthorized('Tokens do not match');

    const { user } = await authService.verifyEmailByToken(token);
    const { accessToken, refreshToken } =
      await authService.activateAccount(user);

    if (refreshToken) setCookieRefreshToken(res, 'refreshToken', refreshToken);
    clearCookie(res, 'verifyEmail');

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const verifyEmailToRecoveryPassword = async (req, res, next) => {
  try {
    const tokenInParams = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.verifyEmail;

    if (!token || !tokenInParams)
      throw boom.unauthorized('Tokens not provided');
    if (tokenInParams !== token) throw boom.unauthorized('Tokens do not match');

    const { user } = await authService.verifyEmailByToken(tokenInParams);
    if (!user?.id) throw boom.unauthorized('Invalid token');

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const token = req.cookies.verifyEmail;
    if (!token) throw boom.unauthorized('Token not provided');

    const { message } = await authService.changePassword(token, newPassword);
    if (!message)
      throw boom.badRequest('Something went wrong while changing the password');

    clearCookie(res, 'refreshToken');
    clearCookie(res, 'verifyEmail');
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

const validateSessionController = async (req, res, next) => {
  try {
    const { accessToken } = req.tokens || null;

    res.status(200).json({
      message: 'Session is valid',
      accessToken: accessToken || '',
    });
  } catch (error) {
    next(error);
  }
};

const validateTokenToVerifyEmail = async (req, res, next) => {
  try {
    const token = req.cookies.verifyEmail;
    if (!token) throw boom.unauthorized('Token not provided');

    const { user } = await authService.verifyEmailByToken(token);
    if (!user) throw boom.unauthorized('Invalid token');

    res.status(200).json({ message: 'Valid token' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  verifyEmailToActivateAccount,
  verifyEmailToRecoveryPassword,
  changePassword,
  sendVerificationEmail,
  resendVerificationEmail,
  validateSessionController,
  validateTokenToVerifyEmail,
};
