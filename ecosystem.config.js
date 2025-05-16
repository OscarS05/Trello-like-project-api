const { config } = require('./api/config/config');
const isProd = config.isProd;

module.exports = {
  apps: [
    {
      name: 'api-server',
      script: './api/index.js',
      watch: !isProd,
    },
    {
      name: 'email-worker',
      script: './api/src/infrastructure/queues/workers/email.worker.js',
      watch: !isProd,
    },
    {
      name: 'attachment-worker',
      script: './api/src/infrastructure/queues/workers/attachment.worker.js',
      watch: !isProd,
    },
  ],
};
