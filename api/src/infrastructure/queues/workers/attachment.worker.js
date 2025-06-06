const { Worker } = require('bullmq');

const { config } = require('../../../../config/config');
const logger = require('../../../../utils/logger/logger');
const redis = require('../../store/cache/index');
const processAttachment = require('./attachment.process');
const { attachmentQueueName } = require('../../../../utils/constants');

const attachmentWorker = new Worker(attachmentQueueName, processAttachment, {
  connection: redis,
});

const { isProd } = config;

attachmentWorker.on('completed', (job) => {
  const message = `Job ${job.id} completed successfully`;
  if (isProd) {
    logger.info(message);
  } else {
    console.error(message);
  }
});

attachmentWorker.on('failed', (job, err) => {
  const message = `Job ${job.id} failed with error: ${err.message}`;
  if (isProd) {
    logger.error(message);
  } else {
    console.error(message);
  }
});

module.exports = {
  attachmentWorker,
};
