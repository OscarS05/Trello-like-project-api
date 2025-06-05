const { Worker } = require('bullmq');

const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');
const redis = require('../../store/cache/index');
const { emailQueueName } = require('../../../../utils/constants');
const { processEmailJob } = require('./email.process');

const emailWorker = new Worker(emailQueueName, processEmailJob, {
  connection: redis,
});

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

module.exports = { processEmailJob, emailWorker };
