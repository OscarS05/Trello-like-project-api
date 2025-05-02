const express = require('express');
const router = express.Router();

const { changePasswordSchema } = require('../schemas/user.schema');

const { validatorHandler } = require('../middlewares/validator.handler')
const { limiter, validateSession, refreshTokens } = require('../middlewares/authentication.handler');

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


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with email and password. Returns an access token in the response body and sets a refresh token in an HTTP-only cookie.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginRequestBody'
 *     responses:
 *       200:
 *         description: Successful login. Access token is returned in the response body. Refresh token is sent in an HTTP-only cookie.
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing the refresh token
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/loginResponse'
 *       400:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts, please try again later.
 */
router.post('/login',
  limiter(5, 15 * 60 * 100, LOGIN_LIMITER_MESSAGE),
  login,
);

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: Sends a verification email to the user's email address. A verification token is set in an HTTP-only cookie.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/emailRequestBody'
 *     responses:
 *       200:
 *         description: Verification email sent successfully. The verification token is sent in an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/sendEmailResponse'
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing the verification token
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid request payload
 *       404:
 *         description: Email address not found
 *       429:
 *         description: Too many requests. Please try again later.
 */
router.post('/send-verification-email',
  limiter(3, 15 * 60 * 100, EMAIL_LIMITER_MESSAGE),
  sendVerificationEmail
);

/**
 * @swagger
 * /auth/resend-verification-email:
 *   post:
 *     summary: Resend verification email
 *     description: Resends the verification email to the user's email address. Requires the verification token in an HTTP-only cookie named `verifyToken`.
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Verification email resent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/sendEmailResponse'
 *       400:
 *         description: Invalid or missing verification token
 *       401:
 *         description: Unauthorized. Verification token is invalid or expired.
 *       429:
 *         description: Too many requests. Please try again later.
 */
router.post('/resend-verification-email',
  limiter(3, 15 * 60 * 100, EMAIL_LIMITER_MESSAGE),
  resendVerificationEmail
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify user's email
 *     description: |
 *       Verifies a user's email address.
 *
 *       **Important:**
 *       - To test this endpoint from the Swagger UI, you must only fill the **Authorization** field (click on the padlock and insert the Bearer token you received in the email).
 *       - **Do NOT fill manually** the **verifyEmail** cookie field. The server sets it automatically and Swagger will send it if it's already stored in your browser cookies.
 *       - Swagger automatically sends stored cookies during requests, similar to a browser behavior.
 *     tags:
 *       - auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/loginResponse'
 *       400:
 *         description: Invalid, missing tokens or key does not exists(In redis).
 *       401:
 *         description: Unauthorized. Token is invalid or expired or tokens do not match.
 *       404:
 *         description: Not found.
 */
router.post('/verify-email',
  verifyEmailToActivateAccount
);

/**
 * @swagger
 * /auth/verify-email-to-recover-password:
 *   post:
 *     summary: Verify user's email to recover password
 *     description: |
 *       Verifies a user's email address to enable password recovery.
 *
 *       **Important:**
 *       - To test this endpoint from the Swagger UI, you must only fill the **Authorization** field (click on the padlock and insert the Bearer token you received in the recovery email).
 *       - **Do NOT fill manually** the **verifyEmail** cookie field. The server sets it automatically and Swagger will send it if it's already stored in your browser cookies.
 *       - Swagger automatically sends stored cookies during requests, similar to a browser behavior.
 *     tags:
 *       - auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email verified successfully for password recovery.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verifiedEmailResponse'
 *       400:
 *         description: Invalid or missing tokens.
 *       401:
 *         description: Unauthorized. Token is invalid or expired.
 */
router.post('/verify-email-to-recover-password',
  verifyEmailToRecoveryPassword
);

/**
 * @swagger
 * /auth/password:
 *   patch:
 *     summary: Change user's password
 *     description: |
 *       Allows the user to change their password after verifying their email.
 *
 *       **Important:**
 *       - The HTTP-only cookie `verifyEmail` must be present. This cookie is automatically set by the server during the email verification process.
 *       - Swagger will automatically send your existing cookies. You do not need to manually add the `verifyEmail` cookie.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/changePasswordBody'
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/changedPasswordResponse'
 *       400:
 *         description: Token not provided, Something went wrong while changing the password.
 *       401:
 *         description: Unauthorized. Missing or invalid verifyEmail cookie.
 */
router.patch('/password',
  validatorHandler(changePasswordSchema, 'body'),
  changePassword
);

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     description: |
 *       Regenerates a new access token and a new refresh token, allowing the user to maintain their session without logging in again.
 *
 *       **Important:**
 *       - The `Authorization` header **must contain the expired access token** in the format: `Bearer <accessToken>`.
 *       - The HTTP-only cookie `refreshToken` **must also be present**.
 *       - Swagger will automatically send your existing cookies. You only need to manually add the Authorization header.
 *       - This endpoint is intended for use when the access token has expired, but the refresh token is still valid and stored in Redis.
 *
 *       **Security:** The server will only refresh the session if **both tokens match the ones stored in Redis**, making it harder to hijack a session with only one token.
 *     tags:
 *       - auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
  *               $ref: '#/components/schemas/loginResponse'
 *       401:
 *         description: Unauthorized. Invalid or missing access or refresh token.
 */
router.post('/refresh-tokens',
  refreshTokens,
  validateSessionController,
)

module.exports = router;
