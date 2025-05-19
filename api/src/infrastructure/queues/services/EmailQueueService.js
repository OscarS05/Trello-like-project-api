const { sendVerificationEmailName } = require('../../../../utils/constants');

class EmailQueueService {
  constructor(queue) {
    this.queue = queue;
  }

  async sendVerificationEmail({ email, name, token }) {
    return this.queue.add(sendVerificationEmailName, {
      email,
      name,
      token,
    });
  }
}

module.exports = EmailQueueService;
