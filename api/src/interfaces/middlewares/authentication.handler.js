const boom = require('@hapi/boom');
const { rateLimit } = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const { config } = require('../../../config/config');
const { setCookieRefreshToken } = require('../../../utils/cookieHelper');
const { AuthRedis } = require('../../infrastructure/repositories/cache/index');
const { authService } = require('../../application/services/index');


const limiter = (limit, windowMs, message) => rateLimit( {
  windowMs: windowMs,
  limit: limit,
  message: message,
  standardHeaders: true,
  legacyHeaders: false,
});

async function validateSession(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if(!accessToken) return next(boom.unauthorized('Tokens not provided'));

  try {
    const decodedAccessToken = authService.validateAccessToken(accessToken);
    if(decodedAccessToken){
      req.user = decodedAccessToken;
      req.tokens = { accessToken };
      return next();
    }
  } catch (accessError) {
    if(accessError.name === 'TokenExpiredError'){
      return next(accessError.message);
    } else {
      return next(boom.unauthorized(accessError.message || 'Invalid token'));
    }
  }
}

async function refreshTokens(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.cookies.refreshToken;

  if(!accessToken || !refreshToken) return next(boom.unauthorized('Tokens not provided'));

  try {
    const decodedAccessToken = authService.validateAccessToken(accessToken);
    if(decodedAccessToken){
      req.user = decodedAccessToken;
      req.tokens = { accessToken };
      return next();
    }
  } catch (accessError) {
    if(accessError.name === 'TokenExpiredError'){
      try {
        const decodedRefreshToken = authService.validateRefreshToken(refreshToken);
        const [ storedRefreshToken, storedAccessToken ] = await Promise.all([
          await AuthRedis.verifyRefreshTokenInRedis(decodedRefreshToken.sub, refreshToken),
          await AuthRedis.verifyAccessTokenInRedis(decodedRefreshToken.sub, accessToken),
        ]);

        if(!storedRefreshToken) throw boom.unauthorized('Refresh token in redis is invalid');
        if(!storedAccessToken) throw boom.unauthorized('Access token in redis is invalid');

        if(storedRefreshToken !== refreshToken) throw boom.unauthorized('Refresh token does not match');
        if(storedAccessToken !== accessToken) throw boom.unauthorized('Access token does not match');

        await Promise.all([
          await AuthRedis.removeRefreshToken(decodedRefreshToken.sub, refreshToken),
          await AuthRedis.removeAccessToken(decodedRefreshToken.sub, accessToken),
        ]);

        const user = {
          sub: decodedRefreshToken.sub,
          role: decodedRefreshToken.role
        }

        const newTokens = await authService.generateTokens(user);

        req.user = user;
        req.tokens = newTokens;
        setCookieRefreshToken(res, 'refreshToken', newTokens.refreshToken)

        return next();
      } catch (refreshError) {
        return next(boom.unauthorized(refreshError.message || 'Invalid refresh token'));
      }
    } else {
      return next(boom.unauthorized(accessError.message || 'Invalid token'));
    }
  }
}


module.exports = { limiter, validateSession, refreshTokens };
