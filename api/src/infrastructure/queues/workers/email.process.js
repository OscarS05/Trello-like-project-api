const { config } = require('../../../../config/config');
const { sendEmail } = require('../../adapters/email/nodemailerAdapter');
const { sendVerificationEmailName } = require('../../../../utils/constants');

async function processEmailJob(job) {
  const { email, name, token } = job.data;

  switch (job.name) {
    case sendVerificationEmailName:
      return sendEmail({
        from: config.smtpEmail,
        to: email,
        subject: 'Email Verification',
        html: `<p>Hello ${name},</p><p>Please verify your email by clicking the link below(This link doesn't work, it's just an example.):</p><a href="${config.frontUrl}/auth/verify-email/email-confirmed?token=${token}">Verify Email. Please, Please copy this token and paste it into the authorize section of the swagger documentation. Token: ${token}</a>`,
      });
    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}

module.exports = { processEmailJob };
