const { Queue } = require('bullmq');
const redis = require('../store/cache/index');

const emailQueue = new Queue('emailQueue', { connection: redis });

const EmailQueueService = require('./services/EmailQueueService');
const emailQueueService = new EmailQueueService(emailQueue);

module.exports = {
  emailQueueService,
};
