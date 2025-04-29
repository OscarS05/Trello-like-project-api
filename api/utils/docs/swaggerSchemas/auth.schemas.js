/**
 * @swagger
 * components:
 *   schemas:
 *
 *     loginRequestBody:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: O123456@k
 *
 *     loginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           format: jwt
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *
 *     sendEmailResponse:
 *       type: object
 *       properties:
 *         message:
 *            type: string
 *            example: The verification email was sent successfully!
 *
 *     verifiedEmailResponse:
 *       type: object
 *       properties:
 *         message:
 *            type: string
 *            example: Email verified successfully
 *
 *     emailRequestBody:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            example: johndoe@example.com
 *
 *     changePasswordBody:
 *        type: object
 *        required:
 *          - newPassword
 *          - confirmNewPassword
 *        properties:
 *          newPassword:
 *            type: string
 *            description: The new password you want to set.
 *            example: MyNewSecurePassword123!
 *          confirmNewPassword:
 *            type: string
 *            description: Must match the newPassword field.
 *            example: MyNewSecurePassword123!
 *
 *     changedPasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *            type: string
 *            example: Password updated successfully
 *
 */
