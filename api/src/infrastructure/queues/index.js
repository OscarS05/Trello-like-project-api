const { Queue } = require('bullmq');
const redis = require('../store/cache/index');

const {
  emailQueueName,
  attachmentQueueName,
} = require('../../../utils/constants');

const emailQueue = new Queue(emailQueueName, { connection: redis });
const attachmentQueue = new Queue(attachmentQueueName, { connection: redis });

const EmailQueueService = require('./services/EmailQueueService');
const AttachmentQueueService = require('./services/AttachmentQueueService');

const emailQueueService = new EmailQueueService(emailQueue);
const attachmentQueueService = new AttachmentQueueService(attachmentQueue);

module.exports = {
  emailQueueService,
  attachmentQueueService,
};
