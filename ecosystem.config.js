module.exports = {
  apps: [
    {
      name: 'api-server',
      script: './api/index.js',
      watch: true,
    },
    {
      name: 'email-worker',
      script: './api/src/infrastructure/queues/workers/email.worker.js',
      watch: true,
    },
  ],
};
