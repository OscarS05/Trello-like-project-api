const express = require('express');
const router = express.Router();

const { changePasswordSchema } = require('../schemas/user.schema');

const { validatorHandler } = require('../middlewares/validator.handler')
const { limiter, validateSession } = require('../middlewares/authentication.handler');

const EMAIL_LIMITER_MESSAGE = 'Too many email requests, please try again after an 15 minutes';
const LOGIN_LIMITER_MESSAGE = {
  error: 'Too many login attempts',
  message: 'Please wait 15 minutes and try again.'
};

const {
  login,
  verifyEmailToActivateAccount,
  verifyEmailToRecoveryPassword,
  changePassword,
  sendVerificationEmail,
  resendVerificationEmail,
  validateSessionController,
  validateTokenToVerifyEmail,
} = require('../controllers/auth.contoller');


router.post('/login',
  limiter(5, 15 * 60 * 100, LOGIN_LIMITER_MESSAGE),
  login,
);

router.post('/send-verification-email',
  limiter(3, 15 * 60 * 100, EMAIL_LIMITER_MESSAGE),
  sendVerificationEmail
);

router.post('/resend-verification-email',
  limiter(3, 15 * 60 * 100, EMAIL_LIMITER_MESSAGE),
  resendVerificationEmail
);

router.post('/verify-email',
  verifyEmailToActivateAccount
);

router.post('/verify-email-to-recover-password',
  verifyEmailToRecoveryPassword
);

router.patch('/password',
  validatorHandler(changePasswordSchema, 'body'),
  changePassword
);

router.post('/validate-session',
  validateSession,
  validateSessionController,
)

router.post('/validate-tokens-to-verify-email',
  validateTokenToVerifyEmail
)

module.exports = router;
