const { nameQueueLoadBackgroundImage } = require('../../../../utils/constants');

class AttachmentQueueService {
  constructor(queue) {
    this.queue = queue;
  }

  async loadBackgroundImage({ buffer, folder, projectId }) {
    return await this.queue.add(
      nameQueueLoadBackgroundImage,
      {
        buffer,
        folder,
        projectId,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );
  }

  // async saveCardAttachment({ email, name, token }) {
  //   return await this.queue.add('sendVerificationEmail', {
  //     email,
  //     name,
  //     token,
  //   });
  // }
}

module.exports = AttachmentQueueService;
