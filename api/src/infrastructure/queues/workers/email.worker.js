const { Worker } = require('bullmq');

const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');
const redis = require('../../store/cache/index');
const { sendEmail } = require('../../adapters/email/nodemailerAdapter');
const {
  emailQueueName,
  sendVerificationEmailName,
} = require('../../../../utils/constants');

const emailWorker = new Worker(
  emailQueueName,
  async (job) => {
    const { email, name, token } = job.data;

    switch (job.name) {
      case sendVerificationEmailName:
        await sendEmail({
          from: config.smtpEmail,
          to: email,
          subject: 'Email Verification',
          html: `<p>Hello ${name},</p><p>Please verify your email by clicking the link below(This link doesn't work, it's just an example.):</p><a href="${config.frontUrl}/auth/verify-email/email-confirmed?token=${token}">Verify Email. Please, Please copy this token and paste it into the authorize section of the swagger documentation. Token: ${token}</a>`,
        });
        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  },
  { connection: redis },
);

const { isProd } = config;

emailWorker.on('completed', (job) => {
  const message = `Job ${job.id} completed successfully`;
  if (isProd) {
    logger.info(message);
  } else {
    console.info(message);
  }
});

emailWorker.on('failed', (job, err) => {
  const message = `Job ${job.id} failed with error: ${err.message}`;
  if (isProd) {
    logger.error(message);
  } else {
    console.error(message);
  }
});
