const { config } = require('../config/config');

const isProduction = config.env === 'production';

const setCookieRefreshToken = (res, name, value) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'lax',
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

const setTokenCookieToVerifyEmail = (res, name, value) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'lax',
    maxAge: 30 * 60 * 1000,
  });
};

const clearCookie = (res, name) => {
  res.cookie(name, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'lax',
    expires: new Date(0),
  });
};

module.exports = {
  setCookieRefreshToken,
  setTokenCookieToVerifyEmail,
  clearCookie,
};
