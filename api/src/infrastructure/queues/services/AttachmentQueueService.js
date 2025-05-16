const boom = require('@hapi/boom');

const {
  nameQueueLoadBackgroundImage,
  loadCardAttachmentName,
} = require('../../../../utils/constants');

class AttachmentQueueService {
  constructor(queue) {
    this.queue = queue;
  }

  async loadBackgroundImage({ buffer, folder, projectId }) {
    if (!buffer || !folder || !projectId) {
      throw boom.badRequest('Missing required job data');
    }

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

  async loadCardAttachment({ buffer, folder, cardId, type, filename }) {
    if (!buffer || !folder || !cardId || !type || !filename) {
      throw boom.badRequest('Missing required job data');
    }

    return await this.queue.add(loadCardAttachmentName, {
      buffer,
      folder,
      cardId,
      type,
      filename,
    });
  }
}

module.exports = AttachmentQueueService;
