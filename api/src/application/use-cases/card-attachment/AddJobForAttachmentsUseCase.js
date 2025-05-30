const boom = require('@hapi/boom');

const { MAX_FILE_SIZE_IN_BYTES } = require('../../../../utils/constants');

class AddJobForAttachmentsUseCase {
  constructor({ cardAttachmentRepository }, { attachmentQueueService }) {
    this.cardAttachmentRepository = cardAttachmentRepository;
    this.attachmentQueueService = attachmentQueueService;
  }

  async execute({ fileData, folder, cardId }) {
    if (
      !fileData ||
      !fileData?.buffer ||
      !fileData?.size ||
      !fileData?.mimetype
    ) {
      throw new Error('fileData was not provided');
    }
    if (!folder || typeof folder !== 'string') {
      throw new Error('folder was not provided');
    }
    if (!cardId) throw new Error('cardId was not provided');

    if (fileData.size > MAX_FILE_SIZE_IN_BYTES) {
      throw boom.badData('The file is too large');
    }

    const addedJob = await this.attachmentQueueService.loadCardAttachment({
      buffer: fileData.buffer,
      folder,
      cardId,
      type: fileData.mimetype,
      filename: fileData.originalname,
    });

    if (!addedJob.id || !addedJob.name) {
      throw boom.badData('Something went wrong loading the file in the queue');
    }

    return addedJob;
  }
}

module.exports = AddJobForAttachmentsUseCase;
